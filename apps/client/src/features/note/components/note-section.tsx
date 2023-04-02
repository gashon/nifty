import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState, useEffect, FC } from 'react';

const LongPollDocumentEditor = dynamic(
  () => import('@/features/note/components/editor'),
  { ssr: false }
);
const SocketDocumentEditor = dynamic(
  () => import('@/features/note/components/editor-socket'),
  {
    ssr: false,
  }
);
const PageNavigation = dynamic(
  () => import('@/features/note/components/page-navigation'),
  {
    ssr: false,
  }
);

export const DocumentSection: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof window === 'undefined') return null;

  return (
    <>
      <section className="h-screen">
        <SocketDocumentEditor
          documentId={id as string}
          fallBackEditor={<LongPollDocumentEditor documentId={id as string} />}
        />
      </section>
      <section className="w-full flex justify-between">
        <PageNavigation id={id as string} />
      </section>
    </>
  );
};
