const PROVIDER_IDS = ["codex", "opencode-go", "commandcode"];
const parseProviders = (value) => {
  if (!Array.isArray(value)) return [];
  return PROVIDER_IDS.filter((provider) => value.includes(provider));
};
export {
  PROVIDER_IDS,
  parseProviders
};
//# sourceMappingURL=options.js.map