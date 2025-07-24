module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
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
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '.eslintrc.js'],
};
