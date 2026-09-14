import { createComponent as _$createComponent } from "@opentui/solid";
import { memo as _$memo } from "@opentui/solid";
import { Show } from "solid-js";
import { Empty, pct, QuotaRow, remaining, Section } from "../ui.js";
const resetLabel = (iso, percent) => {
  if (iso === null) return "reset unknown";
  if (percent === 0) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "reset unknown";
  return `resets ${date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`;
};
function GoView(props) {
  const shortSummary = () => {
    const usage = props.usage();
    if (!usage && props.loading()) return "(loading)";
    if (!usage || usage.error) return "(unavailable)";
    for (const [label, value] of [["5h", remaining(usage.rolling?.percent ?? null)], ["1w", remaining(usage.weekly?.percent ?? null)], ["1mo", remaining(usage.monthly?.percent ?? null)]]) {
      if (value !== null) return `(${label} ${pct(value)} left)`;
    }
    return "(unavailable)";
  };
  const WindowRow = (row) => {
    const reset = () => resetLabel(row.window.resetsAt, row.window.percent);
    return _$createComponent(QuotaRow, {
      get label() {
        return row.label;
      },
      get remainingPercent() {
        return remaining(row.window.percent);
      },
      get usedPercent() {
        return row.window.percent;
      },
      get reset() {
        return reset() || void 0;
      },
      get status() {
        return _$memo(() => row.window.status !== "ok")() ? row.window.status : null;
      },
      get unavailable() {
        return _$memo(() => !!(row.window.status !== null && row.window.status !== "ok"))() && row.window.percent === null;
      },
      get theme() {
        return props.theme;
      }
    });
  };
  return _$createComponent(Section, {
    title: "OpenCode Go usage",
    shortSummary,
    get loading() {
      return props.loading;
    },
    available: () => props.usage() !== null,
    get theme() {
      return props.theme;
    },
    get open() {
      return props.open;
    },
    get toggleOpen() {
      return props.toggleOpen;
    },
    get children() {
      return _$createComponent(Show, {
        get when() {
          return !props.usage().error;
        },
        get fallback() {
          return _$createComponent(Empty, {
            get theme() {
              return props.theme;
            }
          });
        },
        get children() {
          return _$createComponent(Show, {
            get when() {
              return props.usage().rolling ?? props.usage().weekly ?? props.usage().monthly;
            },
            get fallback() {
              return _$createComponent(Empty, {
                get theme() {
                  return props.theme;
                }
              });
            },
            get children() {
              return [_$createComponent(Show, {
                get when() {
                  return props.usage().rolling;
                },
                children: (window) => _$createComponent(WindowRow, {
                  label: "5h",
                  get window() {
                    return window();
                  }
                })
              }), _$createComponent(Show, {
                get when() {
                  return props.usage().weekly;
                },
                children: (window) => _$createComponent(WindowRow, {
                  label: "1w",
                  get window() {
                    return window();
                  }
                })
              }), _$createComponent(Show, {
                get when() {
                  return props.usage().monthly;
                },
                children: (window) => _$createComponent(WindowRow, {
                  label: "1mo",
                  get window() {
                    return window();
                  }
                })
              })];
            }
          });
        }
      });
    }
  });
}
export {
  GoView
};
//# sourceMappingURL=opencode-go-view.js.map