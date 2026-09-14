import { opencodeDataFile, numberOrNull, readJson, record, stringOrNull } from "../shared.js"

export const USAGE_URL = "https://opencode.ai/zen/go/v1/usage"
export const USER_AGENT = "opencode-multi-usage/1.0"

export type GoWindow = {
  percent: number | null
  resetsAt: string | null
  status: string | null
}

export type GoUsage = {
  rolling: GoWindow | null
  weekly: GoWindow | null
  monthly: GoWindow | null
  error?: string
}

export const emptyGoUsage = (error: string): GoUsage => ({
  rolling: null,
  weekly: null,
  monthly: null,
  error,
})

export const parseGoWindow = (value: unknown): GoWindow | null => {
  if (!record(value)) return null
  return {
    percent: numberOrNull(value.percent),
    resetsAt: stringOrNull(value.resetsAt),
    status: stringOrNull(value.status),
  }
}

export const parseGoUsage = (value: unknown): GoUsage => {
  const usage = record(value) && record(value.usage) ? value.usage : {}
  return {
    rolling: parseGoWindow(usage.rolling),
    weekly: parseGoWindow(usage.weekly),
    monthly: parseGoWindow(usage.monthly),
  }
}

const readAuth = async (): Promise<string | undefined> => {
  const environmentKey = stringOrNull(process.env.OPENCODE_GO_API_KEY)
  if (environmentKey) return environmentKey
  try {
    const data = await readJson(opencodeDataFile("auth.json"))
    if (record(data) && record(data["opencode-go"])) {
      const key = stringOrNull(data["opencode-go"].key)
      if (key) return key
    }
  } catch {
    // Fall through to the v2 account store.
  }
  try {
    const data = await readJson(opencodeDataFile("account.json"))
    const accounts = record(data) && record(data.accounts) ? data.accounts : {}
    for (const item of Object.values(accounts)) {
      if (!record(item) || item.serviceID !== "opencode-go") continue
      const credential = record(item.credential) ? item.credential : {}
      const key = stringOrNull(credential.key)
      if (key) return key
    }
  } catch {
    return undefined
  }
  return undefined
}

export const getGoUsage = async (): Promise<GoUsage> => {
  const key = await readAuth()
  if (!key) throw new Error("Connect OpenCode Go from /connect first")
  const response = await fetch(USAGE_URL, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json", "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(10_000),
  })
  if (response.status === 401) throw new Error("OpenCode Go key rejected (401); reconnect from /connect")
  if (response.status === 403) {
    const body = await response.text().catch(() => "")
    if (body.includes("1010") || body.includes("cloudflare")) {
      throw new Error("Usage request blocked by Cloudflare (403/1010); retry later")
    }
    throw new Error("No OpenCode Go subscription on this key (403)")
  }
  if (!response.ok) throw new Error(`Usage request failed (${response.status})`)
  return parseGoUsage(await response.json())
}
