import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react';
import { Spinner } from './spinner';

const args: ComponentProps<typeof Spinner> = {
  size: 20,
};

const config: Meta<typeof args> = {
  title: 'Atoms / Spinner',
  component: Spinner,
  args,
  argTypes: {
    animation: {
      control: {
        type: 'text',
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    color: {
      control: {
        type: 'text',
      },
    },
    size: {
      control: {
        type: 'number',
      },
    },
    style: {
      control: {
        type: 'object',
      },
    },
  },
};

export default config;
