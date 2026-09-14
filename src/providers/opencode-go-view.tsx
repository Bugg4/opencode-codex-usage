/** @jsxImportSource @opentui/solid */
import { Show } from "solid-js"
import type { GoUsage, GoWindow } from "./opencode-go.js"
import { Empty, pct, QuotaRow, remaining, Section, type UsageViewProps } from "../ui.js"

const resetLabel = (iso: string | null, percent: number | null): string => {
  if (iso === null) return "reset unknown"
  if (percent === 0) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "reset unknown"
  return `resets ${date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
}

export function GoView(props: UsageViewProps<GoUsage>) {
  const shortSummary = () => {
    const usage = props.usage()
    if (!usage && props.loading()) return "(loading)"
    if (!usage || usage.error) return "(unavailable)"
    for (const [label, value] of [
      ["5h", remaining(usage.rolling?.percent ?? null)],
      ["1w", remaining(usage.weekly?.percent ?? null)],
      ["1mo", remaining(usage.monthly?.percent ?? null)],
    ] as const) {
      if (value !== null) return `(${label} ${pct(value)} left)`
    }
    return "(unavailable)"
  }
  const WindowRow = (row: { label: string; window: GoWindow }) => {
    const reset = () => resetLabel(row.window.resetsAt, row.window.percent)
    return <QuotaRow
      label={row.label}
      remainingPercent={remaining(row.window.percent)}
      usedPercent={row.window.percent}
      reset={reset() || undefined}
      status={row.window.status !== "ok" ? row.window.status : null}
      unavailable={row.window.status !== null && row.window.status !== "ok" && row.window.percent === null}
      theme={props.theme}
    />
  }

  return (
    <Section
      title="OpenCode Go usage"
      shortSummary={shortSummary}
      loading={props.loading}
      available={() => props.usage() !== null}
      theme={props.theme}
      open={props.open}
      toggleOpen={props.toggleOpen}
    >
      <Show when={!props.usage()!.error} fallback={<Empty theme={props.theme} />}>
        <Show when={props.usage()!.rolling ?? props.usage()!.weekly ?? props.usage()!.monthly} fallback={<Empty theme={props.theme} />}>
          <Show when={props.usage()!.rolling}>{(window) => <WindowRow label="5h" window={window()} />}</Show>
          <Show when={props.usage()!.weekly}>{(window) => <WindowRow label="1w" window={window()} />}</Show>
          <Show when={props.usage()!.monthly}>{(window) => <WindowRow label="1mo" window={window()} />}</Show>
        </Show>
      </Show>
    </Section>
  )
}
