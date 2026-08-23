/* 八张项目数据图。图型骨架取自 lieflat-charts 的 Lupi Basics gallery，
   每页之内模板不重复（F12 / F6 / F5 / F1 / F8）。
   数值逐格取自各项目论文的正式表格，与项目页正文里的表同源。 */
import { C, ChartFrame, label, num, rnd, useReveal } from "./base";

/* ── 共用：滚入后逐个淡入的属性 ── */
const fade = (on: boolean, delay: number) => ({
  opacity: on ? 1 : 0,
  transition: `opacity 520ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
});
const pop = (on: boolean, delay: number) => ({
  opacity: on ? 1 : 0,
  transform: on ? "scale(1)" : "scale(.55)",
  transformOrigin: "center",
  transformBox: "fill-box" as const,
  transition: `opacity 420ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform 420ms cubic-bezier(.34,1.3,.5,1) ${delay}ms`,
});
const Svg = ({ h, children, r }: { h: number; children: React.ReactNode; r: React.Ref<SVGSVGElement> }) => (
  <svg ref={r} viewBox={`0 0 640 ${h}`} className="block w-full font-mono" style={{ overflow: "visible" }}>
    {children}
  </svg>
);

/* ════ F12 Dumbbell ════ SoftVTBench：TSR → DSR，缺口本身是结论 */
export function SvTsrDsr() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number, number][] = [
    ["Diffusion Policy · VO-C", 37.4, 33.6], ["Diffusion Policy · VT-C", 40.0, 30.4],
    ["π0.5 · VO-C", 41.6, 38.4], ["π0.5 · VT-C", 41.4, 35.0],
    ["FastWAM · VO-C", 62.0, 58.0], ["FastWAM · VT-C", 57.6, 54.4],
  ];
  const HERO = 1, X0 = 208, X1 = 532, VX = 636,
    mx = (v: number) => X0 + ((v - 27) / 38) * (X1 - X0);
  return (
    <ChartFrame caption="十二个 in-distribution 配置里，DSR 全部低于 TSR。缺口最大的是 Diffusion Policy 的视触觉变体：9.6 个百分点，相当于该配置成功 rollout 的 24%。">
      <Svg r={ref} h={318}>
        {D.map(([n, tsr, dsr], i) => {
          const y = 44 + i * 42, xa = mx(tsr), xb = mx(dsr), hero = i === HERO;
          const beads = Math.round(tsr - dsr);
          return (
            <g key={n}>
              <text x={194} y={y + 4} textAnchor="end" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 70) }}>{n}</text>
              <line x1={X0 - 8} y1={y} x2={X1 + 8} y2={y} stroke={C.grid} strokeWidth={1}
                style={fade(on, i * 70)} />
              {Array.from({ length: beads }, (_, k) => {
                const t = (k + 0.5) / beads;
                return <circle key={k} cx={xb + t * (xa - xb)} cy={y + (rnd(k + 1, i + 3) - 0.5) * 2}
                  r={2.1} fill={hero ? C.hero : C.dataLo}
                  style={pop(on, 300 + i * 70 + k * 26)} />;
              })}
              <circle cx={xa} cy={y} r={5} fill={C.card} stroke={C.faint} strokeWidth={1.4}
                style={pop(on, 200 + i * 70)} />
              <circle cx={xb} cy={y} r={5.4} fill={hero ? C.hero : C.ink}
                style={pop(on, 620 + i * 70)}>
                <title>{`${n} — TSR ${tsr}% → DSR ${dsr}%（缺口 ${(tsr - dsr).toFixed(1)} 个百分点）`}</title>
              </circle>
              <text x={xa + 12} y={y + 4} fill={C.faint} style={{ ...label(10.5), ...fade(on, 300 + i * 70) }}>
                {tsr.toFixed(1)}</text>
              <text x={VX} y={y + 7} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(21), ...fade(on, 700 + i * 70) }}>{dsr.toFixed(1)}</text>
            </g>
          );
        })}
        <text x={X0} y={300} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>← 形变越界拉开的缺口</text>
        <text x={VX} y={300} textAnchor="end" fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>DSR %</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F6 Paired Rungs ════ SoftVTBench：分布偏移下 VT 全面高于 VO */
export function SvOod() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, string, number, number][] = [
    ["Diffusion Policy", "Object", 29.2, 31.2], ["Diffusion Policy", "Spatial", 11.0, 25.2],
    ["π0.5", "Object", 35.8, 41.0], ["π0.5", "Spatial", 24.4, 28.4],
    ["FastWAM", "Object", 54.4, 55.8], ["FastWAM", "Spatial", 27.8, 39.4],
  ];
  const base = 226, unit = 5.2, HERO = 1;
  return (
    <ChartFrame caption="九个留出条件池化后的任务成功率。视触觉变体在全部六组里都高于视觉-only —— 单个 margin 有大有小，方向的一致性本身是结果。论文限定这是对已发布变体的相关性描述，不是隔离出的触觉因果效应。">
      <Svg r={ref} h={312}>
        {D.map(([m, s, vo, vt], i) => {
          const x = 70 + i * 96, hero = i === HERO;
          const rungs = (v: number) => Math.round(v / 2);
          return (
            <g key={m + s}>
              {Array.from({ length: rungs(vo) }, (_, k) => (
                <line key={"a" + k} x1={x - 26} y1={base - k * unit} x2={x - 6} y2={base - k * unit}
                  stroke={C.dataLo} strokeWidth={1.6} style={fade(on, i * 70 + k * 9)} />
              ))}
              {Array.from({ length: rungs(vt) }, (_, k) => (
                <line key={"b" + k} x1={x + 6} y1={base - k * unit} x2={x + 26} y2={base - k * unit}
                  stroke={hero ? C.hero : C.data} strokeWidth={1.6} style={fade(on, 140 + i * 70 + k * 9)} />
              ))}
              <text x={x - 16} y={base - rungs(vo) * unit - 10} textAnchor="middle" fill={C.faint}
                style={{ ...label(11), ...fade(on, 420 + i * 70) }}>{vo.toFixed(1)}</text>
              <text x={x + 16} y={base - rungs(vt) * unit - 10} textAnchor="middle"
                fill={hero ? C.heroTxt : C.ink} style={{ ...num(19), ...fade(on, 560 + i * 70) }}>
                {vt.toFixed(1)}<title>{`${m} · ${s}-Soft — VO-C ${vo}% → VT-C ${vt}%`}</title></text>
              <text x={x} y={base + 22} textAnchor="middle" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(10.5), ...fade(on, i * 70) }}>{s}</text>
              <text x={x} y={base + 38} textAnchor="middle" fill={C.faint}
                style={{ ...label(9.5), ...fade(on, i * 70) }}>{m === "Diffusion Policy" ? "DP" : m}</text>
            </g>
          );
        })}
        <line x1={30} y1={base + 4} x2={610} y2={base + 4} stroke={C.grid} strokeWidth={1} style={fade(on, 0)} />
        <text x={30} y={300} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          淡档 = 视觉-only VO-C · 实档 = 视触觉 VT-C · 一档 = 2 个百分点</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F5 Tick Rows ════ SoftVTBench：十个资产各自标定的形变容差 */
export function SvTau() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number][] = [
    ["stw_cube_hq", 11.2], ["pastry005", 10.7], ["stw_cuboid_hq", 9.8], ["stw_cylinder_hq", 9.8],
    ["stw_sphere_hq", 9.7], ["pastry002", 9.3], ["pastry003", 8.6], ["pastry010", 8.3],
    ["pastry001", 7.6], ["pastry011", 7.1],
  ];
  const X0 = 190, PX = 15, VX = 628;
  return (
    <ChartFrame caption="形变容差 τ 取稳定抓取下位移峰值的第 90 百分位，按初始包围盒对角线归一化。百分位是一个全局常数，一次固定、对所有资产同值 —— 不能按物体或按方法调。">
      <Svg r={ref} h={330}>
        {D.map(([n, v], i) => {
          const y = 34 + i * 29, ticks = Math.round(v * 2);
          return (
            <g key={n}>
              <text x={176} y={y + 4} textAnchor="end" fill={C.mut}
                style={{ ...label(11), ...fade(on, i * 55) }}>{n}</text>
              <line x1={X0} y1={y + 8} x2={X0 + 23 * PX} y2={y + 8} stroke={C.grid} strokeWidth={1}
                style={fade(on, i * 55)} />
              {Array.from({ length: ticks }, (_, k) => (
                <line key={k} x1={X0 + k * PX + PX / 2} y1={y + 8}
                  x2={X0 + k * PX + PX / 2} y2={y + 8 - (10 + rnd(k + 1, i + 2) * 5)}
                  stroke={C.data} strokeWidth={1.5} opacity={0.45 + rnd(k + 3, i + 5) * 0.5}
                  style={fade(on, i * 55 + k * 11)} />
              ))}
              <text x={VX} y={y + 9} textAnchor="end" fill={C.ink}
                style={{ ...num(19), ...fade(on, 380 + i * 55) }}>
                {v.toFixed(1)}<title>{`${n} — τ / 包围盒对角线 = ${v}%`}</title></text>
            </g>
          );
        })}
        <text x={X0} y={318} fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>
          一 tick = 0.5 个百分点 · 数值为 τ 占包围盒对角线的比例</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F5 Tick Rows ════ GaussianDream：LIBERO 十个方法 */
export function GdLibero() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number][] = [
    ["LingBot-VA", 98.5], ["GaussianDream", 98.4], ["3D-CAVLA", 98.1], ["GeoVLA", 97.7],
    ["Spatial Forcing", 97.6], ["VLA-4D", 97.4], ["π0.5", 96.7], ["GeoPredict", 96.5],
    ["QDepth-VLA", 94.9], ["π0", 94.1],
  ];
  const X0 = 176, LO = 93, PX = 36, VX = 628;
  return (
    <ChartFrame caption="LIBERO 四协议平均成功率。GaussianDream 在 Spatial 与 Goal 两项最高，平均 98.4；LingBot-VA 平均 98.5 更高，但它在控制阶段跑的是更大的自回归视频-动作管线。">
      <Svg r={ref} h={330}>
        {D.map(([n, v], i) => {
          const y = 32 + i * 29, hero = n === "GaussianDream";
          const w = (v - LO) * PX;
          return (
            <g key={n}>
              <text x={162} y={y + 4} textAnchor="end" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 55) }}>{n}</text>
              <line x1={X0} y1={y} x2={X0 + (99 - LO) * PX} y2={y} stroke={C.grid} strokeWidth={1}
                style={fade(on, i * 55)} />
              <line x1={X0} y1={y} x2={on ? X0 + w : X0} y2={y}
                stroke={hero ? C.hero : C.data} strokeWidth={hero ? 5 : 3.5} strokeLinecap="round"
                style={{ transition: `x2 700ms cubic-bezier(.22,1,.36,1) ${i * 55}ms` }}>
                <title>{`${n} — LIBERO 平均 ${v}%`}</title></line>
              <text x={VX} y={y + 6} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(hero ? 21 : 18), ...fade(on, 400 + i * 55) }}>{v.toFixed(1)}</text>
            </g>
          );
        })}
        <text x={X0} y={318} fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>
          横轴自 93% 起 —— 十个方法都在 94–99% 之间，从 0 起画会让差异完全看不出
        </text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F1 Rung Bars ════ GaussianDream：四个开关的消融 */
export function GdAblation() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string[], number][] = [
    [["当前帧重建"], 97.0],
    [["当前帧重建", "渲染", "深度"], 97.3],
    [["当前帧重建", "未来预测", "深度"], 97.5],
    [["当前帧重建", "未来预测", "渲染"], 97.2],
    [["当前帧重建", "未来预测", "渲染", "深度"], 98.4],
  ];
  const base = 236, LO = 96.6, SC = 105;
  return (
    <ChartFrame caption="只做当前帧重建已有 97.0，说明把观测解码成高斯状态本身就是有效的空间先验。保留未来预测和渲染但去掉深度降到 97.2 —— 只有 RGB 一致性不足以完全约束度量几何。">
      <Svg r={ref} h={300}>
        {D.map(([parts, v], i) => {
          const x = 92 + i * 116, hero = i === 4, h = (v - LO) * SC;
          return (
            <g key={i}>
              <rect x={x - 26} y={on ? base - h : base} width={52} height={on ? h : 0} rx={3}
                fill={hero ? C.hero : C.dataLo}
                style={{ transition: `y 720ms cubic-bezier(.22,1,.36,1) ${i * 90}ms, height 720ms cubic-bezier(.22,1,.36,1) ${i * 90}ms` }}>
                <title>{`${parts.join(" + ")} — LIBERO 平均 ${v}%`}</title></rect>
              <text x={x} y={base - h - 12} textAnchor="middle" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(hero ? 24 : 20), ...fade(on, 500 + i * 90) }}>{v.toFixed(1)}</text>
              {["当前帧重建", "未来预测", "渲染", "深度"].map((k, j) => (
                <text key={k} x={x} y={base + 22 + j * 15} textAnchor="middle"
                  fill={parts.includes(k) ? (hero ? C.heroTxt : C.mut) : C.grid}
                  style={{ ...label(9.5), ...fade(on, i * 90) }}>
                  {parts.includes(k) ? k : "—"}</text>
              ))}
            </g>
          );
        })}
        <line x1={40} y1={base} x2={600} y2={base} stroke={C.grid} strokeWidth={1} style={fade(on, 0)} />
        <text x={40} y={296} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          纵轴自 96.6% 起 · 灰=部分开关 · 蓝=四项齐全</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F8 Plumb Scatter ════ CounterScene：真实性 × 对抗性 */
export function CsTradeoff() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const P: [string, number, number][] = [
    ["CTG", 2.480, 2.0], ["VAE", 3.086, 13.3], ["STRIVE", 2.722, 15.3],
    ["CTG++", 2.963, 3.7], ["CCDiff", 2.092, 12.3], ["CounterScene", 1.877, 22.7],
  ];
  const X0 = 70, X1 = 590, base = 250,
    mx = (v: number) => X0 + ((v - 1.75) / 1.5) * (X1 - X0),
    my = (v: number) => base - (v / 24) * 196;
  return (
    <ChartFrame caption="nuScenes 闭环 8–10 秒段。基线分成两种失败模式：CTG 与 CTG++ 保住了低越界率但几乎不产生碰撞；STRIVE 与 VAE 拿到中等碰撞率，代价是真实性退化。左上角是两者兼得。">
      <Svg r={ref} h={310}>
        {Array.from({ length: 21 }, (_, g) => {
          const x = X0 + (g / 20) * (X1 - X0);
          return <line key={g} x1={x} y1={base} x2={x} y2={base - (g % 5 === 0 ? 8 : 4)}
            stroke={C.grid} strokeWidth={1} style={fade(on, g * 12)} />;
        })}
        <line x1={X0 - 8} y1={base} x2={X1 + 8} y2={base} stroke={C.grid} strokeWidth={1.2} style={fade(on, 0)} />
        {P.map(([n, ade, cr], i) => {
          const x = mx(ade), y = my(cr), hero = n === "CounterScene";
          return (
            <g key={n}>
              <line x1={x} y1={base} x2={x} y2={on ? y : base} stroke={hero ? C.hero : C.dataLo}
                strokeWidth={hero ? 1.6 : 1} style={{ transition: `y2 700ms cubic-bezier(.22,1,.36,1) ${200 + i * 70}ms` }} />
              <circle cx={x} cy={y} r={hero ? 7 : 4} fill={hero ? C.hero : C.data}
                style={pop(on, 260 + i * 70)}>
                <title>{`${n} — ADE ${ade}（越低越真实）· CR ${cr}%（越高越对抗）`}</title></circle>
              <text x={x} y={y - 15} textAnchor="middle" fill={hero ? C.heroTxt : C.mut}
                style={{ ...(hero ? num(17) : label(11)), ...fade(on, 560 + i * 70),
                  paintOrder: "stroke", stroke: C.card, strokeWidth: 4 }}>
                {hero ? `${n}  ${cr}%` : n}</text>
            </g>
          );
        })}
        <text x={X0} y={base + 22} fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>← 轨迹更真实　ADE</text>
        <text x={X1} y={base + 22} textAnchor="end" fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>3.1</text>
        <text x={34} y={my(12)} textAnchor="middle" transform={`rotate(-90 34 ${my(12)})`} fill={C.faint}
          style={{ ...label(10), ...fade(on, 800) }}>碰撞率 CR ↑ 更对抗</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F12 Dumbbell ════ CounterScene：关掉哪个部件最伤对抗性 */
export function CsAblation() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const FULL = 11.0;
  const D: [string, number][] = [
    ["No Jerk 去掉 jerk 正则", 10.5], ["No Conflict Aware 去掉冲突感知加权", 9.0],
    ["No Progressive 去掉渐进调度", 9.0], ["No Adaptive 去掉到达时间压缩", 7.5],
    ["Minimal 只留基础空间与时间目标", 6.5],
  ];
  const X0 = 330, X1 = 596, mx = (v: number) => X0 + ((v - 6) / 5.6) * (X1 - X0);
  return (
    <ChartFrame caption="Full 的碰撞率是 11.0%。去掉自适应到达时间压缩造成最大跌幅，而真实性几乎不动（ADE 0.753 对 0.747）—— 时间压缩负责对抗效果，调度与正则负责真实性。">
      <Svg r={ref} h={266}>
        <line x1={mx(FULL)} y1={30} x2={mx(FULL)} y2={218} stroke={C.grid} strokeWidth={1}
          strokeDasharray="3 4" style={fade(on, 0)} />
        <text x={mx(FULL)} y={22} textAnchor="middle" fill={C.mut}
          style={{ ...label(10.5), ...fade(on, 0) }}>Full 11.0%</text>
        {D.map(([n, v], i) => {
          const y = 56 + i * 34, xa = mx(FULL), xb = mx(v), hero = i === 3;
          const beads = Math.round((FULL - v) * 2);
          return (
            <g key={n}>
              <text x={316} y={y + 4} textAnchor="end" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 80) }}>{n}</text>
              <line x1={X0 - 10} y1={y} x2={X1} y2={y} stroke={C.grid} strokeWidth={1} style={fade(on, i * 80)} />
              {Array.from({ length: beads }, (_, k) => {
                const t = (k + 0.5) / beads;
                return <circle key={k} cx={xb + t * (xa - xb)} cy={y + (rnd(k + 1, i + 3) - 0.5) * 2}
                  r={2.1} fill={hero ? C.hero : C.dataLo} style={pop(on, 300 + i * 80 + k * 26)} />;
              })}
              <circle cx={xa} cy={y} r={4.4} fill={C.card} stroke={C.faint} strokeWidth={1.3}
                style={pop(on, 200 + i * 80)} />
              <circle cx={xb} cy={y} r={5.4} fill={hero ? C.hero : C.ink} style={pop(on, 620 + i * 80)}>
                <title>{`${n} — CR ${v}%（相对 Full 掉 ${(FULL - v).toFixed(1)} 个百分点）`}</title></circle>
              <text x={xb - 13} y={y + 7} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(20), ...fade(on, 700 + i * 80) }}>{v.toFixed(1)}</text>
            </g>
          );
        })}
        <text x={X0 - 10} y={250} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          一珠 = 0.5 个百分点 · 空心 = Full 基准 · 实心 = 关掉该部件后</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F5 Tick Rows ════ ReconDrive：下游检测 mAP + 生成耗时 */
export function RdPerception() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number, string, boolean][] = [
    ["ReconDrive", 26.7, "15s", true], ["DrivingForward", 23.4, "5s", true],
    ["PVG", 18.5, "23min", false], ["DeformableGS", 16.4, "46min", false],
    ["OmniRe", 16.1, "35min", false], ["Street Gaussians", 14.6, "31min", false],
  ];
  const X0 = 190, PX = 12.6, VX = 604, TX = 636;
  return (
    <ChartFrame caption="渲染结果按 2 Hz 送进在 nuScenes 原图上预训练的 UniAD，横向偏移七档一起统计，只算车辆类别。四个 per-scene 优化方法的检测 mAP 全部低于前馈的 DrivingForward —— 重建阶段的光度指标高，不等于渲染结果对下游感知可用。">
      <Svg r={ref} h={280}>
        {D.map(([n, v, t, ff], i) => {
          const y = 34 + i * 38, ticks = Math.round(v), hero = i === 0;
          return (
            <g key={n}>
              <text x={176} y={y + 4} textAnchor="end" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 70) }}>{n}</text>
              <text x={176} y={y + 18} textAnchor="end" fill={C.grid}
                style={{ ...label(9), ...fade(on, i * 70) }}>{ff ? "前馈" : "per-scene 优化"}</text>
              <line x1={X0} y1={y + 8} x2={X0 + 28 * PX} y2={y + 8} stroke={C.grid} strokeWidth={1}
                style={fade(on, i * 70)} />
              {Array.from({ length: ticks }, (_, k) => (
                <line key={k} x1={X0 + k * PX + PX / 2} y1={y + 8}
                  x2={X0 + k * PX + PX / 2} y2={y + 8 - (11 + rnd(k + 1, i + 2) * 6)}
                  stroke={hero ? C.hero : C.data} strokeWidth={1.5}
                  opacity={0.45 + rnd(k + 3, i + 5) * 0.5} style={fade(on, i * 70 + k * 13)} />
              ))}
              <text x={VX} y={y + 9} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(hero ? 22 : 19), ...fade(on, 400 + i * 70) }}>
                {v.toFixed(1)}<title>{`${n} — 检测 mAP ${v}% · 单场景高斯生成 ${t}`}</title></text>
              <text x={TX} y={y + 9} textAnchor="end" fill={C.faint}
                style={{ ...label(10.5), ...fade(on, 500 + i * 70) }}>{t}</text>
            </g>
          );
        })}
        <text x={X0} y={268} fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>
          一 tick = 1 个百分点 mAP · 小字为单场景高斯生成耗时</text>
      </Svg>
    </ChartFrame>
  );
}

export const CHARTS = {
  "sv-tsr-dsr": SvTsrDsr, "sv-ood": SvOod, "sv-tau": SvTau,
  "gd-libero": GdLibero, "gd-ablation": GdAblation,
  "cs-tradeoff": CsTradeoff, "cs-ablation": CsAblation,
  "rd-perception": RdPerception,
} as const;
export type ChartKey = keyof typeof CHARTS;
