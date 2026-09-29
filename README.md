# سهمي (Sahmy) — لوحة تحكم البورصة المصرية

تطبيق ويب احترافي لمتابعة البورصة المصرية (EGX) مبني بـ React 18 + TypeScript + Tailwind CSS.

---

## 🚀 كيفية التشغيل

### المتطلبات
- Node.js 18+
- npm 9+

### الخطوة 1: تثبيت وتشغيل سيرفر البيانات (مرة واحدة فقط)

```bash
cd server
npm install
npx playwright install chromium   # تحميل متصفح Chromium (~150MB)
npm start
# سيعمل على http://localhost:3001
```

### الخطوة 2: تشغيل الـ Frontend

```bash
# في terminal جديد
npm install
npm run dev
# افتح http://localhost:5173
```

---

## 🏗️ معمارية البيانات

```
المتصفح (React)
      │ /api/* (Vite proxy)
      ▼
سيرفر Express (localhost:3001)
      │ Playwright (Chrome حقيقي)
      ▼
egx.com.eg (الموقع الرسمي للبورصة)
      │ إذا فشل الـ scraping
      ▼
Mock Data (بيانات تجريبية)
```

### لماذا Playwright وليس fetch مباشر؟

موقع egx.com.eg محمي بـ **F5 BIG-IP Bot Protection** — يرسل JavaScript challenge يجب تنفيذه في متصفح حقيقي. Playwright يفتح Chrome فعلي في الـ background ويُنفّذ الـ challenge تلقائياً.

---

## 📊 البيانات: الحقيقي مقابل التجريبي

| البيانات | المصدر | الحالة |
|----------|--------|--------|
| مؤشرات السوق (EGX30/70/100) | egx.com.eg | ✅ حقيقي (عبر Playwright) |
| أخبار البورصة | egx.com.eg | ✅ حقيقي |
| أكثر الأسهم ارتفاعاً/انخفاضاً | egx.com.eg | ✅ حقيقي |
| القطاعات | egx.com.eg | ✅ حقيقي |
| أسعار الأسهم | egx.com.eg | ✅ حقيقي |
| هيكل الملكية | **تجريبي ⚠️** | غير متاح على الموقع |
| السيولة اليومية | **تجريبي ⚠️** | غير متاح على الموقع |
| النتائج المالية | **تجريبي ⚠️** | من التقارير — غير متاح كـ API |

> **البيانات المحددة بـ "بيانات تجريبية"** تُظهر شارة أمبر في الواجهة.

---

## ⚙️ متغيرات البيئة

انسخ `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

| المتغير | القيمة الافتراضية | الوصف |
|---------|------------------|-------|
| `VITE_USE_MOCK` | `false` | `true` = بيانات تجريبية فقط بدون سيرفر |
| `VITE_PROXY_BASE` | (فارغ) | يستخدم Vite proxy تلقائياً في dev |

---

## 🗂️ هيكل المشروع

```
Sahmy/
├── src/                  # React frontend
│   ├── pages/            # LandingPage + StockPage
│   ├── components/       # مكونات UI والرسوم البيانية
│   ├── hooks/            # TanStack Query hooks
│   ├── services/         # marketApi.ts (الاتصال بالـ proxy)
│   ├── mocks/            # بيانات تجريبية واقعية
│   └── types/            # TypeScript types
└── server/               # Express + Playwright proxy
    └── index.js          # سيرفر السحب من egx.com.eg
```

---

## ⚠️ ملاحظات قانونية

- البيانات مصدرها البورصة المصرية (EGX) — تراجع شروط الاستخدام قبل النشر التجاري.
- المعلومات لأغراض إعلامية فقط وليست نصيحة استثمارية.
- السحب يحترم الـ rate limiting ويُخزّن النتائج لـ 5-10 دقائق لتقليل الضغط على الموقع.

---

## 🔧 استكشاف الأخطاء

**سيرفر البيانات لا يعمل؟**
```bash
cd server && npm start
# إذا ظهر خطأ في Chromium:
npx playwright install chromium
```

**البيانات تجريبية رغم تشغيل السيرفر؟**
- تأكد من عمل السيرفر: `curl http://localhost:3001/api/health`
- الموقع قد يكون عرّض تغييراً في HTML — تفقد logs السيرفر
- يمكن إجبار Mock: `VITE_USE_MOCK=true npm run dev`
