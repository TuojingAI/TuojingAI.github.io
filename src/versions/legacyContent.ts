/* 全站内容。项目部分的每一条都来自 github.com/orgs/TuojingAI 的公开仓库与其 README，
   arXiv 号、star 数、开源状态、数据集地址均已逐条核对，未做任何补充或推测。 */

export const site = {
  wordmark: "Tuojing Intelligence",
  glyph: "拓",
  nameZh: "拓境智能",
};

export const pages = [
  { id: "home", label: "首页", labelEn: "Home" },
  { id: "research", label: "项目", labelEn: "Projects" },
  /* 成员页按老板要求先下线。team 数据整块保留在下方，恢复时把这一条与
     Legacy.tsx 里的 TeamPage / pageNodes 一起加回来即可。 */
  { id: "join", label: "加入我们", labelEn: "Join Us" },
];

export const hero = {
  // 强调只给一个短语（Stripe：品牌色只作 CTA/链接与单点强调，不作正文色）
  headline: ["拓展智能边界，", "连接"],
  // 数字侧走赛博特效，物理侧走物理特效 —— 特效本身就是这句话的注解
  digitalZh: "数字世界",
  digitalEn: "Digital World",
  physicalZh: "物理世界",
  physicalEn: "Physical World",
};

export const mission = {
  lead: "拓境智能是一家面向 Physical World AI 的公司。我们围绕空间智能与物理智能构建基础设施：让机器先看懂真实世界的几何与场景，再理解接触、力与形变如何运转，最终能在真实世界中可靠地行动。",
  body: "我们的四个开源项目连成一条完整的路线：从真实视频重建可交互的 4D 场景（ReconDrive），到在生成式世界模型里做反事实因果推理、造出安全攸关场景（CounterScene），到把 3D 高斯世界模型接进机器人操作策略（GaussianDream），再到用视触觉衡量可形变物体操作中的形变合规（SoftVTBench）。重建、生成、行动、评测——这是同一件事的四个面。",
  taglineZh: "拓展智能边界，连接数字世界与物理世界。",
  taglineEn: "Building intelligence for the physical world.",
};

export const loop = [
  { zh: "重建", en: "Reconstruct" },
  { zh: "生成", en: "Generate" },
  { zh: "行动", en: "Act" },
  { zh: "评测", en: "Evaluate" },
];

export type FeedEntry = {
  slug: string;
  title: string;
  titleEn: string;
  tag: string;
  desc: string;
  meta: string;
  href: string;
  links: { label: string; href: string }[];
  variant: "featured" | "card" | "plain";
};

/* 按公开时间倒序。desc 全部改写自各仓库 README 的 Introduction / Highlights，
   数字（1,628 demonstrations / 33 assets / 四个任务套件）取自 SoftVTBench README 自述。 */
export const feed: FeedEntry[] = [
  {
    slug: "real2simready",
    title: "Real2SimReady：从一次人类演示到可执行的仿真世界",
    titleEn: "From One Handheld Human Demonstration to a Physics-Ready World",
    tag: "Pipeline",
    desc: "操作者手持夹爪把任务自然地做一遍。管线把这一次演示还原成与真实环境对齐的数字孪生，在里面派生多条候选动作序列并行推演，最后交付一个可执行的机器人技能。页内有 80 秒演示片。",
    meta: "内部管线 · 演示片",
    href: "?p=real2simready",
    links: [],
    variant: "featured",
  },
  {
    slug: "softvtbench",
    title: "SoftVTBench：可形变物体操作的视触觉数据集与形变感知评测",
    titleEn: "A Deformation-Aware Visuo-Tactile Dataset and Benchmark",
    tag: "Benchmark",
    desc: "把「完成任务」和「没有把东西弄坏」合成一个指标来衡量：一条轨迹只有既达成目标、又全程未超出该物体标定的形变容差，才算成功。4,000 条专家演示、40 个任务、四个成对套件、50 个以上资产，每个可形变物体都配一个外观一致的刚体孪生。",
    meta: "arXiv 2607.04234 · 代码与数据集已开源",
    href: "https://github.com/TuojingAI/SoftVTBench",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2607.04234" },
      { label: "代码", href: "https://github.com/TuojingAI/SoftVTBench" },
      {
        label: "数据集",
        href: "https://huggingface.co/datasets/Arthur12137/SoftVTBench",
      },
    ],
    variant: "card",
  },
  {
    slug: "gaussiandream",
    title: "GaussianDream：机器人操作的前馈式 3D 高斯世界模型",
    titleEn: "A Feed-Forward 3D Gaussian World Model for Robotic Manipulation",
    tag: "World Model",
    desc: "挂在 VLA 策略上的前馈式高斯世界模型插件：训练时把机器人视频解码成当前帧的 3D 高斯场景与短时程未来演化，推理时把全部辅助解码头丢掉，只留一段前缀参与动作生成，控制回路不变重。",
    meta: "arXiv 2605.20752 · 代码已开源",
    href: "https://github.com/TuojingAI/GaussianDream",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2605.20752" },
      { label: "代码", href: "https://github.com/TuojingAI/GaussianDream" },
    ],
    variant: "card",
  },
  {
    slug: "counterscene",
    title: "CounterScene：世界模型中的反事实因果推理",
    titleEn: "Counterfactual Causal Reasoning in Generative World Models",
    tag: "Safety",
    desc: "不做随机扰动，而是先找出那个「正在维持安全」的关键交通参与者，再对它施加最小干预——把一个安全场景变成真实可信的安全攸关交互，同时保持周围多智能体动态的一致性。",
    meta: "arXiv 2603.21104 · 代码待发布",
    href: "https://github.com/TuojingAI/CounterScene",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2603.21104" },
      { label: "代码", href: "https://github.com/TuojingAI/CounterScene" },
    ],
    variant: "card",
  },
  {
    slug: "recondrive",
    title: "ReconDrive：自动驾驶场景的前馈式 4D 高斯重建",
    titleEn: "Fast Feed-Forward 4D Gaussian Splatting",
    tag: "Reconstruction",
    desc: "把驾驶场景的 4D 高斯泼溅做成一次前向推理。在 nuScenes 上，一个约 20 秒的场景生成高斯需要 15 秒，per-scene 优化方法需要 23 到 46 分钟。",
    meta: "arXiv 2603.07552 · 代码与 checkpoint 已开源",
    href: "https://github.com/TuojingAI/ReconDrive",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2603.07552" },
      { label: "代码", href: "https://github.com/TuojingAI/ReconDrive" },
      {
        label: "Checkpoint",
        href: "https://huggingface.co/TuojingAI/ReconDrive",
      },
    ],
    variant: "card",
  },
];

export type TeamMember = {
  initial: string;
  name: string;
  role: string;
  org: string;
};

export const team = {
  intro:
    "我们是一支由研究者、机器人工程师与系统工程师组成的小团队，在北京工作，并与海内外高校长期合作。上面四个项目的作者来自清华、港大、伦敦国王学院、东南大学、帝国理工、CMU、北航、浙大等机构。",
  note: "",
  members: [
    { initial: "俞", name: "俞海宝", role: "创始人", org: "香港大学 MMLab" },
    { initial: "秦", name: "秦海芳", role: "联合创始人", org: "北京大学" },
    { initial: "荆", name: "荆博文", role: "算法工程师", org: "曼彻斯特大学" },
    { initial: "张", name: "张梓健", role: "研究实习生", org: "中国科学院大学" },
    { initial: "蒋", name: "蒋雨清", role: "研究实习生", org: "中国科学院大学" },
    { initial: "王", name: "王明鑫", role: "研究实习生", org: "清华大学" },
    { initial: "葛", name: "葛晨晨", role: "研究实习生", org: "东南大学" },
    { initial: "沈", name: "沈瀚文", role: "研究实习生", org: "史蒂文斯理工学院" },
    { initial: "邹", name: "邹颜刚", role: "研究实习生", org: "复旦大学" },
  ] satisfies TeamMember[],
  advisors:
    "合作机构：清华大学 · 香港大学 · 伦敦国王学院 · 东南大学 · 帝国理工学院 · 卡内基梅隆大学 · 北京航空航天大学 · 浙江大学 · 曼彻斯特大学 · 香港科技大学（广州）· 史蒂文斯理工学院",
};

export const careers = {
  intro: "我们正在北京扩充团队，也在持续招募实习生与研究合作者。",
  roles: [
    "Research Scientist",
    "Robotics Engineer",
    "Simulation Engineer",
    "Embodied AI Intern",
    "Full-stack Engineer",
    "Research Intern",
  ],
  email: "yuhaibao94@gmail.com",
};

export const footer = {
  collab:
    "我们与高校、研究机构和产业团队合作，共建真实世界智能的重建、生成、评测与数据生态。四个项目全部在 GitHub 开源。",
  ctaZh: ["让智能体从数字世界，", "走向物理世界。"],
  ctaEn: "Building intelligence for the physical world.",
  location: "Beijing, China",
  year: "2026",
  github: "https://github.com/TuojingAI",
};
