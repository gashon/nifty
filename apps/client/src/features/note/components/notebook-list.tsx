import { FC } from 'react';

import NotebookItem from '@nifty/ui/molecules/notebook-item';
import { useInfiniteNotes } from '@/features/note';

type NotebookListProps = {
  moduleId: string;
};

export const NotebookList: FC<NotebookListProps> = ({ moduleId }) => {
  const { data, isFetched } = useInfiniteNotes({ directoryId: moduleId, limit: 1000 });

  return (
    <>
      <div className="flex flex-col gap-3">
        {!isFetched && (
          <>
            <NotebookItem variant="loading" />
            <NotebookItem variant="loading" />
            <NotebookItem variant="loading" />
            <NotebookItem variant="loading" />
            <NotebookItem variant="loading" />
          </>
        )}
        {isFetched && data && (
          <>
            {data.pages.map(({ data }: any) =>
              data.map(note => (
                <div key={note.id}>
                  <NotebookItem href={`/notes/${note.id}?name=${note.title}`} {...note} />
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NotebookList;
