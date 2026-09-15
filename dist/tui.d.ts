/** @jsxImportSource @opentui/solid */
import type { TuiPluginApi } from "@opencode-ai/plugin/tui";
import type { Plugin as V2Plugin } from "@opencode/plugin/tui";
export declare const legacyTui: (api: TuiPluginApi, options?: unknown) => Promise<void>;
declare const plugin: {
    id: string;
    setup(context: V2Plugin.Context): () => void;
    tui: (api: TuiPluginApi, options?: unknown) => Promise<void>;
};
export default plugin;
//# sourceMappingURL=tui.d.ts.map