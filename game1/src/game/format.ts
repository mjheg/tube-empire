const SUFFIXES = [
  { threshold: 1e12, suffix: "T" },
  { threshold: 1e9, suffix: "B" },
  { threshold: 1e6, suffix: "M" },
  { threshold: 1e4, suffix: "K" },
];

export function formatNumber(n: number): string {
  if (n < 0) return "-" + formatNumber(-n);

  for (const { threshold, suffix } of SUFFIXES) {
    if (n >= threshold) {
      const value = n / threshold;
      return value < 10
        ? value.toFixed(1) + suffix
        : Math.floor(value) + suffix;
    }
  }

  return Math.floor(n).toLocaleString();
}

export function formatMoney(n: number): string {
  return "$" + formatNumber(n);
}
