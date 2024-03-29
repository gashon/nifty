import { FC } from 'react';

import NotebookItem from '@nifty/ui/molecules/notebook-item';
import {
  useInfiniteNotesInDirectory,
  useDeleteNote,
} from '@nifty/client/features/note';

type NotebookListProps = {
  moduleId: number;
  notes: any;
};

export const NotebookList: FC<NotebookListProps> = ({ moduleId }) => {
  const { data, isFetched } = useInfiniteNotesInDirectory({
    directoryId: moduleId,
    limit: '100',
  });
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
        {/* @ts-ignore */}
        {data && isFetched && data.pages[0]?.data?.length === 0 && (
          <div className="text-gray-500">No notes found</div>
        )}
        {data && isFetched && (
          <>
            {data.pages.map(({ data: page }) => {
              return page.map((note) => (
                <div key={note.id}>
                  <NotebookItem
                    icon="ICON"
                    variant="default"
                    onDelete={() => deleteNote(note.id)}
                    href={`/notes/${note.id}?title=${note.title}`}
                    lastEdited={new Date(note.updatedAt).toLocaleDateString()}
                    title={note.title}
                    label={{
                      color: 'blue',
                      name: 'LABEL',
                    }}
                  />
                </div>
              ));
            })}
          </>
        )}
      </div>
    </>
  );
};

export default NotebookList;
