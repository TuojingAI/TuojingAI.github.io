import { useEffect, useRef, useState } from "react";
import { Figure, useRise } from "../shared";
import logoBlue from "../assets/tuojing-logo-blue.png";
import simCatalog from "../assets/media/sim-catalog.webp";
import {
  careers,
  footer,
  hero,
  heroFigure,
  naming,
  pages,
  site,
  team,
  tracks,
  type Project,
} from "../data/siteContent";

/* ------------------------------------------------------------------ *
 * 「境」——全站的结构性图形。
 * 一条发丝线：左侧是已推进的部分（仪表色），右侧是未及之处（灰线），
 * 交界处一个刻度。逐节向右推进 = 拓境。
 * 它是版面装置，不是数据可视化——刻度位置不承载任何测量含义。
 * ------------------------------------------------------------------ */
function Frontier({ at, label }: { at: number; label?: string }) {
  const pct = `${Math.round(Math.min(1, Math.max(0, at)) * 100)}%`;
  return (
    <div aria-hidden className="relative h-px w-full bg-rule">
      <div
        className="absolute inset-y-0 left-0 bg-instrument"
        style={{ width: pct }}
      />
      {/* 刻度：骑在线上的一小竖 */}
      <div
        className="absolute top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-instrument"
        style={{ left: pct }}
      />
      {label && (
        <span
          className="absolute top-2 -translate-x-1/2 font-mono text-specimen text-instrument"
          style={{ left: pct }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  // 全大写拉丁专用档：这是唯一允许正字距的地方
  return (
    <p className="text-eyebrow uppercase tracking-latin text-instrument">
      {children}
    </p>
  );
}

function Section({
  id,
  at,
  children,
}: {
  id: string;
  at: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pb-20 pt-14 lg:pb-28 lg:pt-16">
      <div className="mx-auto w-full max-w-content px-6 lg:px-10">
        {/* 边界逐节右移：研究 → 团队 → 加入我们 */}
        <Frontier at={at} />
        <div className="pt-14 lg:pt-16">{children}</div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rise flex flex-col gap-4 border border-rule bg-canvas-raised p-6 transition-colors duration-160 ease-standard hover:border-rule-strong">
      <header className="flex flex-col gap-1">
        <h3 className="text-h3 text-ink">{project.nameZh}</h3>
        <p className="u-num font-mono text-specimen text-ink-faint">
          {project.nameEn}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-eyebrow uppercase tracking-latin text-ink-faint">
            Question
          </span>
          <p className="text-small text-ink">{project.question}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-eyebrow uppercase tracking-latin text-ink-faint">
            Direction
          </span>
          <p className="text-small text-ink-muted">{project.goal}</p>
        </div>
      </div>

      <p className="mt-auto border-t border-rule pt-3 font-mono text-specimen text-ink-faint">
        {project.wanted}
      </p>
    </article>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // 不用毛玻璃：滚动时换实底 + 一条发丝线，240ms 过渡
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-240 ease-standard ${
        solid ? "border-b border-rule bg-canvas" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#home" className="flex shrink-0 items-center gap-2.5">
          <img src={logoBlue} alt={site.wordmark} className="h-5 w-auto" />
          <span className="hidden text-h3 text-ink sm:inline">
            {site.nameZh}
          </span>
        </a>
        <div className="flex items-center gap-5 text-small md:gap-8">
          {pages.slice(1).map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="whitespace-nowrap text-ink-muted transition-colors duration-160 ease-standard hover:text-ink"
            >
              {p.label}
            </a>
          ))}
          <a
            href={`mailto:${careers.email}`}
            className="hidden rounded bg-ink px-4 py-2 text-small text-ink-inverse transition-colors duration-160 ease-standard hover:bg-ink-muted sm:inline-block"
          >
            联系我们
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="scroll-mt-24 pb-28 pt-24 lg:pb-40 lg:pt-28">
      <div className="mx-auto w-full max-w-content px-6 lg:px-10">
        {/* 12 栏：文案 6 栏 + 图版 6 栏 —— 直接治原版 1440px 下右侧 35% 真空 */}
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Eyebrow>Physical World AI · Beijing</Eyebrow>
            <h1 className="text-display text-ink">
              {hero.headline.map((line) => (
                // 每行一个 block：中文在 display 字号下交给浏览器断行会劈开词
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="max-w-measure text-lead text-ink-muted">
              {hero.lead}
            </p>
          </div>
          <div className="lg:col-span-7">
            <Figure
              src={simCatalog}
              alt="Isaac Sim 厨房场景中的 SoftVTBench 资产目录：柔性糕点与刚体对照物"
              caption={heroFigure.caption}
              meta={heroFigure.meta}
              width={2000}
              height={1250}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Research() {
  return (
    <Section id="research" at={0.28}>
      <div className="flex flex-col gap-16 lg:gap-20">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Research</Eyebrow>
            <h2 className="mt-3 text-h1 text-ink">我们在解决什么问题</h2>
          </div>
          <p className="max-w-measure text-body text-ink-muted lg:col-span-7 lg:col-start-6">
            当前机器人智能面临两类相互耦合的瓶颈。一类是模型瓶颈：策略能否从短程、单任务、单本体的反应式控制，走向具有世界预测、长期记忆、跨任务迁移与实时闭环能力的模型。另一类是评测与数据瓶颈：仿真中的高分能否代表真实世界中的可靠交互。
          </p>
        </div>

        {tracks.map((track) => (
          <div key={track.id} className="flex flex-col gap-8">
            <div className="grid gap-6 border-t border-rule-strong pt-6 lg:grid-cols-12">
              <div className="flex items-start gap-4 lg:col-span-5">
                <span className="u-num font-mono text-specimen text-instrument">
                  {track.no}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-h2 text-ink">{track.titleZh}</h3>
                  <p className="u-num font-mono text-specimen text-ink-faint">
                    {track.titleEn}
                  </p>
                </div>
              </div>
              <p className="max-w-measure text-small text-ink-muted lg:col-span-6 lg:col-start-7">
                {track.aim}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {track.projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Team() {
  return (
    <Section id="team" at={0.58}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>Team</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">团队</h2>
        </div>
        <div className="flex max-w-measure flex-col gap-6 lg:col-span-7 lg:col-start-6">
          <p className="rise text-lead text-ink">{team.intro}</p>
          <p className="rise rise-1 text-body text-ink-muted">{team.body}</p>
          <ul className="rise rise-2 mt-2 flex flex-col border-t border-rule">
            {team.values.map((v) => (
              <li
                key={v}
                className="flex items-baseline gap-3 border-b border-rule py-3 text-small text-ink"
              >
                <span aria-hidden className="text-instrument">
                  —
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Join() {
  return (
    <Section id="join" at={0.88}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>Join Us</Eyebrow>
          <h2 className="mt-3 text-h1 text-ink">加入我们</h2>
        </div>
        <div className="flex max-w-measure flex-col gap-6 lg:col-span-7 lg:col-start-6">
          <p className="rise text-lead text-ink">{careers.intro}</p>
          <ul className="rise rise-1 flex flex-wrap gap-x-2 gap-y-2">
            {careers.roles.map((r) => (
              <li
                key={r}
                className="rounded-sm border border-rule bg-canvas-raised px-3 py-1.5 font-mono text-specimen text-ink-muted"
              >
                {r}
              </li>
            ))}
          </ul>
          <p className="rise rise-2 text-small text-ink-muted">
            {careers.note}
          </p>
          <div className="rise rise-3 mt-4 flex flex-col gap-4 border-t border-rule-strong pt-8">
            <p className="text-h2 text-ink">{footer.ctaZh}</p>
            <a
              href={`mailto:${careers.email}`}
              className="u-num self-start rounded bg-ink px-5 py-3 font-mono text-small text-ink-inverse transition-colors duration-160 ease-standard hover:bg-instrument"
            >
              {careers.email}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 名字释义。全站只讲一次，放在页脚之上。
   「拓」的两个读音同时成立：tuò＝开拓，tà＝拓印。后者正是视触觉传感的原理。 */
function Naming() {
  return (
    <section aria-label="关于名字" className="pb-24 pt-8 lg:pb-28">
      <div className="mx-auto w-full max-w-content px-6 lg:px-10">
        {/* 刻意不给 1：这条界推不到头，是这家公司存在的前提 */}
        <Frontier at={0.96} />
        <div className="grid gap-8 pt-14 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-4">
            {/* 不放圆圈、不做印章红：一个安静的大字，靠字号和留白站住 */}
            <span
              aria-hidden
              className="block text-[clamp(4rem,9vw,7rem)] font-bold leading-none tracking-tighter text-ink"
            >
              {naming.glyph}
            </span>
          </div>
          <div className="flex max-w-measure flex-col gap-4 lg:col-span-7 lg:col-start-6">
            {naming.lines.map((line) => (
              <p key={line} className="text-lead text-ink-muted">
                {line}
              </p>
            ))}
            <p className="text-lead text-ink">{naming.claim}</p>
            <p className="u-num mt-2 font-mono text-specimen text-ink-faint">
              拓 tuò 开拓 · 拓 tà 拓印 ｜ 境 jìng 边界
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-6 py-10 text-small text-ink-faint lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <span>
          {site.nameZh} · {site.wordmark}
        </span>
        <span className="u-num font-mono text-specimen">
          {footer.location} · © {footer.year}
        </span>
      </div>
    </footer>
  );
}

export default function Specimen() {
  const root = useRef<HTMLDivElement>(null);
  useRise("specimen");

  return (
    <div ref={root} className="bg-canvas text-body text-ink antialiased">
      <Nav />
      <main>
        <Hero />
        <Research />
        <Team />
        <Join />
        <Naming />
      </main>
      <Footer />
    </div>
  );
}
