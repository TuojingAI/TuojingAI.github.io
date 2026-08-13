/* 成员头像：静止是原来的蓝底姓氏圆，悬停切换成卡通形象。
   三种风格：日漫 / 像素 / 毕加索抽象。

   刻意不用 AI 生图：那是给真人套一张"像不像"的脸，既不好迭代，
   也不该拿真实姓名去配一张生成的面孔。这里全部是参数化 SVG ——
   抽象几何形象，按姓名做种子，同一个人每次渲染一致、不同人各不相同，
   零外部资源、总共几 KB。 */

export type AvatarStyle = "anime" | "pixel" | "picasso";

/* 由姓名派生的稳定伪随机流 */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

const SKIN = ["#FFE0C4", "#F7CFA8", "#FFD9BC", "#EFC49F"];
const HAIR = ["#2B2B33", "#3B2A22", "#1F3A5F", "#5B2E4A", "#123B36", "#7A3B1E"];
const POP = ["#0877FE", "#EB6106", "#00C2A8", "#7A5BFF", "#E8306B", "#F2B705"];
const BG = ["#FFF4EC", "#EAF3FF", "#F0F7F2", "#FBF0F4", "#F4F1FA"];

/* 从数组里取一个，并保证和 not 不同 —— 免得配出两块同色 */
function pick<T>(r: () => number, arr: T[], not?: T): T {
  const v = arr[(r() * arr.length) | 0];
  if (not === undefined || v !== not) return v;
  return arr[(arr.indexOf(v) + 1 + ((r() * (arr.length - 1)) | 0)) % arr.length];
}

/* —— 日漫风 —— 发型是这一组唯一的辨识度来源，所以给足 6 种。
   画法：先铺一个比脸大的发帽（dome），再盖脸，最后把"发帽减去发际线"
   的那块头发重新画在脸上 —— 发际线的曲线不同 = 发型不同。 */
const FRINGE = [
  /* 齐刘海：发际线向下鼓，压到眉毛 */
  "M6 22A14 14 0 0 1 34 22L32 18Q20 24 8 18Z",
  /* 中分：中间挑高成一个尖 */
  "M6 22A14 14 0 0 1 34 22L32 19Q26 22 20 14Q14 22 8 19Z",
  /* 碎发：锯齿发际线 */
  "M6 22A14 14 0 0 1 34 22L31 17L28 21L25 16L22 21L19 16L16 21L10 20Z",
  /* 斜刘海：一边长一边短 */
  "M6 22A14 14 0 0 1 34 22L33 23Q30 14 20 16Q12 18 8 17Z",
  /* 高额头：发际线平且靠上 */
  "M6 22A14 14 0 0 1 34 22L31 15Q20 12 9 15Z",
  /* 呆毛：齐刘海 + 头顶翘一根 */
  "M6 22A14 14 0 0 1 34 22L32 18Q20 23 8 18ZM19 8q2-5 4-6-1 3 0 6z",
];

function Anime({ r }: { r: () => number }) {
  const skin = pick(r, SKIN);
  const hair = pick(r, HAIR);
  const bg = pick(r, BG);
  const fringe = FRINGE[(r() * FRINGE.length) | 0];
  const side = r(); // 0-.33 无 / .33-.66 鬓发 / .66-1 长发
  const glasses = r() > 0.72;
  const eyeH = 3.2 + r() * 0.8;

  return (
    <>
      <rect width="40" height="40" fill={bg} />
      {/* 长发：先画在脸后面 */}
      {side > 0.66 && (
        <path d="M6 20q-1 12 2 16h24q3-4 2-16Z" fill={hair} opacity=".95" />
      )}
      {/* 脸 */}
      <ellipse cx="20" cy="22" rx="12" ry="12.6" fill={skin} />
      {/* 耳朵 */}
      <ellipse cx="7.8" cy="23" rx="1.6" ry="2.2" fill={skin} />
      <ellipse cx="32.2" cy="23" rx="1.6" ry="2.2" fill={skin} />
      {/* 鬓发 */}
      {side > 0.33 && (
        <>
          <path d="M6.6 19q-.6 7 1 11 1.6-6 1.4-11Z" fill={hair} />
          <path d="M33.4 19q.6 7-1 11-1.6-6-1.4-11Z" fill={hair} />
        </>
      )}
      {/* 头发 */}
      <path d={fringe} fill={hair} />
      {/* 眼睛：大瞳孔 + 两点高光 */}
      <ellipse cx="15" cy="23.5" rx="2.6" ry={eyeH} fill="#1B1B22" />
      <ellipse cx="25" cy="23.5" rx="2.6" ry={eyeH} fill="#1B1B22" />
      <circle cx="13.9" cy="22.1" r="1" fill="#fff" />
      <circle cx="23.9" cy="22.1" r="1" fill="#fff" />
      <circle cx="16" cy="25" r="0.55" fill="#fff" opacity=".85" />
      <circle cx="26" cy="25" r="0.55" fill="#fff" opacity=".85" />
      {/* 腮红 */}
      <ellipse cx="10.6" cy="27.4" rx="2.2" ry="1.3" fill="#FF9AA6" opacity=".5" />
      <ellipse cx="29.4" cy="27.4" rx="2.2" ry="1.3" fill="#FF9AA6" opacity=".5" />
      {/* 嘴 */}
      <path
        d="M18.4 29.8q1.6 1.6 3.2 0"
        stroke="#8A5A4A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      {/* 眼镜 */}
      {glasses && (
        <g stroke="#1B1B22" strokeWidth="0.9" fill="none" opacity=".85">
          <rect x="11.4" y="20.4" width="7.2" height="6.2" rx="2" />
          <rect x="21.4" y="20.4" width="7.2" height="6.2" rx="2" />
          <path d="M18.6 23.5h2.8M8.4 22.4l3 .6M31.6 22.4l-3 .6" />
        </g>
      )}
    </>
  );
}

/* —— 像素风：10×10 网格，硬边方块 —— */
function Pixel({ r }: { r: () => number }) {
  const skin = pick(r, SKIN);
  const hair = pick(r, HAIR);
  const shirt = pick(r, POP);
  const bg = pick(r, BG);
  const top = (r() * 3) | 0; // 0 平头 / 1 中分 / 2 莫西干
  /* 不画眼镜：脸只有 6 格宽，两片镜片加鼻梁必然连成一条横贯全脸的黑条，
     读起来是眼罩不是眼镜。改用眉毛区分个体。 */
  const brow = r() > 0.5;
  const P = 4;
  let k = 0;
  const px = (x: number, y: number, w: number, h: number, f: string) => (
    <rect key={k++} x={x * P} y={y * P} width={w * P} height={h * P} fill={f} />
  );
  return (
    <>
      <rect width="40" height="40" fill={bg} />
      {/* 头发 */}
      {top === 2 ? (
        <>
          {px(4, 0, 2, 3, hair)}
          {px(2, 2, 6, 1, hair)}
        </>
      ) : (
        <>
          {px(2, 1, 6, 2, hair)}
          {px(1, 2, 8, 1, hair)}
          {top === 1 && px(4, 1, 2, 1, skin)}
        </>
      )}
      {/* 脸 */}
      {px(2, 3, 6, 4, skin)}
      {px(1, 4, 1, 2, skin)}
      {px(8, 4, 1, 2, skin)}
      {/* 鬓角 */}
      {px(1, 3, 1, 1, hair)}
      {px(8, 3, 1, 1, hair)}
      {/* 眉毛 */}
      {brow && (
        <>
          {px(3, 3, 1, 1, hair)}
          {px(6, 3, 1, 1, hair)}
        </>
      )}
      {/* 眼睛 */}
      {px(3, 4, 1, 1, "#1B1B22")}
      {px(6, 4, 1, 1, "#1B1B22")}
      {/* 嘴 */}
      {px(4, 6, 2, 1, "#B4614F")}
      {/* 身体 */}
      {px(2, 7, 6, 3, shirt)}
      {px(1, 8, 1, 2, shirt)}
      {px(8, 8, 1, 2, shirt)}
      {px(4, 7, 2, 1, skin)}
    </>
  );
}

/* —— 毕加索抽象风：面部被切成错位的平面，双眼不在一个高度 —— */
function Picasso({ r }: { r: () => number }) {
  const a = pick(r, POP);
  const b = pick(r, POP, a);
  const skin = pick(r, SKIN);
  const bg = pick(r, BG);
  const flip = r() > 0.5;
  const tilt = -6 + r() * 12;
  /* 三套切法：竖切 / 斜切 / 对角切 —— 否则十几个头像只有配色在变，
     几何完全一样，一眼看出是同一个模板 */
  const cut = (r() * 3) | 0;
  const planes = [
    ["M4 6h16l-3 28H7Z", "M20 6h16l-2 28H17Z", "M12 14l14-4-2 12-12 3Z"],
    ["M6 4l15 3-5 29-9-2Z", "M21 7l14-3 1 28-20 4Z", "M9 17l20-5-1 10-18 4Z"],
    ["M4 4h18L6 36H4Z", "M22 4h14v32H8Z", "M10 20l22-8v9l-20 8Z"],
  ][cut];
  return (
    <g transform={flip ? "translate(40,0) scale(-1,1)" : undefined}>
      <rect width="40" height="40" fill={bg} />
      <g transform={`rotate(${tilt} 20 20)`}>
        {/* 三块错位的面 */}
        <path d={planes[0]} fill={skin} />
        <path d={planes[1]} fill={a} opacity=".85" />
        <path d={planes[2]} fill={b} opacity=".7" />
        {/* 侧脸轮廓线 */}
        <path
          d="M20 7c3 4 2 8 0 11 3 2 3 5 0 7 2 3 1 6-2 8"
          stroke="#1B1B22"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* 一只圆眼、一只杏眼，高度错开 —— 立体主义的签名 */}
        <circle cx="12" cy="16" r="3.2" fill="#FFF" stroke="#1B1B22" strokeWidth="1" />
        <circle cx="12" cy="16" r="1.3" fill="#1B1B22" />
        <path
          d="M25 23c2-2.4 5-2.4 7 0-2 2.4-5 2.4-7 0Z"
          fill="#FFF"
          stroke="#1B1B22"
          strokeWidth="1"
        />
        <circle cx="28.5" cy="23" r="1.2" fill="#1B1B22" />
        {/* 折线嘴 */}
        <path
          d="M13 28l4 2 4-3"
          stroke="#1B1B22"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

const STYLES: AvatarStyle[] = ["anime", "pixel", "picasso"];

export default function MemberAvatar({
  name,
  initial,
  index = 0,
  style,
}: {
  name: string;
  initial: string;
  /* 按顺序轮换风格，保证三种各占三分之一；用哈希分配会分布不均 */
  index?: number;
  style?: AvatarStyle;
}) {
  const r = rng(name);
  const kind = style ?? STYLES[index % STYLES.length];

  return (
    <span className="avatar relative block size-11 shrink-0">
      {/* 静止态：原来的蓝底姓氏圆 */}
      <span className="avatar-face absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-deep font-serif text-sm font-bold text-white">
        {initial}
      </span>
      {/* 悬停态：卡通形象 */}
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className="avatar-toon absolute inset-0 size-full rounded-full"
        shapeRendering={kind === "pixel" ? "crispEdges" : "auto"}
      >
        {kind === "anime" && <Anime r={r} />}
        {kind === "pixel" && <Pixel r={r} />}
        {kind === "picasso" && <Picasso r={r} />}
      </svg>
    </span>
  );
}
