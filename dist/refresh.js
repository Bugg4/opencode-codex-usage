const DEFAULT_REFRESH_INTERVAL_MS = 3e5;
const MIN_REFRESH_INTERVAL_MS = 1e4;
const MAX_REFRESH_INTERVAL_MS = 2147483647;
const UNIT_MILLISECONDS = {
  s: 1e3,
  m: 6e4,
  h: 36e5,
  d: 864e5
};
const formatInterval = (milliseconds) => {
  for (const [unit, multiplier] of [
    ["d", UNIT_MILLISECONDS.d],
    ["h", UNIT_MILLISECONDS.h],
    ["m", UNIT_MILLISECONDS.m]
  ]) {
    if (milliseconds >= multiplier && milliseconds % multiplier === 0) {
      return `${milliseconds / multiplier}${unit}`;
    }
  }
  return `${milliseconds / UNIT_MILLISECONDS.s}s`;
};
const parseRefreshInterval = (value, fallback = DEFAULT_REFRESH_INTERVAL_MS) => {
  const match = typeof value === "string" ? /^\s*(\d+)\s*([smhd])\s*$/i.exec(value) : null;
  const amount = match ? Number(match[1]) : Number.NaN;
  const unit = match?.[2]?.toLowerCase();
  const parsed = unit ? amount * UNIT_MILLISECONDS[unit] : Number.NaN;
  const milliseconds = Number.isSafeInteger(parsed) && parsed <= MAX_REFRESH_INTERVAL_MS ? Math.max(MIN_REFRESH_INTERVAL_MS, parsed) : fallback;
  return { milliseconds, label: formatInterval(milliseconds) };
};
export {
  DEFAULT_REFRESH_INTERVAL_MS,
  parseRefreshInterval
};
//# sourceMappingURL=refresh.js.map