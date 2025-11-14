import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'node/no-unsupported-features/es-syntax': 'off'
    }
  },
  {
    name: 'local/config-ignores',
    ignores: ['eslint.config.js', 'prettier.config.js', 'postcss.config.cjs']
  }
];
