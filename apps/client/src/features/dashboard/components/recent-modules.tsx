import { FC } from 'react';
import Link from 'next/link';
import {
  useRecentModules,
  useDeleteModule,
  ModuleCreationButton,
} from '@nifty/client/features/module';

import type { Selectable, User } from '@nifty/common/types';
import { Button } from '@nifty/ui/atoms';
import ModuleCard from '@nifty/ui/molecules/module-card';

export const RecentModules: FC<{ user: Selectable<User> }> = ({ user }) => {
  const { data: modules, isFetched } = useRecentModules(user.id, {
    limit: '6',
  });
  const { mutate: deleteModule } = useDeleteModule();

  // todo fetch data
  const noModules = isFetched && modules.length === 0;

  return (
    <>
      <h3 className="pb-3 text-xs text-zinc-600 dark:text-zinc-400 lg:text-base">
        Classes
      </h3>
      {!isFetched && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(288px,_1fr))] gap-6">
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
        </div>
      )}
      {noModules && (
        <Link href={'/modules'}>
          <Button>Create your first class</Button>
        </Link>
      )}
      {isFetched && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div key={module.id}>
              <ModuleCard
                variant="default"
                href={`/modules/${module.id}?${new URLSearchParams({
                  name: module.name,
                }).toString()}`}
                onDelete={() => deleteModule(module.id)}
                icon={<></>}
                color="blue"
                {...module}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RecentModules;
