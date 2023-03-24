// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

const generateColorClass = variable => {
  return ({ opacityValue }) => `var(--${variable})`;
};

const textColor = {
  primary: generateColorClass('text-primary'),
  secondary: generateColorClass('text-secondary'),
  tertiary: generateColorClass('text-tertiary'),
};

const backgroundColor = {
  primary: generateColorClass('bg-primary'),
  secondary: generateColorClass('bg-secondary'),
  tertiary: generateColorClass('bg-tertiary'),
};

const borderColor = {
  primary: generateColorClass('border-primary'),
  secondary: generateColorClass('border-secondary'),
  tertiary: generateColorClass('border-tertiary'),
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../tailwind.config')],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  theme: {
    extend: {
      textColor,
      backgroundColor,
      borderColor,
      colors: {
        gray: colors.zinc,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/custom-forms')],
};
