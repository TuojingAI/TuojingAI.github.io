/* 图表底座。
   图型骨架来自 lieflat-charts 的 Lupi Basics gallery（F5/F6/F8/F12 等），
   但视觉推到站点这一侧：站点学 Physical Intelligence 靠"空"取质感，
   而 Lupi 的原生语法是编辑部密度（串珠、梯档、全大写字距注记）靠"挤"。
   两者硬碰会出学术插图的味道，所以这里保留数据契约与几何，
   把排版换成站点的：大号轻字重数字、发丝网格、无全大写注记、留白拉开。 */
import { useEffect, useRef, useState } from "react";

/* 确定性伪随机 —— 刷新必须长一样，禁用 Math.random（lieflat 硬规则） */
export const rnd = (i: number, k: number) =>
  Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

/* 滚入视野才播。reduced-motion 下直接给终态。 */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (setOn(true), io.disconnect())),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

/* 站点色板。灰阶承载数据，品牌蓝只标每张图的一个主角 ——
   蓝与灰在任何合理明度下都到不了 3:1 的相邻对比，所以颜色不能是唯一线索，
   类目差异一律另由明度、形状或位置承担。 */
export const C = {
  ink: "#0B2B49",
  mut: "#5A6E86",
  faint: "#8CA0B4",
  grid: "#E2EAF2",
  data: "#6E8299",
  dataLo: "#B6C4D2",
  hero: "#0877FE",
  heroTxt: "#0A6BE0",
  card: "#FFFFFF",
};

/* 卡片外壳：跟 Plate / 视频块同规格 —— 12px 圆角、发丝边、图注在下 */
export function ChartFrame({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-[12px] border border-card-border bg-white px-5 py-6 sm:px-7">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2.5 font-mono text-xs leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* 大号轻字重数字 —— 站点 tj-display 的做法：weight 300 + 负字距。
   图里所有"值"都走这个，是这一版和上一版观感差别最大的地方。 */
export const num = (size = 22) => ({
  fontSize: size,
  fontWeight: 300,
  letterSpacing: "-0.02em",
});
export const label = (size = 11) => ({ fontSize: size, fontWeight: 400 });
