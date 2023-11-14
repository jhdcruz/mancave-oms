import type { Config } from "tailwindcss";
import defaultConfig from "@erp/tooling/tailwind/tailwind.config";

const config: Pick<Config, "presets"> = {
  presets: [defaultConfig],
};

export default config;
