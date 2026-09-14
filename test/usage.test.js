import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { parseUsage, accountIdFromToken } from "../dist/usage.js"

const b64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url")

describe("parseUsage", () => {
  it("parses plan, allowance and both windows", () => {
    const usage = parseUsage({
      plan_type: "plus",
      rate_limit: {
        allowed: true,
        limit_reached: false,
        primary_window: { used_percent: 30, limit_window_seconds: 10800, reset_at: 1789000000 },
        secondary_window: { used_percent: 10, limit_window_seconds: 604800, reset_at: 1789600000 },
      },
    })
    assert.equal(usage.plan, "plus")
    assert.equal(usage.allowed, true)
    assert.equal(usage.limitReached, false)
    assert.equal(usage.primary?.remainingPercent, 70)
    assert.equal(usage.primary?.windowSeconds, 10800)
    assert.equal(usage.secondary?.remainingPercent, 90)
  })

  it("tolerates missing rate_limit", () => {
    const usage = parseUsage({ plan_type: "team" })
    assert.equal(usage.plan, "team")
    assert.equal(usage.primary, null)
    assert.equal(usage.secondary, null)
  })
})

describe("accountIdFromToken", () => {
  it("reads the direct claim", () => {
    const token = `h.${b64url({ chatgpt_account_id: "acc-123" })}.s`
    assert.equal(accountIdFromToken(token), "acc-123")
  })

  it("reads the nested auth claim", () => {
    const token = `h.${b64url({ "https://api.openai.com/auth": { chatgpt_account_id: "acc-456" } })}.s`
    assert.equal(accountIdFromToken(token), "acc-456")
  })

  it("returns undefined for garbage", () => {
    assert.equal(accountIdFromToken("not-a-jwt"), undefined)
  })
})
