import Link from 'next/link';
import { ComponentProps, FC, memo, ReactElement } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { ModuleTag } from '../../atoms/module-tag';

type NotebookItemProps =
  | {
      variant: 'loading';
      icon?: undefined;
      title?: undefined;
      lastEdited?: undefined;
      label?: undefined;
      href?: undefined;
      onClick?: never;
      onDelete?: never;
    }
  | {
      variant?: 'default';
      icon: string;
      title: string;
      lastEdited: string;
      label: ComponentProps<typeof ModuleTag>;
      href: string;
      onClick?: never;
      onDelete?: () => void;
    }
  | {
      variant: 'button';
      onClick?: () => void;
      onDelete?: never;
      icon: ReactElement;
      label: string;
      title?: never;
      lastEdited?: never;
      href?: never;
    };

export const NotebookItem: FC<NotebookItemProps> = ({
  variant = 'default',
  icon,
  title,
  lastEdited,
  label,
  href,
  onClick,
  onDelete,
}) => {
  if (variant === 'loading') {
    return (
      <div
        role="status"
        className="h-11 w-full animate-pulse bg-accent dark:bg-zinc-800 lg:h-12"
      />
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={onClick}
        className="flex justify-center items-center h-11 w-full rounded-xl bg-accent dark:bg-zinc-800 lg:h-12"
      >
        <span className="text-base lg:text-lg">{icon}</span>
        <h3 className="pt-2 text-base lg:text-lg">{label}</h3>
      </button>
    );
  }

  return (
    <div className="relative w-full">
      <button
        onClick={onDelete}
        className="absolute right-1 top-1 accent-mask-hover"
      >
        <AiOutlineDelete size={22} />
      </button>
      <a
        href={href as string}
        className="border-b-2 flex items-center justify-between transition-colors accent-mask-hover"
      >
        <span className="flex flex-1 items-center gap-3 truncate px-5 py-3">
          <span className="text-sm lg:text-base">{icon}</span>
          <span className="truncate text-sm text-primary dark:text-zinc-300 lg:text-base">
            {title}
          </span>
        </span>
        <div className="flex items-center gap-3 pr-5">
          <p className="text-xs text-zinc-500">{lastEdited}</p>
          {label && (
            <div className="flex items-center gap-3">
              {/* @ts-ignore */}
              <ModuleTag name={label.name} color={label.color} />
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default memo(NotebookItem);
