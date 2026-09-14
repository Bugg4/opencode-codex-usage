import type { Plugin as V2Plugin } from "@opencode/plugin"
import { legacyTui } from "./tui.js"

const plugin = {
  id: "opencode.multi-usage",
  setup() {},
  tui: legacyTui,
} satisfies V2Plugin.Plugin & { tui: typeof legacyTui }

export default plugin
