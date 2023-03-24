// .storybook/main.js

const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  /** Expose public folder to storybook as static */
  staticDirs: [path.resolve(__dirname, '../../../apps/client/public')],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    'storybook-addon-paddings',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    // 'storybook-addon-next',
    'storybook-addon-next-router',
    {
      name: 'storybook-addon-next',
      id: 'storybook-addon-next',
      options: {
        nextConfigPath: path.resolve(__dirname, '../../../apps/client/next.config.js'),
      },
    },
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: config => {
    /**
     * Add support for alias-imports
     * @see https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391
     */
    config.resolve.alias = {
      ...config.resolve?.alias,
      '@': [path.resolve(__dirname, '../src/'), path.resolve(__dirname, '../')],
    };

    /**
     * Fixes font import with /
     * @see https://github.com/storybookjs/storybook/issues/12844#issuecomment-867544160
     */
    config.resolve.roots = [path.resolve(__dirname, '../public'), 'node_modules'];

    return config;
  },
};
