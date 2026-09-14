import { readFile } from "node:fs/promises";
import path from "node:path";
export const USAGE_URL = "https://chatgpt.com/backend-api/wham/usage";
const record = (v) => Boolean(v) && typeof v === "object" && !Array.isArray(v);
const numberOrNull = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const stringOrNull = (v) => (typeof v === "string" && v.length > 0 ? v : null);
const booleanOrNull = (v) => (typeof v === "boolean" ? v : null);
export const accountIdFromToken = (token) => {
    const payload = token.split(".")[1];
    if (!payload)
        return undefined;
    try {
        const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!record(claims))
            return undefined;
        const direct = stringOrNull(claims.chatgpt_account_id);
        if (direct)
            return direct;
        const authClaims = record(claims["https://api.openai.com/auth"])
            ? claims["https://api.openai.com/auth"]
            : undefined;
        const nested = record(authClaims) ? stringOrNull(authClaims.chatgpt_account_id) : null;
        if (nested)
            return nested;
        const organizations = Array.isArray(claims.organizations) ? claims.organizations : [];
        const organization = organizations.find((item) => record(item) && stringOrNull(item.id));
        return record(organization) ? stringOrNull(organization.id) ?? undefined : undefined;
    }
    catch {
        return undefined;
    }
};
const parseWindow = (value) => {
    if (!record(value))
        return null;
    const usedPercent = numberOrNull(value.used_percent);
    return {
        usedPercent,
        remainingPercent: usedPercent === null ? null : Math.max(0, Math.min(100, 100 - usedPercent)),
        windowSeconds: numberOrNull(value.limit_window_seconds),
        resetAt: numberOrNull(value.reset_at),
    };
};
export const parseUsage = (value) => {
    const data = record(value) ? value : {};
    const rateLimit = record(data.rate_limit) ? data.rate_limit : {};
    return {
        plan: stringOrNull(data.plan_type),
        allowed: booleanOrNull(rateLimit.allowed),
        limitReached: booleanOrNull(rateLimit.limit_reached),
        primary: parseWindow(rateLimit.primary_window),
        secondary: parseWindow(rateLimit.secondary_window),
    };
};
const readAuth = async () => {
    const environmentToken = stringOrNull(process.env.CHATGPT_ACCESS_TOKEN);
    if (environmentToken) {
        return {
            access: environmentToken,
            accountId: stringOrNull(process.env.CHATGPT_ACCOUNT_ID) ?? accountIdFromToken(environmentToken),
        };
    }
    const dataHome = process.env.XDG_DATA_HOME ?? path.join(process.env.HOME ?? "", ".local", "share");
    const contents = process.env.OPENCODE_AUTH_CONTENT ?? (await readFile(path.join(dataHome, "opencode", "auth.json"), "utf8"));
    const data = JSON.parse(contents);
    const openai = record(data) && record(data.openai) ? data.openai : {};
    const access = stringOrNull(openai.access);
    return {
        access: access ?? undefined,
        accountId: stringOrNull(openai.accountId) ?? (access ? accountIdFromToken(access) : undefined),
    };
};
export const getUsage = async () => {
    const auth = await readAuth();
    if (!auth.access)
        throw new Error("Connect ChatGPT from /connect first");
    const headers = new Headers({ Authorization: `Bearer ${auth.access}`, Accept: "application/json" });
    if (auth.accountId)
        headers.set("ChatGPT-Account-ID", auth.accountId);
    const response = await fetch(USAGE_URL, { headers, signal: AbortSignal.timeout(10_000) });
    if (response.status === 401 || response.status === 403) {
        throw new Error("ChatGPT session expired; reconnect from /connect");
    }
    if (!response.ok)
        throw new Error(`Usage request failed (${response.status})`);
    return parseUsage(await response.json());
};
//# sourceMappingURL=usage.js.map