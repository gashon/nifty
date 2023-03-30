import { FC } from 'react';

import { useInfiniteDirectories, useDeleteModule } from '@/features/module';
import ModuleCard from '@nifty/ui/molecules/module-card';

export const ModuleList: FC = () => {
  // todo implement frontend pagination
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetched } =
    useInfiniteDirectories({ limit: 100 });
  const { mutate: deleteModule } = useDeleteModule();

  return (
    <div className="flex flex-col gap-4">
      {isFetching &&
        !isFetched &&
        [...Array(25)].map((_, i) => <ModuleCard key={i} variant="loading" />)}

      {isFetched && (
        <>
          {data.pages.map(({ data }: any) =>
            data.map(module => (
              <div key={module.id}>
                <ModuleCard
                  onDelete={() => deleteModule(module.id)}
                  {...module}
                  href={`/modules/${module.id}?name=${module.name}`}
                />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default ModuleList;
