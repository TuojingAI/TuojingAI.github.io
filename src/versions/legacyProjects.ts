/* 项目详情页内容。全部改写自各项目对应的论文本身，不再取自 GitHub README。
   - SoftVTBench 只取自本地 LaTeX 源码（main.tex 与 sec/*.tex），正文、数字与全部
     配图都来自这一份；arXiv 2607.04234 是更早的 Workshop 版，标题与统计口径都不同，
     只作为链接出现且已标注版本，不参与正文
   - GaussianDream / CounterScene / ReconDrive 取自各自的 arXiv 全文
   每一个数字、每一张表都逐位回溯到原文的表或章节，未做四舍五入、单位换算或补全。
   论文自陈的 caveat 与 limitation 一并保留 —— 页面宁可短，不要有一个推测出来的数。
   作者一律用论文的英文原名与署名顺序，共同一作标 *，通讯标 ‡。 */
import csIntro from "../assets/projects/counterscene-intro.webp";
import csMethod from "../assets/projects/counterscene-method.webp";
import gdFramework from "../assets/projects/gaussiandream.webp";
import rdFramework from "../assets/projects/recondrive.webp";
import svRollouts from "../assets/projects/softvtbench-rollouts.webp";
import svMethod from "../assets/projects/softvtbench-method.webp";
import svOod from "../assets/projects/softvtbench-ood.webp";
import svTactile from "../assets/projects/softvtbench-tactile.webp";
import svTeaser from "../assets/projects/softvtbench-teaser.webp";
import r2srPoster from "../assets/media/real2simready-poster.webp";
import r2srFilm from "../assets/media/real2simready.mp4";

export type Figure = { src: string; caption: string };
export type Video = {
  src: string;
  poster: string;
  /* 视频不一定需要图注 —— 没有就不渲染 figcaption，避免留一段空白边距 */
  caption?: string;
};

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: { term: string; desc: string }[] }
  | { kind: "table"; head: string[]; rows: string[][]; note?: string }
  | { kind: "fig"; fig: Figure }
  | { kind: "video"; video: Video };

export type Project = {
  slug: string;
  title: string;
  titleEn: string;
  tag: string;
  date: string;
  /* 论文型项目才有作者与机构；内部管线页没有署名，字段留空即不渲染 */
  authors?: string;
  /* 机构按论文的编号顺序排列，去重后用 · 分隔 */
  affiliations?: string;
  /* 外部收录。venue 是会扫光的那段，venueNote 是跟在后面的限定，不扫光 */
  venue?: string;
  venueNote?: string;
  /* 合作方。片尾卡上署了名，页面就得对得上 */
  collab?: string;
  lede: string;
  links?: { label: string; href: string }[];
  hero?: Figure;
  body: Block[];
  status: string;
};

export const projects: Project[] = [
  {
    /* 内部管线，不是论文。页面内容全部是这条 80 秒演示片里可以看到的东西；
       片中烧录的读数（局部压缩率、质量回复率）不在正文复述 —— 它们的口径
       没有公开定义，写成文字就变成了无从核对的主张。 */
    slug: "real2simready",
    title: "Real2SimReady：从一次人类演示到可执行的仿真世界",
    titleEn:
      "From One Handheld Human Demonstration to a Physics-Ready Simulated World",
    tag: "Pipeline",
    date: "2026 年 8 月",
    lede: "操作者手持 UMI 夹爪，自然地把任务做一遍。管线把这一次采集还原成与真实环境几何对齐的可交互仿真世界，再从中派生出多条候选轨迹、多套背景与光照，交付可直接用于训练与评测的仿真资产。",
    collab: "SIMPLE·AI × The University of Hong Kong × Tuojing Intelligence",
    status: "内部管线，持续建设中",
    body: [
      {
        kind: "p",
        text: "机器人操作的瓶颈不在模型，在数据。遥操作采一条轨迹的成本很高，而采回来的轨迹只对应一种执行方式、一套本体、一个物理条件。换一个夹爪、换一个初始摆放、换一个软硬程度，这条数据的价值就大幅衰减。",
      },
      {
        kind: "p",
        text: "Real2SimReady 想换一个起点：让人手持夹爪把任务自然地做一遍，剩下的交给管线。这一次演示先被还原成一个与真实环境几何对齐的仿真世界，然后在这个世界里派生出多条候选动作序列，并行推演、互相比较，最后留下一条可以直接执行的。数据的单位从「一条轨迹」变成「一个可反复推演的世界」。",
      },
      { kind: "h", text: "演示片" },
      {
        kind: "video",
        video: {
          src: r2srFilm,
          poster: r2srPoster,
        },
      },
      { kind: "h", text: "片子里的七段" },
      {
        kind: "list",
        items: [
          {
            term: "一次真实 UMI 采集",
            desc: "操作者手持 UMI 夹爪自然地把任务做一遍。这一次采集直接进入仿真，中间不经过遥操作台，也不需要在采集时就想好机器人会怎么做。",
          },
          {
            term: "改变观察视角",
            desc: "换一个相机位看同一个场景，几何保持一致。这一步是在验证重建出来的是一个三维场景，而不是一段只在原始视角下成立的画面。",
          },
          {
            term: "场景与动作，同帧对应",
            desc: "真实画面与仿真画面逐帧并排。对得上的不只是物体摆放，还有手的动作 —— 这决定了后面派生出来的轨迹是不是从同一个起点长出来的。",
          },
          {
            term: "真实交互：软硬分类",
            desc: "同一个场景里左碗是刚体、右碗是可形变体，接触时的响应不一样。真实世界不只有刚体，把这件事做进物理属性而不是只做进外观，是这条管线与纯视觉重建的分界。",
          },
          {
            term: "一次采集，多条候选轨迹",
            desc: "以录制的那条 UMI 轨迹为基准，派生出多条候选执行方式。示范给的是目标和约束，不是唯一答案。",
          },
          {
            term: "一次采集，重配背景与光线",
            desc: "同一段交互换背景、换光照、换材质，批量铺开。这是把一次采集放大成一个分布，也是策略在真机上遇到没见过的房间时唯一的准备方式。",
          },
          {
            term: "一次采集，完整仿真输出",
            desc: "以上全部由管线自动产出，交付的是可以直接拿去训练与评测的仿真资产，而不是一段录像。",
          },
        ],
      },
      { kind: "h", text: "机器人数据的经济学" },
      {
        kind: "p",
        text: "一个语言模型的单次预训练可以吃掉 15.6 万亿个 token（Llama 3）。机器人这一侧的数量级完全不同。DROID 是 76,000 条演示、350 小时交互数据；目前公开的最大单体真机数据集 AgiBot World 超过 100 万条轨迹、217 个任务；把全领域的公开数据池化起来，Open X-Embodiment 收录了 21 家机构、22 种本体、527 项技能，量级仍停在百万条轨迹。Physical Intelligence 在 π0 的博文里把这件事写成一句话：There is no such treasure trove of robot data.",
      },
      {
        kind: "p",
        text: "Fei-Fei Li 在 2025 年 11 月的 From Words to Worlds 里写，今天的大语言模型 remain wordsmiths in the dark; eloquent but inexperienced, knowledgeable but ungrounded，并直接指出 unlike language models, training data is scarce for today's robotic research。她给出的三个数据来源是互联网数据、合成仿真、以及真人演示的真实采集。更早在 TED2024，她的说法是 Simply seeing is not enough. Seeing is for doing and learning.",
      },
      {
        kind: "p",
        text: "NVIDIA 对同一个问题的表述是 GR00T N1 论文里的数据金字塔：底层是网络数据与人类视频，中层是物理仿真生成的合成数据，顶层是真机上采的数据；自下而上数量递减，与具体本体的绑定递增。World Labs 在 2026 年 6 月的世界模型功能分类学里把世界模型拆成 renderer、simulator、planner 三类，并写道 the simulator gets the least public attention, and is the most consequential of the three。两种表述指向同一层：把少量真实交互放大成可训练、可评估的东西。Real2SimReady 做的是这一层里的一段。",
      },
      { kind: "h", text: "仿真买到的到底是什么" },
      {
        kind: "list",
        items: [
          {
            term: "可复制",
            desc: "一次采集反复使用。DeepMind 的 DemoStart 给过一组直白的对照：同一个插接任务，在仿真里采 20 条演示约需半小时，而在真机上遥操作采到同等可用的数据用了 2,753 条轨迹、约 27 小时不间断操作。",
          },
          {
            term: "可扰动",
            desc: "位姿、干扰物、外部推挤可以按档位施加。MIT 的 RialTo 把真实场景扫描成数字孪生、在仿真里加固后回到真机，三档扰动下八任务平均 91% / 77% / 75%；同样起点、15 条演示的行为克隆基线是 25% / 11% / 5%。",
          },
          {
            term: "可评测",
            desc: "仿真可以当策略的筛选器，但要的是保序不是绝对值。SIMPLER 在六个通用策略上测得仿真与真机的排序相关性 Pearson 平均 0.924，同时说明即使做满视觉对齐，抽屉任务的真机与仿真成功率仍差 13.6 个百分点。",
          },
          {
            term: "可承受失败",
            desc: "在仿真里失败没有成本。RialTo 的消融显示，纯从零强化学习的策略会学会利用仿真器的建模误差，例如借铰链位置误差从底部顶开烤面包机，五个任务里有三个真机成功率为 0。这类失败必须在离硬件足够远的地方发生。",
          },
        ],
      },
      {
        kind: "p",
        text: "同样要说清楚仿真不解决什么。Berkeley 的 HIL-SERL 在十三个接触密集任务上全程不用仿真，直接在真机上做人在环强化学习，多数任务一到两个半小时训到 100% 成功率，单张消费级显卡即可；Physical Intelligence 公开的 π0.5 与 π*0.6 两篇博客里，simulation 一词一次都没有出现。所以结论应当是收窄的：在单一固定工位、有夹具、能自动判定成功的场景里，直接在真机上练很可能更划算。real2sim 的价值落在规模、变体、评测，以及那些在真机上做不起或不安全的情况，而不落在「比真机训练便宜」。",
      },
      { kind: "h", text: "real2sim2real：环闭上才是判据" },
      {
        kind: "p",
        text: "几何对齐不等于物理对齐。NVIDIA 对 SimReady 的定义里第一句就是，仅有视觉准确的三维资产是不够的，质量、摩擦、惯量张量、碰撞体都属于资产定义本身。Digital Cousins 给过一个方向相反、但更值得记住的实测：用目标柜子的精确数字孪生训练的策略，仿真里 100%、真机上只有 25%；用自动匹配的近似资产训练的，仿真 94%、真机 90%。RialTo 的消融方向恰恰相反，针对性重建远好于替换成大量合成资产。也就是说「重建越精确越好」和「多样性越大越好」这两句话各自都有论文反对，这个领域内部还没有共识。",
      },
      {
        kind: "p",
        text: "唯一站得住的推论因此只有一条：策略必须回到硬件上验。TRANSIC 在四个家具装配任务上真机每格 20 次试验、最终均值 81.25%，而不做任何补救、把仿真策略直接迁移过去的对照只有 11.25%。这类真机评测普遍每格只有 10 到 20 次试验，20 次上的 90% 与 95% 不构成差别；NVIDIA Research 在 2026 年 7 月也算过这笔账 —— 在 90% 成功率附近，70 次 rollout 的 95% 置信区间宽达 15.4 个百分点。一个永远不回到硬件的数字孪生，本质上只是图形学。",
      },
      {
        kind: "p",
        text: "接触与形变是这个环最难闭的地方。MuJoCo 官方文档承认 3.0 之前它本质上是刚体仿真器；NVIDIA 在 Isaac Sim 5.0 把原有 deformable body 标记为弃用并重建了这条 API；Omniverse PhysX 的可形变体仍标 Beta，限制清单里包含体可形变与面可形变均不支持静摩擦。已发表的可形变闭环成果高度集中在布料、绳索这类薄壳与线性物体上，体积型软体在接触、压缩、回弹上的公开真机成功率，我们这一轮检索没有找到可引用的数字。Real2SimReady 把可形变放进管线，是因为要交付的任务里有会变形的东西 —— 这是方向陈述，我们没有可以对外公布的闭环实测结果。",
      },
      { kind: "h", text: "这条路上已有的工作" },
      {
        kind: "list",
        items: [
          {
            term: "UMI（2024-02）",
            desc: "手持夹爪采集是这篇论文确立的公开做法，也给出了选择这条路的量化理由：在杯子摆放任务上，手持夹爪的采集速度比遥操作快三倍以上。Real2SimReady 的第一段沿用这条思路，不是另起一条。",
          },
          {
            term: "MimicGen / DexMimicGen（2023-10 / 2024-10）",
            desc: "从约 200 条人类演示生成 5 万余条。这条线后来成为 NVIDIA 的 Isaac GR00T-Mimic 与合成运动生成 Blueprint。",
          },
          {
            term: "Digital Cousins / ACDC（2024-10，Fei-Fei Li 为末位作者）",
            desc: "论证逐点几何对齐的数字孪生成本高且不产生跨域泛化，提出保留 affordance 的变体。几何对齐本身不是目的，用途决定它值不值得。",
          },
          {
            term: "Real2Render2Real（2025-05，Berkeley）",
            desc: "手机扫描加一条人类演示，派生大量训练数据并在真机上验证。它明确不做动力学仿真，这也是与本管线的实际分界：我们的第五段与第七段都发生在仿真里。",
          },
          {
            term: "TwinAligner（2025-12）",
            desc: "标题里就写着 Real2Sim2Real，同时处理视觉与动力学两侧的对齐，仿真训练后真机零样本。这条路线已经有人走通并交了真机数字。",
          },
          {
            term: "SimFoundry（2026-06，斯坦福与 NVIDIA 合著）",
            desc: "从单段视频零样本重建 sim-ready 数字孪生并自动派生变体，报告仿真评估预测真机表现的平均 Pearson 相关系数 0.911。sim-ready 是 NVIDIA Omniverse 生态里已有的资产术语，不是谁新提出的概念。",
          },
          {
            term: "World Labs 的 R2S2R（2026-07）",
            desc: "从一个真实任务重建可交互仿真，系统性变化外观、物体摆放、杂乱度、物理、机器人状态与相机视角，再在其中训练与评估策略；公开演示已覆盖线缆走线与弹性线缆插接等可形变任务。",
          },
        ],
      },
      {
        kind: "p",
        text: "把这些摆出来是为了说清位置。Real2SimReady 的七段流程里没有一段是我们最先提出的，real-to-sim-to-real 早就是一个有名字的成熟方向，参与者里有斯坦福、NVIDIA、Berkeley、MIT，而且这几家彼此之间是合作关系而不是对立阵营 —— SimFoundry 的作者名单里同时有 Fei-Fei Li 和 NVIDIA GEAR 的核心成员。我们选择的路径是把手持夹爪的一次演示、与真实工位对齐的重建、候选动作的并行推演与比较，组织成一次可交付的技能。差异在输入形态与交付物，不在能力对比；这条管线目前没有公开的量化结果，所以这一节不给任何成功率、保序性或迁移能力的数字。",
      },
    ],
  },

  {
    slug: "softvtbench",
    title: "SoftVTBench：可形变物体操作的视触觉数据集与形变感知评测",
    titleEn:
      "A Deformation-Aware Visuo-Tactile Dataset and Benchmark for Deformable-Object Manipulation",
    tag: "Benchmark",
    date: "2026 年 7 月",
    venue: "ECCVW 2026 Oral",
    venueNote: "Workshop 版",
    authors:
      "Bowen Jing*, Mingxin Wang*, Ruiyang Hao, Chenchen Ge, Hanwen Shen, Junjie He, Yang Cui, Yiming Hou, Weitao Zhou‡, Jiawei Wang, Minglei Li, Dandan Zhang, Ding Zhao, Houde Liu, Xiaofan Li, Si Liu, Ping Luo, Haibao Yu‡（* equal contribution　‡ corresponding author）",
    affiliations:
      "Tuojing Intelligence · Tsinghua University · King's College London · Southeast University · Stevens Institute of Technology · The Hong Kong University of Science and Technology (Guangzhou) · University of Manchester · Simple AI · Imperial College London · Carnegie Mellon University · Zhejiang University · Beihang University · The University of Hong Kong",
    lede: "把策略可见的接触观测与仅评测方可见的有限元物理状态分开记录，用逐物体标定的形变容差定义 Deformation-aware Success Rate（DSR）：一条 rollout 只有既完成任务、又全程未超出形变容差，才算成功。",
    links: [
      {
        label: "arXiv 2607.04234（Workshop 版）",
        href: "https://arxiv.org/abs/2607.04234",
      },
      { label: "代码", href: "https://github.com/TuojingAI/SoftVTBench" },
      {
        label: "数据集",
        href: "https://huggingface.co/datasets/Arthur12137/SoftVTBench",
      },
      { label: "项目站", href: "https://softvtbench.github.io/" },
    ],
    hero: {
      src: svTeaser,
      caption:
        "4,000 条专家演示，四个诊断性套件，50 个以上资产，包括体积式可形变物体与外观匹配的刚体孪生。下方分别是受控的视觉与物理分布偏移、从易滑脱的松抓到过度压缩的物理交互区间，以及同步的视觉、触觉、本体、语言与动作流。",
    },
    status: "代码与数据集已开源",
    body: [
      {
        kind: "p",
        text: "可形变物体操作要的不只是把物体送进目标区域。抓得太松会滑脱，抓得太紧则会把物体压出不可接受的形变，而任务成功这一个指标把这两种情况和一次稳定、轻柔的操作记成同一个结果。视觉能提供接近物体和抵达目标所需的场景信息，但夹爪与物体的接触界面恰恰在接触发生的时刻被遮挡。触觉补的就是这一段：触觉图像与 marker 位移直接记录接触几何、剪切、滑移与局部压缩。SoftVTBench 把这两件事同时做进数据与评测：触觉告诉策略接触正在如何演化，有限元（FEM）状态告诉评测方这次接触对物体做了什么。",
      },
      { kind: "h", text: "与已有基准的位置" },
      {
        kind: "table",
        head: [
          "基准",
          "完整任务",
          "3D 可形变",
          "策略可见触觉",
          "物理真值",
          "形变感知评测",
        ],
        rows: [
          ["LIBERO", "✓", "✗", "✗", "✗", "✗"],
          ["ManiSkill2", "✓", "✓", "✗", "✓", "✗"],
          ["SoftGym", "✓", "◐", "✗", "✓", "✗"],
          ["MoDeSuite", "✓", "◐", "✗", "✓", "✗"],
          ["DefGraspSim", "✗", "✓", "✗", "✓", "✓"],
          ["SoGraB", "✗", "✓", "✗", "✓", "✓"],
          ["VTDexManip", "✓", "✗", "✓", "✗", "✗"],
          ["ManiFeel", "✓", "✗", "✓", "✗", "✗"],
          ["Tabero", "✓", "✗", "✓", "✗", "◐"],
          ["SoftVTBench", "✓", "✓", "✓", "✓", "✓"],
        ],
        note: "论文 Table 1。✓ 为完整支持，◐ 为部分支持，✗ 为不支持。已有工作要么做完整任务但没有物理真值，要么有物理真值但只做抓取片段而非完整任务。",
      },
      { kind: "h", text: "数据集构成" },
      {
        kind: "p",
        text: "数据集包含 4,000 条专家演示，覆盖 40 个 pick-and-place 任务，分属四个套件，每个套件 10 个任务、1,000 条演示，每个任务 100 条。可形变资产共 10 个：6 个烘焙风格网格与 4 个程序化生成的几何基元。每个可形变物体都有一个刚体孪生，网格、贴图、质量一致，刚度被调高到任何可达抓取下形变都可忽略；孪生任务复用对应的布局与语言指令。加上桌面、地面、柜体、容器与刚体干扰物，场景资产总数超过 50。摆放区域改编自 LIBERO。",
      },
      {
        kind: "table",
        head: [
          "套件",
          "物体类型",
          "变化轴",
          "任务数",
          "演示数",
          "ID 评测 episode",
          "OOD 条件数",
        ],
        rows: [
          ["Object-Soft", "可形变", "物体身份", "10", "1,000", "500", "9"],
          ["Spatial-Soft", "可形变", "空间布局", "10", "1,000", "500", "9"],
          ["Object-Rigid", "刚体孪生", "物体身份", "10", "1,000", "500", "—"],
          ["Spatial-Rigid", "刚体孪生", "空间布局", "10", "1,000", "500", "—"],
          ["合计", "—", "—", "40", "4,000", "2,000", "—"],
        ],
        note: "四个套件构成物体类型 × 变化轴的 2×2 匹配设计。OOD 评测只施加在两个可形变套件上，共九个单因子条件。",
      },
      {
        kind: "p",
        text: "四个套件是一组诊断性对照。Object 套件固定场景布局、更换被操作物体，考的是对几何、柔度与接触面的适应；Spatial 套件在同一场景里放两个外观完全相同的实例，只靠语言指令指认目标，考的是在共享物理布局下的指代落地。底层的 pick-and-place 技能保持不变，所以差异可以归到物体类型或变化轴，而不是换了一种操作技能。",
      },
      { kind: "h", text: "记录了什么" },
      {
        kind: "list",
        items: [
          {
            term: "多视角 RGB",
            desc: "第三人称 1024×1024 与腕部 512×512，统一缩放到 224×224。",
          },
          {
            term: "双指触觉",
            desc: "每根手指一张 320×240 触觉 RGB 图与一个 11×9 的 marker 位移场（每指 99 个 marker）。由 TacEx 渲染 GelSight Mini，Taxim 负责光学接触外观，FOTS 负责 marker 运动。",
          },
          {
            term: "本体与语言",
            desc: "末端位姿、机械臂关节状态、当前夹爪宽度，以及自然语言指令。",
          },
          {
            term: "动作",
            desc: "绝对末端位姿目标（3D 位置 + 3D 轴角）加夹爪指令。夹爪动作同时存二值开合命令与连续闭合目标两种编码，因此观测模态与控制粒度可以交叉，不必重采数据。",
          },
          {
            term: "仅评测可见的物理状态",
            desc: "FEM 节点位置、物体位姿、接触事件、掉落事件。与观测一同落盘，但在训练与评测时都不暴露给策略，只由数据筛选流程和评测器读取。",
          },
        ],
      },
      {
        kind: "fig",
        fig: {
          src: svTactile,
          caption:
            "十个可形变资产上的触觉观测。底图是 GelSight Mini 的触觉 RGB，箭头是 marker 相对未接触基准的位移场 —— 接触斑块的位置、面积与剪切方向都写在这张图里，而第三人称与腕部相机在夹爪闭合的那一刻恰好看不到这里。",
        },
      },
      {
        kind: "p",
        text: "实现基于 Isaac Sim 4.5.0 与 Isaac Lab 0.41.3，走 PhysX 5 GPU 管线。物理以 60 Hz 步进，decimation 为 3，得到 20 Hz 的控制与记录频率；所有视觉、触觉、本体、动作与物理状态流都在这个频率上同步。每条轨迹先在物理下执行一次，再从存下的 replay 渲染，因此没有任何一路信号被重采样或插值到另一路的时间轴上。机器人是 Franka 机械臂加 Panda 平行夹爪，任务空间微分逆运动学控制，手指摩擦静态 1.5、动态 1.2。FEM 用 PhysX 软体的共旋线性弹性，hex 分辨率 6，64 次位置迭代，阻尼 2.5。采集与评测跑在 4 张 NVIDIA L20 上，训练在 A100-80GB 上。",
      },
      { kind: "h", text: "形变怎么量，阈值怎么定" },
      {
        kind: "p",
        text: "每个可形变资产都是体积式 FEM 网格，仿真器跟踪其全部内部节点。形变定义为去掉刚体运动后的节点 RMS 位移峰值，再按初始包围盒对角线归一化。去刚体运动是为了把「被搬运」和「被挤压」分开，按尺寸归一化是为了让一毫米的压缩在一个小面包和一个大面包上意味着同一件事。这个量从仅评测可见的仿真状态算出，不由策略观测反推，在刚度调高的孪生体上可忽略。",
      },
      {
        kind: "p",
        text: "标定在策略训练之前完成，用的是脚本化的抓-提-保持流程，把夹爪闭合量从松扫到紧。第一个能反复稳定持物不滑的闭合量定义为 g_min；形变容差 τ 取稳定抓取下位移峰值的第 90 百分位；g_max 是仍落在该容差内的最紧闭合量。夹爪包络 [g_min, g_max] 约束专家采集，τ 提供评测判据。百分位是一个全局常数，一次固定、对所有资产同值，不能按物体或按方法调；由于发布的评测记录保存的是逐 episode 的 R_max 轨迹而非二值结果，换一个百分位重打分只是对已发布记录的重新聚合，不需要重跑 rollout。论文明确说明：该容差是仿真中形变合规的操作性评测判据，不是材料失效或真实世界的损伤阈值。",
      },
      {
        kind: "table",
        head: ["资产", "g_min", "g_max", "开口跨度 (mm)", "τ / 对角线 (%)"],
        rows: [
          ["soft_pastry001", "0.4000", "0.8000", "26.21", "7.6"],
          ["soft_pastry002", "0.6547", "0.6900", "2.56", "9.3"],
          ["soft_pastry003", "0.4400", "0.8000", "13.26", "8.6"],
          ["soft_pastry005", "0.4700", "0.5800", "5.87", "10.7"],
          ["soft_pastry010", "0.4200", "0.6600", "24.82", "8.3"],
          ["soft_pastry011", "0.4400", "0.5800", "10.63", "7.1"],
          ["soft_stw_cube_hq", "0.3200", "0.6200", "19.43", "11.2"],
          ["soft_stw_cuboid_hq", "0.3800", "0.4400", "10.95", "9.8"],
          ["soft_stw_cylinder_hq", "0.2900", "0.6600", "21.95", "9.8"],
          ["soft_stw_sphere_hq", "0.3700", "0.6300", "20.77", "9.7"],
        ],
        note: "十个可形变资产的交互安全区。g 值越大表示抓得越紧；跨度按采集卡记录的松/紧实测开口直接相减，不是由统一线性换算推出的。",
      },
      { kind: "h", text: "评测协议" },
      {
        kind: "p",
        text: "策略以 20 Hz 闭环执行，只拿到策略可见观测，输出绝对末端位姿目标与它训练时所用编码的夹爪指令。一个 episode 最多 300 个控制步，成功或掉落即提前终止。任务成功判据是纯运动学的：被指认的那个实例（而不是同类的另一个实例）静止在目标区域内，形变不进入这个判据。DSR 则要求 episode 既满足任务成功，又在全程内保持归一化形变峰值 R_max ≤ 1。论文把 DSR 作为主指标，TSR 只作诊断参考 —— 任务成功是 DSR 的一个组成部分，不是与之并列的第二个评测目标；TSR 与 DSR 之差正是「完成了任务但超出形变容差」的那部分 episode。在刚体套件上形变可忽略，DSR 与 TSR 重合。",
      },
      {
        kind: "p",
        text: "ID 评测每套件 500 个留出初始状态、每任务 50 个。OOD 用九个单因子条件，只施加在两个可形变套件上：dome light 强度从 135 改为 67.5、180、270；物体质量按 1.25、1.75、2.5 缩放；杨氏模量按 0.5、0.8、2.0 缩放。每个条件复用其 ID 参照的任务、初始状态与随机种子，只挪动一个参数；九个条件合计每套件每配置 900 个 episode，报告的是池化结果。",
      },
      {
        kind: "fig",
        fig: {
          src: svMethod,
          caption:
            "阶段一构建匹配的刚体-可形变物体并标定逐物体交互约束；阶段二生成受控任务，并把策略可见观测与仅评测可见的物理状态分开记录；阶段三做自动质检与人工核验，产出训练、ID 与 OOD 划分。任务成功与形变合规分别标注，DSR 在评测时把两者合并。",
        },
      },
      { kind: "h", text: "基线与主结果" },
      {
        kind: "p",
        text: "基线覆盖三个策略族：Diffusion Policy、π0.5、FastWAM，各自都有视觉-only（VO）与视触觉（VT）两个变体，分别对应从零训练、LoRA 适配的预训练视觉-语言-动作模型、以及世界-动作模型。所有配置都接收第三人称 RGB、腕部 RGB 与 7 维机器人状态，VT 变体额外接收双指触觉 RGB 与 marker 运动。π0.5 与 FastWAM 是语言条件的，Diffusion Policy 不是，因此在只靠指令区分两个相同实例的 Spatial 套件上，它的数字应被读作该限制设下的下界。所有配置在完全相同的 episode、初始状态与种子上评测；每个配置只训练一次，用固定 schedule 的最终 checkpoint，不做基于验证集的挑选。论文同时声明了一处 caveat：Diffusion Policy 与 FastWAM 的 VT 变体因触觉流增加了激活显存而使用更小的有效 batch（DP 128 对 256，FastWAM 128 对 192），所以它们的 VO-VT 对比刻画的是已发布的这两个变体，而不是隔离出的观测模态效应；只有 π0.5 的两个变体在全局 batch 256 上对齐。",
      },
      {
        kind: "table",
        head: [
          "模型",
          "输入",
          "Object-Soft TSR",
          "Object-Soft DSR",
          "Spatial-Soft TSR",
          "Spatial-Soft DSR",
        ],
        rows: [
          ["Diffusion Policy", "VO-C", "37.4", "33.6", "15.6", "13.4"],
          ["Diffusion Policy", "VT-C", "40.0", "30.4", "33.0", "25.0"],
          ["π0.5", "VO-C", "41.6", "38.4", "26.0", "22.6"],
          ["π0.5", "VT-C", "41.4", "35.0", "27.6", "22.0"],
          ["FastWAM", "VO-C", "62.0", "58.0", "37.0", "36.6"],
          ["FastWAM", "VT-C", "57.6", "54.4", "56.4", "56.0"],
        ],
        note: "两个可形变套件上的 in-distribution 结果（%）。十二个配置里 DSR 全部低于 TSR。在 N=500、成功率接近 40% 时，单个比率的保守 95% 区间约为 ±4.3 个百分点，两个比率之差约为 ±6.1 个百分点；这两个区间只刻画 episode 级的抽样不确定性，不包含跨训练轮次的波动（每个配置只训练一次）。更小的跨配置差异照报但不作为效应解释。",
      },
      {
        kind: "p",
        text: "十二个 in-distribution 配置全部存在完成任务却超出标定容差的 rollout，占各自成功 rollout 的 0.7% 到 24%。Diffusion Policy VT-C 的缺口最大：Object-Soft 上 9.6 个百分点、Spatial-Soft 上 8.0 个百分点，各相当于该配置成功 rollout 的 24%，由于 TSR 与 DSR 在同一批 rollout 上计算，这是 48 条与 40 条 episode 的精确计数，不是两个含噪估计之差。缺口的大小与策略族有关：Diffusion Policy 为 10%–24%，π0.5 为 8%–20%，FastWAM 只有 0.7%–6.5%。FastWAM 在两个 Spatial 配置上把 TSR 与 DSR 控制在 0.4 个百分点以内（500 条里的两条），同时拿到表中最强的 Spatial 结果。这说明两条评测轴对齐是可达的，而不是这个领域固有的代价。DSR 也确实会改结论：Object-Soft 上 TSR 把 Diffusion Policy 的 VT-C 排在 VO-C 之前（40.0% 对 37.4%），DSR 则把顺序反了过来（30.4% 对 33.6%）。判据本身是可达的 —— 2,000 条可形变物体演示的 R_max 中位数为 0.433、第 95 百分位为 0.713，没有一条演示超出其容差，所以学习策略里出现的越界不是从监督数据继承来的。",
      },
      {
        kind: "fig",
        fig: {
          src: svRollouts,
          caption:
            "三个可形变物体、跨 Object-Soft 与 Spatial-Soft 的示例 rollout，各行独立采样，不是同初始状态的配对比较。全部达成任务成功；蓝色满足标定容差，橙色在抓取阶段越过 R_t=1 并在搬运中持续偏高，最后的放置动作本身执行正确。第三人称与腕部视图难以区分这两类，marker 场与形变曲线可以。",
        },
      },
      { kind: "h", text: "刚体孪生：可形变性到底贵在哪" },
      {
        kind: "p",
        text: "刚体孪生用来防止把可形变套件上的全部难度都归给可形变性。在匹配了几何、外观、质量、布局与指令的六组 VO-C 对比中，只有三组超过了协议约 6.1 个百分点的分辨率：π0.5 在物体变化上从刚体到软体掉 18.4 个百分点、在空间变化上掉 24.4 个百分点，而 FastWAM 在空间变化上反而涨 12.0 个百分点。其余三组差异在 −2.6 到 +1.6 个百分点之间，在此分辨率下与无变化不可区分。可形变性并不施加一个统一的惩罚，其代价取决于策略族与任务结构。",
      },
      {
        kind: "table",
        head: [
          "模型",
          "输入",
          "物体变化 · 刚体",
          "物体变化 · 软体",
          "空间变化 · 刚体",
          "空间变化 · 软体",
        ],
        rows: [
          ["Diffusion Policy", "VO-C", "40.0", "37.4", "14.0", "15.6"],
          ["Diffusion Policy", "VT-C", "35.0", "40.0", "11.0", "33.0"],
          ["π0.5", "VO-C", "60.0", "41.6", "50.4", "26.0"],
          ["π0.5", "VT-C", "59.6", "41.4", "54.0", "27.6"],
          ["FastWAM", "VO-C", "64.0", "62.0", "25.0", "37.0"],
          ["FastWAM", "VT-C", "61.6", "57.6", "30.0", "56.4"],
        ],
        note: "刚体孪生与可形变套件的 TSR 对照（%）。两条 caveat：刚体套件上的 VT 行是从连续控制 checkpoint 解码二值夹爪执行的，不是原生训练的配置，只作旁证；Diffusion Policy 非语言条件，其空间变化两列是该限制设下的下界。",
      },
      { kind: "h", text: "感知与控制粒度的交叉" },
      {
        kind: "table",
        head: [
          "π0.5 配置",
          "Object-Soft TSR",
          "Object-Soft DSR",
          "Spatial-Soft TSR",
          "Spatial-Soft DSR",
        ],
        rows: [
          ["VO-B", "30.2", "27.2", "34.2", "20.0"],
          ["VO-C", "41.6", "38.4", "26.0", "22.6"],
          ["VT-B", "41.0", "28.0", "30.0", "21.4"],
          ["VT-C", "41.4", "35.0", "27.6", "22.0"],
        ],
        note: "VO/VT 为视觉-only 与视触觉输入，B/C 为二值与连续夹爪控制。两种夹爪编码都已随每条演示存下，因此这个交叉不需要重新采集数据。",
      },
      {
        kind: "p",
        text: "这组消融说明为什么在归因触觉收益之前必须先对齐动作空间。在 Object-Soft 上，从 VO-B 出发，单独换连续控制（VO-C）把 TSR 抬高 11.4 个百分点，单独加触觉（VT-B）抬高 10.8 个百分点，两者都上（VT-C）得到 41.4%，相对单独用连续控制没有改进。一个只比较 VO-B 与 VT-C 的实验，会把细粒度执行本身就能复现的收益记到触觉头上。形变轴上的分离更明显：VO-C 与 VT-B 的 TSR 只差 0.6 个百分点，DSR 却差 10.4 个百分点（38.4% 对 28.0%），VO-C 的成功里有 7.7% 越界，VT-B 是 31.7%。这个效应限于 π0.5，且与任务结构有关 —— 在 Spatial-Soft 上两项升级相对 VO-B 都降低了 TSR，与那里的瓶颈是目标指代而非接触调控相符。",
      },
      { kind: "h", text: "分布偏移下" },
      {
        kind: "table",
        head: [
          "模型",
          "输入",
          "Object-Soft TSR (Δ)",
          "Object-Soft DSR (Δ)",
          "Spatial-Soft TSR (Δ)",
          "Spatial-Soft DSR (Δ)",
        ],
        rows: [
          [
            "Diffusion Policy",
            "VO-C",
            "29.2 (−8.2)",
            "26.6 (−7.0)",
            "11.0 (−4.6)",
            "8.8 (−4.6)",
          ],
          [
            "Diffusion Policy",
            "VT-C",
            "31.2 (−8.8)",
            "25.0 (−5.4)",
            "25.2 (−7.8)",
            "17.8 (−7.2)",
          ],
          [
            "π0.5",
            "VO-C",
            "35.8 (−5.8)",
            "33.2 (−5.2)",
            "24.4 (−1.6)",
            "19.4 (−3.2)",
          ],
          [
            "π0.5",
            "VT-C",
            "41.0 (−0.4)",
            "34.2 (−0.8)",
            "28.4 (+0.8)",
            "23.2 (+1.2)",
          ],
          [
            "FastWAM",
            "VO-C",
            "54.4 (−7.6)",
            "53.8 (−4.2)",
            "27.8 (−9.2)",
            "27.2 (−9.4)",
          ],
          [
            "FastWAM",
            "VT-C",
            "55.8 (−1.8)",
            "55.8 (+1.4)",
            "39.4 (−17.0)",
            "38.8 (−17.2)",
          ],
        ],
        note: "九个留出条件池化后的 out-of-distribution 结果（%）。Δ 为相对同一模型、同一输入、同一套件的 in-distribution 条目的变化。",
      },
      {
        kind: "fig",
        fig: {
          src: svOod,
          caption:
            "三个策略族 × 三条偏移轴（光照、质量、杨氏模量）× 两个可形变套件的任务成功率。虚线为视觉-only（VO-C），实线为视触觉（VT-C），竖线标出 in-distribution 参照点。",
        },
      },
      {
        kind: "p",
        text: "分布偏移下，视触觉变体的优势是最一致的：VT-C 在全部六组策略-套件对比中 TSR 都高于 VO-C，DSR 在其中五组更高，唯一例外是 Object-Soft 上的 Diffusion Policy。单个 margin 有的很小，但方向的一致性本身就是结果 —— 按描述性单侧符号检验，六比零给出 p=0.016，五比一给出 p=0.11。而在 in-distribution，同样的比较是分裂的：VT-C 的 TSR 在六组里赢四组、输两组，没有统一方向。所以支持视触觉输入的最强对比证据是偏移下的任务成功提升，而不是 ID 性能或形变合规上的普遍收益；论文同时限定，这是对已发布变体的相关性描述，不是隔离出的触觉因果效应。",
      },
      {
        kind: "p",
        text: "按因子拆开看，这个模式更多由套件而非因子组织：Spatial-Soft 上视触觉曲线在三个因子、三个策略上都不低于视觉-only；Object-Soft 上两条曲线基本重合，可见的分离只出现在 π0.5 与 FastWAM 的质量偏移上，与触觉只能观测到接触建立之后才发生的变化相符。光照作用在接触之前，削弱的是两种模态共同依赖的视觉通路 —— Diffusion Policy 在 Object-Soft 的两个光照极端（×0.5 与 ×2.0）上，VO-C 与 VT-C 的 TSR 与 DSR 全部为 0，而在 ×1.33 上分别是 37/33 与 36/30。视觉整个失效时，触觉没有可修正的东西。",
      },
      {
        kind: "p",
        text: "一处需要限定的观察：在偏移下，从 VO-C 换到已发布的 VT-C 变体，会把本来缺口就大的两个策略的 TSR−DSR 差进一步拉开 —— Diffusion Policy 在 Object-Soft 上从 2.6 涨到 6.2 个百分点、在 Spatial-Soft 上从 2.2 涨到 7.4，π0.5 在 Object-Soft 上从 2.6 涨到 6.8。其余三组对比的缺口变化不超过 0.6 个百分点。FastWAM 是反例：两种模态下它的 TSR 与 DSR 在每一组池化比较中都相差不到一个百分点，它的视触觉鲁棒性提升没有以交互质量为代价。两条轴可以一起改善，但不会自动一起改善，而这正是只看任务成功的协议会记成「整体进步」的那种分歧。",
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
      "Zijian Zhang*, Yuqing Jiang*, Qian Cheng, Xiaofan Li, Si Liu, Ding Zhao, Ping Luo, Weitao Zhou, Haibao Yu‡（* equal contribution　‡ corresponding author）",
    affiliations:
      "Tuojing Intelligence · University of Chinese Academy of Sciences · Institute of Automation, Chinese Academy of Sciences · Tsinghua University · Zhejiang University · Beihang University · Carnegie Mellon University · The University of Hong Kong",
    lede: "一个挂在 VLA 策略上的前馈式 3D 高斯世界模型插件：训练时把机器人视频解码成当前帧高斯场景和短时程未来高斯演化，用 RGB、深度和伪 3D 场景流做稠密监督；推理时丢掉全部辅助头，只留一段前缀 token 参与动作生成。",
    links: [
      { label: "arXiv 2605.20752", href: "https://arxiv.org/abs/2605.20752" },
      { label: "代码", href: "https://github.com/TuojingAI/GaussianDream" },
    ],
    hero: {
      src: gdFramework,
      caption:
        "训练时时序视觉特征与可学习 queries 生成紧凑前缀，前缀被解码为当前与未来 3D 高斯状态，接受 RGB、深度与伪 3D 场景流监督；推理时全部辅助高斯解码头被丢弃，只有前缀参与动作生成。",
    },
    status: "论文已上 arXiv，代码已发布",
    body: [
      {
        kind: "p",
        text: "视觉-语言-动作策略把预训练视觉语言模型的语义先验搬进了机器人控制，但监督信号仍以动作模仿为主。论文指出三处缺口：3D 空间结构和接触约束只隐式编码在视觉隐变量和动作标签里，抓取点偏移这类几何误差难以纠正；机器人轨迹里的物体布局、外观、深度这些稠密像素证据被浪费，因为动作损失只监督每一步的控制指令；环境在交互之后如何演化，标准 VLA 没有显式机制去预判。",
      },
      {
        kind: "p",
        text: "已有的两条补救路线各有代价。3D 增强策略用点云或深度图把当前场景静态锚住，对交互后的状态演化仍然沉默；世界模型在像素、隐空间或动作空间里预测未来，但迭代体素优化和自回归视频 rollout 会把推理开销推高，难以放进高频控制回路。GaussianDream 的做法是把两者都放在训练侧，推理侧只保留代价最小的那部分。",
      },
      { kind: "h", text: "非对称的插件设计" },
      {
        kind: "p",
        text: "基座策略是 π0.5。编码器里加入可学习的 GaussianDream queries，与来自 agent-view 那一路的短时观测序列一起经时序编码器产生一段前缀 token；这段前缀与图像、语言 token 共享 2048 维的 PaliGemma/Gemma-2B 前缀空间，动作专家用 1024 维隐空间。训练时这段前缀被两个辅助头解码：静态重建头产出当前 3D 高斯场景状态，未来预测头产出 horizon 条件下的高斯演化状态。推理时所有辅助解码头被丢弃，策略只在原有的多模态上下文里追加这段前缀，动作接口不变，不做测试时高斯重建、渲染、视频 rollout，也不加规划器。",
      },
      { kind: "h", text: "当前帧重建" },
      {
        kind: "p",
        text: "1024 个 GaussianDream token 被 reshape 成 32×32 的隐格点，经解码骨干上采样成 256×256×128 的稠密特征图。几何头预测深度、旋转、尺度、不透明度，外观头结合当前 RGB 观测预测一阶球谐系数。深度反投影得到高斯中心，场景共 256×256 个高斯，随后渲染出 RGB 和深度接受监督。这一支的作用是逼迫前缀承载可渲染的显式几何。",
      },
      { kind: "h", text: "未来高斯预测" },
      {
        kind: "p",
        text: "时序特征由 VGGT 提取多尺度 3D-aware patch 特征，按 32×32 自适应池化后投影成时间 token。Temporal Gaussian Evolution 模块含 12 个注意力块、8 个注意力头，交替做帧内空间交互和跨帧的时间槽注意力。动态头预测 horizon 条件下的高斯中心位移，尺度、不透明度、外观、旋转直接沿用当前高斯模板，把预测集中在交互引起的几何变化上。上下文取三帧 {t−10, t−5, t}，未来监督覆盖 t+1 到 t+5。",
      },
      { kind: "h", text: "两阶段训练与伪监督" },
      {
        kind: "list",
        items: [
          {
            term: "Stage I",
            desc: "只训重建与预测头，不做动作学习。当前分支用深度和渲染损失，未来分支加上伪 3D 场景流损失，预测 horizon 在训练中逐步放大以稳定优化。",
          },
          {
            term: "Stage II",
            desc: "与策略联合训练，动作损失是 π0.5 的 flow matching 目标，总目标为动作损失加上带权的 GaussianDream 辅助损失。",
          },
          {
            term: "伪深度",
            desc: "由 Depth Anything V2 从 agent-view RGB 生成，缩放回原分辨率后随 episode 数据存储，仅训练时使用。",
          },
          {
            term: "伪 3D 场景流",
            desc: "默认用 RAFT 估计相邻帧 2D 光流，Farneback 作为轻量回退；warp 后采样未来深度、用相机内参反投影两帧作差得到 3D 位移，并计算有效性掩码剔除越界和无效深度的像素。",
          },
          {
            term: "训练配置",
            desc: "60K 步，global batch size 24，AdamW，峰值学习率 5×10⁻⁵，cosine 调度，10K 步 warmup，梯度裁剪 1.0，EMA 衰减 0.999，A100 上混合精度。",
          },
        ],
      },
      { kind: "h", text: "评测设置" },
      {
        kind: "p",
        text: "LIBERO 按 Spatial、Object、Goal、Long 四个协议评，50 条演示、50 次评测 trial。RoboCasa 用 Human-50 少样本设置，覆盖 24 个长时程厨房任务、五个场景，每任务 50 次 trial。真机平台是 leader-follower 双臂：leader 臂只在遥操作采数据时用，follower 臂是执行臂，评测时由策略直接控制；观测来自 agent-view 和腕部两路 RGB 相机。",
      },
      {
        kind: "table",
        head: ["方法", "Spatial", "Object", "Goal", "Long", "Average"],
        rows: [
          ["π0", "96.8", "98.8", "95.8", "85.2", "94.1"],
          ["π0.5", "97.8", "98.8", "97.6", "92.4", "96.7"],
          ["GeoPredict", "98.0", "98.2", "95.7", "94.0", "96.5"],
          ["QDepth-VLA", "97.6", "96.6", "95.2", "90.0", "94.9"],
          ["LingBot-VA", "98.5", "99.6", "97.2", "98.5", "98.5"],
          ["GeoVLA", "98.4", "99.0", "96.6", "96.6", "97.7"],
          ["VLA-4D", "97.9", "98.6", "97.8", "94.8", "97.4"],
          ["3D-CAVLA", "98.2", "99.8", "98.2", "96.1", "98.1"],
          ["Spatial Forcing (PyTorch)", "98.6", "98.4", "98.2", "95.4", "97.6"],
          ["GaussianDream", "99.0", "99.6", "99.0", "96.0", "98.4"],
        ],
        note: "LIBERO 成功率（%）。GaussianDream 在 Spatial 与 Goal 上最高，平均 98.4。LingBot-VA 平均 98.5 更高，但控制时用的是更大的自回归视频-动作管线。Spatial Forcing 取其 PyTorch 实现以保持实现口径一致。",
      },
      {
        kind: "table",
        head: ["方法", "Pick&Place", "Doors/Drawers", "Others", "Average"],
        rows: [
          ["π0", "14.0", "53.1", "58.5", "42.4"],
          ["π0.5", "36.0", "46.5", "39.5", "40.1"],
          ["BC-Transformer", "3.8", "46.7", "38.0", "28.8"],
          ["GWM", "14.8", "54.3", "49.8", "39.3"],
          ["GeoPredict", "22.7", "75.1", "62.4", "52.4"],
          ["Being-H0.5", "36.0", "71.7", "57.6", "53.9"],
          ["GaussianDream", "43.8", "66.3", "54.4", "54.8"],
        ],
        note: "RoboCasa Human-50 成功率（%）。GaussianDream 平均最高，Pick&Place 最高；GeoPredict 在 Doors/Drawers 与 Others 上更高。",
      },
      {
        kind: "table",
        head: ["方法", "Scene-A", "Scene-B", "Scene-C", "Scene-D", "Average"],
        rows: [
          ["π0.5", "42.5", "50.0", "25.0", "20.0", "34.4"],
          ["GaussianDream", "55.0", "70.0", "35.0", "40.0", "50.0"],
        ],
        note: "真机成功率（%）。相对基线 π0.5 从 34.4 提到 50.0，四个场景组均有提升，增益最大的是空间关系类和长时程场景。真机任务覆盖属性 grounding、空间关系、堆叠与拆叠、长时程执行。",
      },
      { kind: "h", text: "消融" },
      {
        kind: "table",
        head: ["当前重建", "未来预测", "渲染分支", "深度分支", "LIBERO 平均"],
        rows: [
          ["✓", "✗", "✗", "✗", "97.0"],
          ["✓", "✗", "✓", "✓", "97.3"],
          ["✓", "✓", "✗", "✓", "97.5"],
          ["✓", "✓", "✓", "✗", "97.2"],
          ["✓", "✓", "✓", "✓", "98.4"],
        ],
        note: "只做当前重建已有 97.0，说明把观测重建成高斯状态本身就是有效的空间先验；加入未来预测到 97.5；保留未来预测和渲染但去掉深度降到 97.2，说明只靠 RGB 一致性约束不住度量几何；全量 98.4。",
      },
      { kind: "h", text: "推理开销" },
      {
        kind: "p",
        text: "部署配置去掉辅助高斯解码器与预测头后，每个 action chunk 的推理耗时为 531 ms；保留解码器和预测头的诊断配置为 569 ms。两者都快于 WAM / World Action Model 基线的 700 ms 以上。附录同时给出与 π0.5 的执行平滑度对比，GaussianDream 的轨迹突变更少。",
      },
      { kind: "h", text: "边界" },
      {
        kind: "p",
        text: "未来预测只更新高斯中心，尺度、不透明度、外观、旋转都从当前模板复制，因此建模的是短时程的几何位移，不是外观或拓扑变化；监督 horizon 也只到 t+5。深度和 3D 场景流都是伪标签，来自 Depth Anything V2 与 RAFT，而非真值传感。LIBERO 上平均分仍低于走视频-动作自回归路线的 LingBot-VA，Long 一项也不是最好；RoboCasa 上 Doors/Drawers 与 Others 两类落后于 GeoPredict。真机结果只与 π0.5 基线对比，没有与其他 3D 增强或世界模型方法的物理对照。",
      },
    ],
  },

  {
    slug: "counterscene",
    title: "CounterScene：把安全场景改成危险场景的最小反事实干预",
    titleEn:
      "Counterfactual Causal Reasoning in Generative World Models for Safety-Critical Closed-Loop Evaluation",
    tag: "Safety",
    date: "2026 年 3 月",
    venue: "ECCVW 2026 Oral",
    venueNote: "早期版本",
    authors:
      "Bowen Jing*, Ruiyang Hao*, Weitao Zhou‡, Haibao Yu‡（* equal contribution　‡ corresponding author）",
    affiliations:
      "Tuojing Intelligence · King's College London · Tsinghua University · The University of Hong Kong",
    lede: "给定一个安全的真实交通场景，先找出正在维持这份安全的那一个智能体，再把它的空间余量和时间余量剥掉，让风险沿着自然的交互路径传播出来。方法建在闭环生成式 BEV 世界模型上，在 nuScenes 上评测，并零样本迁到 nuPlan。",
    links: [
      { label: "arXiv 2603.21104", href: "https://arxiv.org/abs/2603.21104" },
      { label: "代码", href: "https://github.com/TuojingAI/CounterScene" },
    ],
    hero: {
      src: csIntro,
      caption:
        "观测场景里关键智能体等待，自车安全通过。反事实问题是：如果关键智能体没有等待呢。对该智能体的轨迹施加干预，构造出一个诱发安全攸关交互、同时保留真实交通动力学的反事实世界。",
    },
    status: "论文已上 arXiv，代码、权重与评测脚本待发布",
    body: [
      { kind: "h", text: "问题定义" },
      {
        kind: "p",
        text: "一个安全的路口场景，安全不是偶然的。它是被某个具体行为维持出来的：一辆车在路口让行，一位司机保持了纵向间距，一个行人推迟了进入斑马线的时刻。把这个行为拿掉，结果就会变。这给出一个反事实问法：观测到的安全场景里，是哪一个智能体的行为在维持安全，以及最小的什么改动能让场景从安全翻成危险。",
      },
      {
        kind: "p",
        text: "现有的安全攸关场景生成不这么问。对抗智能体靠简化规则挑：人工指定，或者按距离就近。选中之后，扰动被全局施加或施加在固定智能体上，没有机制刻画行为改变如何在多智能体系统里传播。结果是一个结构性的真实性—对抗性权衡：扰动激进就产生不合理的动力学，扰动保守就几乎产生不了有意义的风险。论文把这个权衡归因于在没有因果机制的前提下扰动行为。",
      },
      { kind: "h", text: "三个部件" },
      {
        kind: "list",
        items: [
          {
            term: "Causal Adversarial Agent Identification",
            desc: "回答 who。基于交互语义与运动学风险，判定哪个智能体的当前行为是维持安全的那个单变量，并给出冲突类型标签。",
          },
          {
            term: "Causal Interaction Graph (CIG)",
            desc: "回答 how。在 SceneTransformer 去噪器上加一层学习到的有向图，边特征为相对位置、相对速度、TTC、TTI 以及冲突区附近的交互距离与速度，经 MLP 编码后条件化成对注意力权重，让行为改变沿冲突耦合路径传播，弱相关的智能体不受扰动。",
          },
          {
            term: "Stage-Adaptive Counterfactual Guidance",
            desc: "回答 what-if。按阶段和冲突结构调制扩散引导，只改被选中智能体的轨迹，剥掉它的空间余量与时间余量；其余智能体由世界模型的学习动力学自行响应。",
          },
        ],
      },
      {
        kind: "fig",
        fig: {
          src: csMethod,
          caption:
            "四个模块：因果对抗智能体选择、CIG 冲突感知交互编码、带 SceneTransformer 去噪器的扩散式交互 BEV 世界模型、在去噪过程中作用于对抗智能体的反事实引导。",
        },
      },
      { kind: "h", text: "关键参与者是怎么选出来的" },
      {
        kind: "p",
        text: "选择在离线阶段完成，用 trajdata 环境里的真值未来轨迹，在 100 场景评测子集上做。自车固定为 index 0，其余每个智能体都是候选。一对自车—候选只有在共享至少五个同时有效的未来时间步时才被考虑。对每一对，在所有有效时间步组合上搜索最近的时空遭遇 (τe, τa)，冲突点取这一对位置的中点，并算出最小距离 d_min、到达时间差 Δt 和用有限差分估计的相对速度 v_rel。冲突类型由两者未来行进方向的余弦判定：cos θ 大于 0.8 记为 following，否则记为 intersection；following 再按沿自车行进方向的先后分成 rear_approach 与 lead_braking。危险分数按类型算，intersection 是 v_rel /(Δt + 0.5)，following 是 v_rel /(d_min + 1.0)。分数越高，表示该智能体当前的安全行为正在压住越多的潜在风险。",
      },
      {
        kind: "table",
        head: ["冲突类型", "Tier", "保留判据"],
        rows: [
          ["intersection", "Tier 1", "Δt < 5.0 且 s_conflict ≥ 0.05"],
          ["following / rear_approach", "Tier 2", "d_min < 10.0 且 s_conflict ≥ 0.05"],
          ["following / lead_braking", "Tier 3", "d_min < 12.0 且 s_conflict ≥ 0.05"],
        ],
        note: "论文附录 A.2 的分层筛选规则。最终目标按 (tier, −s_conflict) 字典序取第一位，tier 序号小的优先，同 tier 比危险分数。引导权重 w = −80 − 40·min(s,1)（intersection）或 −60 − 30·min(s,1)（following），无类型时回退到 −50。没有候选通过筛选的场景被标为无效挖掘样本，不生成冲突引导配置。",
      },
      { kind: "h", text: "最小干预" },
      {
        kind: "p",
        text: "在事实场景里，对抗智能体通过两件事维持安全：它在空间上避开冲突区，它在时间上不与自车同时到达。引导把这两件事分别拿掉。空间项把对抗智能体吸引向挖掘出的冲突点，自车的期望状态只作为锚定冲突位置的空间参照。时间项分两步：先用一个到达时间压缩表 Δτ′ = Δτ(1 − p) 逐步收窄目标时间差，再用一个同步目标让对抗智能体去匹配这个被压缩的时序。论文明确不规定碰撞轨迹本身，只移除时间余量，让扩散模型自己找一条与压缩后时序相容的真实轨迹。",
      },
      {
        kind: "p",
        text: "三段式调度按归一化进度 p 给出阶段乘子：p < 0.3 时固定为 0.2，0.3 ≤ p < 0.7 时从 0.2 线性升到 1.5，p ≥ 0.7 时从 1.5 线性升到 3.0。到达时间压缩只在 p ≥ 0.5 之后启动。基础权重按冲突类型给定，jerk 正则系数 intersection 取 0.3、rear_approach 取 0.5、lead_braking 取 0.8，jerk 由轨迹的三阶有限差分算出。另有一个权重 2.0 的地图碰撞正则项抑制越界轨迹，这一项不受阶段乘子调制。采样时梯度严格只改对抗智能体的轨迹。",
      },
      { kind: "h", text: "评测设定与基线" },
      {
        kind: "p",
        text: "全部实验在 nuScenes 上、以 tbsim 为统一仿真平台完成，所有方法在同一框架下训练与评测。模型训练用官方 train split，评测用 100 个验证场景，覆盖路口、汇入、变道等路网拓扑和不同交互密度。每个场景给 3 s 观测历史，闭环推演最长 10 s，起始条件相同。扩散用 100 步去噪和 cosine 噪声表；每个场景生成 16 条候选 rollout，取对抗性最强的一条，所有基线用同一套多 rollout 协议。真实性指标是 ADE、FDE 和越界率 ORR；对抗性指标是碰撞率 CR 和急刹率 HBR，CR 按定向包围盒重叠逐帧判定并按场景计，HBR 的阈值是纵向减速度低于 −3.0 m/s²。世界模型侧：时间步长 0.1 s，历史 31 步，预测 52 步（未来时程 5.2 s，与 10 s 的闭环推演是两回事），地图编码器为 ResNet-18，16 个注意力头，训练 100,000 步，EMA decay 0.995，在 A100 上进行。",
      },
      {
        kind: "list",
        items: [
          { term: "VAE", desc: "在隐空间里采样轨迹。" },
          { term: "STRIVE", desc: "基于梯度的轨迹优化。" },
          { term: "CTG", desc: "规则引导的扩散。" },
          { term: "CTG++", desc: "语言引导的扩散。" },
          {
            term: "CCDiff",
            desc: "组合式因果扩散，用 TTC 选择对抗车辆。",
          },
        ],
      },
      { kind: "h", text: "nuScenes 上的结果" },
      {
        kind: "table",
        head: ["方法", "ADE ↓", "FDE ↓", "ORR ↓", "HBR ↑", "CR ↑"],
        rows: [
          ["CTG", "2.480", "6.143", "0.2%", "1.4%", "2.0%"],
          ["VAE", "3.086", "7.433", "1.0%", "0.2%", "13.3%"],
          ["STRIVE", "2.722", "7.060", "0.8%", "0.1%", "15.3%"],
          ["CTG++", "2.963", "7.525", "0.2%", "1.3%", "3.7%"],
          ["CCDiff", "2.092", "5.898", "2.3%", "1.5%", "12.3%"],
          ["CounterScene", "1.877", "5.141", "1.9%", "1.8%", "22.7%"],
        ],
        note: "论文 Table 2 的 8–10 s 长时程段（1–4 s 与 5–7 s 段见原文）。同一张表在 1–4 s 段上 CounterScene 的 ADE 是 0.288、CR 是 3.3%，CCDiff 对应 0.380 与 1.3%。",
      },
      {
        kind: "p",
        text: "基线分成两种失败模式。CTG 和 CTG++ 保住了低越界率，但几乎不产生碰撞，CTG 在 8–10 s 也只有 2.0% CR。STRIVE 和 VAE 拿到了中等的长时程 CR（15.3%、13.3%），代价是真实性退化，8–10 s 的 ADE 超过 2.7。CounterScene 在 8–10 s 同时给出最低 ADE（1.877）和最高 CR（22.7%），且优势随时程拉长而扩大，论文把这解释为构造出的交互是随时间自然演化成危险，而不是靠激进扰动立刻撞上去。越界率上 CounterScene 不是最好的：8–10 s 的 ORR 是 1.9%，高于 CTG 与 CTG++ 的 0.2%。",
      },
      { kind: "h", text: "分离「选谁」与「怎么扰」" },
      {
        kind: "table",
        head: ["选择策略", "ADE ↓", "FDE ↓", "ORR ↓", "HBR ↑", "CR ↑"],
        rows: [
          ["Random", "1.024", "2.696", "1.4%", "1.8%", "10.0%"],
          ["CCDiff（TTC）", "1.036", "2.708", "1.4%", "1.7%", "8.0%"],
          ["SafeSim（距离）", "1.004", "2.643", "1.3%", "1.7%", "9.5%"],
          ["Ours（因果选择）", "0.721", "1.898", "1.1%", "1.8%", "11.0%"],
        ],
        note: "论文 Table 3，同一骨干与同一引导函数下只替换选择策略，3 s 与 7 s 平均。",
      },
      {
        kind: "p",
        text: "骨干和引导函数完全固定，只换选择策略。因果选择在真实性上领先明显（ADE 0.721 对 SafeSim 的 1.004），CR 也最高（11.0%）。值得记的是 CCDiff 的 TTC 选择拿到最低的 CR（8.0%），低于随机采样的 10.0%。论文的解释是纯邻近判据会自信地锁定一个并非真正关键变量的智能体，而随机采样偶尔会碰对。更大的差距出现在真实性一侧：ADE 从 0.721 到 1.036，跨度约 44%，而 CR 只在 8.0% 到 11.0% 之间。选错智能体损害真实性的程度大于损害对抗效果，因为引导必须把越来越不自然的行为强加给一个无关参与者才能撞出碰撞。",
      },
      { kind: "h", text: "引导部件的消融" },
      {
        kind: "table",
        head: ["变体", "ADE ↓", "FDE ↓", "ORR ↓", "HBR ↑", "CR ↑"],
        rows: [
          ["Full", "0.747", "1.978", "0.9%", "1.8%", "11.0%"],
          ["No Jerk", "0.784", "2.098", "1.0%", "1.6%", "10.5%"],
          ["No Conflict Aware", "0.768", "2.052", "1.0%", "1.6%", "9.0%"],
          ["No Progressive", "0.775", "2.072", "1.0%", "1.6%", "9.0%"],
          ["No Adaptive", "0.753", "2.000", "0.9%", "1.7%", "7.5%"],
          ["Minimal", "0.798", "2.157", "1.2%", "1.4%", "6.5%"],
        ],
        note: "论文 Table 4，3 s 与 7 s 平均。Full 与这五个消融变体在 3 s / 7 s / 10 s 上的逐时程数值见附录 Table 9，趋势一致：10 s 上 Full 的 CR 是 32.0%，No Adaptive 是 24.0%，Minimal 是 20.0%。",
      },
      {
        kind: "p",
        text: "去掉自适应到达时间压缩（No Adaptive）造成最大的 CR 下降，11.0% 掉到 7.5%，而真实性几乎不动（ADE 0.753 对 0.747）。去掉冲突感知加权或渐进调度各把 CR 压到 9.0%。去掉 jerk 正则或渐进调度会让 ADE 涨约 0.03、越界率从 0.9% 涨到 1.0%。只保留基础空间与时间目标的 Minimal 变体所有指标都变差，CR 6.5%、ADE 0.798。功能划分是清楚的：时间压缩负责对抗效果，调度与正则负责真实性。",
      },
      { kind: "h", text: "零样本迁到 nuPlan" },
      {
        kind: "table",
        head: [
          "方法",
          "3 s ADE ↓",
          "3 s CR ↑",
          "5 s ADE ↓",
          "5 s CR ↑",
          "7 s ADE ↓",
          "7 s CR ↑",
        ],
        rows: [
          ["CTG", "0.801", "5.1%", "1.609", "10.1%", "2.513", "18.2%"],
          ["STRIVE", "0.672", "4.0%", "1.332", "16.2%", "2.113", "23.2%"],
          ["CTG++", "1.199", "15.2%", "2.282", "13.1%", "3.429", "15.2%"],
          ["CCDiff", "0.688", "14.1%", "1.564", "28.3%", "2.534", "40.2%"],
          ["CounterScene", "0.535", "5.4%", "1.111", "22.8%", "2.021", "40.2%"],
        ],
        note: "论文 Table 5。所有模型只在 nuScenes 上训练，直接用于 nuPlan，不做任何微调或超参调整。评测集是 100 个场景，Boston、Pittsburgh、Las Vegas、Singapore 各 25 个，过滤掉排队和长时间等待这类低风险样本，统一 10 Hz 推演。这张表里没有 VAE。FDE、ORR、HBR 三列见原文，CounterScene 的 HBR 在三个时程上分别是 17.6%、16.4%、15.5%。",
      },
      { kind: "h", text: "边界" },
      {
        kind: "list",
        items: [
          {
            term: "短时程 CR 落后",
            desc: "nuPlan 上 3 s 时 CounterScene 的 CR 是 5.4%，CCDiff 是 14.1%。论文的解释是此时生成的是自车真实感到威胁并开始急刹的近距冲突（HBR 17.6%，全表最高），3 秒不足以让这些交互演化成实际碰撞；到 7 s 时 CR 升到 40.2%，与 CCDiff 持平而 ADE 更低（2.021 对 2.534）。",
          },
          {
            term: "越界率不是最优",
            desc: "nuScenes 上 CounterScene 的 ORR 在 1–4 s 是 0.5%、8–10 s 是 1.9%，两个时程都高于 CTG 与 CTG++ 的 0.2%。nuPlan 上 7 s 的 ORR 是 1.5%，与 CCDiff 相同。",
          },
          {
            term: "只干预单个智能体",
            desc: "当前框架把反事实实例化成对单个因果关键智能体的最小干预，其余智能体和场景按学习到的动力学演化。论文在 Future Work 里把场景级约束保持与智能体级因果交互控制的联合形式化列为待做方向。",
          },
          {
            term: "闭环里的自车规划器未指明",
            desc: "论文反复用「自车感到真实威胁」来解释 HBR，但全篇没有说明闭环推演中自车用的是哪一个规划器。CR 与 HBR 都是对自车行为的度量，这个空缺影响两个对抗性指标的解释。",
          },
          {
            term: "评测分辨率",
            desc: "主结果在 100 个 nuScenes 验证场景上得到，每场景生成 16 条候选 rollout 并取对抗性最强的一条。附录 Table 8 的 CR 全部是 1.0% 的整数倍 —— 与 100 场景的规模一致，也就是说 CR 的分辨率就是每场景一个百分点，论文未给误差棒，也未做多种子重复。",
          },
          {
            term: "筛选会过滤场景池",
            desc: "离线冲突挖掘要求自车与候选至少共享五个有效未来时间步，并要通过 Tier 判据。没有候选存活的场景被标为无效，不生成冲突引导配置。",
          },
          {
            term: "HBR 是近似量",
            desc: "HBR 由预测质心的有限差分得到速度与加速度，纵向制动信号近似为加速度模长乘以航向角余弦，阈值取 −3.0 m/s²。这是一个几何近似而不是纵向加速度的严格投影。",
          },
        ],
      },
    ],
  },

  {
    slug: "recondrive",
    title: "ReconDrive：前馈式 4D 高斯泼溅的驾驶场景重建",
    titleEn:
      "Fast Feed-Forward 4D Gaussian Splatting for Autonomous Driving Scene Reconstruction",
    tag: "Reconstruction",
    date: "2026 年 2 月",
    authors:
      "Haibao Yu*‡, Kuntao Xiao*, Jiahang Wang, Ruiyang Hao, Yuxin Huang, Guoran Hu, Haifang Qin, Bowen Jing, Yuntian Bo, Ping Luo（* equal contribution　‡ corresponding author）",
    affiliations:
      "Tuojing Intelligence · The University of Hong Kong · King's College London · The University of Sydney · Mohamed bin Zayed University of Artificial Intelligence",
    lede: "把驾驶场景的 4D 高斯泼溅做成一次前向推理。在 nuScenes 上，一个约 20 秒的场景生成高斯需要 15 秒，per-scene 优化方法需要 23 到 46 分钟。",
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
      caption:
        "从城市场景的每个段落中选两帧上下文输入，用静态-动态组合表示 4D 高斯。高斯预测头分为 Gaussian Parameter Prediction Head（GPPH）与 Gaussian Center Prediction Head（GCPH）两条路径。",
    },
    status: "2026 年 2 月 23 日开源，代码与 checkpoint 已发布",
    body: [
      {
        kind: "p",
        text: "闭环评测要求自车在仿真里做出动作之后，能拿到与这个动作对应的传感器观测。4D 高斯泼溅在几何精度、光度保真和实时渲染之间取得了平衡，是搭这类仿真的可行表示。但目前主流做法是 per-scene 优化：每换一个场景就要重新迭代拟合高斯核，通常还需要 LiDAR 先验做初始化。这条路不复用场景之间的共享结构，成本随场景数量线性叠加。已有的前馈方法绕开了迭代，代价是光度质量明显下降。",
      },
      {
        kind: "p",
        text: "ReconDrive 把这一步换成一次前向推理。场景被切成时间段落，每个段落取两帧环视图像作为上下文输入，输出该段落的 4D 高斯。分段的动机是在扩大环境覆盖的同时限制渲染时的活跃高斯数量，以保证实时性。骨干用 3D 基础模型 VGGT，在其上加两处改动：把空间坐标和外观属性的回归拆开的混合高斯预测头，以及用速度显式建模运动的静态-动态 4D 组合策略。",
      },
      { kind: "h", text: "骨干与两个预测头" },
      {
        kind: "p",
        text: "输入图像从 nuScenes 原始的 1600×900 缩放到 518×280，两帧、六路相机共 12 张。图像先经 DINOv2 编码器切成 patch，patch size 14，token 维度 1024；再过 24 层 Transformer，采用 Alternating-Attention，在帧内自注意力和全局自注意力之间交替，前者维持单个时间戳内的局部结构一致性，后者捕捉跨视角与跨时间的几何关联。第 4、11、17、23 层的 token 送进两个预测头，相机 token 和四个 register token 不进入头部输入。",
      },
      {
        kind: "list",
        items: [
          {
            term: "Gaussian Center Prediction Head（GCPH）",
            desc: "用 DPT 把融合特征上采样回缩放后的图像分辨率，经 3×3 卷积得到逐像素深度图，再用相机内外参投影到三维，得到每个像素对应的高斯中心。深度被截断在 1.5m 到 110m。标定参数直接进这个头，是为了让重建结果锚定在自车标定坐标系里。",
          },
          {
            term: "Gaussian Parameter Prediction Head（GPPH）",
            desc: "同样用 DPT 上采样，但额外把原图经卷积和 ReLU 处理后与上采样特征拼接，再由卷积层回归不透明度、球谐系数等外观参数。这条 shortcut 是为了补回 transformer 特征下采样中丢掉的高频纹理和颜色细节。",
          },
        ],
      },
      {
        kind: "p",
        text: "骨干权重冻结，用 LoRA 做参数高效微调，rank 8，缩放系数 32。附录里对原始 VGGT 做了一次单独检查：把六路环视图像直接送进 VGGT 得到的 point map，与 nuScenes 的 LiDAR 点云之间存在明显的尺度失配；但施加一个全局尺度因子之后，两者能贴合。也就是说基础模型抓到了场景的结构几何，恢复不出绝对的度量尺度。这是把预标定的传感器参数写进中心预测头的直接理由。",
      },
      { kind: "h", text: "静态与动态的分离" },
      {
        kind: "p",
        text: "静态背景的高斯中心不随时间变化；动态物体的高斯中心在段落内按线性运动外推。动态区域由 SAM2 分割，覆盖 car、truck、bus、trailer、construction vehicle 五类。速度用 nuScenes 的 3D 框标注算：把物体在段落末帧的位置变换到首帧的自车坐标系，位移除以时间差，段落内假设刚体匀速运动。论文指出，对没有 3D 标注的数据集，位移也可以改用两帧高斯中心的差分来算。",
      },
      {
        kind: "p",
        text: "两帧高斯的合并分两步，先做空间变换再做时间对齐，顺序不能交换，因为速度场是在首帧自车坐标系下算出来的。变换后的两组高斯拼接起来，连同速度场构成该段落的最终 4D 表示。相邻段落共享上下文帧，推理时用缓存去掉重复计算。",
      },
      { kind: "h", text: "训练目标" },
      {
        kind: "p",
        text: "总损失有三项：渲染损失、投影损失、正则项。渲染损失由 VGG-19 感知损失与 L2 组成；投影损失把预测深度反投影成三维点、按自车运动变换到另一帧、再重投影回图像平面，用 grid_sample 采样并按有效掩码计算，用于在没有额外深度真值的情况下约束跨帧几何一致；正则项约束高斯的尺度与不透明度。权重为 λ_percep = 0.05、λ_l2 = 1.0、λ_l1 = 0.85、λ_ssim = 0.15、λ_scale = λ_opacity = 0.01。",
      },
      {
        kind: "p",
        text: "训练时每个场景被切成连续 6 帧（0.5 秒）的 clip，第 1 帧与第 6 帧作上下文帧；投影损失以第 1 帧为 target、第 2 帧为 source。渲染到第 1 至第 5 帧的采样概率是 0.7、0.3、0.2、0.1、0.1、0.05。分两阶段：单帧预训练 10 个 epoch（batch 4，学习率 2×10⁻⁵，weight decay 0.01），双帧微调 2 个 epoch（batch 2）；优化器 AdamW，梯度累积 8 步；全部实验在 H800 上进行，约 8 GPU-days。",
      },
      { kind: "h", text: "评测设定" },
      {
        kind: "p",
        text: "nuScenes 共 1,000 个场景、六路环视相机。训练用原始的 700 个训练场景。评测从原验证集里选了 14 个场景：scene-0014、0018、0098、0100、0103、0270、0271、0278、0553、0558、0802、0906、0968、1065，覆盖昼夜、晴雨、静止/直行/转弯以及不同交通密度。关键帧取 12 Hz，每隔 6 帧（0.5 秒）的那一帧作为上下文帧用于重建，其余帧留作新视角合成的评测真值。所有方法统一在 518×280 分辨率下评。优化类基线在 DriveStudio 代码库上复现（原本面向 Waymo，改造为支持 12 Hz 的 nuScenes），每个验证场景训练 30000 步；前馈基线 DrivingForward 同样被喂了多帧输入，以保证同设定比较。",
      },
      {
        kind: "table",
        head: [
          "方法",
          "重建 PSNR",
          "重建 SSIM",
          "重建 LPIPS",
          "新视角 PSNR",
          "新视角 SSIM",
          "新视角 LPIPS",
          "生成耗时",
        ],
        rows: [
          [
            "Street Gaussians",
            "29.18",
            "0.8824",
            "0.1658",
            "22.98",
            "0.6959",
            "0.2948",
            "31min",
          ],
          ["PVG", "29.58", "0.8839", "0.2200", "23.48", "0.6919", "0.2897", "23min"],
          [
            "DeformableGS",
            "28.93",
            "0.8832",
            "0.1610",
            "23.73",
            "0.6919",
            "0.2342",
            "46min",
          ],
          ["OmniRe", "29.42", "0.8853", "0.1577", "23.01", "0.6885", "0.2762", "35min"],
          [
            "DrivingForward",
            "22.83",
            "0.7650",
            "0.2563",
            "21.88",
            "0.6866",
            "0.2979",
            "5s",
          ],
          ["ReconDrive", "32.66", "0.9589", "0.0618", "23.99", "0.7234", "0.2591", "15s"],
        ],
        note: "nuScenes，14 个验证场景，渲染分辨率 518×280。前四行为 per-scene 优化方法，后两行为前馈方法。耗时是单个场景（约 20 秒时长）的高斯生成时间。",
      },
      {
        kind: "p",
        text: "重建的三项指标 ReconDrive 都是最好：PSNR 32.66、SSIM 0.9589、LPIPS 0.0618。新视角合成上 PSNR 23.99、SSIM 0.7234 两项最高，但 LPIPS 0.2591 高于 DeformableGS 的 0.2342。论文自述在九项评测中有八项超过 per-scene 优化方法，但没有点名是哪一项；按表 1 与表 2 逐项比对，只有新视角合成的 LPIPS 没有超过。耗时方面，单场景高斯生成 15 秒，优化类方法是 23 到 46 分钟，前馈的 DrivingForward 是 5 秒。",
      },
      {
        kind: "table",
        head: ["方法", "检测 mAP (%)", "跟踪 AMOTA (%)"],
        rows: [
          ["Street Gaussians", "14.6", "11.9"],
          ["PVG", "18.5", "14.4"],
          ["DeformableGS", "16.4", "13.4"],
          ["OmniRe", "16.1", "12.9"],
          ["DrivingForward", "23.4", "13.3"],
          ["ReconDrive", "26.7", "18.9"],
        ],
        note: "把渲染结果按 2 Hz 送进在 nuScenes 原图上预训练的 UniAD，横向偏移 0m、±1m、±2m、±3m 共七档一起统计，只算车辆类别。",
      },
      {
        kind: "p",
        text: "第三项协议把重建结果喂给下游感知：横向平移自车轨迹来模拟侧向偏移，渲染出的环视图像送进 UniAD。ReconDrive 检测 26.7% mAP、跟踪 18.9% AMOTA。这张表里有一个值得单独看的现象：四个 per-scene 优化方法的检测 mAP 全部低于前馈的 DrivingForward（14.6 到 18.5 对 23.4），但跟踪上并非如此，PVG 的 14.4% AMOTA 高于 DrivingForward 的 13.3%。论文的表述也是「前馈方法通常在检测上更强，在跟踪一致性上往往不及」。重建阶段的光度指标高，不等于渲染结果对下游感知可用。",
      },
      {
        kind: "table",
        head: ["输入", "新视角 PSNR", "新视角 SSIM", "新视角 LPIPS"],
        rows: [
          ["ReconDrive-S（单帧）", "23.54", "0.6940", "0.3177"],
          ["ReconDrive（双帧）", "23.99", "0.7234", "0.2591"],
        ],
        note: "时序输入消融。论文表 3 在 ReconDrive 行标注了相对单帧的差值：PSNR +0.45、SSIM +0.0294、LPIPS −0.058。",
      },
      {
        kind: "p",
        text: "双帧输入在三项新视角指标上都好于单帧，论文的解释是多帧融合扩大了重建覆盖的视野范围，并提供了互补的视点信息。",
      },
      { kind: "h", text: "论文自述的局限" },
      {
        kind: "list",
        items: [
          {
            term: "非刚性运动",
            desc: "段落内的时序表示基于线性运动估计，难以准确表达复杂的非刚性形变和强非线性的物体轨迹。",
          },
          {
            term: "时序聚合的冗余",
            desc: "多帧聚合走的是逐像素输出的后处理，会带来高斯冗余，被遮挡区域的处理也不理想。",
          },
          {
            term: "动态物体提取精度",
            desc: "依赖 SAM2 做分割，偶尔出现边界不准或漏检；直接位移动态物体还会在背景上留下补不回来的空洞。",
          },
          {
            term: "吞吐",
            desc: "比优化类方法快几个数量级，但离边缘端实时仍有距离，需要更轻量的骨干和更高效的高斯采样策略。",
          },
          {
            term: "泛化",
            desc: "目前只在 nuScenes 上训练与评测，更广的地域范围和极端天气条件下的表现尚未验证。",
          },
        ],
      },
    ],
  },
];

export function findProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}
