import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState, useEffect, FC } from 'react';

const DocumentEditor = dynamic(() => import('@/features/note/components/editor'), { ssr: false });

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
      <DocumentEditor documentId={id} />
    </>
  );
};
