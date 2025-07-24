import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  js.config({
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
  }),
  ...tseslint.config({
    files: ['**/*.ts'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    rules: {
      'no-unused-vars': 'warn',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  }),
  {
    ignores: [
      'dist',
      'node_modules',
      '*.config.js',
    ],
  },
];
