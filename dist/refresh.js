const DEFAULT_REFRESH_INTERVAL_MS = 30_000;
const MIN_REFRESH_INTERVAL_MS = 10_000;
const MAX_REFRESH_INTERVAL_MS = 2_147_483_647;
const UNIT_MILLISECONDS = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
};
const formatInterval = (milliseconds) => {
    for (const [unit, multiplier] of [
        ["d", UNIT_MILLISECONDS.d],
        ["h", UNIT_MILLISECONDS.h],
        ["m", UNIT_MILLISECONDS.m],
    ]) {
        if (milliseconds >= multiplier && milliseconds % multiplier === 0) {
            return `${milliseconds / multiplier}${unit}`;
        }
    }
    return `${milliseconds / UNIT_MILLISECONDS.s}s`;
};
export const parseRefreshInterval = (value) => {
    const match = typeof value === "string" ? /^\s*(\d+)\s*([smhd])\s*$/i.exec(value) : null;
    const amount = match ? Number(match[1]) : Number.NaN;
    const unit = match?.[2]?.toLowerCase();
    const parsed = unit ? amount * UNIT_MILLISECONDS[unit] : Number.NaN;
    const milliseconds = Number.isSafeInteger(parsed) && parsed <= MAX_REFRESH_INTERVAL_MS
        ? Math.max(MIN_REFRESH_INTERVAL_MS, parsed)
        : DEFAULT_REFRESH_INTERVAL_MS;
    return { milliseconds, label: formatInterval(milliseconds) };
};
//# sourceMappingURL=refresh.js.map