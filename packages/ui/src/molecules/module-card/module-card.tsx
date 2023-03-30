import Link from 'next/link';
import { FC, ReactNode, memo } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { ProgressBar } from '../../atoms/progress-bar';

type ModuleCardProps =
  | {
      variant?: 'default';
      href: string;
      icon: ReactNode;
      color: string;
      name: string;
      alias: string;
      tasks?: number;
      progress?: number;
      credits?: number;
      onClick?: never;
      onDelete: () => void;
    }
  | {
      variant: 'button';
      onClick?: () => void;
      icon: ReactNode;
      name?: string;
      color?: never;
      alias?: never;
      href?: never;
      tasks?: never;
      progress?: never;
      credits?: never;
      onDelete?: never;
    }
  | {
      variant: 'loading';
      href?: undefined;
      icon?: undefined;
      color?: undefined;
      name?: undefined;
      alias?: undefined;
      tasks?: undefined;
      progress?: undefined;
      credits?: undefined;
      onClick?: never;
      onDelete?: never;
    };

export const ModuleCard: FC<ModuleCardProps> = ({
  variant = 'default',
  href,
  icon,
  name,
  alias,
  tasks,
  progress,
  color,
  credits,
  onClick,
  onDelete,
}) => {
  if (variant === 'loading') {
    return <div role="status" className="h-[90px] min-w-[300px] animate-pulse accent-mask" />;
  }

  if (variant === 'button') {
    return (
      <button
        onClick={onClick}
        className="flex justify-center items-center text-primary bg-accent block rounded-2xl p-6 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700/50"
      >
        <span className="text-base lg:text-lg">{icon}</span>
        <h3 className="pt-2 text-base lg:text-lg">{name}</h3>
      </button>
    );
  }

  return (
    <div className="relative">
      <button onClick={onDelete} className="absolute p-5 right-0 accent-mask-hover">
        <AiOutlineDelete size={22} />
      </button>
      <a
        href={href as string}
        className="text-primary block p-6 transition-colors accent-mask-hover border-b-2 "
      >
        <span className="text-base lg:text-lg">{icon}</span>
        <h3 className="pt-2 text-base lg:text-lg">{name}</h3>
        <p className="pt-1 text-sm opacity-75 dark:text-zinc-400">{alias}</p>
        {credits && <p className="pt-1 pb-3 text-xs opacity-50">{credits} Credits</p>}
        <div>
          {progress && tasks && (
            <div className="flex flex-col gap-1">
              <span className="pb-[2px] text-xs text-zinc-500">
                {tasks} {tasks === 1 ? 'task' : 'tasks'} remaining
              </span>
              <ProgressBar value={progress} color={color} />
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default memo(ModuleCard);
