import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, useEffect, FC } from 'react';
import { Editor } from '@nifty/editor/editor';
import useUser from '@nifty/client/hooks/use-user';

const LongPollDocumentEditor = dynamic(
  () => import('@nifty/client/features/note/components/editor'),
  { ssr: false }
);
const SocketDocumentEditor = dynamic(
  () => import('@nifty/client/features/note/components/editor-socket'),
  {
    ssr: false,
  }
);
const PageNavigation = dynamic(
  () => import('@nifty/client/features/note/components/page-navigation'),
  {
    ssr: false,
  }
);

export const DocumentSection: FC<{ documentId: string }> = ({ documentId }) => {
  const router = useRouter();
  const { id } = router.query;
  const [isMounted, setIsMounted] = useState(false);
  const { data: user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof window === 'undefined') return null;

  return (
    <>
      <section className="min-h-screen">
        <ErrorBoundary fallback={<p>Failed to connect</p>}>
          {/* <SocketDocumentEditor */}
          {/*   documentId={Number(id as string)} */}
          {/*   fallBackEditor={ */}
          {/*     // todo: only use long poll if note has not collaborators (offline) */}
          {/*     <LongPollDocumentEditor documentId={Number(id as string)} /> */}
          {/*   } */}
          {/* /> */}
          {user && <Editor documentId={documentId} user={user} />}
        </ErrorBoundary>
      </section>
      <section className="w-full flex justify-between py-10 underline">
        <PageNavigation id={Number(id as string)} />
      </section>
    </>
  );
};
