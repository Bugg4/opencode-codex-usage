export declare const USAGE_URL = "https://chatgpt.com/backend-api/wham/usage";
export type WindowUsage = {
    usedPercent: number | null;
    remainingPercent: number | null;
    windowSeconds: number | null;
    resetAt: number | null;
};
export type Usage = {
    plan: string | null;
    allowed: boolean | null;
    limitReached: boolean | null;
    primary: WindowUsage | null;
    secondary: WindowUsage | null;
    error?: string;
};
export declare const accountIdFromToken: (token: string) => string | undefined;
export declare const parseUsage: (value: unknown) => Usage;
export declare const getUsage: () => Promise<Usage>;
//# sourceMappingURL=usage.d.ts.map