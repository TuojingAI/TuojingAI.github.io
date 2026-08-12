import { useEffect, useRef } from "react";

/* 中英互变的物理特效文字 —— 鼠标悬停触发。
   做法：把两串文字分别画到离屏 canvas，读像素采出字形点集，粒子在两个点集间迁移。
   五种效果的差别在于「迁移途中施加什么力」以及「粒子画成什么形状」：

   dissolve 雾化 / 粒子溶解   各向同性散射，无方向偏好，最克制        方块
   vapor    汽化 / 升华       浮力向上 + 卷曲湍流，像蒸汽升腾再凝结    方块（越散越透）
   electric 电击 / 辉光放电   横向急冲 + 高频抖动，途中抽点对拉电弧    方块 + 电弧
   magnetic 磁场 / 铁粉排列   沿偶极场线位移，粒子转成沿场线的短线段    短线段（这是铁屑感的来源）
   crystal  相变 / 结晶       位置吸附到三角晶格，分段跳变而非平滑     菱形

   每次触发随机选一种。静止态粒子边长 = 采样步长，正好铺满，读作实字而不是点阵。 */

export type MorphEffect =
  // 物理侧
  | "dissolve"
  | "vapor"
  | "electric"
  | "magnetic"
  | "crystal"
  // 数字侧（赛博）
  | "glitch"
  | "datastream"
  | "scanline"
  | "pixelate";

export const PHYSICAL: MorphEffect[] = [
  "dissolve", // 雾化 / 粒子溶解
  "vapor", // 汽化 / 升华
  "electric", // 电击 / 辉光放电
  "magnetic", // 磁场 / 铁粉排列
  "crystal", // 相变 / 结晶
];

export const CYBER: MorphEffect[] = [
  "glitch", // 故障 / RGB 通道分离 + 横向条带错位
  "datastream", // 数据流 / 竖向坠落再重组
  "scanline", // 扫描线 / 一条亮线扫过，线后重建
  "pixelate", // 像素化 / 量化成粗块再细化
];

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  seed: number;
};

const SPEED = 0.045; // k 每帧向 target 逼近的比例

function sample(
  text: string,
  font: string,
  ls: string,
  w: number,
  h: number,
  stride: number,
  baselineY: number,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.font = font;
  if ("letterSpacing" in g)
    (g as unknown as { letterSpacing: string }).letterSpacing = ls;
  g.textBaseline = "alphabetic";
  g.fillStyle = "#000";
  g.fillText(text, 0, baselineY);

  const d = g.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += stride)
    for (let x = 0; x < w; x += stride)
      if (d[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
  return pts;
}

function resize(pts: { x: number; y: number }[], n: number) {
  if (!pts.length) return Array.from({ length: n }, () => ({ x: 0, y: 0 }));
  const out = [];
  for (let i = 0; i < n; i++) out.push(pts[Math.floor((i * pts.length) / n)]);
  return out;
}

export default function MorphText({
  a,
  b,
  color = "8,119,254",
  pool = PHYSICAL,
  onEffect,
}: {
  a: string;
  b: string;
  color?: string;
  pool?: MorphEffect[];
  onEffect?: (e: MorphEffect) => void;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const target = useRef(0); // 0 = 中文, 1 = 英文
  const fx = useRef<MorphEffect>("vapor");
  const onEffectRef = useRef(onEffect);
  onEffectRef.current = onEffect;

  useEffect(() => {
    const el = host.current;
    const canvas = cv.current;
    if (!el || !canvas) return;

    // Webfont 是异步加载的。在它就绪前 getComputedStyle 拿到的是回退字体的
    // 度量，量出来的宽高、采样出来的字形点集全是错的（实测 4 个 68px 汉字
    // 只量到 172px，应为约 264px），而且事件会挂在这个失效实例上。
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const ready = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    Promise.resolve(ready).then(() => {
      if (!cancelled) dispose = init();
    });
    return () => {
      cancelled = true;
      dispose?.();
    };

    function init() {
      // 函数声明会被提升，TS 在这里丢了外层的非空收窄，重新断言一次
      if (!el || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    const ls = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;

    // 画布按两串里更宽的定尺寸，切换时标题不重排
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = font;
    if ("letterSpacing" in probe)
      (probe as unknown as { letterSpacing: string }).letterSpacing = ls;
    const Wa = Math.ceil(probe.measureText(a).width);
    const Wb = Math.ceil(probe.measureText(b).width);
    const W = Math.max(Wa, Wb) + 10;
    // 基线对齐：inline-block 的基线是盒子底边，而字形基线在画布内部。
    // 先按两串里最大的 ascent/descent 定高，把字形基线放在 H-descent-2，
    // 再用负 verticalAlign 把整个盒子下移同样的量，字形基线才会落在文本基线上。
    const ma = probe.measureText(a);
    const mb = probe.measureText(b);
    const asc = Math.ceil(Math.max(ma.actualBoundingBoxAscent, mb.actualBoundingBoxAscent));
    const desc = Math.ceil(Math.max(ma.actualBoundingBoxDescent, mb.actualBoundingBoxDescent));
    const PAD = 2;
    const H = asc + desc + PAD * 2;
    const baselineY = H - desc - PAD;
    el.style.width = `${Wa}px`; // 初始为中文宽度，随形变插值
    el.style.height = `${H}px`;
    el.style.verticalAlign = `${-(desc + PAD)}px`;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const g = canvas.getContext("2d")!;
    g.scale(dpr, dpr);

    const stride = 2;
    const pa = sample(a, font, ls, W, H, stride, baselineY);
    const pb = sample(b, font, ls, W, H, stride, baselineY);
    const N = Math.min(9000, Math.max(pa.length, pb.length));
    const A = resize(pa, N);
    const B = resize(pb, N);

    const ps: P[] = A.map((p, i) => ({
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      ax: p.x,
      ay: p.y,
      bx: B[i].x,
      by: B[i].y,
      seed: Math.random() * 1000,
    }));

    // 静止态直接画真文字（不是粒子）——粒子网格在静止时会留下一层
    // 轻微的像素化毛边，文字必须是干净的。只有变形途中才走粒子。
    const drawRest = (which: 0 | 1) => {
      el.style.width = `${which ? Wb : Wa}px`;
      g.clearRect(0, 0, W, H);
      g.font = font;
      if ("letterSpacing" in g)
        (g as unknown as { letterSpacing: string }).letterSpacing = ls;
      g.textBaseline = "alphabetic";
      g.fillStyle = `rgb(${color})`;
      g.fillText(which ? b : a, 0, baselineY);
    };

    if (reduce) {
      drawRest(0); // 减弱动效：静态中文，不响应悬停
      return;
    }

    let k = 0; // 当前位置 0→1
    let raf = 0;
    let idle = false;

    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.021 + t * 0.0011) * Math.cos(y * 0.027 - t * 0.0009);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      k += (target.current - k) * SPEED;
      const settled = Math.abs(target.current - k) < 0.001;
      if (settled) {
        if (!idle) {
          k = target.current;
          drawRest(k > 0.5 ? 1 : 0);
          idle = true; // 静止后停止逐帧重绘，省电
        }
        return;
      }
      idle = false;
      // 外层宽度跟着插值：中文态不会留出英文那段空洞，行内也不会被撑开
      el.style.width = `${Math.round(Wa + (Wb - Wa) * k)}px`;

      // 离散度：两端 0，中途最大
      const spread = Math.sin(Math.min(1, Math.max(0, k)) * Math.PI);
      const e = fx.current;

      g.clearRect(0, 0, W, H);

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        let tx = p.ax + (p.bx - p.ax) * k;
        let ty = p.ay + (p.by - p.ay) * k;
        let ox = 0;
        let oy = 0;
        let alpha = 1;

        const n = noise(p.x + p.seed, p.y, now);

        if (e === "dissolve") {
          const ang = p.seed * 0.618;
          ox = Math.cos(ang) * 34 * spread * (0.4 + (p.seed % 7) / 7);
          oy = Math.sin(ang) * 34 * spread * (0.4 + (p.seed % 5) / 5);
          alpha = 1 - spread * 0.5;
        } else if (e === "vapor") {
          ox = n * 26 * spread;
          oy = (-42 * spread + n * 14 * spread) * (0.6 + (p.seed % 10) / 14);
          alpha = 1 - spread * 0.6;
        } else if (e === "electric") {
          ox = n * 46 * spread;
          oy = Math.sin(p.seed + now * 0.02) * 10 * spread;
          alpha = 1 - spread * 0.35;
        } else if (e === "magnetic") {
          // 偶极场：以画布中心为极，位移沿场线切向
          const cx = W / 2;
          const cy = H / 2;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const r = Math.hypot(dx, dy) + 1;
          ox = (-dy / r) * 34 * spread;
          oy = (dx / r) * 34 * spread + n * 8 * spread;
          alpha = 1 - spread * 0.3;
        } else if (e === "glitch") {
          // 故障：按水平条带整体错位，同一条带内位移一致 —— 这才像信号撕裂
          const band = Math.floor(ty / 7);
          const j = Math.sin(band * 12.9898 + Math.floor(now / 90)) * 43758.5453;
          ox = ((j - Math.floor(j)) - 0.5) * 46 * spread;
          alpha = 1 - spread * 0.2;
        } else if (e === "datastream") {
          // 数据流：先竖向坠落，再从下方重组
          const lane = (p.seed % 17) / 17;
          oy = (0.5 - Math.abs(k - 0.5)) * 2 * (40 + lane * 70);
          ox = n * 5 * spread;
          alpha = 1 - spread * 0.45;
        } else if (e === "scanline") {
          // 扫描线：一条亮线自上而下扫过，线之前保持旧位，线之后落到新位
          const sweep = k * (H + 30) - 15;
          const passed = ty < sweep;
          if (!passed) {
            tx = p.ax;
            ty = p.ay;
          }
          ox = passed ? 0 : n * 3;
          alpha = passed ? 1 : 0.85;
        } else if (e === "pixelate") {
          // 像素化：中途量化成粗块，再细化回来
          const q = 3 + spread * 12;
          tx = Math.round(tx / q) * q;
          ty = Math.round(ty / q) * q;
          alpha = 1 - spread * 0.15;
        } else {
          // crystal：中途把位置吸附到三角晶格，读作"重结晶"
          const L = 9;
          if (spread > 0.15) {
            const row = Math.round(ty / L);
            tx = Math.round((tx - (row % 2) * L * 0.5) / L) * L + (row % 2) * L * 0.5;
            ty = row * L;
          }
          ox = n * 12 * spread;
          oy = -n * 12 * spread;
          alpha = 1 - spread * 0.25;
        }

        const dx2 = tx + ox - p.x;
        const dy2 = ty + oy - p.y;
        // 结晶用更硬的跟随，出跳变感；其余平滑
        const stiff = e === "crystal" ? 0.3 : 0.16;
        const damp = e === "crystal" ? 0.55 : 0.74;
        p.vx = (p.vx + dx2 * stiff) * damp;
        p.vy = (p.vy + dy2 * stiff) * damp;
        p.x += p.vx;
        p.y += p.vy;

        g.fillStyle = `rgba(${color},${alpha})`;

        if (e === "magnetic" && spread > 0.06) {
          // 铁屑：画成沿场线取向的短线段，这才是铁粉排列的样子
          const cx = W / 2;
          const cy = H / 2;
          const ang = Math.atan2(p.y - cy, p.x - cx) + Math.PI / 2;
          const L = 2 + spread * 4;
          g.beginPath();
          g.lineWidth = stride * 0.9;
          g.strokeStyle = `rgba(${color},${alpha})`;
          g.moveTo(p.x - Math.cos(ang) * L * 0.5, p.y - Math.sin(ang) * L * 0.5);
          g.lineTo(p.x + Math.cos(ang) * L * 0.5, p.y + Math.sin(ang) * L * 0.5);
          g.stroke();
        } else if (e === "crystal" && spread > 0.12) {
          // 菱形
          const r = stride * 1.15;
          g.beginPath();
          g.moveTo(p.x, p.y - r);
          g.lineTo(p.x + r, p.y);
          g.lineTo(p.x, p.y + r);
          g.lineTo(p.x - r, p.y);
          g.closePath();
          g.fill();
        } else {
          g.fillRect(p.x, p.y, stride, stride);
        }
      }

      // 故障：RGB 通道分离（把已画内容错位重绘两次，用 lighten 混合出色边）
      if (e === "glitch" && spread > 0.15) {
        g.globalCompositeOperation = "lighten";
        g.globalAlpha = spread * 0.5;
        g.drawImage(canvas, -3 * spread * dpr, 0, W, H);
        g.drawImage(canvas, 3 * spread * dpr, 0, W, H);
        g.globalAlpha = 1;
        g.globalCompositeOperation = "source-over";
      }

      // 扫描线本体
      if (e === "scanline" && spread > 0.02) {
        const y = k * (H + 30) - 15;
        const grad = g.createLinearGradient(0, y - 14, 0, y + 4);
        grad.addColorStop(0, `rgba(${color},0)`);
        grad.addColorStop(1, `rgba(${color},0.85)`);
        g.fillStyle = grad;
        g.fillRect(0, y - 14, W, 18);
      }

      if (e === "electric" && spread > 0.2) {
        g.strokeStyle = `rgba(${color},${(spread - 0.2) * 0.55})`;
        g.lineWidth = 1;
        for (let m = 0; m < 8; m++) {
          const s = ps[(Math.random() * ps.length) | 0];
          const t = ps[(Math.random() * ps.length) | 0];
          g.beginPath();
          g.moveTo(s.x, s.y);
          for (let j = 1; j <= 4; j++) {
            const r = j / 4;
            g.lineTo(
              s.x + (t.x - s.x) * r + (Math.random() - 0.5) * 18,
              s.y + (t.y - s.y) * r + (Math.random() - 0.5) * 18,
            );
          }
          g.stroke();
        }
      }
    };

    // ?fx=<id> 强制指定某一种，便于逐个对比；不带参数就随机
    const forced = new URLSearchParams(window.location.search).get("fx");
    const pick = () => {
      const e = forced && pool.includes(forced as MorphEffect)
        ? (forced as MorphEffect)
        : pool[(Math.random() * pool.length) | 0];
      fx.current = e;
      onEffectRef.current?.(e);
    };

    const enter = () => {
      if (target.current === 1) return;
      pick(); // 每次触发随机换一种效果
      target.current = 1;
      idle = false;
    };
    const leave = () => {
      if (target.current === 0) return;
      pick(); // 回来的路上也换一种
      target.current = 0;
      idle = false;
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("focus", enter);
    el.addEventListener("blur", leave);
    // 触屏没有 hover：点一下切过去，再点切回来
    el.addEventListener("click", () => (target.current ? leave() : enter()));

    drawRest(0);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("focus", enter);
      el.removeEventListener("blur", leave);
    };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, color, pool]);

  return (
    <span
      ref={host}
      tabIndex={0}
      role="button"
      aria-label={`${a} / ${b}`}
      className="relative inline-block cursor-pointer overflow-visible align-baseline outline-none"
    >
      <span className="absolute h-px w-px overflow-hidden opacity-0">{a}</span>
      {/* 绝对定位：画布保持两态里更宽的那个尺寸，外层宽度另行插值，
          这样中文态右侧不会留空洞，形变途中粒子也能飞出外层边界 */}
      <canvas ref={cv} aria-hidden className="absolute left-0 top-0 block" />
    </span>
  );
}
