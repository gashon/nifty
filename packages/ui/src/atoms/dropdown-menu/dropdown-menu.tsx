import { Menu } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { FC, PropsWithChildren, ReactNode } from 'react';

const menuContentStyles = cva(
  [
    'absolute',
    'left-0',
    'flex',
    'flex-col',
    'w-full',
    'gap-1',
    'text-black',
    'origin-top-right',
    'dark:text-white',
    'rounded-xl',
    'focus:outline-none',
  ],
  {
    variants: {
      pos: {
        top: ['top-0', '-translate-y-full'],
        bottom: ['translate-y-2'],
      },
    },
    defaultVariants: {
      pos: 'bottom',
    },
  }
);

type ListItem =
  | { onClick?: undefined; href: string; label: string; icon: ReactNode }
  | { onClick: () => void; href?: undefined; label: string; icon: ReactNode };

type DropdownMenuProps = VariantProps<typeof menuContentStyles> & {
  buttonAs?: 'button' | 'div';
  menuClassName?: string;
  itemClassName?: string;
  list: ListItem[];
};

export const DropdownMenu: FC<PropsWithChildren<DropdownMenuProps>> = ({
  children,
  list,
  pos,
  buttonAs,
  menuClassName,
  itemClassName,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left w-max">
      <Menu.Button as={buttonAs}>{children}</Menu.Button>
      <Menu.Items
        as="ul"
        className={`${menuContentStyles({ pos })} ${menuClassName}`}
      >
        {list.map((item) => (
          <Menu.Item
            key={item.label}
            as="li"
            className={`border border-b-none hover:border-primary ${
              itemClassName ?? ''
            }`}
          >
            {item.href ? (
              <a
                href={item.href}
                className="flex h-9 items-center gap-3 px-3 text-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="flex h-9 w-full items-center gap-3 px-3 text-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};
