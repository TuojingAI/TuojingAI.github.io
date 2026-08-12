/* Hallmark · macrostructure: Map/Diagram (19) · nav: rail · footer: tabular
   图谱。整页由一张系统图组织：信息按空间排布，不按线性叙述。
   图是手绘 SVG（无图标库、无 Lottie），纯概念图 —— 不含任何测量含义。 */
import simRow from "../assets/media/sim-row.webp";
import logoBlue from "../assets/tuojing-logo-blue.png";
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
import { Eyebrow, Figure, Shell, useRise } from "../shared";

const DIGITAL = ["语言", "视觉", "决策"];
const PHYSICAL = ["工厂", "家庭", "物流", "机器人操作", "自动驾驶", "仿真世界"];

/* 系统图。lg 以上显示；小屏走下方的堆叠版，避免横向滚动。 */
function SystemMap() {
  const lanes = [160, 262, 364];
  return (
    <figure className="rise hidden lg:block">
      <svg
        viewBox="0 0 1200 660"
        role="img"
        aria-label="拓境智能系统图：空间智能、物理智能与具身智能三条能力线，跨过数字世界与物理世界之间的边界；下方是感知、仿真、评测、行动四段基础设施。"
        className="w-full"
      >
        {/* 两端的世界 */}
        <text x="8" y="70" className="fill-ink font-bold" fontSize="26">
          数字世界
        </text>
        <text x="8" y="94" className="fill-ink-faint" fontSize="12" letterSpacing="1.6">
          DIGITAL
        </text>
        <text x="1192" y="70" textAnchor="end" className="fill-ink font-bold" fontSize="26">
          物理世界
        </text>
        <text
          x="1192"
          y="94"
          textAnchor="end"
          className="fill-ink-faint"
          fontSize="12"
          letterSpacing="1.6"
        >
          PHYSICAL
        </text>

        {DIGITAL.map((d, i) => (
          <text key={d} x="8" y={148 + i * 26} className="fill-ink-muted" fontSize="14">
            {d}
          </text>
        ))}
        {PHYSICAL.map((p, i) => (
          <text
            key={p}
            x="1192"
            y={148 + i * 26}
            textAnchor="end"
            className="fill-ink-muted"
            fontSize="14"
          >
            {p}
          </text>
        ))}

        {/* 两端的界柱 */}
        <line x1="150" y1="110" x2="150" y2="470" className="stroke-rule-strong" strokeWidth="1" />
        <line x1="1050" y1="110" x2="1050" y2="470" className="stroke-rule-strong" strokeWidth="1" />

        <defs>
          <marker id="ah" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 z" className="fill-ink" />
          </marker>
        </defs>

        {/* 三条能力线，横跨边界 */}
        {pillars.map((p, i) => (
          <g key={p.no}>
            <line
              x1="150"
              y1={lanes[i]}
              x2="1042"
              y2={lanes[i]}
              className="stroke-ink"
              strokeWidth="1.5"
              markerEnd="url(#ah)"
            />
            <text x="168" y={lanes[i] - 14} className="fill-ink font-bold" fontSize="20">
              {p.zh}
            </text>
            <text x="168" y={lanes[i] + 22} className="fill-ink-muted" fontSize="13">
              {p.meaning}
            </text>
            <text
              x="1042"
              y={lanes[i] - 14}
              textAnchor="end"
              className="fill-instrument"
              fontSize="13"
            >
              {p.line}
            </text>
          </g>
        ))}

        {/* 境：被推动的那条界。虚线 = 位置未定，不是测量值。 */}
        <line
          x1="700"
          y1="106"
          x2="700"
          y2="474"
          className="stroke-instrument"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <text x="700" y="96" textAnchor="middle" className="fill-instrument font-bold" fontSize="18">
          境
        </text>
        <g className="fill-instrument">
          <text x="716" y="496" fontSize="12" letterSpacing="1.4">
            我们在推的就是这条界
          </text>
          <path d="M700,492 L744,492" className="stroke-instrument" strokeWidth="1.5" />
        </g>

        {/* 基础设施：横贯全幅的底带 */}
        <line x1="0" y1="546" x2="1200" y2="546" className="stroke-rule-strong" strokeWidth="1" />
        <text x="0" y="580" className="fill-ink-faint" fontSize="12" letterSpacing="1.6">
          INFRASTRUCTURE
        </text>
        {loop.map((s, i) => (
          <g key={s.en}>
            <text x={260 + i * 210} y="586" className="fill-ink font-bold" fontSize="22">
              {s.zh}
            </text>
            <text x={260 + i * 210} y="610" className="fill-ink-faint" fontSize="12">
              {s.en}
            </text>
            {i < loop.length - 1 && (
              <text x={260 + i * 210 + 130} y="584" className="fill-instrument" fontSize="18">
                →
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="mt-6 border-l-2 border-instrument pl-3 text-caption text-ink-muted">
        拓境智能能力图 · 概念示意，非测量结果
      </figcaption>
    </figure>
  );
}

/* 小屏堆叠版：同样的信息，纵向排 */
function StackedMap() {
  return (
    <div className="flex flex-col gap-8 lg:hidden">
      <div className="flex items-start justify-between gap-6 border-y border-rule-strong py-5">
        <div>
          <p className="text-h3 text-ink">数字世界</p>
          <p className="mt-1 text-small text-ink-muted">{DIGITAL.join(" · ")}</p>
        </div>
        <span aria-hidden className="pt-1 text-instrument">
          →
        </span>
        <div className="text-right">
          <p className="text-h3 text-ink">物理世界</p>
          <p className="mt-1 text-small text-ink-muted">{PHYSICAL.slice(0, 4).join(" · ")}</p>
        </div>
      </div>
      {pillars.map((p) => (
        <div key={p.no} className="rise flex flex-col gap-1 border-l-2 border-ink pl-4">
          <p className="text-h3 text-ink">{p.zh}</p>
          <p className="text-small text-ink-muted">{p.meaning}</p>
          <p className="text-small text-instrument">{p.line}</p>
        </div>
      ))}
      <p className="u-num border-t border-rule pt-4 font-mono text-specimen text-ink-faint">
        {loop.map((s) => s.zh).join(" → ")}
      </p>
    </div>
  );
}

function Nav() {
  return (
    // 侧栏轨：不是顶部通栏 + 药丸按钮那套默认指纹
    <nav className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-[2px]">
      <Shell>
        <div className="flex items-center justify-between gap-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={logoBlue} alt={site.wordmark} className="h-5 w-auto" />
            <span className="hidden text-h3 text-ink sm:inline">{site.nameZh}</span>
          </a>
          <div className="flex items-center gap-5 text-small md:gap-7">
            <a
              href="#map"
              className="text-ink-muted transition-colors duration-160 ease-standard hover:text-ink"
            >
              能力图
            </a>
            <a
              href="#research"
              className="text-ink-muted transition-colors duration-160 ease-standard hover:text-ink"
            >
              研究
            </a>
            <a
              href="#join"
              className="text-ink-muted transition-colors duration-160 ease-standard hover:text-ink"
            >
              加入
            </a>
          </div>
        </div>
        <div className="h-px w-full bg-rule" />
      </Shell>
    </nav>
  );
}

export default function Atlas() {
  useRise("atlas");
  return (
    <div className="bg-canvas text-body text-ink antialiased">
      <Nav />

      <header id="top" className="pb-28 pt-16 lg:pb-36 lg:pt-20">
        <Shell>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Physical World AI · Beijing</Eyebrow>
              <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[1.12] tracking-tighter text-ink">
                {positioning.tagline}
              </h1>
            </div>
            <p className="max-w-measure self-end text-body text-ink-muted lg:col-span-4 lg:col-start-9">
              {positioning.academic}
            </p>
          </div>
        </Shell>
      </header>

      <section id="map" className="scroll-mt-20 pb-28 lg:pb-36">
        <Shell>
          <SystemMap />
          <StackedMap />
        </Shell>
      </section>

      <section className="pb-28 lg:pb-36">
        <Shell>
          <Figure
            src={simRow}
            alt="Isaac Sim 中的柔性糕点与刚体对照物阵列"
            caption="资产阵列 · 柔性糕点与刚体对照物、材质梯度同场渲染（取自同一帧全景的下半幅）"
            meta="Isaac Sim · 单帧离线渲染 · 裁切自 2400×1500"
            width={1800}
            height={492}
          />
        </Shell>
      </section>

      <section id="research" className="scroll-mt-20 pb-28 lg:pb-36">
        <Shell>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Research</Eyebrow>
              <h2 className="mt-3 text-h1 text-ink">两类耦合的瓶颈</h2>
            </div>
            <div className="flex flex-col gap-12 lg:col-span-7 lg:col-start-6">
              {tracks.map((t) => (
                <div key={t.id} className="rise flex flex-col gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="u-num font-mono text-specimen text-instrument">
                      {t.no}
                    </span>
                    <h3 className="text-h2 text-ink">{t.titleZh}</h3>
                  </div>
                  <p className="max-w-measure text-small text-ink-muted">{t.aim}</p>
                  <ul className="flex flex-col border-t border-rule">
                    {t.projects.map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-3"
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
          </div>
        </Shell>
      </section>

      <section id="join" className="scroll-mt-20 border-t border-rule-strong py-20 lg:py-28">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Join Us</Eyebrow>
              <h2 className="mt-3 text-h1 text-ink">加入我们</h2>
            </div>
            <div className="flex max-w-measure flex-col gap-6 lg:col-span-7 lg:col-start-6">
              <p className="text-lead text-ink">{careers.intro}</p>
              <ul className="flex flex-wrap gap-2">
                {careers.roles.map((r) => (
                  <li
                    key={r}
                    className="rounded-sm border border-rule bg-canvas-raised px-3 py-1.5 font-mono text-specimen text-ink-muted"
                  >
                    {r}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${careers.email}`}
                className="u-num self-start rounded bg-ink px-5 py-3 font-mono text-small text-ink-inverse transition-colors duration-160 ease-standard hover:bg-instrument"
              >
                {careers.email}
              </a>
            </div>
          </div>
        </Shell>
      </section>

      <footer className="border-t border-rule py-10">
        <Shell>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-baseline lg:justify-between">
            <p className="max-w-measure text-small text-ink-muted">
              {naming.lines[0]}
              {naming.lines[1]}
            </p>
            <p className="u-num shrink-0 font-mono text-specimen text-ink-faint">
              {site.nameZh} · {footer.location} · © {footer.year}
            </p>
          </div>
        </Shell>
      </footer>
    </div>
  );
}
