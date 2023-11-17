import type { Config } from 'tailwindcss';
import defaultConfig from '@mcsph/tooling/tailwind/tailwind.config';

const config: Pick<Config, 'presets'> = {
  presets: [defaultConfig],
};

export default config;
