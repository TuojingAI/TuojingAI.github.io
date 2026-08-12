/* Hallmark · macrostructure: Photographic (08) · nav: floating-minimal · footer: single-line
   影。近黑底 + 全幅影像，文字退为批注。先让人看，再让人读。
   三幅影像取自同一帧真实渲染的不同取景 —— 图注写明，不伪装成三个场景。 */
import simArm from "../assets/media/sim-arm.webp";
import simRow from "../assets/media/sim-row.webp";
import simWide from "../assets/media/sim-wide.webp";
import logoWhite from "../assets/tuojing-logo-white.png";
import {
  careers,
  footer,
  loop,
  naming,
  pillars,
  positioning,
  site,
  tracks,
} from "../data/siteContent";
import { Shell, useRise } from "../shared";

function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <Shell>
        <div className="flex items-center justify-between gap-6 py-5">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={logoWhite} alt={site.wordmark} className="h-5 w-auto" />
          </a>
          <a
            href={`mailto:${careers.email}`}
            className="u-num font-mono text-specimen text-ink transition-colors duration-160 ease-standard hover:text-instrument"
          >
            {careers.email}
          </a>
        </div>
      </Shell>
    </nav>
  );
}

/* 全幅影像 + 批注。scrim 保证文字对比度（深底上白字必须压住高光区）。 */
function Plate({
  src,
  alt,
  width,
  height,
  caption,
  meta,
  children,
  minH = "min-h-[86svh]",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  meta: string;
  children?: React.ReactNode;
  minH?: string;
  priority?: boolean;
}) {
  return (
    <section className={`relative isolate flex ${minH} items-end overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(var(--c-canvas))_0%,rgb(var(--c-canvas)/0.78)_26%,rgb(var(--c-canvas)/0.30)_58%,rgb(var(--c-canvas)/0.62)_100%)]"
      />
      <div className="w-full pb-12 pt-28 lg:pb-16">
        <Shell>
          {children}
          <div className="mt-8 flex max-w-measure flex-col gap-1 border-l-2 border-instrument pl-3">
            <span className="text-caption text-ink-muted">{caption}</span>
            <span className="u-num font-mono text-specimen text-ink-faint">{meta}</span>
          </div>
        </Shell>
      </div>
    </section>
  );
}

export default function Cinema() {
  useRise("cinema");
  return (
    <div id="top" className="bg-canvas text-body text-ink antialiased">
      <Nav />

      <Plate
        src={simWide}
        alt="Isaac Sim 厨房场景：机械臂与柔性糕点、刚体对照物"
        width={2000}
        height={1250}
        priority
        minH="min-h-[92svh]"
        caption="SoftVTBench 资产目录 · Isaac Sim 厨房场景全景"
        meta="Isaac Sim · 单帧离线渲染 · 2400×1500"
      >
        <p className="text-eyebrow uppercase tracking-latin text-instrument">
          Physical World AI · Beijing
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,5.4vw,4.5rem)] font-bold leading-[1.06] tracking-tightest text-ink">
          <span className="block">拓展智能边界，</span>
          <span className="block">连接数字世界与物理世界。</span>
        </h1>
      </Plate>

      {/* 批注段：影像之间的呼吸，文字仍然克制 */}
      <section className="py-24 lg:py-32">
        <Shell>
          <p className="max-w-[42ch] text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-snug tracking-tight text-ink">
            {positioning.declaration}
          </p>
          <dl className="mt-14 grid gap-x-10 gap-y-8 border-t border-rule pt-10 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.no} className="rise flex flex-col gap-2">
                <dt className="flex items-baseline gap-3">
                  <span className="u-num font-mono text-specimen text-instrument">
                    {p.no}
                  </span>
                  <span className="text-h3 text-ink">{p.zh}</span>
                </dt>
                <dd className="text-small text-ink-muted">{p.meaning}</dd>
                <dd className="text-small text-instrument">{p.line}</dd>
              </div>
            ))}
          </dl>
        </Shell>
      </section>

      <Plate
        src={simArm}
        alt="Isaac Sim 场景中的机械臂与台面上的柔性物体"
        width={1800}
        height={1687}
        minH="min-h-[80svh]"
        caption="机械臂与操作台 · 取自同一帧全景的中部取景"
        meta="Isaac Sim · 裁切自 2400×1500 · 非另一次渲染"
      >
        <p className="u-num max-w-measure font-mono text-specimen text-ink-muted">
          {positioning.infra}
        </p>
        <ol className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          {loop.map((s, i) => (
            <li key={s.en} className="flex items-baseline gap-5">
              {i > 0 && (
                <span aria-hidden className="text-instrument">
                  →
                </span>
              )}
              <span className="text-[clamp(1.25rem,2.6vw,2rem)] font-bold tracking-tight text-ink">
                {s.zh}
              </span>
            </li>
          ))}
        </ol>
      </Plate>

      <section className="py-24 lg:py-32">
        <Shell>
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 className="text-h1 text-ink lg:col-span-4">我们在解决什么问题</h2>
            <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-6">
              {tracks.map((t) => (
                <div key={t.id} className="rise flex flex-col gap-3">
                  <div className="flex items-baseline gap-3 border-b border-rule pb-3">
                    <span className="u-num font-mono text-specimen text-instrument">
                      {t.no}
                    </span>
                    <h3 className="text-h2 text-ink">{t.titleZh}</h3>
                  </div>
                  <p className="max-w-measure text-small text-ink-muted">{t.aim}</p>
                  <p className="u-num font-mono text-specimen text-ink-faint">
                    {t.projects.map((p) => p.nameZh).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Shell>
      </section>

      <Plate
        src={simRow}
        alt="柔性糕点与刚体对照物阵列"
        width={1800}
        height={492}
        minH="min-h-[62svh]"
        caption="材质梯度 · 取自同一帧全景的下半幅"
        meta="Isaac Sim · 裁切自 2400×1500 · 非另一次渲染"
      >
        <p className="max-w-[24ch] text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.12] tracking-tighter text-ink">
          {footer.ctaZh}
        </p>
        <a
          href={`mailto:${careers.email}`}
          className="u-num mt-7 inline-block rounded bg-ink px-5 py-3 font-mono text-small text-ink-inverse transition-colors duration-160 ease-standard hover:bg-instrument"
        >
          {careers.email}
        </a>
      </Plate>

      <footer className="border-t border-rule py-10">
        <Shell>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
            <p className="max-w-measure text-small text-ink-muted">{naming.claim}</p>
            <p className="u-num shrink-0 font-mono text-specimen text-ink-faint">
              {site.nameZh} · {site.wordmark} · {footer.location} · © {footer.year}
            </p>
          </div>
        </Shell>
      </footer>
    </div>
  );
}
