/* 项目详情页 —— 结构照搬 Physical Intelligence 的 blog / research 页，皮肤沿用原版。
   从 PI 学来的：大号衬线标题 + 标题下的 label/value 元信息表（发表 / 联系）+ 完整作者名单 +
   虚线框硬投影的资源按钮 + 带 mono 全大写角标的图版 + 无粗体的层级（层级只靠字号与字族）。
   换成原版皮肤的：淡蓝底、宋体标题、等宽正文、accent 蓝、原版的硬阴影规格。 */
import logoBlue from "../assets/tuojing-logo-blue.png";
import { careers, footer, site } from "./legacyContent";
import type { Block, Figure, Project } from "./legacyProjects";
import { projects } from "./legacyProjects";

/* 图版规格量自两个参照站：worldlabs.ai 的媒体容器是 radius 8-16px + overflow hidden、
   无标签栏无阴影；pi.website/blog/pi07 是 radius 12px + overflow hidden + bg-black，
   连图注都不放。两家都没有"顶部等宽大写标签栏 + 直角边框盒"这种东西，所以去掉。
   圆角一律加在外层容器上、媒体本身保持方角 —— 这是两家共同的做法。 */
function Plate({ fig }: { fig: Figure }) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-[12px] border border-card-border bg-white">
        <img
          src={fig.src}
          alt={fig.caption}
          className="block h-auto w-full"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-2.5 font-mono text-xs leading-relaxed text-muted-foreground">
        {fig.caption}
      </figcaption>
    </figure>
  );
}

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === "h")
          // 不加粗：跟 PI 一样，层级只靠字号与字族
          return (
            <h2
              key={i}
              className="mt-10 font-serif text-xl font-normal text-foreground"
            >
              {b.text}
            </h2>
          );

        if (b.kind === "p")
          return (
            <p
              key={i}
              className="mt-4 font-mono text-[13px] leading-[2] text-foreground/85"
            >
              {b.text}
            </p>
          );

        if (b.kind === "fig") return <Plate key={i} fig={b.fig} />;

        if (b.kind === "video")
          return (
            <figure key={i} className="my-8">
              {/* bg-black 跟 pi07 一样：片子是 16:9，容器不给底色的话首帧前会闪白 */}
              <div className="overflow-hidden rounded-[12px] bg-black">
                {/* preload="none"：15 MB 的片子不能在首屏就开始下，等用户按播放 */}
                <video
                  src={b.video.src}
                  poster={b.video.poster}
                  controls
                  playsInline
                  preload="none"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="mt-2.5 font-mono text-xs leading-relaxed text-muted-foreground">
                {b.video.caption}
              </figcaption>
            </figure>
          );

        if (b.kind === "list")
          return (
            <dl key={i} className="mt-5 flex flex-col">
              {b.items.map((it) => (
                <div
                  key={it.term}
                  className="flex flex-col gap-1 border-t border-divider py-3 sm:flex-row sm:gap-6"
                >
                  <dt className="shrink-0 font-mono text-[13px] text-foreground sm:w-44">
                    {it.term}
                  </dt>
                  <dd className="font-mono text-[13px] leading-[1.9] text-muted-foreground">
                    {it.desc}
                  </dd>
                </div>
              ))}
              <div className="border-t border-divider" />
            </dl>
          );

        return (
          <div key={i} className="mt-6">
            <div className="overflow-x-auto rounded-[12px] border border-card-border bg-white">
              <table className="w-full border-collapse font-mono text-[12px]">
                <thead>
                  <tr className="border-b border-divider bg-background-deep/60">
                    {b.head.map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-3 py-2 text-left font-normal text-accent"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* key 用行号不用 r[0]：多张表的首列有重复值（同一个模型的 VO / VT 两行） */}
                  {b.rows.map((r, ri) => (
                    <tr key={ri} className="border-b border-divider last:border-0">
                      {r.map((c, ci) => (
                        <td
                          key={ci}
                          className={`px-3 py-2 align-top leading-relaxed ${
                            ci === 0
                              ? "whitespace-nowrap text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {b.note && (
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {b.note}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function LegacyProject({ project }: { project: Project }) {
  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <div className="min-h-svh bg-background font-mono text-sm text-foreground antialiased">
      <nav className="sticky top-0 z-50 border-b border-divider/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-6 py-4">
          <a href="./" className="flex items-center gap-2.5">
            <img src={logoBlue} alt={site.wordmark} className="h-5 w-auto" />
            <span className="font-serif text-lg font-bold text-foreground/80">
              {site.nameZh}
            </span>
          </a>
          <a
            href="./#research"
            className="text-xs text-foreground/70 underline-offset-8 hover:text-foreground hover:underline"
          >
            ← 返回项目
          </a>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <p className="font-mono text-xs tracking-widest text-accent">
          {project.tag}
        </p>

        {/* 大号宋体标题，不用首页那条渐变——渐变留给首页一次就够 */}
        <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.3] text-foreground md:text-[40px]">
          {project.title}
        </h1>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
          {project.titleEn}
        </p>

        {/* PI 的 label/value 元信息表 */}
        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-xs">
          <dt className="text-muted-foreground">发表</dt>
          <dd className="text-foreground">{project.date}</dd>
          <dt className="text-muted-foreground">状态</dt>
          <dd className="text-foreground">{project.status}</dd>
          <dt className="text-muted-foreground">联系</dt>
          <dd>
            <a
              href={`mailto:${careers.email}`}
              className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {careers.email}
            </a>
          </dd>
        </dl>

        {project.authors && (
          <p className="mt-6 font-mono text-[11px] leading-[1.9] text-muted-foreground">
            {project.authors}
          </p>
        )}
        {/* 机构比作者再降一档：同字号但更淡，让作者名单先被读到 */}
        {project.affiliations && (
          <p className="mt-2 font-mono text-[11px] leading-[1.9] text-muted-foreground/70">
            {project.affiliations}
          </p>
        )}

        {/* 资源按钮：虚线框 + 硬位移投影，PI 只把硬阴影用在这一个器件上 */}
        <div className="mt-7 flex flex-wrap gap-3">
          {(project.links ?? []).map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="border border-dashed border-foreground/55 bg-white px-4 py-2 font-mono text-xs text-foreground shadow-hard-sm transition-transform duration-150 hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-none"
            >
              {l.label} ↗
            </a>
          ))}
        </div>

        <p className="mt-9 border-l-2 border-accent pl-4 font-mono text-[13px] leading-[2] text-foreground">
          {project.lede}
        </p>

        {project.hero && <Plate fig={project.hero} />}

        <Body blocks={project.body} />

        <nav className="mt-16 border-t border-divider pt-6">
          <p className="font-mono text-xs text-muted-foreground">其他项目</p>
          <ul className="mt-3 flex flex-col">
            {others.map((p) => (
              <li key={p.slug}>
                <a
                  href={`?p=${p.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-divider py-3 hover:text-accent"
                >
                  <span className="text-[13px] font-semibold">{p.title}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {p.date}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 text-center font-mono text-xs text-muted-foreground">
          {site.nameZh} · {site.wordmark} · {footer.location} · © {footer.year}
        </p>
      </article>
    </div>
  );
}
