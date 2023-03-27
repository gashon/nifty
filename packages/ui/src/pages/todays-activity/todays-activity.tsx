import { ComponentProps, FC } from 'react';
import { IoMdCreate } from 'react-icons/io';
import Greeting from '../../molecules/greeting';
import ModuleCard from '../../molecules/module-card';
import NotebookItem from '../../molecules/notebook-item';
import { Dashboard } from '../../templates/Dashboard';

type TodaysActivityProps = Omit<ComponentProps<typeof Dashboard>, 'children'> & {
  greetingProps: ComponentProps<typeof Greeting>;
  recentModules: {
    data?: ComponentProps<typeof ModuleCard>[];
    isLoading: boolean;
  };
  recentNotebooks: {
    data?: ComponentProps<typeof NotebookItem>[];
    isLoading: boolean;
  };
};

export const TodaysActivity: FC<TodaysActivityProps> = ({
  userName,
  userAvatar,
  greetingProps,
  recentModules,
  recentNotebooks,
}) => {
  const noModules = !recentModules.isLoading && (recentModules.data || []).length === 0;
  return (
    <Dashboard userName={userName} userAvatar={userAvatar}>
      <Greeting {...greetingProps} />
      <div className="flex flex-col">
        <section className="order-2 pt-9 lg:order-1">
          <h3 className="text-primary pb-3 text-xs dark:text-zinc-400 lg:text-base">
            {noModules ? 'Modules' : 'Recent modules'}
          </h3>
          {recentModules.isLoading && (
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
          {!recentModules.isLoading && recentModules.data && (
            <div className="grid grid-cols-2 gap-6">
              {recentModules.data.map(module => (
                <div key={module.name}>
                  <ModuleCard {...module} />
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="order-1 pt-9">
          <h3 className="pb-3 text-xs text-zinc-600 dark:text-zinc-400 lg:text-base">
            Recently edited notebooks
          </h3>
          <div className="flex flex-col gap-3">
            {recentNotebooks.isLoading && (
              <>
                <NotebookItem variant="loading" />
                <NotebookItem variant="loading" />
                <NotebookItem variant="loading" />
                <NotebookItem variant="loading" />
                <NotebookItem variant="loading" />
              </>
            )}
            {!recentNotebooks.isLoading &&
              recentNotebooks.data &&
              recentNotebooks.data.map(notebook => (
                <NotebookItem key={notebook.href} {...notebook} />
              ))}
          </div>
        </section>
      </div>
    </Dashboard>
  );
};
