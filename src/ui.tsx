/** @jsxImportSource @opentui/solid */
import type { RGBA } from "@opentui/core"
import { Show, type Accessor, type JSX } from "solid-js"

export type UsageTheme = {
  text: RGBA
  muted: RGBA
  primary: RGBA
  error: RGBA
  warning: RGBA
  success: RGBA
}

export type UsageViewProps<Usage extends { error?: string }> = {
  usage: Accessor<Usage | null>
  loading: Accessor<boolean>
  theme: Accessor<UsageTheme>
  open: Accessor<boolean>
  toggleOpen: () => void
}

export const pct = (value: number | null): string =>
  value === null ? "--%" : `${Math.round(value)}%`

export const remaining = (value: number | null): number | null =>
  value === null ? null : Math.max(0, Math.min(100, 100 - value))

export function Row(props: { theme: Accessor<UsageTheme>; children: JSX.Element }) {
  return (
    <box flexDirection="row" gap={1}>
      <text flexShrink={0} fg={props.theme().muted}>•</text>
      <text fg={props.theme().text} wrapMode="word">{props.children}</text>
    </box>
  )
}

export function Empty(props: { theme: Accessor<UsageTheme> }) {
  return <Row theme={props.theme}><span style={{ fg: props.theme().muted }}>(unavailable)</span></Row>
}

export function PlanRow(props: { plan: string | null; theme: Accessor<UsageTheme> }) {
  return <Row theme={props.theme}>Plan: <b>{props.plan ?? "unknown"}</b></Row>
}

export function QuotaRow(props: {
  label: string
  remainingPercent: number | null
  usedPercent: number | null
  reset?: string
  status?: string | null
  unavailable?: boolean
  theme: Accessor<UsageTheme>
}) {
  return (
    <Row theme={props.theme}>
      {props.label}: <Show
        when={!props.unavailable}
        fallback={<span style={{ fg: props.theme().muted }}>(unavailable)</span>}
      >
        <span style={{ fg: props.theme().primary }}>{pct(props.remainingPercent)} left</span>
        <Show when={props.usedPercent !== null}> <span style={{ fg: props.theme().muted }}>({pct(props.usedPercent)} used)</span></Show>
        <Show when={props.status}><span style={{ fg: props.theme().warning }}> ({props.status})</span></Show>
      </Show>
      <Show when={props.reset}><span style={{ fg: props.theme().muted }}> - {props.reset}</span></Show>
    </Row>
  )
}

export function Section(props: {
  title: string
  shortSummary: Accessor<string>
  loading: Accessor<boolean>
  available: Accessor<boolean>
  theme: Accessor<UsageTheme>
  open: Accessor<boolean>
  toggleOpen: () => void
  children: JSX.Element
}) {
  return (
    <box>
      <box flexDirection="row" gap={1} onMouseDown={props.toggleOpen}>
        <text fg={props.theme().text}>{props.open() ? "▼" : "▶"}</text>
        <text fg={props.theme().text}>
          <b>{props.title}</b>
          <Show when={!props.open()}>
            <span style={{ fg: props.theme().muted }}> {props.shortSummary()}</span>
          </Show>
        </text>
      </box>
      <Show when={props.open()}>
        <Show
          when={props.available()}
          fallback={<text fg={props.theme().muted}>{props.loading() ? "Loading usage..." : "Usage unavailable"}</text>}
        >
          {props.children}
        </Show>
      </Show>
    </box>
  )
}
