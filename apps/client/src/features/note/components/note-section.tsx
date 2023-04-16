import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, useEffect, FC } from 'react';
import { CreateNoteDiagram, NoteDiagramDisplay } from '@/features/note-diagram';

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
      <section className="min-h-screen">
        <ErrorBoundary fallback={<p>Failed to connect</p>}>
          <SocketDocumentEditor
            documentId={id as string}
            fallBackEditor={
              // todo: only use long poll if note has not collaborators (offline)
              <LongPollDocumentEditor documentId={id as string} />
            }
          />
        </ErrorBoundary>
      </section>
      <CreateNoteDiagram documentId={id as string} />
      <NoteDiagramDisplay documentId={id as string} />
      <section className="w-full flex justify-between py-10 underline">
        <PageNavigation id={id as string} />
      </section>
    </>
  );
};
