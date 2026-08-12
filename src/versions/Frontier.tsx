/* 境 FRONTIER —— 参照 rimbot.com 的设计 DNA 重做，不是像素复刻。
   借来的（结构逻辑）：纯黑底 + 白字 + 单一高饱和强调色；整屏分页；
     首屏全幅动态视觉、文案退到左下角且不占主导；英文大写在上、中文在下的双行标题；
     [ 方括号 ] 眉标；字标紧邻两颗药丸按钮的导航形制；vw 等比字号阶梯。
   换掉的（身份层）：日冕用橙（来自太阳日冕影像），拓境用自己的品牌蓝提亮；
     母题不用天体，用 marker 点阵 + 一条推过去的界 —— 这是公司名本身。 */
import { useEffect, useRef, useState } from "react";
import FrontierField from "../components/FrontierField";
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



function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3 lg:gap-5">
          <a href="#s0" className="flex items-center gap-2.5">
            <img src={logoWhite} alt={site.wordmark} className="h-5 w-auto" />
          </a>
          {/* 字标紧邻两颗药丸 —— rimbot 的导航形制，不是把链接甩到右边 */}
          <nav className="hidden items-center gap-2 sm:flex">
            <a
              href="#s2"
              className="t-label rounded bg-white/10 px-4 py-2 text-white transition-colors duration-160 ease-standard hover:bg-white/20"
            >
              研究方向
            </a>
            <a
              href="#s4"
              className="t-label rounded bg-white/10 px-4 py-2 text-white transition-colors duration-160 ease-standard hover:bg-white/20"
            >
              加入我们
            </a>
          </nav>
        </div>
        <a
          href={`mailto:${careers.email}`}
          className="t-label rounded bg-white px-4 py-2 text-black transition-opacity duration-160 ease-standard hover:opacity-80"
        >
          联系我们
        </a>
      </div>
    </header>
  );
}

function Bracket({ children }: { children: string }) {
  // [ 方括号 ] 眉标：rimbot 的签名标记法
  return (
    <p className="t-label text-white/70">
      <span className="text-instrument">[</span>
      <span className="px-2">{children}</span>
      <span className="text-instrument">]</span>
    </p>
  );
}

function ScrollHint() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2">
      <span className="t-label text-white/45">向下滚动</span>
      <span aria-hidden className="h-8 w-px bg-white/25" />
    </div>
  );
}

/* 整屏分页。原版被我上一轮删掉是错的 —— rimbot 用的正是这个。
   问题从来不是分页机制，是每屏背后有没有东西撑着。 */
function useSnapIndex(count: number) {
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            const n = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(n)) setI(n);
          }
        });
      },
      { threshold: 0.55 },
    );
    el.querySelectorAll("[data-idx]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [count]);
  return { i, root };
}

function Dots({ i, count }: { i: number; count: number }) {
  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2.5 lg:flex">
      {Array.from({ length: count }, (_, n) => (
        <span
          key={n}
          className={`w-px transition-all duration-420 ease-standard ${
            n === i ? "h-7 bg-instrument" : "h-3 bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}

const SCREENS = 5;

export default function Frontier() {
  const { i, root } = useSnapIndex(SCREENS);

  return (
    <div className="bg-black text-white antialiased">
      <Nav />
      <Dots i={i} count={SCREENS} />

      <div
        ref={root}
        className="h-svh snap-y snap-mandatory overflow-y-auto overflow-x-clip"
      >
        {/* 00 · 首屏：全幅动态 + 左下角文案 */}
        <section
          id="s0"
          data-idx="0"
          className="relative isolate flex h-svh snap-start flex-col justify-end overflow-hidden"
        >
          <FrontierField />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,#000_2%,rgba(0,0,0,.55)_34%,rgba(0,0,0,.15)_70%)]"
          />
          <div className="relative px-6 pb-24 lg:px-10 lg:pb-28">
            <Bracket>拓境开物</Bracket>
            <h1 className="mt-5">
              <span className="t-display-en block text-white">
                Expand The Boundary
              </span>
              <span className="t-display mt-1 block text-white">
                拓展智能边界
              </span>
            </h1>
            <p className="t-body mt-6 max-w-[46ch] text-white/70">
              {positioning.oneLine}
            </p>
          </div>
          <ScrollHint />
        </section>

        {/* 01 · 宣言 */}
        <section
          data-idx="1"
          className="relative flex h-svh snap-start flex-col justify-center px-6 lg:px-10"
        >
          <Bracket>我们相信</Bracket>
          <p className="t-sec mt-6 max-w-[24ch] text-white">
            {positioning.declaration}
          </p>
          <p className="t-body mt-8 max-w-[52ch] text-white/60">
            {positioning.infra}
          </p>
          <ol className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-4">
            {loop.map((s, n) => (
              <li key={s.en} className="flex items-baseline gap-8">
                {n > 0 && (
                  <span aria-hidden className="text-instrument">
                    /
                  </span>
                )}
                <span className="flex items-baseline gap-2">
                  <span className="t-sec text-white">{s.zh}</span>
                  <span className="t-label text-white/40">{s.en}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* 02 · 三条能力线 */}
        <section
          id="s2"
          data-idx="2"
          className="relative flex h-svh snap-start flex-col justify-center px-6 lg:px-10"
        >
          <Bracket>研究方向</Bracket>
          <div className="mt-10 flex flex-col border-t border-white/12">
            {pillars.map((p) => (
              <article
                key={p.no}
                className="grid items-baseline gap-x-8 gap-y-2 border-b border-white/12 py-7 lg:grid-cols-12 lg:py-9"
              >
                <span className="t-label text-instrument lg:col-span-1">
                  {p.no}
                </span>
                <div className="lg:col-span-4">
                  <h2 className="t-sec text-white">{p.zh}</h2>
                  <p className="t-label mt-1 text-white/40">{p.en}</p>
                </div>
                <p className="t-body text-white/60 lg:col-span-4">{p.meaning}</p>
                <p className="t-body text-white lg:col-span-3 lg:text-right">
                  {p.line}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 03 · 证据 */}
        <section
          data-idx="3"
          className="relative flex h-svh snap-start flex-col justify-center px-6 lg:px-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Bracket>仿真与评测</Bracket>
              <h2 className="t-sec mt-5 text-white">
                我们在解决什么问题
              </h2>
              <div className="mt-7 flex flex-col gap-5">
                {tracks.map((t) => (
                  <div key={t.id} className="flex gap-3">
                    <span className="t-label text-instrument">{t.no}</span>
                    <div>
                      <p className="t-body text-white">{t.titleZh}</p>
                      <p className="t-label mt-1 text-white/40">
                        {t.projects.map((p) => p.nameZh).join(" · ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <figure className="lg:col-span-7 lg:col-start-6">
              {/* 明亮的渲染放在黑底上：装进一个带边框的图版里，读作「屏幕」而不是穿帮 */}
              <div className="overflow-hidden rounded border border-white/12">
                <img
                  src={simWide}
                  alt="Isaac Sim 厨房场景中的柔性糕点与刚体对照物"
                  width={2000}
                  height={1250}
                  className="block h-auto w-full"
                  loading="lazy"
                />
              </div>
              <figcaption className="t-label mt-3 text-white/45">
                SoftVTBench 资产目录 · Isaac Sim 单帧离线渲染 · 2400×1500
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 04 · 加入 + 名字 */}
        <section
          id="s4"
          data-idx="4"
          className="relative flex h-svh snap-start flex-col justify-between px-6 pb-8 pt-28 lg:px-10"
        >
          <div className="flex flex-1 flex-col justify-center">
            <Bracket>加入我们</Bracket>
            <p className="t-display mt-6 max-w-[16ch] text-white">
              {footer.ctaZh}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${careers.email}`}
                className="t-label rounded bg-white px-5 py-3 text-black transition-opacity duration-160 ease-standard hover:opacity-80"
              >
                {careers.email}
              </a>
              <span className="t-label text-white/40">
                {careers.roles.join(" · ")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/12 pt-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-5">
              <span
                aria-hidden
                className="text-[clamp(2.5rem,4vw,3.5rem)] font-black leading-none text-white"
              >
                {naming.glyph}
              </span>
              <p className="t-label max-w-[34ch] text-white/50">
                {naming.lines[0]}
                {naming.lines[1]}
              </p>
            </div>
            <p className="t-label text-white/35">
              {site.nameZh} · {site.wordmark} · {footer.location} · ©{" "}
              {footer.year}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
