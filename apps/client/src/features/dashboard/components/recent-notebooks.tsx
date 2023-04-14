import { FC } from 'react';
import { useRecentNotes, useDeleteNote } from '@/features/note';
import { useAuth } from '@/features/auth';

import NotebookItem from '@nifty/ui/molecules/notebook-item';

export const RecentNotebooks: FC<{}> = ({}) => {
  const { user } = useAuth();
  const { data: notes, isFetched } = useRecentNotes(user.id);
  const { mutate: deleteNote } = useDeleteNote();

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
        {isFetched &&
          notes.data.map((note) => (
            <div key={note.id}>
              {/* @ts-ignore */}
              <NotebookItem
                onDelete={() => deleteNote(note.id)}
                href={`/notes/${note.id}?title=${note.title}`}
                {...note}
              />{' '}
            </div>
          ))}
      </div>
    </>
  );
};

export default RecentNotebooks;
