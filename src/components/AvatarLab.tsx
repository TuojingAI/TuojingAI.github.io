/* 临时预览页：?avatars=1 —— 看清三种风格的全部变体，审完删掉 */
import MemberAvatar, { type AvatarStyle } from "./MemberAvatar";

const SEEDS = ["俞海宝","秦海芳","荆博文","张梓健","蒋雨清","王明鑫","葛晨晨","沈瀚文","邹颜刚","李","陈","刘","黄","周","吴","徐","孙","马"];
const STYLES: AvatarStyle[] = ["anime", "pixel", "picasso"];

export default function AvatarLab() {
  return (
    <div style={{ padding: 24, background: "#fff", fontFamily: "sans-serif" }}>
      {STYLES.map((s) => (
        <div key={s} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, marginBottom: 8 }}>{s}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SEEDS.map((n) => (
              <div key={n} style={{ width: 96, textAlign: "center" }}>
                <div style={{ width: 96, height: 96, position: "relative" }} className="lab">
                  <MemberAvatar name={n} initial={n[0]} style={s} />
                </div>
                <div style={{ fontSize: 10 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <style>{`.lab .avatar{width:96px;height:96px}.lab .avatar-face{display:none}.lab .avatar-toon{opacity:1;transform:none}`}</style>
    </div>
  );
}
