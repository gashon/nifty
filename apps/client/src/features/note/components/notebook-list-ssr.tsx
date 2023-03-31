import { FC } from 'react';

import NotebookItem from '@nifty/ui/molecules/notebook-item';
import { useInfiniteNotes, useDeleteNote } from '@/features/note';

type NotebookListProps = {
  moduleId: string;
  notes: any;
};

export const NotebookListSSR: FC<NotebookListProps> = ({ moduleId, notes }) => {
  // const { data, isFetched } = useInfiniteNotes({ directoryId: moduleId, limit: 1000 });
  const { mutate: deleteNote } = useDeleteNote();

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* @ts-ignore */}
        {notes && notes.pages[0]?.data.length === 0 && (
          <div className="text-gray-500">No notes found</div>
        )}
        {notes && (
          <>
            {notes.pages.map(({ data }: any) =>
              data.map(note => (
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
