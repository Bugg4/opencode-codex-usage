/** @jsxImportSource @opentui/solid */
import type { TuiPluginApi } from "@opencode-ai/plugin/tui"
import { createSignal, Show } from "solid-js"
import { getUsage, type Usage, type WindowUsage } from "./usage.js"
import { parseRefreshInterval } from "./refresh.js"

const pct = (v: number | null) => (v === null ? "--%" : `${Math.round(v)}%`)

function windowLabel(w: WindowUsage, fallback: string): string {
  if (w.windowSeconds === null) return fallback
  const hours = Math.round(w.windowSeconds / 3600)
  if (hours >= 24) return `${Math.round(hours / 24)}d window`
  return `${Math.max(1, hours)}h window`
}

function resetLabel(ts: number | null): string {
  if (ts === null) return "reset unknown"
  const d = new Date(ts * 1000)
  return `resets ${d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
}

function View(props: { api: TuiPluginApi; usage: () => Usage | null; loading: () => boolean }) {
  const [open, setOpen] = createSignal(true)
  const theme = () => props.api.theme.current
  const u = () => props.usage()

  const shortSummary = () => {
    const value = u()
    if (!value && props.loading()) return "(loading)"
    if (!value || value.error) return "(unavailable)"
    // ponytail: primary is the shortest window; secondary is the fallback
    if (value.primary?.remainingPercent !== null && value.primary?.remainingPercent !== undefined) {
      return `(5h ${pct(value.primary.remainingPercent)} left)`
    }
    if (value.secondary) return `(${windowLabel(value.secondary, "wk")} ${pct(value.secondary.remainingPercent)} left)`
    return "(unavailable)"
  }

  const summary = () => {
    const value = u()
    if (!value && props.loading()) return "(loading)"
    if (!value) return "(unavailable)"
    if (value.error) return "(unavailable)"
    const plan = value.plan ?? "?"
    const left = value.primary ? pct(value.primary.remainingPercent) : "--%"
    return `(${plan} · ${left} left)`
  }

  const Empty = () => (
    <box flexDirection="row" gap={1}>
      <text flexShrink={0} fg={theme().textMuted}>
        •
      </text>
      <text fg={theme().textMuted}>(unavailable)</text>
    </box>
  )

  const statusColor = () => {
    const value = u()
    return value?.allowed === false || value?.limitReached === true ? theme().error : theme().success
  }

  const statusText = () => {
    const value = u()!
    const base =
      value.allowed === true ? "Allowed" : value.allowed === false ? "Not allowed" : "Allowed unknown"
    return value.limitReached === true ? `${base} · limit reached` : base
  }

  const WindowRow = (p: { label: string; win: WindowUsage }) => (
    <box flexDirection="row" gap={1}>
      <text flexShrink={0} fg={theme().textMuted}>
        •
      </text>
      <text fg={theme().text} wrapMode="word">
        {windowLabel(p.win, p.label)}:{" "}
        <span style={{ fg: theme().primary }}>{pct(p.win.remainingPercent)} left</span>
        <Show when={p.win.usedPercent !== null}>
          {" "}
          <span style={{ fg: theme().textMuted }}>({pct(p.win.usedPercent)} used)</span>
        </Show>
        <Show when={p.win.resetAt !== null}>
          <span style={{ fg: theme().textMuted }}> · {resetLabel(p.win.resetAt)}</span>
        </Show>
      </text>
    </box>
  )

  return (
    <box>
      <box flexDirection="row" gap={1} onMouseDown={() => setOpen((x) => !x)}>
        <text fg={theme().text}>{open() ? "▼" : "▶"}</text>
        <text fg={theme().text}>
          <b>Codex usage</b>
          <Show when={!open()}>
            <span style={{ fg: theme().textMuted }}>{" "}{shortSummary()}</span>
          </Show>
        </text>
      </box>
      <Show when={open()}>
        <Show
          when={u()}
          fallback={
            <text fg={theme().textMuted}>
              {props.loading() ? "Loading usage..." : "Usage unavailable"}
            </text>
          }
        >
          {(value) => (
            <box flexDirection="column">
              <Show when={!value().error} fallback={<Empty />}>
                <box flexDirection="row" gap={1}>
                  <text flexShrink={0} fg={theme().textMuted}>
                    •
                  </text>
                  <text fg={theme().text}>
                    Plan: <b>{value().plan ?? "unknown"}</b> ·{" "}
                    <span style={{ fg: statusColor() }}>{statusText()}</span>
                  </text>
                </box>
                <Show when={value().primary ?? value().secondary} fallback={<Empty />}>
                  <Show when={value().primary}>
                    {(win) => <WindowRow label="Primary window" win={win()} />}
                  </Show>
                  <Show when={value().secondary}>
                    {(win) => <WindowRow label="Secondary window" win={win()} />}
                  </Show>
                </Show>
              </Show>
            </box>
          )}
        </Show>
      </Show>
    </box>
  )
}

type Options = { refreshInterval?: string }

const tui = async (api: TuiPluginApi, options?: Options) => {
  let timer: ReturnType<typeof setInterval> | undefined
  let refreshing: Promise<void> | undefined
  const refreshInterval = parseRefreshInterval(options?.refreshInterval ?? "30s")
  const [usage, setUsage] = createSignal<Usage | null>(null)
  const [loading, setLoading] = createSignal(true)

  const refresh = () => {
    if (refreshing) return refreshing
    refreshing = (async () => {
      setLoading(true)
      try {
        setUsage(await getUsage())
      } catch (error) {
        setUsage({
          plan: null,
          allowed: null,
          limitReached: null,
          primary: null,
          secondary: null,
          error: error instanceof Error ? error.message : "Usage request failed",
        })
      } finally {
        setLoading(false)
      }
    })().finally(() => {
      refreshing = undefined
    })
    return refreshing
  }

  api.slots.register({
    order: 150,
    slots: {
      sidebar_content() {
        return <View api={api} usage={usage} loading={loading} />
      },
    },
  })

  void refresh()
  timer = setInterval(() => void refresh(), refreshInterval.milliseconds)
  api.lifecycle.onDispose(() => {
    if (timer) clearInterval(timer)
  })
}

export default {
  id: "codex-usage-collapsible",
  tui,
}
