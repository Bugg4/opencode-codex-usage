export declare const PROVIDER_IDS: readonly ["codex", "opencode-go", "commandcode"];
export type ProviderId = (typeof PROVIDER_IDS)[number];
export type Options = {
    providers?: ProviderId[];
    refreshInterval?: string;
};
export declare const parseProviders: (value: unknown) => ProviderId[];
//# sourceMappingURL=options.d.ts.map