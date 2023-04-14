import { FC } from 'react';
import { IoMdCreate } from 'react-icons/io';
import { useAuth } from '@/features/auth';
import { useRecentModules, useDeleteModule } from '@/features/module';

import ModuleCard from '@nifty/ui/molecules/module-card';

export const RecentModules: FC<{}> = ({}) => {
  const { user } = useAuth();
  const { data: modules, isFetched } = useRecentModules(user.id, 6);
  const { mutate: deleteModule } = useDeleteModule();

  // todo fetch data
  const noModules = !isFetched && (modules?.data || []).length === 0;

  return (
    <>
      {!isFetched && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(288px,_1fr))] gap-6">
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
          <ModuleCard variant="loading" />
        </div>
      )}
      {isFetched && noModules && (
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
      {isFetched && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.data.map((module) => (
            <div key={module.id}>
              <ModuleCard
                href={`/modules/${module.id}?${new URLSearchParams({
                  name: module.name,
                }).toString()}`}
                onDelete={() => deleteModule(module.id)}
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
