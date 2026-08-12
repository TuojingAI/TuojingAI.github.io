/* 项目详情页内容。
   全部改写自 github.com/orgs/TuojingAI 各仓库的 README（Introduction / Benchmark Design /
   Task Suites / Method Overview / Main Results / Highlights），配图取自各仓库 assets 与
   SoftVTBench 项目站。数字与结论一律照搬原文，未做任何补充、外推或美化。 */
import csIntro from "../assets/projects/counterscene-intro.webp";
import csMethod from "../assets/projects/counterscene-method.webp";
import gdFramework from "../assets/projects/gaussiandream.webp";
import rdFramework from "../assets/projects/recondrive.webp";
import svGoalSafety from "../assets/projects/softvtbench-goal_vs_safety.webp";
import svMethod from "../assets/projects/softvtbench-method.webp";
import svTeaser from "../assets/projects/softvtbench-teaser.webp";

export type Figure = { src: string; label: string; caption: string };

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: { term: string; desc: string }[] }
  | { kind: "table"; head: string[]; rows: string[][]; note?: string }
  | { kind: "fig"; fig: Figure };

export type Project = {
  slug: string;
  title: string;
  titleEn: string;
  tag: string;
  date: string;
  /* 作者名单照抄 README 署名顺序，共同一作标 *，通讯标 ‡ */
  authors: string;
  lede: string;
  links: { label: string; href: string }[];
  hero?: Figure;
  body: Block[];
  status: string;
};

export const projects: Project[] = [
  {
    slug: "softvtbench",
    title: "SoftVTBench：柔性物体操作的视触觉安全基准",
    titleEn:
      "A Safety-Aware Visuo-Tactile Benchmark for Physically Constrained Robotic Manipulation of Deformable Objects",
    tag: "Benchmark",
    date: "2026 年 7 月",
    authors:
      "荆博文*、王明鑫*、郝瑞阳、葛晨晨、沈瀚文、何俊杰、崔杨、侯逸鸣、周炜韬‡、王嘉伟、李明磊、张丹丹、赵鼎、刘厚德、李小凡、刘偲、罗平、俞海宝‡（* 共同第一作者　‡ 通讯作者）",
    lede: "把「完成任务」和「没有把东西弄坏」拆成两件事来衡量。它会揪出那些达成了目标、却在过程中滑落、掉落或过度挤压物体的轨迹。",
    links: [
      { label: "arXiv 2607.04234", href: "https://arxiv.org/abs/2607.04234" },
      { label: "代码", href: "https://github.com/TuojingAI/SoftVTBench" },
      {
        label: "数据集",
        href: "https://huggingface.co/datasets/Arthur12137/SoftVTBench",
      },
      { label: "项目站", href: "https://softvtbench.github.io/" },
    ],
    hero: {
      src: svTeaser,
      label: "OVERVIEW",
      caption: "SoftVTBench 总览",
    },
    status: "代码与数据集已开源",
    body: [
      {
        kind: "p",
        text: "柔性物体操作要的不只是把末端送到目标位姿。策略必须把接触力控制得足够紧，才不会打滑；同时又不能大到让物体产生过度形变。SoftVTBench 把这个区别显式地做进了评测里。",
      },
      { kind: "h", text: "两个指标，而不是一个" },
      {
        kind: "fig",
        fig: {
          src: svGoalSafety,
          label: "GOAL VS SAFETY",
          caption: "目标达成与物理安全是两件事：达成目标的轨迹里，仍有相当一部分把物体弄坏了",
        },
      },
      {
        kind: "list",
        items: [
          { term: "Goal Success", desc: "该次轨迹满足任务目标。" },
          {
            term: "Safety Success",
            desc: "在达成目标的前提下，还要没有掉落物体，且峰值形变低于该物体经标定的专属阈值。",
          },
        ],
      },
      {
        kind: "p",
        text: "Safety Success 只在柔性套件上报告。NoDrop 属于安全定义的一部分，但不作为单独的头条指标呈现。",
      },
      { kind: "h", text: "怎么搭的" },
      {
        kind: "fig",
        fig: {
          src: svMethod,
          label: "BENCHMARK DESIGN",
          caption: "Isaac Sim + FEM 柔性体 + Franka Panda + GelSight Mini 触觉传感器",
        },
      },
      {
        kind: "p",
        text: "SoftVTBench 建在 Isaac Sim 上，柔性物体用 FEM 仿真，本体是装了 GelSight Mini 触觉传感器的 Franka Panda。策略观测在 20 Hz 上同步；特权 FEM 状态只给评测器使用，永远不提供给策略。",
      },
      { kind: "h", text: "四个成对任务套件" },
      {
        kind: "table",
        head: ["套件", "物体类型", "变化轴", "目的"],
        rows: [
          ["Object-Rigid", "刚体", "物体身份", "在没有形变约束的条件下衡量以物体为中心的操作能力"],
          ["Spatial-Rigid", "刚体", "空间布局", "衡量对位置与布局变化的鲁棒性"],
          [
            "Object-Soft",
            "柔性",
            "物体身份与柔顺度",
            "要求完成抓取放置，同时避免掉落与过度形变",
          ],
          [
            "Spatial-Soft",
            "柔性",
            "空间布局",
            "在安全柔性操作之上，加入空间变化与视觉上高度相似的干扰物",
          ],
        ],
        note: "公开版包含四个成对任务套件、33 个资产与多样化的桌面场景。",
      },
    ],
  },

  {
    slug: "gaussiandream",
    title: "GaussianDream：机器人操作的前馈式 3D 高斯世界模型",
    titleEn: "A Feed-Forward 3D Gaussian World Model for Robotic Manipulation",
    tag: "World Model",
    date: "2026 年 5 月",
    authors:
      "张梓健、蒋雨清、程谦、李小凡、刘偲、赵鼎、罗平、周炜韬、俞海宝",
    lede: "把 3D 高斯世界模型接进机器人操作：让策略在一个可渲染、可预测的三维表示上做决策，而不是只看二维画面。",
    links: [
      { label: "arXiv 2605.20752", href: "https://arxiv.org/abs/2605.20752" },
      { label: "代码", href: "https://github.com/TuojingAI/GaussianDream" },
    ],
    hero: {
      src: gdFramework,
      label: "FRAMEWORK",
      caption: "GaussianDream 框架",
    },
    status: "代码已发布，权重与数据待发布",
    body: [
      {
        kind: "p",
        text: "GaussianDream 是一个面向机器人操作的前馈式 3D 高斯世界模型。核心实现放在 gaussiandream Python 包里，checkpoint 与 config 的命名沿用上游 OpenPI 的约定，保持兼容。",
      },
      { kind: "h", text: "三条评测路径" },
      {
        kind: "list",
        items: [
          {
            term: "真机 / 运行时",
            desc: "围绕共享策略服务端与 gaussiandream-client 构建。",
          },
          { term: "LIBERO", desc: "仿真评测，见 examples/libero/。" },
          { term: "RoboCasa", desc: "仿真评测，见 examples/robocasa/。" },
        ],
      },
      {
        kind: "p",
        text: "仓库已包含高斯渲染所需的源码依赖 third_party/AD-FFgsStudio；数据集、checkpoint、仿真资产、渲染输出与实验日志等大文件不随仓库分发，需另行准备。",
      },
    ],
  },

  {
    slug: "counterscene",
    title: "CounterScene：世界模型中的反事实因果推理",
    titleEn:
      "Counterfactual Causal Reasoning in Generative World Models for Safety-Critical Closed-Loop Evaluation",
    tag: "Safety",
    date: "2026 年 3 月",
    authors: "荆博文*、郝瑞阳*、周炜韬‡、俞海宝‡（* 共同第一作者　‡ 通讯作者）",
    lede: "不做随机扰动，而是先找出那个「正在维持安全」的关键交通参与者，再对它施加最小干预——把一个安全场景变成真实可信的安全攸关交互，同时保持周围多智能体动态的一致性。",
    links: [
      { label: "arXiv 2603.21104", href: "https://arxiv.org/abs/2603.21104" },
      { label: "代码", href: "https://github.com/TuojingAI/CounterScene" },
    ],
    hero: {
      src: csIntro,
      label: "OVERVIEW",
      caption:
        "把一个观测到的安全交通场景，通过干预因果关键参与者，变成真实可信的安全攸关交互",
    },
    status: "论文已上 arXiv，代码、权重与评测脚本待发布",
    body: [
      { kind: "h", text: "四个组成部分" },
      {
        kind: "fig",
        fig: { src: csMethod, label: "FRAMEWORK", caption: "CounterScene 框架" },
      },
      {
        kind: "list",
        items: [
          {
            term: "因果对抗智能体选择",
            desc: "找出当前行为压制了最大潜在风险的那个参与者。",
          },
          {
            term: "因果交互图（CIG）",
            desc: "对参与者之间冲突敏感的依赖关系建模。",
          },
          {
            term: "反事实引导",
            desc: "扩散过程中只扰动被选中的那条轨迹。",
          },
          {
            term: "闭环推演",
            desc: "其余参与者自然反应，保持真实的多智能体动态。",
          },
        ],
      },
      { kind: "h", text: "主要结果" },
      {
        kind: "p",
        text: "在 nuScenes 上，CounterScene 取得了比既有基线更好的真实性—有效性折中。下表为 5 秒预测视野下与各主要基线的代表性对比。",
      },
      {
        kind: "table",
        head: ["方法", "ADE ↓", "FDE ↓", "OOR", "HBR", "CR ↑"],
        rows: [
          ["CTG", "1.245", "2.977", "0.3%", "1.6%", "1.0%"],
          ["VAE", "1.497", "3.597", "0.5%", "0.2%", "6.0%"],
          ["STRIVE", "1.215", "3.078", "0.5%", "0.1%", "6.0%"],
          ["CTG++", "1.273", "3.190", "0.2%", "1.1%", "1.0%"],
          ["CCDiff", "0.924", "2.421", "1.2%", "1.5%", "3.0%"],
          ["CounterScene", "0.731", "1.967", "1.1%", "2.0%", "11.0%"],
        ],
        note: "数据取自仓库 README 的 Main Results（5s horizon）。ADE / FDE 衡量轨迹真实性，CR 为碰撞率。",
      },
    ],
  },

  {
    slug: "recondrive",
    title: "ReconDrive：自动驾驶场景的前馈式 4D 高斯重建",
    titleEn:
      "Fast Feed-Forward 4D Gaussian Splatting for Autonomous Driving Scene Reconstruction",
    tag: "Reconstruction",
    date: "2026 年 2 月",
    authors:
      "俞海宝、肖坤涛、王嘉航、郝瑞阳、胡国然、黄宇欣、秦海芳、荆博文、薄云天、罗平",
    lede: "把 3D 基础模型扩展为快速、高保真的 4D 高斯泼溅生成框架，通过高效重建与新视角合成，为自动驾驶的真实闭环评测铺一条可规模化的路。",
    links: [
      { label: "arXiv 2603.07552", href: "https://arxiv.org/abs/2603.07552" },
      { label: "代码", href: "https://github.com/TuojingAI/ReconDrive" },
      {
        label: "Checkpoint",
        href: "https://huggingface.co/TuojingAI/ReconDrive",
      },
    ],
    hero: {
      src: rdFramework,
      label: "FRAMEWORK",
      caption: "ReconDrive 框架",
    },
    status: "2026 年 2 月 23 日开源，代码与 checkpoint 已发布",
    body: [
      {
        kind: "p",
        text: "ReconDrive 是一个前馈式框架，把 3D 基础模型扩展到快速、高保真的 4D 高斯泼溅生成。这个原型确立了一条可规模化的路径：通过高效重建与新视角合成，走向自动驾驶的真实闭环评测。",
      },
      {
        kind: "p",
        text: "它是这条路线的起点——先把真实世界变成可重放、可换视角的场景，后面的生成、行动与评测才有立足之地。",
      },
    ],
  },
];

export function findProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}
