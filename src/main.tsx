import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AvatarLab from "./components/AvatarLab";
import ChartLab from "./components/charts/ChartLab";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {(() => {
      const q = new URLSearchParams(location.search);
      if (import.meta.env.DEV && q.has("avatars")) return <AvatarLab />;
      if (import.meta.env.DEV && q.has("charts")) return <ChartLab />;
      return <App />;
    })()}
  </React.StrictMode>,
);
