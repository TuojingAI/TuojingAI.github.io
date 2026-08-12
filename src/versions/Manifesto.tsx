/* Hallmark · macrostructure: Manifesto (07) · nav: numbered-index · footer: index
   宣言。骨白海报 + 巨大黑字 + 一个信号朱红。
   气势来自字号与留白，不来自装饰。朱红只做信号（编号 / 强调 / 规则线），从不做底。 */
import simWide from "../assets/media/sim-wide.webp";
import logoBlue from "../assets/tuojing-logo-blue.png";
import {
  careers,
  footer,
  heroFigure,
  loop,
  naming,
  pillars,
  positioning,
  site,
  tracks,
} from "../data/siteContent";
import { Figure, Shell, useRise } from "../shared";

const NAV = [
  { id: "pillars", no: "01", label: "方向" },
  { id: "loop", no: "02", label: "基础设施" },
  { id: "research", no: "03", label: "研究" },
  { id: "join", no: "04", label: "加入" },
];

function Nav() {
  return (
    // 不用默认导航指纹：无药丸按钮、无下边线、无实底，链接是带编号的 mono 索引
    <nav className="absolute inset-x-0 top-0 z-50">
      <Shell>
        <div className="flex items-baseline justify-between gap-6 py-6">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={logoBlue} alt={site.wordmark} className="h-5 w-auto [filter:grayscale(1)_brightness(0)]" />
            <span className="hidden text-h3 text-ink sm:inline">{site.nameZh}</span>
          </a>
          <ul className="hidden items-baseline gap-4 sm:flex md:gap-7">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="u-num inline-flex items-baseline gap-1.5 whitespace-nowrap font-mono text-specimen text-ink-muted transition-colors duration-160 ease-standard hover:text-ink"
                >
                  <span className="text-instrument">{n.no}</span>
                  <span>{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${careers.email}`}
            className="u-num font-mono text-specimen text-ink-muted transition-colors duration-160 ease-standard hover:text-ink sm:hidden"
          >
            联系
          </a>
        </div>
      </Shell>
    </nav>
  );
}

/* 海报式宣言。下 padding 明显大于上 padding —— 让首屏坐进页面，不悬浮。 */
function Hero() {
  return (
    <header id="top" className="relative pb-40 pt-32 lg:pb-56 lg:pt-36">
      <Shell>
        <div className="flex items-center gap-4">
          <span className="h-px w-16 bg-instrument" />
          <p className="text-eyebrow uppercase tracking-latin text-instrument">
            Physical World AI · Beijing
          </p>
        </div>

        <h1 className="mt-10 max-w-[19ch] text-[clamp(2.75rem,7.6vw,6.5rem)] font-bold leading-[1.02] tracking-tightest text-ink">
          拓展智能边界，
          <br />
          连接数字世界与
          <span className="text-instrument">物理世界</span>。
        </h1>

        <p className="mt-12 max-w-[46ch] border-l-2 border-ink pl-6 text-lead text-ink">
          {positioning.declaration}
        </p>

        <p className="u-num mt-8 max-w-[60ch] font-mono text-specimen text-ink-muted">
          {positioning.en}
        </p>
      </Shell>
    </header>
  );
}

/* 三条能力线：每条一整行的宣告，不是卡片 */
function Pillars() {
  return (
    <section id="pillars" className="scroll-mt-24 pb-28 lg:pb-36">
      <Shell>
        {pillars.map((p) => (
          <article
            key={p.no}
            className="rise grid gap-x-8 gap-y-3 border-t border-rule-strong py-10 lg:grid-cols-12 lg:py-14"
          >
            <div className="flex items-baseline gap-4 lg:col-span-5">
              <span className="u-num font-mono text-specimen text-instrument">
                {p.no}
              </span>
              <div>
                <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.12] tracking-tighter text-ink">
                  {p.zh}
                </h2>
                <p className="u-num mt-1 font-mono text-specimen text-ink-faint">
                  {p.en}
                </p>
              </div>
            </div>
            <p className="text-body text-ink-muted lg:col-span-4">{p.meaning}</p>
            <p className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold leading-snug text-ink lg:col-span-3 lg:text-right">
              {p.line}
            </p>
          </article>
        ))}
      </Shell>
    </section>
  );
}

/* 基础设施四段。排版带，不是图标行。 */
function Loop() {
  return (
    <section id="loop" className="scroll-mt-24 border-y border-ink py-16 lg:py-20">
      <Shell>
        <p className="max-w-[40ch] text-body text-ink-muted">{positioning.infra}</p>
        <ol className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-4 lg:gap-x-12">
          {loop.map((s, i) => (
            <li key={s.en} className="rise flex items-baseline gap-6 lg:gap-12">
              {i > 0 && (
                <span aria-hidden className="text-instrument">
                  /
                </span>
              )}
              <span className="flex items-baseline gap-2.5">
                <span className="text-[clamp(1.75rem,4.4vw,3.5rem)] font-bold leading-none tracking-tighter text-ink">
                  {s.zh}
                </span>
                <span className="u-num font-mono text-specimen text-ink-faint">
                  {s.en}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  );
}

/* 证据只出现一次，全幅，作为兑现 */
function Proof() {
  return (
    <section className="py-24 lg:py-32">
      <Shell>
        <Figure
          src={simWide}
          alt="Isaac Sim 厨房场景中的柔性糕点、刚体对照物与材质梯度"
          caption={heroFigure.caption}
          meta={heroFigure.meta}
          width={2000}
          height={1250}
        />
      </Shell>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="scroll-mt-24 pb-24 lg:pb-32">
      <Shell>
        <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold tracking-tighter text-ink">
          我们在解决什么问题
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-2">
          {tracks.map((t) => (
            <div key={t.id} className="rise flex flex-col gap-5">
              <div className="flex items-baseline gap-3 border-b border-ink pb-3">
                <span className="u-num font-mono text-specimen text-instrument">
                  {t.no}
                </span>
                <h3 className="text-h2 text-ink">{t.titleZh}</h3>
              </div>
              <p className="max-w-measure text-small text-ink-muted">{t.aim}</p>
              <ul className="flex flex-col">
                {t.projects.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-1 border-b border-rule py-3"
                  >
                    <span className="text-h3 text-ink">{p.nameZh}</span>
                    <span className="u-num font-mono text-specimen text-ink-faint">
                      {p.nameEn}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function Join() {
  return (
    <section id="join" className="scroll-mt-24 border-t border-ink py-20 lg:py-28">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.14] tracking-tighter text-ink lg:col-span-7">
            {footer.ctaZh}
          </p>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            <p className="text-small text-ink-muted">{careers.intro}</p>
            <a
              href={`mailto:${careers.email}`}
              className="u-num self-start border-b-2 border-instrument pb-1 font-mono text-lead text-ink transition-colors duration-160 ease-standard hover:text-instrument"
            >
              {careers.email}
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function Colophon() {
  return (
    <footer className="border-t border-rule py-12">
      <Shell>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-5">
            <span
              aria-hidden
              className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-tightest text-ink"
            >
              {naming.glyph}
            </span>
            <p className="u-num font-mono text-specimen text-ink-faint">
              拓 tuò 开拓 · 拓 tà 拓印 ｜ 境 jìng 边界
            </p>
          </div>
          <div className="flex max-w-measure flex-col gap-2 text-small text-ink-muted lg:col-span-6 lg:col-start-7">
            {naming.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="mt-4 text-ink">{naming.claim}</p>
            <p className="u-num mt-6 font-mono text-specimen text-ink-faint">
              {site.nameZh} · {site.wordmark} · {footer.location} · © {footer.year}
            </p>
          </div>
        </div>
      </Shell>
    </footer>
  );
}

export default function Manifesto() {
  useRise("manifesto");
  return (
    <div className="bg-canvas text-body text-ink antialiased">
      <Nav />
      <Hero />
      <Pillars />
      <Loop />
      <Proof />
      <Research />
      <Join />
      <Colophon />
    </div>
  );
}
