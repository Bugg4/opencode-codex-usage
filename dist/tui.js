import { jsx as _jsx, jsxs as _jsxs } from "@opentui/solid/jsx-runtime";
import { createSignal, Show } from "solid-js";
import { getUsage } from "./usage.js";
import { parseRefreshInterval } from "./refresh.js";
const pct = (v) => (v === null ? "--%" : `${Math.round(v)}%`);
function windowLabel(w, fallback) {
    if (w.windowSeconds === null)
        return fallback;
    const hours = Math.round(w.windowSeconds / 3600);
    if (hours >= 24)
        return `${Math.round(hours / 24)}d window`;
    return `${Math.max(1, hours)}h window`;
}
function resetLabel(ts) {
    if (ts === null)
        return "reset unknown";
    const d = new Date(ts * 1000);
    return `resets ${d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
}
function View(props) {
    const [open, setOpen] = createSignal(true);
    const theme = () => props.api.theme.current;
    const u = () => props.usage();
    const shortSummary = () => {
        const value = u();
        if (!value && props.loading())
            return "(loading)";
        if (!value || value.error)
            return "(unavailable)";
        // ponytail: primary is the shortest window; secondary is the fallback
        if (value.primary?.remainingPercent !== null && value.primary?.remainingPercent !== undefined) {
            return `(5h ${pct(value.primary.remainingPercent)} left)`;
        }
        if (value.secondary)
            return `(${windowLabel(value.secondary, "wk")} ${pct(value.secondary.remainingPercent)} left)`;
        return "(unavailable)";
    };
    const summary = () => {
        const value = u();
        if (!value && props.loading())
            return "(loading)";
        if (!value)
            return "(unavailable)";
        if (value.error)
            return "(unavailable)";
        const plan = value.plan ?? "?";
        const left = value.primary ? pct(value.primary.remainingPercent) : "--%";
        return `(${plan} · ${left} left)`;
    };
    const Empty = () => (_jsxs("box", { flexDirection: "row", gap: 1, children: [_jsx("text", { flexShrink: 0, fg: theme().textMuted, children: "\u2022" }), _jsx("text", { fg: theme().textMuted, children: "(unavailable)" })] }));
    const statusColor = () => {
        const value = u();
        return value?.allowed === false || value?.limitReached === true ? theme().error : theme().success;
    };
    const statusText = () => {
        const value = u();
        const base = value.allowed === true ? "Allowed" : value.allowed === false ? "Not allowed" : "Allowed unknown";
        return value.limitReached === true ? `${base} · limit reached` : base;
    };
    const WindowRow = (p) => (_jsxs("box", { flexDirection: "row", gap: 1, children: [_jsx("text", { flexShrink: 0, fg: theme().textMuted, children: "\u2022" }), _jsxs("text", { fg: theme().text, wrapMode: "word", children: [windowLabel(p.win, p.label), ":", " ", _jsxs("span", { style: { fg: theme().primary }, children: [pct(p.win.remainingPercent), " left"] }), _jsxs(Show, { when: p.win.usedPercent !== null, children: [" ", _jsxs("span", { style: { fg: theme().textMuted }, children: ["(", pct(p.win.usedPercent), " used)"] })] }), _jsx(Show, { when: p.win.resetAt !== null, children: _jsxs("span", { style: { fg: theme().textMuted }, children: [" \u00B7 ", resetLabel(p.win.resetAt)] }) })] })] }));
    return (_jsxs("box", { children: [_jsxs("box", { flexDirection: "row", gap: 1, onMouseDown: () => setOpen((x) => !x), children: [_jsx("text", { fg: theme().text, children: open() ? "▼" : "▶" }), _jsxs("text", { fg: theme().text, children: [_jsx("b", { children: "Codex usage" }), _jsx(Show, { when: !open(), children: _jsxs("span", { style: { fg: theme().textMuted }, children: [" ", shortSummary()] }) })] })] }), _jsx(Show, { when: open(), children: _jsx(Show, { when: u(), fallback: _jsx("text", { fg: theme().textMuted, children: props.loading() ? "Loading usage..." : "Usage unavailable" }), children: (value) => (_jsx("box", { flexDirection: "column", children: _jsxs(Show, { when: !value().error, fallback: _jsx(Empty, {}), children: [_jsxs("box", { flexDirection: "row", gap: 1, children: [_jsx("text", { flexShrink: 0, fg: theme().textMuted, children: "\u2022" }), _jsxs("text", { fg: theme().text, children: ["Plan: ", _jsx("b", { children: value().plan ?? "unknown" }), " \u00B7", " ", _jsx("span", { style: { fg: statusColor() }, children: statusText() })] })] }), _jsxs(Show, { when: value().primary ?? value().secondary, fallback: _jsx(Empty, {}), children: [_jsx(Show, { when: value().primary, children: (win) => _jsx(WindowRow, { label: "Primary window", win: win() }) }), _jsx(Show, { when: value().secondary, children: (win) => _jsx(WindowRow, { label: "Secondary window", win: win() }) })] })] }) })) }) })] }));
}
const tui = async (api, options) => {
    let timer;
    let refreshing;
    const refreshInterval = parseRefreshInterval(options?.refreshInterval ?? "30s");
    const [usage, setUsage] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
    const refresh = () => {
        if (refreshing)
            return refreshing;
        refreshing = (async () => {
            setLoading(true);
            try {
                setUsage(await getUsage());
            }
            catch (error) {
                setUsage({
                    plan: null,
                    allowed: null,
                    limitReached: null,
                    primary: null,
                    secondary: null,
                    error: error instanceof Error ? error.message : "Usage request failed",
                });
            }
            finally {
                setLoading(false);
            }
        })().finally(() => {
            refreshing = undefined;
        });
        return refreshing;
    };
    api.slots.register({
        order: 150,
        slots: {
            sidebar_content() {
                return _jsx(View, { api: api, usage: usage, loading: loading });
            },
        },
    });
    void refresh();
    timer = setInterval(() => void refresh(), refreshInterval.milliseconds);
    api.lifecycle.onDispose(() => {
        if (timer)
            clearInterval(timer);
    });
};
export default {
    id: "codex-usage-collapsible",
    tui,
};
//# sourceMappingURL=tui.js.map