import { useEffect } from "react";

/* 进场：全站唯一配方。一个 observer 服务所有 .rise。
   threshold 必须是 0 —— 比例阈值对"比视口高的区块"和"图片加载前高度为 0 的 figure"
   永远不触发，会把元素永久卡在 opacity 0。 */
export function useRise(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll(".rise");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // 兜底：页面在后台标签页加载时 visibilityState=hidden，相交矩形为空、
    // 回调永不触发。进场动画不能是内容可见的前提。
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => el.classList.add("is-in"));
      io.disconnect();
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, [dep]);
}

/* 图版纪律：每张图强制带图注 + 来源口径，不让任何一张图不带口径出现。 */
export function Figure({
  src,
  alt,
  caption,
  meta,
  width,
  height,
  priority = false,
  bare = false,
}: {
  src: string;
  alt: string;
  caption: string;
  meta: string;
  width: number;
  height: number;
  priority?: boolean;
  bare?: boolean;
}) {
  return (
    <figure className="rise">
      <div
        className={
          bare ? "overflow-hidden" : "overflow-hidden border border-rule bg-figure-bg"
        }
      >
        {/* width/height 必给：预留宽高比，防跳动，也让观察器在图加载前量到真实高度 */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          {...(priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
        />
      </div>
      <figcaption className="mt-3 flex flex-col gap-1 border-l-2 border-instrument pl-3">
        <span className="text-caption text-ink-muted">{caption}</span>
        <span className="u-num font-mono text-specimen text-ink-faint">{meta}</span>
      </figcaption>
    </figure>
  );
}

/* 全大写拉丁专用档：全站唯一允许正字距的地方 */
export function Eyebrow({
  children,
  tone = "instrument",
}: {
  children: string;
  tone?: "instrument" | "faint";
}) {
  return (
    <p
      className={`text-eyebrow uppercase tracking-latin ${
        tone === "instrument" ? "text-instrument" : "text-ink-faint"
      }`}
    >
      {children}
    </p>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-content px-6 lg:px-10">{children}</div>
  );
}
