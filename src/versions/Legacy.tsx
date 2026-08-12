/* 原版 LEGACY —— 改版前的线上版本，原样保留作对照。
   只做了两处非视觉改动：数据源指向自己的副本（不受后续内容改动影响）、
   reveal 类名加 lg- 前缀（避免和新版的 .rise 撞）。其余一行未动。 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import logoBlue from "../assets/tuojing-logo-blue.png";
import mesh from "../assets/media/mesh.webp";
import MorphText, { PHYSICAL } from "../components/MorphText";
import LegacyProject from "./LegacyProject";
import { findProject } from "./legacyProjects";
import type { FeedEntry } from "./legacyContent";
import {
  careers,
  feed,
  footer,
  hero,
  loop,
  mission,
  pages,
  site,
  team,
} from "./legacyContent";

const FLIP_LOCK_MS = 720;
const WHEEL_THRESHOLD = 90;
const GESTURE_GAP_MS = 180;
const PAGER_QUERY = "(min-width: 768px) and (min-height: 700px)";

function usePager(enabled: boolean, count: number) {
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const lock = useRef(false);
  const accum = useRef(0);
  const lastWheel = useRef(0);
  const armed = useRef(true);
  const goRef = useRef((_: number) => {});

  goRef.current = (target: number) => {
    const next = Math.min(count - 1, Math.max(0, target));
    if (next === pageRef.current || lock.current) return;
    pageRef.current = next;
    lock.current = true;
    armed.current = false;
    window.setTimeout(() => {
      lock.current = false;
      accum.current = 0;
    }, FLIP_LOCK_MS);
    setPage(next);
  };

  useEffect(() => {
    if (!enabled) return;

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      // A pause in wheel events marks a fresh gesture (filters trackpad inertia).
      if (now - lastWheel.current > GESTURE_GAP_MS) {
        armed.current = true;
        accum.current = 0;
      }
      lastWheel.current = now;
      if (!armed.current || lock.current) return;
      accum.current += e.deltaY;
      if (Math.abs(accum.current) > WHEEL_THRESHOLD) {
        const dir = accum.current > 0 ? 1 : -1;
        accum.current = 0;
        goRef.current(pageRef.current + dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goRef.current(pageRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goRef.current(pageRef.current - 1);
      } else if (e.key === "Home") {
        goRef.current(0);
      } else if (e.key === "End") {
        goRef.current(count - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled, count]);

  return { page, go: (i: number) => goRef.current(i) };
}

/* 渐变网格背景 —— Stripe 那份规格里的签名器件：
   「The gradient mesh IS the depth system」，且明确要求用 SVG 或大图实现，
   不能用扁平的 CSS 渐变（真实网格是有机形状，CSS 渲染不出来）。
   这张 mesh.webp 是按拓境的蓝族生成的：深靛 / 品牌蓝 / 天蓝 / 淡青 / 薰衣草
   ＋ 一点暖桃 —— 冷暖张力是质感的来源，纯蓝会发闷。整图 14 KB。 */
function Mesh({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[62%] overflow-hidden ${
        flip ? "bottom-0 top-auto rotate-180" : ""
      }`}
    >
      <img
        src={mesh}
        alt=""
        className="h-full w-full object-cover"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
}

/* 1200px 居中容器 —— Stripe 的 marketing 页宽度 */
function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">{children}</div>
  );
}

const entryClasses: Record<FeedEntry["variant"], string> = {
  featured:
    "feed-entry ml-6 flex cursor-pointer flex-col gap-2 rounded-2xl border border-card-border bg-white px-5 py-4 shadow-soft",
  card: "feed-entry ml-6 flex cursor-pointer flex-col gap-2 rounded-2xl border border-card-border bg-white/70 px-5 py-4 hover:border-card-border-hover",
  plain:
    "feed-entry ml-6 flex cursor-pointer flex-col gap-1.5 rounded-2xl px-5 py-4 hover:bg-white/50",
};

function Entry({ entry, index }: { entry: FeedEntry; index: number }) {
  return (
    // 整条可点，指向仓库；内部的 arXiv / 数据集另开，用 stopPropagation 让它们各走各的
    <a
      href={`?p=${entry.slug}`}
      className={`shake-trigger lg-reveal lg-reveal-${Math.min(index + 2, 6)} ${entryClasses[entry.variant]}`}
    >
      <div className="relative flex items-baseline justify-between gap-1.5">
        <span
          aria-hidden
          className="absolute -left-[40px] top-[5px] size-[7px] rounded-sm bg-foreground outline outline-2 outline-background"
        />
        <div className="min-w-0 flex-1 text-[13px] font-semibold leading-5">
          {/* 只有冒号前的项目名抖 —— 后面的中文副标题保持不动 */}
          {(() => {
            const i = entry.title.indexOf("：");
            if (i < 0) return <span className="shake-crazy">{entry.title}</span>;
            return (
              <>
                <span className="shake-crazy">{entry.title.slice(0, i)}</span>
                {entry.title.slice(i)}
              </>
            );
          })()}
        </div>
        <div className="ml-1 shrink-0 text-xs text-accent">{entry.tag}</div>
      </div>
      <div className="font-mono text-[10px] leading-4 text-muted-foreground/80">
        {entry.titleEn}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{entry.desc}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
        <span className="font-mono text-[10px] text-accent">阅读项目介绍 →</span>
        <span className="font-mono text-[10px] text-muted-foreground/70">
          {entry.meta}
        </span>
      </div>
    </a>
  );
}

function PageLabel({ index }: { index: number }) {
  const p = pages[index];
  return (
    <p className="lg-reveal font-mono text-xs tracking-widest text-accent">
      {String(index + 1).padStart(2, "0")} · {p.label} {p.labelEn}
    </p>
  );
}

function HomePage() {
  return (
    <div className="relative isolate flex h-full flex-col justify-center pb-16 pt-24">
      <Mesh />
      <Container><div className="relative max-w-5xl">
        <PageLabel index={0} />
        <h1 className="tj-display lg-reveal lg-reveal-1 mt-6 text-[clamp(2.25rem,5vw,4.25rem)] text-foreground">
          {hero.headline[0]}
          <br />
          {hero.headline[1]}
          {hero.digitalZh}与
          {/* 物理世界：悬停触发物理特效（雾化 / 汽化 / 电击 / 磁场 / 结晶） */}
          <MorphText a={hero.physicalZh} b={hero.physicalEn} pool={PHYSICAL} />
        </h1>
        <p className="lg-reveal lg-reveal-2 mt-8 max-w-2xl font-mono text-sm leading-[1.9] text-foreground/85">
          {mission.lead}
        </p>
        <p className="lg-reveal lg-reveal-3 mt-4 font-serif text-lg italic text-deep">
          {mission.taglineEn}
        </p>
        <div className="lg-reveal lg-reveal-4 mt-12 flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-1 border-y border-divider py-4 font-mono text-xs text-muted-foreground">
          {loop.map((step, i) => (
            <span key={step.en} className="flex items-center gap-x-2">
              {i > 0 && <span aria-hidden className="text-accent">→</span>}
              <span>
                {step.zh} <span className="text-foreground/70">{step.en}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-center font-mono text-[10px] tracking-[0.3em] text-muted-foreground md:block">
        SCROLL
        <div className="hint-bob mt-1 text-accent">↓</div>
      </div></Container>
    </div>
  );
}

function ResearchPage() {
  return (
    <div className="relative isolate flex h-full flex-col justify-center pb-10 pt-24">
      <Container><div className="relative w-full max-w-2xl">
        <PageLabel index={1} />
        <p className="lg-reveal lg-reveal-1 mt-4 font-mono text-sm text-foreground/85">
          {mission.body}
        </p>
        <div className="mt-6 pl-2">
          <div className="relative flex flex-col space-y-4 border-l border-line py-3 before:absolute before:-left-px before:top-0 before:h-6 before:w-px before:bg-gradient-to-t before:from-transparent before:to-background after:absolute after:-left-px after:bottom-0 after:h-6 after:w-px after:bg-gradient-to-b after:from-transparent after:to-background">
            {feed.map((entry, i) => (
              <Entry key={entry.title} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div></Container>
    </div>
  );
}

function TeamPage() {
  return (
    <div className="relative isolate flex h-full flex-col justify-center pb-10 pt-24">
      <Container><div className="relative w-full max-w-3xl">
        <PageLabel index={2} />
        <p className="lg-reveal lg-reveal-1 mt-4 max-w-2xl font-mono text-sm leading-relaxed text-foreground/85">
          {team.intro}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {team.members.map((m, i) => (
            <div
              key={m.name}
              className={`shake-trigger feed-entry lg-reveal lg-reveal-${Math.min(2 + Math.floor(i / 3), 4)} flex flex-col gap-2.5 rounded-2xl border border-card-border bg-white/70 p-5 hover:border-card-border-hover`}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-deep font-serif text-sm font-bold text-white">
                  {m.initial}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold leading-5">
                    <span className="shake-crazy">{m.name}</span>
                  </div>
                  <div className="truncate text-[11px] text-accent">{m.role}</div>
                </div>
              </div>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                {m.org}
              </p>
            </div>
          ))}
        </div>
        <p className="lg-reveal lg-reveal-5 mt-5 font-mono text-xs text-muted-foreground">
          {team.advisors}
        </p>
        {team.note && (
          <p className="lg-reveal lg-reveal-5 mt-2 font-mono text-[11px] text-muted-foreground/70">
            {team.note}
          </p>
        )}
      </div></Container>
    </div>
  );
}

function JoinPage() {
  return (
    <div className="relative isolate flex h-full flex-col justify-center pb-10 pt-24">
      <Mesh flip />
      {/* 居中、大字、极大留白 —— 和其余页面同底，不再有实色蓝块的硬切换 */}
      <Container><div className="relative mx-auto w-full max-w-2xl text-center">
        <p className="lg-reveal font-mono text-xs tracking-widest text-accent">
          04 · 加入我们 Join Us
        </p>

        <h2 className="tj-display lg-reveal lg-reveal-1 mt-7 text-3xl text-foreground md:text-[44px]">
          {footer.ctaZh.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="lg-reveal lg-reveal-2 mt-3 font-serif text-lg italic text-deep md:text-xl">
          {footer.ctaEn}
        </p>

        <p className="lg-reveal lg-reveal-3 mx-auto mt-8 max-w-xl font-mono text-[13px] leading-[2] text-foreground/80">
          {careers.intro}
        </p>

        <div className="lg-reveal lg-reveal-4 mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${careers.email}`}
            className="inline-flex items-center justify-center rounded-full bg-deep px-7 py-3.5 font-mono text-sm text-white shadow-soft transition-all duration-200 hover:bg-accent"
          >
            {careers.email}
          </a>
          <a
            href={footer.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-card-border bg-white/70 px-7 py-3.5 font-mono text-sm text-foreground transition-colors duration-200 hover:border-card-border-hover hover:bg-white"
          >
            GitHub ↗
          </a>
        </div>

        <p className="lg-reveal lg-reveal-5 mx-auto mt-12 max-w-xl border-t border-divider pt-8 font-mono text-[11px] leading-[2] text-muted-foreground">
          {careers.roles.join(" · ")}
        </p>
        <p className="lg-reveal lg-reveal-6 mt-6 font-mono text-[11px] text-muted-foreground/80">
          {site.nameZh} · {site.wordmark} · {footer.location} · © {footer.year}
        </p>
      </div></Container>
    </div>
  );
}

function Nav({
  current,
  onNavigate,
}: {
  current: number;
  onNavigate: (i: number) => void;
}) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-divider/80 bg-background/70 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 md:px-16 lg:px-24">
        <button
          type="button"
          onClick={() => onNavigate(0)}
          className="flex items-center gap-2.5"
        >
          <img
            src={logoBlue}
            alt="Tuojing.AI"
            className="h-5 w-auto md:h-6"
          />
          <span className="hidden font-serif text-lg font-bold text-foreground/80 lg:inline">
            {site.nameZh}
          </span>
        </button>
        <div className="flex items-center gap-3 font-mono text-xs md:gap-6 md:text-sm">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onNavigate(i)}
              className={`whitespace-nowrap ${
                i === current
                  ? "text-accent underline decoration-2 underline-offset-8"
                  : "text-foreground/70 underline-offset-8 hover:text-foreground hover:underline"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Dots({
  current,
  onNavigate,
}: {
  current: number;
  onNavigate: (i: number) => void;
}) {
  return (
    <div className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      {pages.map((p, i) => (
        <button
          key={p.id}
          type="button"
          aria-label={p.label}
          title={p.label}
          onClick={() => onNavigate(i)}
          className={`w-2 rounded-full transition-all duration-300 ${
            i === current ? "h-7 bg-accent" : "h-2 bg-foreground/25 hover:bg-foreground/50"
          }`}
        />
      ))}
    </div>
  );
}

const pageNodes = [HomePage, ResearchPage, TeamPage, JoinPage];

// Apple-keynote style depth transition: passed pages fly toward the viewer,
// upcoming pages surface from deeper in the scene.
function proPageStyle(offset: number, count: number): CSSProperties {
  if (offset === 0) {
    return {
      transform: "translateY(0) scale(1)",
      opacity: 1,
      zIndex: count,
      pointerEvents: "auto",
    };
  }
  if (offset > 0) {
    // future pages wait slightly below, deeper in the scene
    return {
      transform: "translateY(3%) scale(0.985)",
      opacity: 0,
      zIndex: count - offset,
      pointerEvents: "none",
    };
  }
  // passed pages fly past the camera
  return {
    transform: "translateY(-2%) scale(1.02)",
    opacity: 0,
    zIndex: count + offset,
    pointerEvents: "none",
  };
}

export default function Legacy() {
  // ?p=<slug> 进项目详情页；无参数则是原版的整页翻页首页
  const slug = new URLSearchParams(window.location.search).get("p") ?? "";
  const project = slug ? findProject(slug) : null;
  if (project) return <LegacyProject project={project} />;

  const [paged, setPaged] = useState(
    () => window.matchMedia(PAGER_QUERY).matches,
  );
  const [booted, setBooted] = useState(false);
  const touchY = useRef(0);
  const { page, go } = usePager(paged, pages.length);

  useEffect(() => {
    const mq = window.matchMedia(PAGER_QUERY);
    const onChange = () => setPaged(window.matchMedia(PAGER_QUERY).matches);
    mq.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    const raf = requestAnimationFrame(() => setBooted(true));
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  const navigate = (i: number) => {
    if (paged) {
      go(i);
    } else {
      document
        .getElementById(pages[i].id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const rootClass = "bg-background font-mono text-sm text-foreground antialiased";

  if (!paged) {
    return (
      <div className={rootClass}>
        <Nav current={-1} onNavigate={navigate} />
        <main>
          {pageNodes.map((Page, i) => (
            <section
              key={pages[i].id}
              id={pages[i].id}
              className="page-active relative min-h-[100svh]"
            >
              <Page />
            </section>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <div
        className="fixed inset-0 overflow-hidden"
        onTouchStart={(e) => {
          touchY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const dy = touchY.current - e.changedTouches[0].clientY;
          if (Math.abs(dy) > 60) go(page + (dy > 0 ? 1 : -1));
        }}
      >
        <div className="relative h-full">
          {pageNodes.map((Page, i) => (
            <section
              key={pages[i].id}
              id={pages[i].id}
              aria-hidden={page !== i}
              style={proPageStyle(i - page, pageNodes.length)}
              className={`pro-page absolute inset-0 bg-background will-change-transform ${
                booted && page === i ? "page-active" : ""
              }`}
            >
              <Page />
            </section>
          ))}
        </div>
      </div>
      <Nav current={page} onNavigate={navigate} />
      <Dots current={page} onNavigate={navigate} />
    </div>
  );
}
