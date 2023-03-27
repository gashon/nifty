import { FC } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import ModuleCard from '@nifty/ui/molecules/module-card';
import { CreateModule } from '@/features/module/components/create-module';

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

      {!isLoading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreateModule />
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
