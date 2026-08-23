/* 临时预览页：?charts=1 —— 一次看全八张，import.meta.env.DEV 门控，不进生产包 */
import { CHARTS } from "./index";

const TITLE: Record<string, string> = {
  "sv-tsr-dsr": "SoftVTBench · F12 Dumbbell · 完成任务不等于没弄坏",
  "sv-ood": "SoftVTBench · F6 Paired Rungs · 分布偏移下 VT 全面高于 VO",
  "sv-tau": "SoftVTBench · F5 Tick Rows · 十个资产各自标定的形变容差",
  "gd-libero": "GaussianDream · F5 Tick Rows · LIBERO 十个方法",
  "gd-ablation": "GaussianDream · F1 Rung Bars · 四个开关的消融",
  "cs-tradeoff": "CounterScene · F8 Plumb Scatter · 真实性 × 对抗性",
  "cs-ablation": "CounterScene · F12 Dumbbell · 关掉哪个部件最伤对抗性",
  "rd-perception": "ReconDrive · F5 Tick Rows · 下游检测 mAP + 生成耗时",
};

export default function ChartLab() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 font-mono">
      {Object.entries(CHARTS).map(([k, Chart]) => (
        <section key={k} className="mb-2">
          <p className="mt-8 font-mono text-[11px] tracking-widest text-accent">{TITLE[k]}</p>
          <Chart />
        </section>
      ))}
    </div>
  );
}
