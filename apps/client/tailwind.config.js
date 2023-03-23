// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
