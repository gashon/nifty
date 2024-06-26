module.exports = {
  root: true,
  env: {
    node: true,
  },
  settings: {
    next: {
      rootDir: ['packages/*/'],
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@tanstack/query', 'next'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'custom',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
      },
    },
  ],
};
