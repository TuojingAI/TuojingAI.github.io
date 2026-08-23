/* 八张项目数据图。图型骨架取自 lieflat-charts 的 Lupi Basics gallery，
   每页之内模板不重复（F12 / F6 / F5 / F1 / F8）。
   数值逐格取自各项目论文的正式表格，与项目页正文里的表同源。 */
import { C, ChartFrame, label, num, rnd, useReveal } from "./base";

/* ── 共用：滚入后逐个淡入的属性 ── */
const fade = (on: boolean, delay: number, o = 1) => ({
  opacity: on ? o : 0,
  transition: `opacity 520ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
});
const pop = (on: boolean, delay: number, o = 1) => ({
  opacity: on ? o : 0,
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
  const D: [string, string, number, number][] = [
    ["Object-Soft", "DP · VO-C", 37.4, 33.6], ["Object-Soft", "DP · VT-C", 40.0, 30.4],
    ["Object-Soft", "π0.5 · VO-C", 41.6, 38.4], ["Object-Soft", "π0.5 · VT-C", 41.4, 35.0],
    ["Object-Soft", "FastWAM · VO-C", 62.0, 58.0], ["Object-Soft", "FastWAM · VT-C", 57.6, 54.4],
    ["Spatial-Soft", "DP · VO-C", 15.6, 13.4], ["Spatial-Soft", "DP · VT-C", 33.0, 25.0],
    ["Spatial-Soft", "π0.5 · VO-C", 26.0, 22.6], ["Spatial-Soft", "π0.5 · VT-C", 27.6, 22.0],
    ["Spatial-Soft", "FastWAM · VO-C", 37.0, 36.6], ["Spatial-Soft", "FastWAM · VT-C", 56.4, 56.0],
  ];
  const HERO = 1, X0 = 208, X1 = 532, VX = 636,
    mx = (v: number) => X0 + ((v - 10) / 52) * (X1 - X0);
  return (
    <ChartFrame caption="十二个 in-distribution 配置里，DSR 全部低于 TSR。缺口最大的是 Diffusion Policy 的视触觉变体：9.6 个百分点，相当于该配置成功 rollout 的 24%。">
      <Svg r={ref} h={618}>
        {D.map(([suite, n, tsr, dsr], i) => {
          const y = 64 + i * 42 + (i >= 6 ? 36 : 0), xa = mx(tsr), xb = mx(dsr), hero = i === HERO;
          const beads = Math.round(tsr - dsr);
          return (
            <g key={suite + n}>
              {(i === 0 || i === 6) && (
                <text x={194} y={y - 26} textAnchor="end" fill={C.heroTxt}
                  style={{ ...label(11), ...fade(on, i * 60) }}>{suite}</text>
              )}
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
        <text x={X0} y={600} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>空心 = 任务成功率 TSR · 实心 = 形变感知成功率 DSR · 珠子 = 两者之差</text>
        <text x={VX} y={600} textAnchor="end" fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>DSR %</text>
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
      <Svg r={ref} h={330}>
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
        <text x={40} y={322} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          纵轴自 96.6% 起 · 灰 = 部分开关 · 蓝 = 四项齐全</text>
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
  const D: [string, number, number][] = [
    ["No Jerk 去掉 jerk 正则", 10.5, 0.784], ["No Conflict Aware 去掉冲突感知加权", 9.0, 0.768],
    ["No Progressive 去掉渐进调度", 9.0, 0.775], ["No Adaptive 去掉到达时间压缩", 7.5, 0.753],
    ["Minimal 只留基础空间与时间目标", 6.5, 0.798],
  ];
  const X0 = 330, X1 = 528, VX = 566, TX = 640,
    mx = (v: number) => X0 + ((v - 6) / 5.6) * (X1 - X0);
  return (
    <ChartFrame caption="Full 的碰撞率是 11.0%。去掉自适应到达时间压缩造成最大跌幅，而真实性几乎不动（ADE 0.753 对 0.747）—— 时间压缩负责对抗效果，调度与正则负责真实性。">
      <Svg r={ref} h={266}>
        <line x1={mx(FULL)} y1={30} x2={mx(FULL)} y2={218} stroke={C.grid} strokeWidth={1}
          strokeDasharray="3 4" style={fade(on, 0)} />
        <text x={mx(FULL)} y={22} textAnchor="middle" fill={C.mut}
          style={{ ...label(10.5), ...fade(on, 0) }}>Full 11.0%</text>
        {D.map(([n, v, ade], i) => {
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
              <text x={VX} y={y + 7} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(20), ...fade(on, 700 + i * 80) }}>{v.toFixed(1)}</text>
              <text x={TX} y={y + 7} textAnchor="end" fill={C.faint}
                style={{ ...label(10.5), ...fade(on, 780 + i * 80) }}>{`ADE ${ade}`}</text>
            </g>
          );
        })}
        <text x={X0 - 10} y={250} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          一珠 = 0.5 个百分点 · 空心 = Full（CR 11.0 · ADE 0.747）· 实心 = 关掉该部件后</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F5 Tick Rows ════ ReconDrive：下游检测 mAP + 生成耗时 */
export function RdPerception() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number, number, string, boolean][] = [
    ["ReconDrive", 26.7, 18.9, "15s", true], ["DrivingForward", 23.4, 13.3, "5s", true],
    ["PVG", 18.5, 14.4, "23min", false], ["DeformableGS", 16.4, 13.4, "46min", false],
    ["OmniRe", 16.1, 12.9, "35min", false], ["Street Gaussians", 14.6, 11.9, "31min", false],
  ];
  const X0 = 186, PX = 10.6, VX = 500, AX = 574, TX = 640;
  return (
    <ChartFrame caption="渲染结果按 2 Hz 送进在 nuScenes 原图上预训练的 UniAD，横向偏移七档一起统计，只算车辆类别。四个 per-scene 优化方法的检测 mAP 全部低于前馈的 DrivingForward —— 重建阶段的光度指标高，不等于渲染结果对下游感知可用。">
      <Svg r={ref} h={280}>
        {D.map(([n, v, am, t, ff], i) => {
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
                  style={fade(on, i * 70 + k * 13, 0.45 + rnd(k + 3, i + 5) * 0.5)} />
              ))}
              <text x={VX} y={y + 9} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(hero ? 22 : 19), ...fade(on, 400 + i * 70) }}>
                {v.toFixed(1)}<title>{`${n} — 检测 mAP ${v}% · 单场景高斯生成 ${t}`}</title></text>
              <text x={AX} y={y + 9} textAnchor="end" fill={C.mut}
                style={{ ...label(11.5), ...fade(on, 480 + i * 70) }}>{am.toFixed(1)}</text>
              <text x={TX} y={y + 9} textAnchor="end" fill={C.faint}
                style={{ ...label(10.5), ...fade(on, 540 + i * 70) }}>{t}</text>
            </g>
          );
        })}
        <text x={X0} y={268} fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>
          一 tick = 1 个百分点检测 mAP · 中列 = 跟踪 AMOTA · 右列 = 单场景高斯生成耗时</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F6 Paired Rungs ════ GaussianDream：真机四个场景 */
export function GdReal() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number, number][] = [
    ["Scene-A", 42.5, 55.0], ["Scene-B", 50.0, 70.0],
    ["Scene-C", 25.0, 35.0], ["Scene-D", 20.0, 40.0],
  ];
  const base = 228, unit = 5.4, HERO = 3;
  return (
    <ChartFrame caption="真机平台是 leader-follower 双臂，follower 臂在评测时由策略直接控制。四个场景全部提升，平均从 34.4% 到 50.0%。论文另称最大增益出现在空间关系与长时程任务，但未给出场景编号与任务类别的对应。">
      <Svg r={ref} h={300}>
        {D.map(([n, a, b], i) => {
          const x = 118 + i * 136, hero = i === HERO, rg = (v: number) => Math.round(v / 2.5);
          return (
            <g key={n}>
              {Array.from({ length: rg(a) }, (_, k) => (
                <line key={"a" + k} x1={x - 40} y1={base - k * unit} x2={x - 8} y2={base - k * unit}
                  stroke={C.dataLo} strokeWidth={2} style={fade(on, i * 80 + k * 10)} />
              ))}
              {Array.from({ length: rg(b) }, (_, k) => (
                <line key={"b" + k} x1={x + 8} y1={base - k * unit} x2={x + 40} y2={base - k * unit}
                  stroke={hero ? C.hero : C.data} strokeWidth={2} style={fade(on, 150 + i * 80 + k * 10)} />
              ))}
              <text x={x - 24} y={base - rg(a) * unit - 10} textAnchor="middle" fill={C.faint}
                style={{ ...label(11), ...fade(on, 440 + i * 80) }}>{a.toFixed(1)}</text>
              <text x={x + 24} y={base - rg(b) * unit - 10} textAnchor="middle"
                fill={hero ? C.heroTxt : C.ink} style={{ ...num(21), ...fade(on, 580 + i * 80) }}>
                {b.toFixed(1)}<title>{`${n} — π0.5 ${a}% → GaussianDream ${b}%`}</title></text>
              <text x={x} y={base + 22} textAnchor="middle" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 80) }}>{n}</text>
            </g>
          );
        })}
        <line x1={40} y1={base + 4} x2={600} y2={base + 4} stroke={C.grid} strokeWidth={1} style={fade(on, 0)} />
        <text x={40} y={288} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          淡档 = π0.5 基线 · 实档 = GaussianDream · 一档 = 2.5 个百分点</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F10 Dot Heat ════ GaussianDream：RoboCasa 三类任务 */
export function GdRoboCasa() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const COL = ["Pick&Place", "Doors/Drawers", "Others", "Average"];
  const D: [string, number[]][] = [
    ["GaussianDream", [43.8, 66.3, 54.4, 54.8]], ["Being-H0.5", [36.0, 71.7, 57.6, 53.9]],
    ["GeoPredict", [22.7, 75.1, 62.4, 52.4]], ["π0", [14.0, 53.1, 58.5, 42.4]],
    ["π0.5", [36.0, 46.5, 39.5, 40.1]], ["GWM", [14.8, 54.3, 49.8, 39.3]],
    ["BC-Transformer", [3.8, 46.7, 38.0, 28.8]],
  ];
  const cx = (j: number) => 286 + j * 96, cy = (i: number) => 66 + i * 42;
  const rr = (v: number) => 3 + Math.sqrt(v) * 1.8;
  return (
    <ChartFrame caption="RoboCasa Human-50 少样本设置，24 个长时程厨房任务跨五个场景。GaussianDream 在对定位精度敏感的 Pick&Place 上最高，平均也最高；但 Doors/Drawers 与 Others 两列都落后 GeoPredict。">
      <Svg r={ref} h={382}>
        {COL.map((c, j) => (
          <text key={c} x={cx(j)} y={34} textAnchor="middle" fill={C.mut}
            style={{ ...label(10), ...fade(on, j * 60) }}>{c}</text>
        ))}
        {D.map(([n, v], i) => {
          const hero = i === 0;
          return (
            <g key={n}>
              <text x={244} y={cy(i) + 4} textAnchor="end" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 55) }}>{n}</text>
              {v.map((t, j) => (
                <g key={j}>
                  <circle cx={cx(j)} cy={cy(i)} r={rr(t)}
                    fill={hero ? C.hero : C.data}
                    style={pop(on, i * 55 + j * 24, hero ? 0.92 : 0.22 + (t / 80) * 0.55)}>
                    <title>{`${n} · ${COL[j]} — ${t}%`}</title></circle>
                  {rr(t) >= 12
                    ? <text x={cx(j)} y={cy(i) + 4} textAnchor="middle" fill="#FFFFFF"
                        style={{ ...label(10), ...fade(on, 300 + i * 55 + j * 24) }}>{t.toFixed(1)}</text>
                    : <text x={cx(j) + rr(t) + 6} y={cy(i) + 4} fill={C.mut}
                        style={{ ...label(10), ...fade(on, 300 + i * 55 + j * 24) }}>{t.toFixed(1)}</text>}
                </g>
              ))}
            </g>
          );
        })}
        <text x={150} y={370} fill={C.faint} style={{ ...label(10), ...fade(on, 900) }}>
          点面积 ∝ 成功率（半径按 √v 换算，不拿数值直接当半径）· 装得下的数字标在点内</text>
      </Svg>
    </ChartFrame>
  );
}

/* ════ F5 Tick Rows ════ CounterScene：只换选择策略，骨干与引导不变 */
export function CsSelection() {
  const { ref, on } = useReveal<SVGSVGElement>();
  const D: [string, number, number][] = [
    ["Ours 因果选择", 11.0, 0.721], ["Random 随机采样", 10.0, 1.024],
    ["SafeSim 距离最近", 9.5, 1.004], ["CCDiff TTC 最小", 8.0, 1.036],
  ];
  const X0 = 214, PX = 10.4, VX = 518, TX = 636;
  return (
    <ChartFrame caption="同一骨干与同一引导函数下只替换选择策略。值得记的是 CCDiff 的 TTC 选择拿到最低碰撞率，低于随机采样 —— 纯邻近判据会自信地锁定一个并非真正关键变量的智能体，而随机采样偶尔会碰对。更大的差距在真实性一侧：ADE 从 0.721 到 1.036，跨度约 44%。">
      <Svg r={ref} h={228}>
        {D.map(([n, cr, ade], i) => {
          const y = 46 + i * 42, ticks = Math.round(cr * 2), hero = i === 0;
          return (
            <g key={n}>
              <text x={206} y={y + 4} textAnchor="end" fill={hero ? C.heroTxt : C.mut}
                style={{ ...label(11), ...fade(on, i * 70) }}>{n}</text>
              <line x1={X0} y1={y + 8} x2={X0 + 23 * PX} y2={y + 8} stroke={C.grid}
                strokeWidth={1} style={fade(on, i * 70)} />
              {Array.from({ length: ticks }, (_, k) => (
                <line key={k} x1={X0 + k * PX + 5} y1={y + 8}
                  x2={X0 + k * PX + 5} y2={y + 8 - (12 + rnd(k + 1, i + 2) * 6)}
                  stroke={hero ? C.hero : C.data} strokeWidth={1.6}
                  style={fade(on, i * 70 + k * 14, 0.45 + rnd(k + 3, i + 5) * 0.5)} />
              ))}
              <text x={VX} y={y + 9} textAnchor="end" fill={hero ? C.heroTxt : C.ink}
                style={{ ...num(hero ? 22 : 19), ...fade(on, 400 + i * 70) }}>
                {cr.toFixed(1)}<title>{`${n} — CR ${cr}% · ADE ${ade}`}</title></text>
              <text x={TX} y={y + 9} textAnchor="end" fill={C.faint}
                style={{ ...label(10.5), ...fade(on, 500 + i * 70) }}>{`ADE ${ade}`}</text>
            </g>
          );
        })}
        <text x={X0} y={216} fill={C.faint} style={{ ...label(10), ...fade(on, 800) }}>
          一 tick = 0.5 个百分点碰撞率 · 右侧为轨迹误差 ADE（越低越真实）</text>
      </Svg>
    </ChartFrame>
  );
}

export const CHARTS = {
  "sv-tsr-dsr": SvTsrDsr, 
  "gd-ablation": GdAblation,
  "cs-tradeoff": CsTradeoff, "cs-ablation": CsAblation,
  "rd-perception": RdPerception,
  
  "gd-real": GdReal, "gd-robocasa": GdRoboCasa,
  "cs-selection": CsSelection,
} as const;
export type ChartKey = keyof typeof CHARTS;
