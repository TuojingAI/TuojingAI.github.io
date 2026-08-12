/* 研究详情页 —— 学 Physical Intelligence 的 /research/<slug> 页面。
   实测它的规格：h1 = Signifier 衬线 60px / weight 400 / lh 1.25；
   正文 = Source Sans 3 18px / lh 1.625 / weight 400；底色 #F5F4EF；
   全页无一处粗体，层级只靠字号与字族。
   照搬的器件：标题下的 label/value 元信息表、虚线框+硬投影的资源按钮、
   点阵底纹 + 左上角 mono 标签的图版、行内下划线链接、斜体提问句。
   中文化的改动：中文标题走无衬线 500，英文副标题才走衬线 —— 见 index.css 注释。 */
import { careers, site, tracks, type Project, type Track } from "../data/siteContent";
import { useRise } from "../shared";

function Col({ children }: { children: React.ReactNode }) {
  // PI 的正文栏约 960px。中文在这个宽度下约 50 字/行，是舒服的。
  return (
    <div className="mx-auto w-full max-w-[960px] px-6 sm:px-8">{children}</div>
  );
}

/* label / value 两列元信息表。没有值的行直接不渲染。 */
function Meta({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-1.5">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="q-meta text-ink-faint">{k}</dt>
          <dd className="q-meta text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* 点阵底纹图版 + 左上角 mono 全大写标签 */
function Plate({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rise q my-14">
      <div className="q-plate overflow-hidden rounded-[10px] border border-rule-strong">
        <p className="q-meta px-4 pt-3 uppercase tracking-[0.08em] text-ink-faint">
          {label}
        </p>
        <div className="px-4 pb-4 pt-3">{children}</div>
      </div>
      {caption && (
        <figcaption className="q-meta mt-3 text-ink-faint">{caption}</figcaption>
      )}
    </figure>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rise q mt-12">
      {/* h3 跟 PI 一样：无衬线、24px、weight 400 —— 不加粗 */}
      <h2 className="q-prose text-[1.5rem] font-normal leading-snug text-ink">
        {title}
      </h2>
      <div className="q-prose mt-4 text-ink">{children}</div>
    </section>
  );
}

export default function QuietArticle({
  project,
  track,
  onBack,
}: {
  project: Project;
  track: Track;
  onBack: () => void;
}) {
  useRise(project.id);

  const meta: [string, React.ReactNode][] = [];
  if (project.date) meta.push(["发表", project.date]);
  meta.push(["方向", `${track.no} · ${track.titleZh}`]);
  meta.push([
    "联系",
    <a
      key="m"
      href={`mailto:${careers.email}`}
      className="underline decoration-ink/25 underline-offset-4 transition-colors duration-300 hover:decoration-ink"
    >
      {careers.email}
    </a>,
  ]);

  return (
    <div className="bg-canvas text-ink antialiased">
      <header className="fixed inset-x-0 top-0 z-50 bg-canvas/80 backdrop-blur-xl">
        <Col>
          <div className="flex items-center justify-between gap-6 py-5">
            <a href="?v=quiet" className="q-h3 text-ink" onClick={onBack}>
              {site.nameZh}
            </a>
            <a
              href="?v=quiet#research"
              onClick={onBack}
              className="q-meta text-ink-muted transition-colors duration-300 hover:text-ink"
            >
              ← 返回研究
            </a>
          </div>
        </Col>
      </header>

      <article className="pb-32 pt-36 sm:pt-44">
        <Col>
          {/* 标题：中文无衬线 500 在上，英文衬线 400 在下 */}
          <h1 className="q-title rise q text-ink">{project.nameZh}</h1>
          <p className="q-serif rise q rise-1 mt-3 text-[clamp(1.125rem,1.8vw,1.625rem)] leading-snug text-ink-muted">
            {project.nameEn}
          </p>

          <div className="rise q rise-2">
            <Meta rows={meta} />
          </div>

          {/* 资源位：有真实链接才渲染。没有论文就不要放一个死的 Paper 按钮。 */}
          {project.links && project.links.length > 0 && (
            <div className="rise q rise-3 mt-9 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="q-chip q-meta rounded-[4px] bg-canvas-raised px-4 py-2 text-ink"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}

          {project.figure && (
            <Plate label={project.figure.label} caption={project.figure.caption}>
              <img
                src={project.figure.src}
                alt={project.figure.caption}
                width={project.figure.w}
                height={project.figure.h}
                className="block h-auto w-full rounded-[6px]"
                loading="eager"
                decoding="sync"
              />
            </Plate>
          )}

          <Section title="我们在问什么">
            {/* 斜体提问句：PI 用它标出全文的核心问题，是它的强调方式 */}
            <p className="italic">{project.question}</p>
          </Section>

          <Section title="希望实现的目标">
            <p>{project.goal}</p>
          </Section>

          <Section title="适合的候选人">
            <p>
              {project.wanted}
              。如果这条线正好是你在想的问题，写信给我们：
              <a
                href={`mailto:${careers.email}`}
                className="underline decoration-ink/25 underline-offset-4 transition-colors duration-300 hover:decoration-ink"
              >
                {careers.email}
              </a>
              。
            </p>
          </Section>

          {/* 同方向的其他条目 */}
          <nav className="rise q mt-20 border-t border-rule pt-8">
            <p className="q-meta text-ink-faint">
              同方向 · {track.titleZh}
            </p>
            <ul className="mt-4 flex flex-col">
              {track.projects
                .filter((p) => p.id !== project.id)
                .map((p) => (
                  <li key={p.id}>
                    <a
                      href={`?v=quiet&p=${p.id}`}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-4 transition-colors duration-300 hover:text-instrument"
                    >
                      <span className="q-h3 font-normal">{p.nameZh}</span>
                      <span className="q-meta text-ink-faint">{p.nameEn}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </Col>
      </article>
    </div>
  );
}

/* 供 Quiet 主页按 slug 找条目 */
export function findProject(slug: string) {
  for (const t of tracks) {
    const p = t.projects.find((x) => x.id === slug);
    if (p) return { project: p, track: t };
  }
  return null;
}
