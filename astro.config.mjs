import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

const rawEnv = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

function readEnv(...keys) {
  for (const key of keys) {
    const value = rawEnv[key];
    if (value) return value;
  }
  throw new Error(
    `[@sanity/astro] Missing required environment variable. Provide one of ${keys.join(', ')}.`
  );
}

const projectId = readEnv(
  'SANITY_STUDIO_PROJECT_ID',
  'SANITY_PROJECT_ID',
  'PUBLIC_SANITY_STUDIO_PROJECT_ID',
  'PUBLIC_SANITY_PROJECT_ID'
);
const dataset = readEnv(
  'SANITY_STUDIO_DATASET',
  'SANITY_DATASET',
  'PUBLIC_SANITY_STUDIO_DATASET',
  'PUBLIC_SANITY_DATASET'
);

export default defineConfig({
  integrations: [
    sanity({
      projectId,
      dataset,
      studioBasePath: '/studio'
    }),
    react(),
    tailwind({
      applyBaseStyles: false
    })
  ],
  site: 'https://madeleine-hochzeitsfotografie.de'
});
