import clsx from 'clsx';
import React from 'react';

const DEFAULT_TEXT_TAG = 'div';

interface TextOwnProps<T extends React.ElementType> {
  as?: T;
  color?:
    | 'black'
    | 'dark'
    | 'default'
    | 'gray'
    | 'lightGray'
    | 'light'
    | 'white'
    | 'inherit'
    | 'transparent';
  family?: 'sans' | 'serif' | 'mono';
  size?:
    | 'xs'
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';
  weight?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  uppercase?: boolean;
  italic?: boolean;
  prose?: boolean;
}

type TextProps<T extends React.ElementType> = TextOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

export function Text<T extends React.ElementType = typeof DEFAULT_TEXT_TAG>({
  as,
  className,
  color = 'default',
  family,
  size,
  weight,
  align,
  prose,
  truncate,
  uppercase,
  italic,
  ...props
}: TextProps<T>): React.ReactElement | null {
  const Tag = as || DEFAULT_TEXT_TAG;

  return (
    <Tag
      className={clsx(
        className,
        {
          'text-black': color === 'black',
          'text-gray-900': color === 'dark',
          'text-gray-700': color === 'default',
          'text-gray-500': color === 'gray',
          'text-gray-300': color === 'lightGray',
          'text-gray-100': color === 'light',
          'text-white': color === 'white',
          'text-inherit': color === 'inherit',
          'text-transparent': color === 'transparent',
        },
        {
          'font-sans': family === 'sans',
          'font-serif': family === 'serif',
          'font-mono': family === 'mono',
        },
        {
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
          'text-2xl': size === '2xl',
          'text-3xl': size === '3xl',
          'text-4xl': size === '4xl',
          'text-5xl': size === '5xl',
          'text-6xl': size === '6xl',
          'text-7xl': size === '7xl',
          'text-8xl': size === '8xl',
          'text-9xl': size === '9xl',
        },
        {
          'font-thin': weight === 'thin',
          'font-extralight': weight === 'extralight',
          'font-light': weight === 'light',
          'font-normal': weight === 'normal',
          'font-medium': weight === 'medium',
          'font-semibold': weight === 'semibold',
          'font-bold': weight === 'bold',
          'font-extrabold': weight === 'extrabold',
          'font-black': weight === 'black',
        },
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
        { truncate, uppercase, italic, 'max-w-prose': prose }
      )}
      {...props}
    />
  );
}

export type { TextProps };

