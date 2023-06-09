import { FC } from 'react';
import { useRecentNotes, useDeleteNote } from '@/features/note';
import { IUser } from '@nifty/server-lib/models/user';

import NotebookItem from '@nifty/ui/molecules/notebook-item';

export const RecentNotebooks: FC<{ user: IUser }> = ({ user }) => {
  const { data: notes, isFetched } = useRecentNotes(user.id);
  const { mutate: deleteNote } = useDeleteNote();

  const noNotes = isFetched && notes.data.length === 0;

  return (
    <>
      {!noNotes && (
        <h3 className="pb-3 text-xs text-zinc-600 dark:text-zinc-400 lg:text-base">
          Recently edited notebooks
        </h3>
      )}
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
