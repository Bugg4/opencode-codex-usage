declare const plugin: {
    id: string;
    setup(): void;
    tui: (api: import("@opencode-ai/plugin/tui").TuiPluginApi, options?: unknown) => Promise<void>;
};
export default plugin;
//# sourceMappingURL=index.d.ts.map