import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { deskStructure, defaultDocumentNode } from './sanity/structure';

const runtimeEnv = (typeof import.meta !== 'undefined' ? import.meta.env : {}) as Record<string, string | undefined>;
const serverEnv =
  typeof globalThis !== 'undefined' && 'process' in globalThis && globalThis.process?.env
    ? (globalThis.process.env as Record<string, string | undefined>)
    : {};

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = runtimeEnv[key] ?? runtimeEnv[`PUBLIC_${key}`] ?? serverEnv[key];
    if (value) return value;
  }
  throw new Error(`[sanity.config] Missing required environment variable. Provide one of ${keys.join(', ')}.`);
}

const projectId = readEnv('SANITY_STUDIO_PROJECT_ID', 'SANITY_PROJECT_ID');
const dataset = readEnv('SANITY_STUDIO_DATASET', 'SANITY_DATASET');

export default defineConfig({
  name: 'madeleine-studio',
  title: 'Madeleine Studio',
  projectId,
  dataset,
  basePath: '/studio',
  schema: {
    types: schemaTypes
  },
  plugins: [
    deskTool({
      structure: deskStructure,
      defaultDocumentNode
    }),
    visionTool()
  ]
});
