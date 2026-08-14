/* 扫光文字。技法学自 styledrive.github.io 的 award-badge-shine：
   ::after 用 content: attr(data-text) 复刻一份同样的文字盖在原文上，
   给它一条极窄的亮带渐变、用 background-clip: text 只透过字形显示，
   再把 background-position 从右扫到左。

   关键在于底下那层原文一个像素都不动 —— 颜色、字重、字距全是原样，
   动的只有盖在上面那层透明文字里的高光。所以「只要闪光、不改字色」。

   data-text 必须和 children 一模一样，否则上下两层字形对不齐。 */
export default function Shine({ text }: { text: string }) {
  return (
    <span className="tj-shine" data-text={text}>
      {text}
    </span>
  );
}
