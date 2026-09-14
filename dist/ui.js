import { memo as _$memo } from "@opentui/solid";
import { createComponent as _$createComponent } from "@opentui/solid";
import { effect as _$effect } from "@opentui/solid";
import { insert as _$insert } from "@opentui/solid";
import { createTextNode as _$createTextNode } from "@opentui/solid";
import { insertNode as _$insertNode } from "@opentui/solid";
import { setProp as _$setProp } from "@opentui/solid";
import { createElement as _$createElement } from "@opentui/solid";
import { createSignal, Show } from "solid-js";
const pct = (value) => value === null ? "--%" : `${Math.round(value)}%`;
const remaining = (value) => value === null ? null : Math.max(0, Math.min(100, 100 - value));
function Row(props) {
  return (() => {
    var _el$ = _$createElement("box"), _el$2 = _$createElement("text"), _el$4 = _$createElement("text");
    _$insertNode(_el$, _el$2);
    _$insertNode(_el$, _el$4);
    _$setProp(_el$, "flexDirection", "row");
    _$setProp(_el$, "gap", 1);
    _$insertNode(_el$2, _$createTextNode(`\u2022`));
    _$setProp(_el$2, "flexShrink", 0);
    _$setProp(_el$4, "wrapMode", "word");
    _$insert(_el$4, () => props.children);
    _$effect((_p$) => {
      var _v$ = props.theme().muted, _v$2 = props.theme().text;
      _v$ !== _p$.e && (_p$.e = _$setProp(_el$2, "fg", _v$, _p$.e));
      _v$2 !== _p$.t && (_p$.t = _$setProp(_el$4, "fg", _v$2, _p$.t));
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}
function Empty(props) {
  return _$createComponent(Row, {
    get theme() {
      return props.theme;
    },
    get children() {
      var _el$5 = _$createElement("span");
      _$insertNode(_el$5, _$createTextNode(`(unavailable)`));
      _$effect((_$p) => _$setProp(_el$5, "style", {
        fg: props.theme().muted
      }, _$p));
      return _el$5;
    }
  });
}
function PlanRow(props) {
  return _$createComponent(Row, {
    get theme() {
      return props.theme;
    },
    get children() {
      return ["Plan: ", (() => {
        var _el$7 = _$createElement("b");
        _$insert(_el$7, () => props.plan ?? "unknown");
        return _el$7;
      })()];
    }
  });
}
function QuotaRow(props) {
  const [resetOpen, setResetOpen] = createSignal(false);
  const hasReset = () => props.resetAt !== null && props.resetAt !== void 0 && props.resetAt > Date.now();
  const toggleReset = () => {
    if (!hasReset()) return;
    setResetOpen((value) => !value);
    props.requestRender();
  };
  const resetLabel = () => new Date(props.resetAt).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const Summary = () => [_$memo(() => props.label), ":", " ", _$createComponent(Show, {
    get when() {
      return !props.unavailable;
    },
    get fallback() {
      return (() => {
        var _el$11 = _$createElement("span");
        _$insertNode(_el$11, _$createTextNode(`(unavailable)`));
        _$effect((_$p) => _$setProp(_el$11, "style", {
          fg: props.theme().muted
        }, _$p));
        return _el$11;
      })();
    },
    get children() {
      return [(() => {
        var _el$8 = _$createElement("span"), _el$9 = _$createTextNode(` left`);
        _$insertNode(_el$8, _el$9);
        _$insert(_el$8, () => pct(props.remainingPercent), _el$9);
        _$effect((_$p) => _$setProp(_el$8, "style", {
          fg: props.theme().primary
        }, _$p));
        return _el$8;
      })(), _$createComponent(Show, {
        get when() {
          return props.status;
        },
        get children() {
          var _el$0 = _$createElement("span"), _el$1 = _$createTextNode(` (`), _el$10 = _$createTextNode(`)`);
          _$insertNode(_el$0, _el$1);
          _$insertNode(_el$0, _el$10);
          _$insert(_el$0, () => props.status, _el$10);
          _$effect((_$p) => _$setProp(_el$0, "style", {
            fg: props.theme().warning
          }, _$p));
          return _el$0;
        }
      })];
    }
  })];
  return (() => {
    var _el$13 = _$createElement("box");
    _$insert(_el$13, _$createComponent(Show, {
      get when() {
        return hasReset();
      },
      get fallback() {
        return _$createComponent(Row, {
          get theme() {
            return props.theme;
          },
          get children() {
            return _$createComponent(Summary, {});
          }
        });
      },
      get children() {
        return [(() => {
          var _el$14 = _$createElement("box"), _el$15 = _$createElement("text"), _el$16 = _$createElement("text");
          _$insertNode(_el$14, _el$15);
          _$insertNode(_el$14, _el$16);
          _$setProp(_el$14, "flexDirection", "row");
          _$setProp(_el$14, "gap", 1);
          _$setProp(_el$14, "onMouseDown", toggleReset);
          _$setProp(_el$15, "flexShrink", 0);
          _$insert(_el$15, () => resetOpen() ? "\u25BC" : "\u25B6");
          _$setProp(_el$16, "wrapMode", "word");
          _$insert(_el$16, _$createComponent(Summary, {}));
          _$effect((_p$) => {
            var _v$3 = props.theme().muted, _v$4 = props.theme().text;
            _v$3 !== _p$.e && (_p$.e = _$setProp(_el$15, "fg", _v$3, _p$.e));
            _v$4 !== _p$.t && (_p$.t = _$setProp(_el$16, "fg", _v$4, _p$.t));
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$14;
        })(), _$createComponent(Show, {
          get when() {
            return resetOpen();
          },
          get children() {
            var _el$17 = _$createElement("box");
            _$setProp(_el$17, "paddingLeft", 2);
            _$insert(_el$17, _$createComponent(Row, {
              get theme() {
                return props.theme;
              },
              get children() {
                return ["Resets: ", _$memo(() => resetLabel())];
              }
            }));
            return _el$17;
          }
        })];
      }
    }));
    return _el$13;
  })();
}
function Section(props) {
  return (() => {
    var _el$18 = _$createElement("box"), _el$19 = _$createElement("box"), _el$20 = _$createElement("text"), _el$21 = _$createElement("text"), _el$22 = _$createElement("b");
    _$insertNode(_el$18, _el$19);
    _$insertNode(_el$19, _el$20);
    _$insertNode(_el$19, _el$21);
    _$setProp(_el$19, "flexDirection", "row");
    _$setProp(_el$19, "gap", 1);
    _$insert(_el$20, () => props.open() ? "\u25BC" : "\u25B6");
    _$insertNode(_el$21, _el$22);
    _$insert(_el$22, () => props.title);
    _$insert(_el$21, _$createComponent(Show, {
      get when() {
        return !props.open();
      },
      get children() {
        var _el$23 = _$createElement("span"), _el$24 = _$createTextNode(` `);
        _$insertNode(_el$23, _el$24);
        _$insert(_el$23, () => props.shortSummary(), null);
        _$effect((_$p) => _$setProp(_el$23, "style", {
          fg: props.theme().muted
        }, _$p));
        return _el$23;
      }
    }), null);
    _$insert(_el$18, _$createComponent(Show, {
      get when() {
        return props.open();
      },
      get children() {
        return _$createComponent(Show, {
          get when() {
            return props.available();
          },
          get fallback() {
            return (() => {
              var _el$25 = _$createElement("text");
              _$insert(_el$25, () => props.loading() ? "Loading usage..." : "Usage unavailable");
              _$effect((_$p) => _$setProp(_el$25, "fg", props.theme().muted, _$p));
              return _el$25;
            })();
          },
          get children() {
            return props.children;
          }
        });
      }
    }), null);
    _$effect((_p$) => {
      var _v$5 = props.toggleOpen, _v$6 = props.theme().text, _v$7 = props.theme().text;
      _v$5 !== _p$.e && (_p$.e = _$setProp(_el$19, "onMouseDown", _v$5, _p$.e));
      _v$6 !== _p$.t && (_p$.t = _$setProp(_el$20, "fg", _v$6, _p$.t));
      _v$7 !== _p$.a && (_p$.a = _$setProp(_el$21, "fg", _v$7, _p$.a));
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$18;
  })();
}
export {
  Empty,
  PlanRow,
  QuotaRow,
  Row,
  Section,
  pct,
  remaining
};
//# sourceMappingURL=ui.js.map