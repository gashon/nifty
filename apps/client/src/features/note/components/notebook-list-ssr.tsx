import { FC } from 'react';

import NotebookItem from '@nifty/ui/molecules/notebook-item';
import { useInfiniteNotes, useDeleteNote } from '@/features/note';

type NotebookListProps = {
  moduleId: string;
  notes: any;
};

export const NotebookListSSR: FC<NotebookListProps> = ({ moduleId, notes }) => {
  // prefetch page 2
  const { data, isFetched } = useInfiniteNotes(
    {
      page: 2,
      directoryId: moduleId,
      limit: 1000,
    },
    { pages: [notes], pageParams: [] }
  );
  const { mutate: deleteNote } = useDeleteNote();

  return (
    <>
      <div className="flex flex-col gap-3">
        {data && data.pages[0]?.data?.length === 0 && (
          <div className="text-gray-500">No notes found</div>
        )}
        {data && (
          <>
            {data.pages.map(({ data: page }: any) =>
              page.map((note) => (
                <div key={note.id}>
                  <NotebookItem
                    onDelete={() => deleteNote(note.id)}
                    href={`/notes/${note.id}?name=${note.title}`}
                    {...note}
                  />
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NotebookListSSR;
