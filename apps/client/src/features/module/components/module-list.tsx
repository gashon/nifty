import { FC, useState } from 'react';

import { ModuleListContext, ModuleCreationButton } from '@/features/module';

import { IDirectory } from '@nifty/server-lib/models/directory';
import ModuleCard from '@nifty/ui/molecules/module-card';

const MOCK = [
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

export const ModuleList: FC<{}> = ({}) => {
  const [directories, setDirectories] = useState<any | IDirectory[] | undefined>(MOCK);

  // todo fetch data
  const isLoading = false;

  return (
    <ModuleListContext.Provider value={{ directories, setDirectories }}>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(288px,_1fr))] gap-6">
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
        </div>
      )}

      {!isLoading && directories && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModuleCreationButton />
          {directories.map(module => (
            <div key={module.name}>
              <ModuleCard {...module} />
            </div>
          ))}
        </div>
      )}
    </ModuleListContext.Provider>
  );
};

export default ModuleList;
