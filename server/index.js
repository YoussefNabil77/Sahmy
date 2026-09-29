/**
 * سهمي — EGX Proxy Server
 *
 * Uses Playwright (real Chromium browser) to bypass F5 BIG-IP bot protection
 * on egx.com.eg. Caches responses for 5 minutes to avoid hammering the site.
 *
 * Run:
 *   npm install
 *   npx playwright install chromium   ← only once
 *   npm start
 *
 * Endpoints:
 *   GET /api/indices          → EGX30, EGX70, EGX100 snapshots
 *   GET /api/index-history    → ?range=1W|1M|3M
 *   GET /api/sectors          → sector performance
 *   GET /api/news             → latest market news
 *   GET /api/top-gainers      → top gaining stocks
 *   GET /api/top-losers       → top losing stocks
 *   GET /api/most-active      → most active stocks
 *   GET /api/stock/:ticker    → single stock quote
 *   GET /api/health           → server health check
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';

const app = express();
const PORT = 3001;
const BASE_URL = 'https://www.egx.com.eg/ar';

// ─── Cache (5 min TTL for market data, 10 min for news) ──────────────────────
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
const NEWS_TTL = 600;

// ─── Browser pool ─────────────────────────────────────────────────────────────
let browser = null;
let browserLaunchPromise = null;

async function getBrowser() {
  if (browser && browser.isConnected()) return browser;
  if (browserLaunchPromise) return browserLaunchPromise;

  browserLaunchPromise = chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
    ],
  }).then(b => {
    browser = b;
    browserLaunchPromise = null;
    console.log('[Browser] Chromium launched');
    b.on('disconnected', () => {
      browser = null;
      console.log('[Browser] Chromium disconnected, will relaunch on next request');
    });
    return b;
  });

  return browserLaunchPromise;
}

/**
 * Fetch a page through real Chromium, wait for network to settle,
 * return the final HTML content.
 */
async function fetchPageHTML(url, waitForSelector = null, timeout = 30000) {
  const b = await getBrowser();
  const ctx = await b.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo',
  });

  const page = await ctx.newPage();

  // Remove automation fingerprints
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'languages', { get: () => ['ar-EG', 'ar', 'en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    window.chrome = { runtime: {} };
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout });
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: 10000 }).catch(() => {});
    }
    // Extra wait for dynamic content
    await page.waitForTimeout(2000);
    const html = await page.content();
    return html;
  } finally {
    await page.close();
    await ctx.close();
  }
}

/**
 * Intercept XHR/fetch requests from the page to capture JSON API calls
 */
async function interceptPageRequests(url, targetUrlPattern, timeout = 30000) {
  const b = await getBrowser();
  const ctx = await b.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo',
  });

  const page = await ctx.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
  });

  const captured = [];

  page.on('response', async response => {
    try {
      const resUrl = response.url();
      if (targetUrlPattern && resUrl.includes(targetUrlPattern)) {
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('json') || ct.includes('javascript')) {
          const body = await response.text().catch(() => '');
          captured.push({ url: resUrl, body, status: response.status() });
        }
      }
    } catch {}
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout });
    await page.waitForTimeout(3000);
    return { html: await page.content(), captured };
  } finally {
    await page.close();
    await ctx.close();
  }
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseNumber(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
}

function parsePercent(str) {
  if (!str) return 0;
  const match = str.match(/-?[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function parseIndicesFromHTML(html) {
  const $ = cheerio.load(html);
  const indices = [];

  // EGX site uses tables/divs for indices — scan for known patterns
  // Pattern 1: look for index value blocks
  $('[class*="index"], [id*="index"], [class*="Index"], [id*="Index"]').each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes('EGX')) {
      const name = text.match(/EGX\s*\d+/)?.[0] || '';
      if (name) {
        const valueEl = $(el).find('[class*="value"], [class*="Value"]').first();
        const changeEl = $(el).find('[class*="change"], [class*="Change"]').first();
        if (valueEl.length) {
          indices.push({
            name,
            value: parseNumber(valueEl.text()),
            changePct: parsePercent(changeEl.text()),
          });
        }
      }
    }
  });

  // Pattern 2: scan tables with EGX data
  $('table').each((i, table) => {
    const headerText = $(table).find('th, thead').text();
    if (headerText.includes('EGX') || headerText.includes('مؤشر')) {
      $(table).find('tr').each((j, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const firstCell = $(cells[0]).text().trim();
          if (firstCell.match(/EGX\s*\d+/)) {
            indices.push({
              name: firstCell,
              value: parseNumber($(cells[1]).text()),
              changePct: cells.length > 2 ? parsePercent($(cells[2]).text()) : 0,
            });
          }
        }
      });
    }
  });

  return indices;
}

function parseNewsFromHTML(html) {
  const $ = cheerio.load(html);
  const news = [];

  // Look for news article patterns
  $('article, [class*="news"], [class*="News"], [class*="خبر"]').each((i, el) => {
    const title = $(el).find('h1, h2, h3, h4, a').first().text().trim();
    const link = $(el).find('a').first().attr('href') || '';
    const date = $(el).find('[class*="date"], [class*="time"], time').first().text().trim();
    const excerpt = $(el).find('p').first().text().trim();

    if (title && title.length > 10) {
      news.push({
        id: String(i + 1),
        title,
        excerpt: excerpt || title,
        source: 'البورصة المصرية',
        publishedAt: new Date().toISOString(),
        url: link.startsWith('http') ? link : `https://www.egx.com.eg${link}`,
        isFeatured: i === 0,
      });
    }
  });

  // Fallback: scan all links that look like news
  if (news.length === 0) {
    $('a').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href') || '';
      if (text.length > 20 && text.length < 300 && (href.includes('news') || href.includes('خبر') || href.includes('News'))) {
        news.push({
          id: String(i + 1),
          title: text,
          excerpt: text,
          source: 'البورصة المصرية',
          publishedAt: new Date().toISOString(),
          url: href.startsWith('http') ? href : `https://www.egx.com.eg${href}`,
          isFeatured: news.length === 0,
        });
      }
    });
  }

  return news.slice(0, 10);
}

function parseStocksTableFromHTML(html, type = 'gainers') {
  const $ = cheerio.load(html);
  const stocks = [];

  $('table').each((i, table) => {
    const rows = $(table).find('tr');
    if (rows.length < 3) return;

    const headers = $(rows[0]).find('th, td').map((_, th) => $(th).text().trim().toLowerCase()).get();
    const hasStockData = headers.some(h =>
      h.includes('رمز') || h.includes('سعر') || h.includes('symbol') || h.includes('price') || h.includes('تغير')
    );

    if (!hasStockData) return;

    rows.each((j, row) => {
      if (j === 0) return;
      const cells = $(row).find('td');
      if (cells.length < 3) return;

      const cellTexts = cells.map((_, c) => $(c).text().trim()).get();
      const ticker = cellTexts[0] || cellTexts[1] || '';
      const priceStr = cellTexts.find(t => /^\d+[\d.,]*$/.test(t.replace(/,/g, '')));
      const changeStr = cellTexts.find(t => /^[+-]?\d+[\d.,]*%?$/.test(t) && t.includes('.'));

      if (ticker && ticker.match(/^[A-Z]{2,6}$/)) {
        stocks.push({
          ticker: ticker.toUpperCase(),
          companyName: cellTexts[1] || ticker,
          price: parseNumber(priceStr || '0'),
          change: 0,
          changePct: parsePercent(changeStr || '0'),
          volume: 0,
          tradedValue: 0,
        });
      }
    });
  });

  return stocks.slice(0, 10);
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests' },
});
app.use('/api/', limiter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    browser: browser?.isConnected() ? 'connected' : 'disconnected',
    cacheKeys: cache.keys().length,
    timestamp: new Date().toISOString(),
  });
});

// ─── Indices ──────────────────────────────────────────────────────────────────
app.get('/api/indices', async (req, res) => {
  const cacheKey = 'indices';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log('[/api/indices] Fetching from EGX...');

    // Try to intercept XHR calls and also parse HTML
    const { html, captured } = await interceptPageRequests(
      `${BASE_URL}/homepage.aspx`,
      'getIndices'
    );

    let data = null;

    // Check captured XHR responses first
    for (const cap of captured) {
      try {
        const parsed = JSON.parse(cap.body);
        if (Array.isArray(parsed) || parsed.indices || parsed.data) {
          data = parsed;
          console.log('[/api/indices] Got JSON from intercepted XHR:', cap.url);
          break;
        }
      } catch {}
    }

    // Fallback: parse HTML
    if (!data) {
      const parsed = parseIndicesFromHTML(html);
      if (parsed.length > 0) {
        data = parsed.map(idx => ({
          name: idx.name,
          nameEn: idx.name,
          value: idx.value,
          change: 0,
          changePct: idx.changePct,
          volume: 0,
          tradedValue: 0,
          advancing: 0,
          declining: 0,
          unchanged: 0,
          lastUpdate: new Date().toISOString(),
          sparkline: [],
          isReal: true,
        }));
      }
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(503).json({ error: 'Could not parse EGX data', fallbackToMock: true });
    }

    cache.set(cacheKey, data);
    res.json(data);
  } catch (err) {
    console.error('[/api/indices] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── News ─────────────────────────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  const cacheKey = 'news';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log('[/api/news] Fetching from EGX...');
    const html = await fetchPageHTML(`${BASE_URL}/news.aspx`, '[class*="news"]');
    const news = parseNewsFromHTML(html);

    if (news.length === 0) {
      return res.status(503).json({ error: 'No news parsed', fallbackToMock: true });
    }

    cache.set(cacheKey, news, NEWS_TTL);
    res.json(news);
  } catch (err) {
    console.error('[/api/news] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Top Gainers ──────────────────────────────────────────────────────────────
app.get('/api/top-gainers', async (req, res) => {
  const cacheKey = 'top-gainers';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log('[/api/top-gainers] Fetching from EGX...');
    const html = await fetchPageHTML(`${BASE_URL}/TopTen.aspx`);
    const stocks = parseStocksTableFromHTML(html, 'gainers');

    if (stocks.length === 0) {
      return res.status(503).json({ error: 'No gainers parsed', fallbackToMock: true });
    }

    cache.set(cacheKey, stocks);
    res.json(stocks);
  } catch (err) {
    console.error('[/api/top-gainers] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Top Losers ───────────────────────────────────────────────────────────────
app.get('/api/top-losers', async (req, res) => {
  const cacheKey = 'top-losers';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log('[/api/top-losers] Fetching from EGX...');
    const html = await fetchPageHTML(`${BASE_URL}/TopTen.aspx`);
    const stocks = parseStocksTableFromHTML(html, 'losers');

    cache.set(cacheKey, stocks);
    res.json(stocks);
  } catch (err) {
    console.error('[/api/top-losers] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Most Active ──────────────────────────────────────────────────────────────
app.get('/api/most-active', async (req, res) => {
  const cacheKey = 'most-active';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log('[/api/most-active] Fetching from EGX...');
    const html = await fetchPageHTML(`${BASE_URL}/equities.aspx`);
    const stocks = parseStocksTableFromHTML(html, 'active');

    cache.set(cacheKey, stocks);
    res.json(stocks);
  } catch (err) {
    console.error('[/api/most-active] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Sectors ──────────────────────────────────────────────────────────────────
app.get('/api/sectors', async (req, res) => {
  const cacheKey = 'sectors';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log('[/api/sectors] Fetching from EGX...');
    const html = await fetchPageHTML(`${BASE_URL}/sectors.aspx`);
    const $ = cheerio.load(html);
    const sectors = [];

    $('table tr, [class*="sector"] [class*="row"]').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length < 2) return;
      const name = $(cells[0]).text().trim();
      const changeStr = $(cells[1]).text().trim();
      if (name && name.length > 2 && name.length < 50) {
        sectors.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          changePct: parsePercent(changeStr),
          tradedValue: 0,
          volume: 0,
          stockCount: 0,
          isReal: true,
        });
      }
    });

    if (sectors.length === 0) {
      return res.status(503).json({ error: 'No sectors parsed', fallbackToMock: true });
    }

    cache.set(cacheKey, sectors);
    res.json(sectors);
  } catch (err) {
    console.error('[/api/sectors] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Index History ────────────────────────────────────────────────────────────
app.get('/api/index-history', async (req, res) => {
  const range = req.query.range || '1M';
  const cacheKey = `index-history-${range}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log(`[/api/index-history] Fetching range=${range} from EGX...`);
    const { html, captured } = await interceptPageRequests(
      `${BASE_URL}/EGX30.aspx`,
      'chart'
    );

    // Check captured XHR for chart data
    let chartData = null;
    for (const cap of captured) {
      try {
        const parsed = JSON.parse(cap.body);
        if (Array.isArray(parsed) && parsed[0]?.date) {
          chartData = parsed;
          break;
        }
        if (parsed.data && Array.isArray(parsed.data)) {
          chartData = parsed.data;
          break;
        }
      } catch {}
    }

    if (!chartData) {
      return res.status(503).json({ error: 'No chart data captured', fallbackToMock: true });
    }

    cache.set(cacheKey, chartData, 600);
    res.json(chartData);
  } catch (err) {
    console.error('[/api/index-history] Error:', err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Stock Quote ──────────────────────────────────────────────────────────────
app.get('/api/stock/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const cacheKey = `stock-${ticker}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    console.log(`[/api/stock/${ticker}] Fetching from EGX...`);
    const { html, captured } = await interceptPageRequests(
      `${BASE_URL}/companyData.aspx?co_id=${ticker}&sec_id=&lang=ar`,
      ticker.toLowerCase()
    );

    // Try captured JSON first
    for (const cap of captured) {
      try {
        const parsed = JSON.parse(cap.body);
        if (parsed.ticker || parsed.price || parsed.symbol) {
          cache.set(cacheKey, parsed);
          return res.json(parsed);
        }
      } catch {}
    }

    // Parse HTML for company data
    const $ = cheerio.load(html);
    const stockData = {
      ticker,
      companyName: ticker,
      companyNameAr: $('[class*="company"], [class*="Company"], h1').first().text().trim() || ticker,
      sector: '',
      sectorAr: '',
      price: 0,
      change: 0,
      changePct: 0,
      open: 0, high: 0, low: 0, prevClose: 0,
      volume: 0, tradedValue: 0, marketCap: 0,
      weekHigh52: 0, weekLow52: 0,
      lastUpdate: new Date().toISOString(),
      trend: 'sideways',
      trendExplanation: '',
      perfOneMonth: 0,
      perfSixMonths: 0,
      ma50: 0, ma200: 0,
      isReal: true,
    };

    // Extract numbers from page
    const allText = $('body').text();
    const priceMatch = allText.match(/السعر[:\s]+(\d+[\d.,]*)/);
    if (priceMatch) stockData.price = parseNumber(priceMatch[1]);

    if (stockData.price === 0) {
      return res.status(404).json({ error: `Stock ${ticker} not found or page not parseable`, fallbackToMock: true });
    }

    cache.set(cacheKey, stockData);
    res.json(stockData);
  } catch (err) {
    console.error(`[/api/stock/${ticker}] Error:`, err.message);
    res.status(503).json({ error: err.message, fallbackToMock: true });
  }
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', async () => {
  console.log('[Server] Shutting down...');
  if (browser) await browser.close();
  process.exit(0);
});
process.on('SIGINT', async () => {
  console.log('[Server] Shutting down...');
  if (browser) await browser.close();
  process.exit(0);
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 سهمي Proxy Server running on http://localhost:${PORT}`);
  console.log(`   Source: ${BASE_URL}`);
  console.log(`   Cache TTL: 5 min (news: 10 min)`);
  console.log(`   Endpoints: /api/indices | /api/news | /api/top-gainers | /api/top-losers`);
  console.log(`             /api/most-active | /api/sectors | /api/index-history | /api/stock/:ticker\n`);

  // Pre-warm browser
  getBrowser().catch(err => console.error('[Browser] Pre-warm failed:', err.message));
});
