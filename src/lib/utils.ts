export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('ar-EG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString('ar-EG', { maximumFractionDigits: 2 })} مليار`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('ar-EG', { maximumFractionDigits: 2 })} مليون`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toLocaleString('ar-EG', { maximumFractionDigits: 1 })} ألف`;
  }
  return value.toLocaleString('ar-EG', { maximumFractionDigits: 0 });
}

export function formatCurrency(value: number): string {
  return `${formatCompact(value)} ج.م`;
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return formatDate(iso);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
