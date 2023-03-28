import { FC } from 'react';

import { ModuleCreationButton, useInfiniteDirectories } from '@/features/module';
import ModuleCard from '@nifty/ui/molecules/module-card';

export const ModuleList: FC = () => {
  // todo implement frontend pagination
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetched } =
    useInfiniteDirectories({ limit: 100 });

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(488px,_1fr))] gap-6">
      {isFetching &&
        !isFetched &&
        [...Array(25)].map((_, i) => <ModuleCard key={i} variant="loading" />)}

      {isFetched && (
        <>
          <ModuleCreationButton />
          {data.pages.map(({ data }: any) =>
            data.map(module => (
              <div key={module.id}>
                <ModuleCard {...module} href={`/modules/${module.id}`} />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default ModuleList;
