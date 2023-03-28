module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'turbo',
    'prettier',
  ],
  rules: {
    // 'import/order': [
    //   'error',
    //   {
    //     alphabetize: { order: 'asc' },
    //     groups: [
    //       ['builtin', 'external'],
    //       'internal',
    //       'parent',
    //       'sibling',
    //       'index',
    //     ],
    //     'newlines-between': 'never',
    //   },
    // ],
    'turbo/no-undeclared-env-vars': 'off',
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
