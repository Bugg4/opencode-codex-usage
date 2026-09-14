export const PROVIDER_IDS = ["codex", "opencode-go", "commandcode"] as const

export type ProviderId = (typeof PROVIDER_IDS)[number]

export type Options = {
  providers?: ProviderId[]
  refreshInterval?: string
}

export const parseProviders = (value: unknown): ProviderId[] => {
  if (!Array.isArray(value)) return []
  return PROVIDER_IDS.filter((provider) => value.includes(provider))
}
