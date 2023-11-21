module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    quotes: ['error', 'single'],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1,
        ignores: [],
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'vue/no-setup-props-destructure': 'off',
  },
};
