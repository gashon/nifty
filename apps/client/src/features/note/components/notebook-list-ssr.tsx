import { FC, useEffect, useState } from 'react';

import NotebookItem from '@nifty/ui/molecules/notebook-item';
import { useInfiniteNotes, useDeleteNote } from '@/features/note';
import { useQueryClient } from 'react-query';

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
  const queryClient = useQueryClient();

  const [allNotes, setAllNotes] = useState(notes.data);

  useEffect(() => {
    // Subscribe to cache updates
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const cacheData = queryClient.getQueryData(['notes']);
      if (cacheData) {
        setAllNotes(cacheData.pages.flatMap(({ data }) => data));
      }
    });

    return () => {
      // Unsubscribe from cache updates
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {isFetched && allNotes.length === 0 && (
          <div className="text-gray-500">No notes found</div>
        )}
        {allNotes && allNotes.length > 0 && (
          <>
            {allNotes.map((note: any) => (
              <div key={note.id}>
                <NotebookItem
                  onDelete={() => deleteNote(note.id)}
                  href={`/notes/${note.id}?title=${note.title}`}
                  {...note}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default NotebookListSSR;
