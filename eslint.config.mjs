import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tailwind from 'eslint-plugin-tailwindcss';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is avail able after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      '.next/**',
      'public/**',
      'playwright-report/**',
      'test-results/**',
      'next.config.js',
      'postcss.config.js',
      'coverage/**',
      'postcss.config.mjs',
      'next.config.mjs',
      'eslint.config.mjs',
      'next-env.d.ts',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginUnicorn.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  ...compat.config({
    extends: ['next'],
    settings: {
      next: {
        rootDir: '.',
      },
    },
  }),
  ...compat.config({
    extends: ['plugin:drizzle/all'],
  }),
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      complexity: ['error', { max: 10 }],
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
export default config;
