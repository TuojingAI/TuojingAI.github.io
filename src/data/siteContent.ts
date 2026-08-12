import simWide from "../assets/media/sim-wide.webp";

export const site = {
  wordmark: "Tuojing Intelligence",
  nameZh: "拓境智能",
};

export const pages = [
  { id: "home", label: "首页", labelEn: "Home" },
  { id: "research", label: "研究", labelEn: "Research" },
  { id: "team", label: "团队", labelEn: "Team" },
  { id: "join", label: "加入我们", labelEn: "Join" },
];

export const hero = {
  // 两行受控换行：display 字号下让浏览器自己断中文，会劈开词（「仿真里有/效」）。
  // 这句同时是公司的实际主张——评测一致性——而不是一句可以套给任何公司的话。
  headline: ["仿真里有效，", "不等于真实世界里可信。"],
  // 原 taglineEn 是 "Building intelligence for the physical world."，与 Physical
  // Intelligence（π0/π0.5 作者，同时是我们评测里的基线模型）撞得极近。裁判不穿选手队服。
  // 新句直接对应公司名：拓（推进）+ 境（边界）。
  headlineEn: "Expanding the boundary where simulation still holds.",
  lead: "拓境智能构建面向真实物理世界的智能：世界模型与机器人操作、视触觉感知、物理资产与评测基础设施。我们关心的不是视觉上的逼真度，而是接触、形变、材料、动作后果与评测结论的一致性。",
};

// 名字释义。全站只出现一次，放在页脚上方。
// 「拓」是多音字：tuò＝开拓；tà＝拓印（覆纸施压，把表面凹凸如实转印下来）。
// 后一个义项恰好就是视触觉传感器的工作原理，这是公司名里真实存在的双关。
export const naming = {
  glyph: "拓",
  lines: [
    "拓，是开拓，也是拓印——覆纸施压，把接触面上的形变如实取下来。",
    "境，是仿真与真实之间，那条还没有画清楚的界。",
  ],
  claim: "我们做的事，就是把这条界往外推。",
};

/* 定位文案。四个版本共用同一份，差别在版式不在文字。 */
export const positioning = {
  // 最有气势的一版
  declaration:
    "拓境智能要做的不是停留在屏幕里的 AI，而是能够理解空间、感知物理、并进入真实世界行动的下一代智能体。",
  // 官网 tagline
  tagline: "拓展智能边界，连接数字世界与物理世界。",
  // 一句话公司
  oneLine: "拓境智能 = 从数字智能走向世界智能。",
  // 学术口径
  academic:
    "面向空间智能、物理智能与具身智能，构建能够感知、理解并操作真实世界的通用智能体。",
  // 统一到基础设施
  infra:
    "我们在为下一代 Physical World AI 构建感知、仿真、评测与行动基础设施。",
  en: "Expanding the boundary of machine intelligence — from the digital world into the physical one.",
};

/* 三条能力线。这是全站的骨架：看懂 → 理解运转 → 作用于世界。 */
export const pillars = [
  {
    no: "01",
    en: "Spatial Intelligence",
    zh: "空间智能",
    meaning: "理解空间、场景、几何、关系",
    line: "AI 看懂世界",
  },
  {
    no: "02",
    en: "Physical AI",
    zh: "物理智能",
    meaning: "理解力、接触、材料、因果、约束",
    line: "AI 理解世界如何运转",
  },
  {
    no: "03",
    en: "Embodied Intelligence",
    zh: "具身智能",
    meaning: "通过身体和动作完成任务",
    line: "AI 能真正作用于世界",
  },
];

/* 闭环：拓境的基础设施四段 */
export const loop = [
  { zh: "感知", en: "Sense" },
  { zh: "仿真", en: "Simulate" },
  { zh: "评测", en: "Evaluate" },
  { zh: "行动", en: "Act" },
];

export const heroFigure = {
  caption:
    "SoftVTBench 资产目录 · Isaac Sim 厨房场景 · 柔性糕点、刚体对照物与材质梯度同场渲染",
  meta: "Isaac Sim · 单帧离线渲染 · 2400×1500",
};

export type Track = {
  id: string;
  no: string;
  titleZh: string;
  titleEn: string;
  aim: string;
  projects: Project[];
};

export type Project = {
  id: string;
  nameZh: string;
  nameEn: string;
  question: string;
  goal: string;
  wanted: string;
  /* 以下三项刻意留空 —— 有真实内容再填，绝不编造。
     date  : 发表/更新日期。PI 的研究列表说服力几乎全来自日期，但没有就是没有。
     links : 论文 / 代码 / 数据集外链。链接必须可用后再放。
     figure: 该条目的配图（导入后的 URL）。没有真图就不放图版。 */
  date?: string;
  links?: { label: string; href: string }[];
  figure?: { src: string; label: string; caption: string; w: number; h: number };
};

// 内容全部来自《拓境智能研发项目介绍｜实习生与研究合作者》(2026-07-20)，
// 已对外分发过的成稿。刻意不搬那份参考文献清单 —— 它把自家项目和外部论文混列。
export const tracks: Track[] = [
  {
    id: "wam",
    no: "01",
    titleZh: "构建可扩展、可部署的世界动作模型",
    titleEn: "Scalable & Deployable World Action Models",
    aim: "目标不是只训练一个更大的视频生成模型，而是建立能够联合建模世界演化与机器人动作、可持续扩展数据与任务规模、并最终在真实机器人上低延迟闭环运行的 World Action Model。",
    projects: [
      {
        id: "memory",
        nameZh: "长时序、架构与记忆",
        nameEn: "Long-horizon, Architecture & Memory",
        question:
          "机器人如何在长任务中保存「对未来决策有用」的历史，而不是简单堆叠更多帧？世界预测与动作生成应该级联、联合还是解耦？",
        goal: "建立短程—长程分层记忆架构，探索 gist token、persistent memory、state memory 与空间化 Gaussian memory；在长时序任务上分析容量、压缩、读出与递归机制各自的贡献。",
        wanted:
          "video diffusion · transformer / state-space model · 长视频理解 · 机器人策略学习",
      },
      {
        id: "scaling",
        nameZh: "跨本体与多源数据扩展",
        nameEn: "Cross-embodiment & Data Scaling",
        question:
          "人类视频、遥操作数据、仿真数据与不同机器人的动作空间之间，哪些知识能够迁移，哪些必须显式对齐？",
        goal: "统一多机器人观测与动作表示，建立跨本体预训练与少样本适配机制；研究多任务预训练、课程与数据混合比例，评估从 clean 到 domain shift 的泛化。",
        wanted: "大规模训练 · 机器人数据工程 · 多任务学习",
      },
      {
        id: "deploy",
        nameZh: "训练、评测与真机闭环",
        nameEn: "Training, Evaluation & Real-robot Loop",
        question:
          "一个模型在离线指标上变好，怎么证明它在真机闭环里也更可靠？延迟、稳定性与失败类型如何进入评测？",
        goal: "建设覆盖延迟、闭环稳定性与失败类型的完整评测协议；建设可复现实验、自动评测、部署监控与真机回放工具链。",
        wanted: "训练与评测系统 · 真机部署 · 推理优化 · 实验基础设施",
      },
    ],
  },
  {
    id: "consistency",
    no: "02",
    titleZh: "构建仿真与真实的评测一致性",
    titleEn: "Sim-to-Real Evaluation Consistency",
    aim: "让「仿真里有效」逐步变成「真实世界里可信」。我们关注的不只是视觉逼真度，而是接触、形变、材料、动作后果和评测结论的一致性，并由此建立可规模化的数据与资产基础设施。",
    projects: [
      {
        id: "softvtbench",
        nameZh: "视触柔性操作基准与生态",
        nameEn: "Visuo-Tactile Deformable Manipulation Benchmark",
        question:
          "触觉在什么条件下真正提升模型能力？视觉与触觉如何对齐？仿真中的接触、滑移、形变与安全结论，能否与真实操作一致？",
        goal: "以 SoftVTBench 为切入点，建设由基准、数据、资产、模型与社区五层组成的视触柔性操作生态；V1 先打通 Isaac Sim 环境、任务、评价、baseline 与开源闭环。",
        wanted:
          "Isaac Sim · 柔性体 / FEM · 视触觉传感器 · Benchmark 工程 · 开源社区",
        figure: {
          src: simWide,
          label: "Asset Catalog · Isaac Sim",
          caption:
            "SoftVTBench 资产目录：柔性糕点、刚体对照物与材质梯度同场渲染。Isaac Sim 单帧离线渲染 · 2400×1500。",
          w: 2000,
          h: 1250,
        },
      },
      {
        id: "physrep",
        nameZh: "物理交互表征",
        nameEn: "Physical Interaction Representation",
        question:
          "具身智能需要理解动作的物理后果。能否从真实可观测的交互中建立物理表征，并检验它能否预测未见交互下的运动、形变、接触、滑移乃至损坏？",
        goal: "从初始观测与已知交互学习交互驱动的物理表征，再对严格分离的新交互预测响应并与真实比较。验收标准不是参数误差本身，而是能否跨作用方向、强度、工具与时间尺度预测新的物理后果。",
        wanted:
          "system identification · 3D / 4D 表征 · 多模态学习 · 可微分物理",
      },
      {
        id: "assets",
        nameZh: "物理资产管线",
        nameEn: "Physical Asset Pipeline",
        question:
          "生成一个更好看的 3D 模型不难。难的是：这些资产能否支持与真实环境一致的操作结果？",
        goal: "建立真实视频到场景空间恢复、资产生成与重建、physics manifest、仿真场景组合与 simulation validation 的端到端系统，并形成自动质检、失败诊断与版本化交付。",
        wanted:
          "3D 重建与生成 · Blender / Isaac Sim / MuJoCo · USD / URDF · 物理属性估计",
      },
    ],
  },
];

export const team = {
  intro:
    "我们是一支由研究者、机器人工程师与系统工程师组成的小团队，来自海内外高校与产业界，在北京工作。",
  body: "团队同时推进模型与基础设施两条线：一条走向能预测世界、能长期记忆、能在真机上闭环运行的策略；另一条走向可复现、可诊断、能被外部团队真正用起来的仿真、资产与评测系统。两条线互为验证——模型的进展要经得起评测系统的检验，评测系统的口径要经得起真机的检验。",
  // 我们尤其看重的四条，来自那份项目介绍原文
  values: [
    "把模糊方向收敛成可验证的问题",
    "真正下钻到代码、数据、实验与系统细节",
    "以证据而不是汇报判断进展",
    "写清楚假设、失败与下一步",
  ],
};

export const careers = {
  intro:
    "我们正在北京组建团队，也在持续招募实习生与研究合作者。下面不是一份标准 JD，而是一张问题地图：你可以先选择最感兴趣的方向，我们再安排对应项目负责人沟通。",
  note: "沟通前建议准备一页以内的材料：你最感兴趣的具体问题、你对它的初步判断、最相关的一段经历或作品，以及如果投入 4—8 周你会如何启动第一轮实验。",
  roles: [
    "Research Scientist",
    "Robotics Engineer",
    "Simulation Engineer",
    "Full-stack Engineer",
    "Research Intern",
  ],
  email: "hello@tuojing.ai",
};

export const footer = {
  ctaZh: "如果你也认为「仿真里有效」还不够，我们想和你聊聊。",
  location: "北京",
  year: "2026",
};
