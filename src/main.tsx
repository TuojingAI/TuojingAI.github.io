import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AvatarLab from "./components/AvatarLab";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {import.meta.env.DEV && new URLSearchParams(location.search).has("avatars") ? (
      <AvatarLab />
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
