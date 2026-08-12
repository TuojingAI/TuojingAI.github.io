import type { Config } from "tailwindcss";

// 拉丁在前、中文在后：浏览器逐字回退，英文数字走 SF/Inter，中文自然穿透到苹方。
// 反过来写（PingFang 在前）会让英文用苹方的拉丁字面，偏轻偏窄，英文会「塌」。
const SANS = [
  "Inter Tight",
  "Inter",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "PingFang SC",
  "HarmonyOS Sans SC",
  "MiSans",
  "Microsoft YaHei",
  "Source Han Sans SC",
  "Noto Sans CJK SC",
  "Apple Color Emoji",
  "sans-serif",
];

// 只用于标本标签、数值、编号 —— 中文回退必须显式给，否则汉字掉进 monospace 黑洞
const MONO = [
  "IBM Plex Mono",
  "ui-monospace",
  "SFMono-Regular",
  "SF Mono",
  "Menlo",
  "Consolas",
  "PingFang SC",
  "Microsoft YaHei",
  "monospace",
];

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // ↓ 这四项写在 theme 而不是 extend —— 目的是「删掉」旧值而不是「新增」。
    //   放 extend 是合并，下一个人照样能写出 font-serif / tracking-widest / shadow-hard。
    fontFamily: {
      sans: SANS,
      mono: MONO,
      // 仅原版对照用：正是它把中文大标题落到宋体 + 伪粗
      serif: ["Georgia", "Times New Roman", "Songti SC", "STSong", "serif"],
    },

    letterSpacing: {
      tightest: "-0.03em",
      tighter: "-0.025em",
      tight: "-0.018em",
      normal: "0",
      latin: "0.12em", // 仅限全大写拉丁 eyebrow，中文用到即为 bug
    },

    borderRadius: { none: "0", sm: "4px", DEFAULT: "10px", full: "9999px" },

    boxShadow: {
      none: "none",
      // 抬升靠 canvas-raised 的明度差 + 1px 发丝线，这档只留给真正的浮层
      overlay: "0 1px 2px rgba(26,23,20,.04), 0 8px 24px rgba(26,23,20,.06)",
      // 苹果式的柔和抬升：两层、低透明度、色相偏向底色而不是纯黑
      soft: "0 1px 2px rgba(11,43,73,.05), 0 8px 24px rgba(11,43,73,.07)",
      "soft-lg": "0 2px 4px rgba(11,43,73,.05), 0 18px 44px rgba(11,43,73,.10)",
      // 项目详情页的资源按钮仍用硬位移投影（PI 也只用在这一个器件上）
      hard: "4px 4px 0px #0B2B49",
      "hard-sm": "3px 3px 0px #0B2B49",
    },

    extend: {
      // 颜色全部走 CSS 变量（空格分隔 RGB 通道，保留 <alpha-value>）。
      // 四个版本各自在 index.css 里覆盖这组变量，共用同一套版式代码。
      colors: {
        canvas: {
          DEFAULT: "rgb(var(--c-canvas) / <alpha-value>)",
          raised: "rgb(var(--c-canvas-raised) / <alpha-value>)",
          sunken: "rgb(var(--c-canvas-sunken) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          muted: "rgb(var(--c-ink-muted) / <alpha-value>)",
          faint: "rgb(var(--c-ink-faint) / <alpha-value>)",
          inverse: "rgb(var(--c-ink-inverse) / <alpha-value>)",
        },
        rule: {
          DEFAULT: "rgb(var(--c-rule) / <alpha-value>)",
          strong: "rgb(var(--c-rule-strong) / <alpha-value>)",
        },
        instrument: {
          DEFAULT: "rgb(var(--c-instrument) / <alpha-value>)",
          wash: "rgb(var(--c-instrument-wash) / <alpha-value>)",
          ink: "rgb(var(--c-instrument-ink) / <alpha-value>)",
        },
        unsafe: "rgb(var(--c-unsafe) / <alpha-value>)",

        /* ↓ 仅供「原版 Legacy」对照版使用的旧色名。定稿删掉那一版时一并删除。 */
        background: "rgb(var(--c-canvas) / <alpha-value>)",
        "background-deep": "rgb(var(--c-canvas-sunken) / <alpha-value>)",
        foreground: "rgb(var(--c-ink) / <alpha-value>)",
        "muted-foreground": "rgb(var(--c-ink-muted) / <alpha-value>)",
        divider: "rgb(var(--c-rule) / <alpha-value>)",
        "card-border": "rgb(var(--c-rule) / <alpha-value>)",
        "card-border-hover": "rgb(var(--c-rule-strong) / <alpha-value>)",
        line: "rgb(var(--c-rule-strong) / <alpha-value>)",
        accent: "rgb(var(--c-instrument) / <alpha-value>)",
        deep: "rgb(var(--c-legacy-deep) / <alpha-value>)",
        brand: "#0877FE",
        "figure-bg": "rgb(var(--c-figure-bg) / <alpha-value>)",
      },

      fontSize: {
        specimen: [
          "0.6875rem",
          { lineHeight: "1.4", letterSpacing: "0.04em", fontWeight: "500" },
        ],
        eyebrow: [
          "0.75rem",
          { lineHeight: "1", letterSpacing: "0.12em", fontWeight: "600" },
        ],
        caption: [
          "0.8125rem",
          { lineHeight: "1.55", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        small: ["0.9375rem", { lineHeight: "1.7", fontWeight: "400" }],
        // 17px 不是 16px —— 汉字笔画密度远高于拉丁，16px 下「境/触/擎」在 1x 屏会并笔
        body: ["1.0625rem", { lineHeight: "1.8", fontWeight: "400" }],
        lead: ["1.1875rem", { lineHeight: "1.7", fontWeight: "400" }],
        h3: [
          "1.1875rem",
          { lineHeight: "1.45", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.375rem, 2.4vw, 1.75rem)",
          { lineHeight: "1.28", letterSpacing: "-0.018em", fontWeight: "700" },
        ],
        h1: [
          "clamp(1.875rem, 3.8vw, 2.75rem)",
          { lineHeight: "1.16", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
        display: [
          "clamp(2.25rem, 5.6vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
      },

      maxWidth: { content: "1320px", measure: "68ch" },

      transitionDuration: {
        90: "90ms",
        160: "160ms",
        240: "240ms",
        420: "420ms",
        900: "900ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.2, 0, 0, 1)",
        exit: "cubic-bezier(.4, 0, 1, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
