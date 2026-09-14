import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { parseProviders } from "../dist/options.js"

describe("parseProviders", () => {
  it("enables no providers by default", () => {
    assert.deepEqual(parseProviders(undefined), [])
    assert.deepEqual(parseProviders({}), [])
  })

  it("filters unknown values, removes duplicates, and uses stable display order", () => {
    assert.deepEqual(
      parseProviders(["commandcode", "unknown", "codex", "commandcode"]),
      ["codex", "commandcode"],
    )
  })
})
