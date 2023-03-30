import { FC } from 'react';

import NotebookItem from '@nifty/ui/molecules/notebook-item';
import { useInfiniteNotes } from '@/features/note';

type NotebookListProps = {
  moduleId: string;
};

const MOCK = [
  {
    icon: '📚',
    title: 'Introduction to Computer Algorithms',
    lastEdited: '2 hours ago',
    href: '/notebooks/1',
    label: {
      name: 'Algorithms and Complexity',
      color: 'red',
    },
  },
  {
    icon: '✨',
    title: 'Week 1 - Introduction to IT Project Management',
    lastEdited: '6 hours ago',
    href: '/notebooks/2',
    label: {
      name: 'IT Project Management',
      color: 'green',
    },
  },
  {
    icon: '👩‍🎨',
    title: 'Introduction to User centered design',
    lastEdited: '8 hours ago',
    href: '/notebooks/3',
    label: {
      name: 'User centered design',
      color: 'indigo',
    },
  },
  {
    icon: '📌',
    title: 'Final Project Plan',
    lastEdited: '14 hours ago',
    href: '/notebooks/4',
    label: {
      name: 'Final Year Project',
      color: 'amber',
    },
  },
  {
    icon: '🔐',
    title: 'Encryption and Decryption',
    lastEdited: '23 hours ago',
    href: '/notebooks/5',
    label: {
      name: 'Malicious Software',
      color: 'blue',
    },
  },
];

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
