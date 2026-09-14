import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { parseRefreshInterval } from "../dist/refresh.js"

describe("parseRefreshInterval", () => {
  it("parses units", () => {
    assert.equal(parseRefreshInterval("30s").milliseconds, 30_000)
    assert.equal(parseRefreshInterval("5m").milliseconds, 300_000)
    assert.equal(parseRefreshInterval("2h").milliseconds, 7_200_000)
    assert.equal(parseRefreshInterval("1d").milliseconds, 86_400_000)
  })

  it("clamps below the 10s minimum", () => {
    assert.equal(parseRefreshInterval("5s").milliseconds, 10_000)
  })

  it("falls back to 30s on invalid input", () => {
    assert.equal(parseRefreshInterval("soon").milliseconds, 30_000)
    assert.equal(parseRefreshInterval(undefined).milliseconds, 30_000)
  })
})
