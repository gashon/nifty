import { FC } from 'react';
import { IoMdCreate } from 'react-icons/io';

import ModuleCard from '@nifty/ui/molecules/module-card';

export const ModuleList: FC<{}> = ({}) => {
  // todo fetch data
  const isLoading = false;
  const data = [
    {
      href: '/modules/1',
      icon: '🧠',
      name: 'Algorithms and Complexity',
      code: 'CS2860',
      color: 'red',
      credits: 15,
    },
    {
      href: '/modules/2',
      icon: '📽',
      name: 'IT Project Management',
      code: 'CS3003',
      color: 'green',
      credits: 15,
    },
    {
      href: '/modules/3',
      icon: '💅',
      name: 'User centered design',
      code: 'PC3001',
      color: 'indigo',
      credits: 15,
    },
    {
      href: '/modules/4',
      icon: '📌',
      name: 'Final Year Project',
      code: 'CS3810',
      color: 'amber',
      credits: 15,
    },
    {
      href: '/modules/5',
      icon: '🔐',
      name: 'Malicious Software',
      code: 'IY3840',
      color: 'blue',
      credits: 15,
    },
  ];
  const noModules = !isLoading && (data || []).length === 0;

  return (
    <>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(288px,_1fr))] gap-6">
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
        </div>
      )}
      {noModules && (
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center h-[288px]">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 lg:text-base">
              <ModuleCard
                href={'/d'}
                icon={<IoMdCreate />}
                color={'white'}
                name={'Create your first module'}
                code={"It's easy!"}
              />
            </p>
          </div>
        </div>
      )}
      {!isLoading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.map(module => (
            <div key={module.name}>
              <ModuleCard {...module} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ModuleList;
