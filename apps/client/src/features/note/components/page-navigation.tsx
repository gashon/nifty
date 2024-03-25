import Link from 'next/link';
import { FC } from 'react';
import { useGetNoteNeighbors } from '@nifty/client/features/note';

type PageNavigationProps = {
  id: string;
};

export const PageNavigation: FC<PageNavigationProps> = ({ id }) => {
  const { data: neighbors } = useGetNoteNeighbors(id, { limit: 2 });

  if (!neighbors?.data) return null;
  const [[beforeNote], [afterNote]] = [
    neighbors.data.before,
    neighbors.data.after,
  ];
  return (
    <>
      {beforeNote && (
        <Link href={`/notes/${beforeNote.id}?title=${beforeNote.title}`}>
          Previous Document
        </Link>
      )}
      {afterNote && (
        <Link href={`/notes/${afterNote.id}?title=${afterNote.title}`}>
          Next Document
        </Link>
      )}
    </>
  );
};

export default PageNavigation;
