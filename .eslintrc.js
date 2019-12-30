module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  // parser: 'babel-eslint',
  // parserOptions: {
  //   sourceType: 'module'
  // },
  extends: 'style-guide',
  env: {
    browser: true,
    node: true,
    mocha: true,
    jest: true,
  },
  globals: {
    packAxios: true,
  },
  settings: {
    // https://github.com/benmosher/eslint-plugin-import/blob/master/README.md#settings
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.json', '.ts']
      }
    },
    'import/extensions': [
      '.js',
      '.ts',
      '.tsx',
      '.mjs',
      '.jsx',
    ],
  },
  rules: {
    "wrap-iife": [2, "any"],
    // https://eslint.org/docs/rules/arrow-body-style
    "arrow-body-style": ["error", "always"],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // This rule warns the usage of `console`
    // 不禁用 console
    'no-console': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-unused-vars': 'off',
    'global-require': 'off',
    'prefer-destructuring': 'off',
    // https://eslint.cn/docs/rules/guard-for-in
    'guard-for-in': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
    "no-unused-vars": "off",
    // specify the maximum length of a line in your program
  },
};