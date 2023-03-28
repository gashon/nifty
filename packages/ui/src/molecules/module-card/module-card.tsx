import Link from 'next/link';
import { FC, ReactNode, memo } from 'react';
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
}) => {
  if (variant === 'loading') {
    return (
      <div
        role="status"
        className="h-[168px] min-w-[300px] animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"
      />
    );
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
    <a
      href={href as string}
      className="text-primary bg-accent block rounded-2xl p-6 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700/50"
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
  );
};

export default memo(ModuleCard);
