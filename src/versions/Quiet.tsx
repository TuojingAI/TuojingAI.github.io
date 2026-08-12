/* 简 QUIET —— Physical Intelligence 的克制 + 苹果的优雅。
   PI 那边学的：暖白纸底、几乎零彩色、一列带日期的研究条目、窄栏、文字优先。
   苹果那边学的：居中构图、字大而字重克制、大圆角媒体、极大留白、慢而轻的进场。
   刻意不学 PI 的：等宽正文（等宽字族不含中文字形，会逐字回退，中英字宽体系撕裂）、
   三种卡片变体混用、硬阴影 —— 那些在 PI 是英文语境下的技术腔，中文里不成立。 */
import { useEffect, useState } from "react";
import simWide from "../assets/media/sim-wide.webp";
// 字标改用与 accent 同色的海蓝版：原 PNG 是 #0877FE 天蓝，
// 和全站 #15568C 海蓝差 30°，同一条导航里两个蓝必然打架。
import logoSea from "../assets/tuojing-logo-sea.png";
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
import { useRise } from "../shared";
import QuietArticle, { findProject } from "./QuietArticle";

/* 苹果式的窄栏：内容宽度远小于视口，留白是构图的一部分 */
function Col({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-8 ${wide ? "max-w-[1120px]" : "max-w-[880px]"}`}
    >
      {children}
    </div>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    // 无边框、无按钮、无实底：只有滚动后一层几不可见的毛玻璃
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-canvas/80 backdrop-blur-xl" : ""
      }`}
    >
      <Col wide>
        <div className="flex items-center justify-between gap-6 py-5">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={logoSea} alt={site.wordmark} className="h-[18px] w-auto" />
            <span className="q-h3 text-ink">{site.nameZh}</span>
          </a>
          <nav className="flex items-center gap-6 sm:gap-9">
            {[
              { href: "#research", label: "研究" },
              { href: "#about", label: "关于" },
              { href: "#join", label: "加入我们" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="q-meta text-ink-muted transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </Col>
    </header>
  );
}

export default function Quiet() {
  const [slug, setSlug] = useState(
    () => new URLSearchParams(window.location.search).get("p") ?? "",
  );

  useEffect(() => {
    const on = () =>
      setSlug(new URLSearchParams(window.location.search).get("p") ?? "");
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);

  const hit = slug ? findProject(slug) : null;

  useRise(slug || "quiet");

  if (hit) {
    return (
      <QuietArticle
        project={hit.project}
        track={hit.track}
        onBack={() => setSlug("")}
      />
    );
  }

  return (
    <div id="top" className="bg-canvas text-ink antialiased">
      <Nav />

      {/* 首屏：居中、极大留白、两行受控换行的标题 */}
      <section className="px-0 pb-24 pt-40 text-center sm:pt-48 lg:pb-32 lg:pt-56">
        <Col>
          <h1 className="q-display rise q text-ink">
            <span className="block">拓展智能边界，</span>
            <span className="block">连接数字世界与物理世界。</span>
          </h1>
          <p className="q-lead rise q rise-1 mx-auto mt-8 max-w-[42ch] text-ink-muted">
            <span className="block">面向空间智能、物理智能与具身智能，</span>
            <span className="block">构建能够感知、理解并操作真实世界的通用智能体。</span>
          </p>
          <p className="rise q rise-2 mt-10">
            <a
              href="#research"
              className="q-meta text-instrument underline decoration-instrument/35 underline-offset-[6px] transition-colors duration-300 hover:decoration-instrument"
            >
              了解我们的研究 →
            </a>
          </p>
        </Col>
      </section>

      {/* 大圆角媒体。无边框、无阴影 —— 图自己站住。 */}
      <section className="pb-28 lg:pb-40">
        <Col wide>
          <figure className="rise q">
            <div className="overflow-hidden rounded-[20px] bg-figure-bg">
              <img
                src={simWide}
                alt="Isaac Sim 厨房场景中的柔性糕点、刚体对照物与材质梯度"
                width={2000}
                height={1250}
                className="block h-auto w-full"
                loading="eager"
                decoding="sync"
              />
            </div>
            <figcaption className="q-meta mt-5 text-center text-ink-faint">
              SoftVTBench 资产目录 · Isaac Sim 单帧离线渲染
            </figcaption>
          </figure>
        </Col>
      </section>

      {/* 三条能力线：没有卡片、没有边框，靠间距和层级分开 */}
      <section id="about" className="scroll-mt-24 pb-28 lg:pb-40">
        <Col wide>
          <p className="q-h2 rise q mx-auto max-w-[30ch] text-balance text-center text-ink">
            {positioning.oneLine}
          </p>
          <div className="mt-20 grid gap-14 sm:grid-cols-3 sm:gap-10 lg:mt-24">
            {pillars.map((p, i) => (
              <div
                key={p.no}
                className={`rise q rise-${Math.min(i + 1, 3)} flex flex-col gap-3 text-center sm:text-left`}
              >
                <p className="q-h3 text-ink">{p.zh}</p>
                <p className="q-meta text-ink-faint">{p.en}</p>
                <p className="q-body text-ink-muted">{p.meaning}</p>
                <p className="q-body text-instrument">{p.line}</p>
              </div>
            ))}
          </div>
        </Col>
      </section>

      {/* 研究：PI 的带日期条目列表，但去掉卡片变体，只留发丝线 */}
      <section id="research" className="scroll-mt-24 pb-28 lg:pb-40">
        <Col>
          <h2 className="q-h2 rise q text-ink">研究</h2>
          <p className="q-body rise q rise-1 mt-5 max-w-[46ch] text-ink-muted">
            当前机器人智能面临两类相互耦合的瓶颈：模型能否走向世界预测与长期记忆，以及仿真中的高分能否代表真实世界中的可靠交互。
          </p>

          <div className="mt-16 flex flex-col">
            {tracks.flatMap((t) =>
              t.projects.map((p) => (
                <a
                  key={p.id}
                  href={`?v=quiet&p=${p.id}`}
                  className="rise q group flex flex-col gap-2 border-t border-rule py-7"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="q-h3 text-ink transition-colors duration-300 group-hover:text-instrument">
                      {p.nameZh}
                    </h3>
                    <span className="q-meta shrink-0 text-ink-faint">
                      {p.nameEn}
                    </span>
                  </div>
                  <p className="q-body max-w-[52ch] text-ink-muted">{p.question}</p>
                </a>
              )),
            )}
            <div className="border-t border-rule" />
          </div>

          <p className="q-meta rise q mt-10 text-ink-faint">
            {loop.map((s) => s.zh).join(" · ")} —— {positioning.infra}
          </p>
        </Col>
      </section>

      {/* 加入：居中、大字、一个链接。苹果的收尾方式。 */}
      <section id="join" className="scroll-mt-24 pb-28 text-center lg:pb-40">
        <Col>
          <p className="q-display rise q mx-auto max-w-[18ch] text-ink">
            {footer.ctaZh}
          </p>
          <p className="q-lead rise q rise-1 mx-auto mt-7 max-w-[36ch] text-balance text-ink-muted">
            {careers.intro}
          </p>
          <p className="rise q rise-2 mt-10">
            <a
              href={`mailto:${careers.email}`}
              className="q-lead text-instrument underline decoration-instrument/35 underline-offset-[8px] transition-colors duration-300 hover:decoration-instrument"
            >
              {careers.email}
            </a>
          </p>
          <p className="q-meta rise q rise-3 mx-auto mt-8 max-w-[52ch] text-ink-faint">
            {careers.roles.join(" · ")}
          </p>
        </Col>
      </section>

      <footer className="border-t border-rule py-12">
        <Col wide>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="q-meta max-w-[46ch] text-ink-faint">
              {naming.lines[0]}
              {naming.lines[1]}
            </p>
            <p className="q-meta shrink-0 text-ink-faint">
              {site.nameZh} · {site.wordmark} · {footer.location} · ©{" "}
              {footer.year}
            </p>
          </div>
        </Col>
      </footer>
    </div>
  );
}
