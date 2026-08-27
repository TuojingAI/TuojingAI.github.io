/* 深浅色切换。只挂在项目详情页（blog）上。

   为什么不是月亮/太阳开关：站点导航是纯文字、全站零图标，塞一个图标开关
   既不合调性也是随处可见的默认解。这里让控件成为它所控制之物的缩影 ——
   色板显示的是"点下去会变成什么"，而不是当前状态，所以它同时是预览和按钮。

   切换瞬间用一道从按钮圆心扩散的擦除把整页翻过去（View Transitions API）。
   这是全站唯一一处"大"动效，其余保持安静；不支持该 API 或用户要求减少动效时
   直接静默换色，功能不受影响。 */
import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "tj-theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(t: Theme) {
  const el = document.documentElement;
  if (t === "dark") el.setAttribute("data-theme", "dark");
  else el.removeAttribute("data-theme");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Theme | null;
    const init = saved ?? systemTheme();
    setTheme(init);
    apply(init);
    /* 没有显式选择过就跟随系统改变 */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSys = () => {
      if (!localStorage.getItem(KEY)) {
        const t = systemTheme();
        setTheme(t);
        apply(t);
      }
    };
    mq.addEventListener("change", onSys);
    /* 离开详情页时清掉，首页保持浅色 */
    return () => {
      mq.removeEventListener("change", onSys);
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      const commit = () => {
        setTheme(next);
        apply(next);
        localStorage.setItem(KEY, next);
      };

      const reduce = window.matchMedia("(prefers-color-scheme: reduce)").matches
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      type VTDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
      const doc = document as VTDoc;

      if (!origin || reduce || typeof doc.startViewTransition !== "function") {
        commit();
        return;
      }

      const { x, y } = origin;
      /* 擦除半径要够到最远的那个角，否则会留下没翻过去的一块 */
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = doc.startViewTransition(commit);
      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          {
            duration: 620,
            easing: "cubic-bezier(.22,1,.36,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [theme],
  );

  return { theme, toggle };
}

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "浅色" : "深色";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={`切换到${next}`}
      title={`切换到${next}`}
      className="group flex items-center gap-2 rounded-full border border-card-border px-2.5 py-1
                 text-[11px] text-muted-foreground transition-colors duration-200
                 hover:border-card-border-hover hover:text-foreground
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-accent"
    >
      {/* 色板画的是「点下去会变成什么」：外圈是那一侧的画布色，内点是那一侧的墨色 */}
      <span
        aria-hidden
        className="relative block size-3.5 overflow-hidden rounded-full border transition-transform duration-300 group-hover:rotate-180"
        style={{
          background: theme === "dark" ? "#F7FAFC" : "#0C1822",
          borderColor: theme === "dark" ? "#C8D6E5" : "#3C5468",
        }}
      >
        <span
          className="absolute inset-y-0 right-0 block w-1/2"
          style={{ background: theme === "dark" ? "#0B2B49" : "#E6EDF5" }}
        />
      </span>
      <span className="font-mono">{next}</span>
    </button>
  );
}
