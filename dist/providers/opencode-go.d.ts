export declare const USAGE_URL = "https://opencode.ai/zen/go/v1/usage";
export declare const USER_AGENT = "opencode-multi-usage/1.0";
export type GoWindow = {
    percent: number | null;
    resetsAt: string | null;
    status: string | null;
};
export type GoUsage = {
    rolling: GoWindow | null;
    weekly: GoWindow | null;
    monthly: GoWindow | null;
    error?: string;
};
export declare const emptyGoUsage: (error: string) => GoUsage;
export declare const parseGoWindow: (value: unknown) => GoWindow | null;
export declare const parseGoUsage: (value: unknown) => GoUsage;
export declare const getGoUsage: () => Promise<GoUsage>;
//# sourceMappingURL=opencode-go.d.ts.map