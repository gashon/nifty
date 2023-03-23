import clsx from 'clsx';
import React from 'react';

const DEFAULT_BUTTON_TAG = 'button';

type ButtonOwnProps<T extends React.ElementType> = {
  as?: T;
  variant?: 'light' | 'dark' | 'primary' | 'alert' | 'success' | 'info';
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  shortcut?: string;
};

type ButtonProps<T extends React.ElementType> = ButtonOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

type ButtonRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

// eslint-disable-next-line react/display-name
export const Button = React.forwardRef(
  <T extends React.ElementType = typeof DEFAULT_BUTTON_TAG>(
    {
      as,
      className,
      variant = 'light',
      size = 'sm',
      type = 'button',
      disabled,
      loading,
      children,
      shortcut,
      ...props
    }: ButtonProps<T>,
    ref: ButtonRef<T>
  ): React.ReactElement | null => {
    const Tag = as || DEFAULT_BUTTON_TAG;

    return (
      <Tag
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          className,
          'box-border relative rounded-md after:absolute inline-flex items-center align-middle min-w-min select-none',
          'outline-none justify-center text-center whitespace-nowrap transition appearance-none focus:outline-none font-medium',
          disabled && 'cursor-not-allowed',
          loading && 'cursor-default pointer-events-none',
          disabled || loading
            ? 'text-gray-400 bg-gray-100 border'
            : [
                'focus:outline-none shadow-sm hover:shadow focus:shadow active:shadow-none border border-transparent focus:border-blue-300 focus:ring ring-blue-400 ring-opacity-40 duration-200',
                {
                  'bg-gray-900 text-white ring-gray-500 hover:bg-gray-800': variant === 'dark',
                  'bg-white text-gray-800 border-gray-300 after:via-gray-100': variant === 'light',
                  'bg-blue-500 text-white border-blue-600': variant === 'primary',
                  'bg-red-400 text-white ring-red-400 hover:bg-red-500': variant === 'alert',
                  'bg-green-400 text-white ring-green-400 hover:bg-green-500':
                    variant === 'success',
                  'bg-teal-400 text-white ring-teal-400 hover:bg-teal-500': variant === 'info',
                },
              ],
          {
            'px-2.5 h-7 text-sm': size === 'xs',
            'px-3 h-8 text-sm': size === 'sm',
            'px-3 h-9 text-sm': size === 'md',
            'px-3 h-10': size === 'lg',
            'px-5 h-11 ': size === 'xl',
          }
        )}
        {...props}
      >
        {children}
        {shortcut && (
          <div className="ml-2 space-x-1">
            {shortcut.split('+').map((key, i) => (
              <span key={key}>
                {i > 0 && <span className="font-normal mr-1">+</span>}
                <kbd
                  key={key}
                  className="font-sans hidden sm:inline-block rounded px-1 text-xs bg-gray-300 bg-opacity-50"
                >
                  {key}
                </kbd>
              </span>
            ))}
          </div>
        )}
      </Tag>
    );
  }
);

export type { ButtonProps };
