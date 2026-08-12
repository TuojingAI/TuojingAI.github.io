import Legacy from "./versions/Legacy";

/* 已定稿：官网使用原版（Legacy）。
   评审期的另外六版（Quiet / Frontier / Manifesto / Atlas / Cinema / Specimen）
   与版本切换器已从入口移除，文件仍留在 src/versions/ 下，需要时改回这里即可。 */
export default function App() {
  return <Legacy />;
}
