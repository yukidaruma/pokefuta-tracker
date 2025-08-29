import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

export default defineConfig({
  plugins: [tsConfigPaths(), react(), generouted()],
});
