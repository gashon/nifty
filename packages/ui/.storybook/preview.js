// .storybook/preview.js

import { DocsContainer } from '@storybook/addon-docs';
import { useDarkMode } from 'storybook-dark-mode';
import * as NextImage from 'next/image';
import { dark, light } from './theme';

import '../../../apps/client/src/styles/globals.css';

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  // controls: {
  //   matchers: {
  //     color: /(background|color)$/i,
  //     date: /Date$/,
  //   },
  // },
  darkMode: {
    dark: { ...dark },
    light: { ...light },
    darkClass: 'dark',
    classTarget: 'html',
    stylePreview: true,
  },
  docs: {
    container: props => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const isDark = useDarkMode();

      const { id: storyId, storyById } = props.context;
      const {
        parameters: { docs = {} },
      } = storyById(storyId);
      docs.theme = isDark ? dark : light;

      return (
        <div className={isDark ? 'dark-layout' : 'light'}>
          <DocsContainer {...props} />
        </div>
      );
    },
  },
  layout: 'fullscreen',
  options: {
    storySort: {
      order: ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages', '*'],
    },
  },
  previewTabs: {
    'storybook/docs/panel': { index: -1 },
  },
};

export const decorators = [
  renderStory => {
    const isDark = useDarkMode();
    return <div className={isDark ? 'dark-layout' : ''}>{renderStory()}</div>;
  },
];
