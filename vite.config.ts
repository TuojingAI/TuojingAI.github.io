import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), {
    name: "lab-directory-entry",
    configureServer(server) {
      // Vite's SPA fallback otherwise sends /lab/ to the company homepage.
      server.middlewares.use((request, _response, next) => {
        if (request.url?.split("?")[0] === "/lab/") {
          request.url = request.url.replace("/lab/", "/lab/index.html");
        }
        next();
      });
    },
  }],
});
