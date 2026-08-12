import { useEffect, useRef } from "react";

/* 「境」——首屏品牌动画。
   一片规则点阵（视触觉传感器的 marker 阵列母题）铺在纯黑上，
   一条发光的界从左向右推过去；界经过时点被点亮、被推开，界过之后缓慢复位。
   这是抽象品牌影像，不是数据可视化 —— 点位与位移不承载任何测量含义。
   canvas 2D 手写，零依赖；prefers-reduced-motion 下渲染静止帧。 */
export default function FrontierField({
  deep = "7,46,84",     // 深处
  sea = "15,111,196",   // 中景
  lit = "127,212,255",  // 界心高光
}: {
  deep?: string;
  sea?: string;
  lit?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const GAP = 26; // 点距（CSS px）

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // 界的位置：一个缓慢右移并循环的比例
      const cycle = 11000;
      const p = ((t % cycle) / cycle) * 1.35 - 0.15; // -0.15 → 1.2
      const bx = p * w;
      const band = Math.max(150, w * 0.16); // 界的影响半宽

      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x0 = i * GAP;
          const y0 = j * GAP;
          const d = x0 - bx;
          const near = Math.max(0, 1 - Math.abs(d) / band);
          const e = near * near; // 收紧衰减

          // 界前方被推开一点，界后方回落
          const push = d > 0 ? e * 9 : e * -4;
          // 纵向随位置轻微起伏，避免死板的方格
          const wob = e * Math.sin((y0 / h) * Math.PI * 3 + t / 900) * 5;

          const x = x0 + push;
          const y = y0 + wob;

          // 边缘暗角：让画面四周沉下去，中心才立得起来
          const vx = (x / w - 0.5) * 2;
          const vy = (y / h - 0.5) * 2;
          const vig = 1 - Math.min(1, (vx * vx * 0.55 + vy * vy * 0.85)) * 0.75;

          const base = 0.16 * vig; // 静默点
          const a = (base + e * 1.0) * vig;
          const r = 1 + e * 2.2;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          // 越靠近界越往高光走：深海 → 海蓝 → 白蓝
          ctx.fillStyle =
            e > 0.62
              ? `rgba(${lit},${Math.min(1, a)})`
              : e > 0.12
                ? `rgba(${sea},${Math.min(1, a)})`
                : `rgba(${deep},${Math.min(1, base + e * 0.5)})`;
          ctx.fill();

          // 界心附近的点带一层小 bloom
          if (e > 0.55) {
            ctx.beginPath();
            ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${lit},${(e - 0.55) * 0.16 * vig})`;
            ctx.fill();
          }
        }
      }

      // 界本身：宽 bloom + 窄 bloom + 一根实线，三层叠出体积
      const wide = ctx.createLinearGradient(bx - band, 0, bx + band, 0);
      wide.addColorStop(0, `rgba(${deep},0)`);
      wide.addColorStop(0.5, `rgba(${sea},0.13)`);
      wide.addColorStop(1, `rgba(${deep},0)`);
      ctx.fillStyle = wide;
      ctx.fillRect(bx - band, 0, band * 2, h);

      const core = ctx.createLinearGradient(bx - 90, 0, bx + 90, 0);
      core.addColorStop(0, `rgba(${sea},0)`);
      core.addColorStop(0.5, `rgba(${lit},0.30)`);
      core.addColorStop(1, `rgba(${sea},0)`);
      ctx.fillStyle = core;
      ctx.fillRect(bx - 90, 0, 180, h);

      // 实线：中段最亮，上下收掉，避免读成一根生硬的分割线
      const line = ctx.createLinearGradient(0, 0, 0, h);
      line.addColorStop(0, `rgba(${sea},0)`);
      line.addColorStop(0.5, `rgba(255,255,255,0.72)`);
      line.addColorStop(1, `rgba(${sea},0)`);
      ctx.fillStyle = line;
      ctx.fillRect(bx - 0.75, 0, 1.5, h);
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) {
      draw(3200); // 静止帧：界停在一个好看的位置
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (reduce) draw(3200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [deep, sea, lit]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
