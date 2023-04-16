import { FC } from 'react';
import { useGetNoteDiagram } from '@/features/note-diagram';

export const NoteDiagramDisplay: FC<{ documentId: string | undefined }> = ({
  documentId,
}) => {
  const { data: noteDiagram } = useGetNoteDiagram(documentId);

  if (!noteDiagram) return null;

  const diagramWithNewLines = noteDiagram.data.content.replace(
    /\\n/g,
    String.fromCharCode(10)
  );

  return <>{diagramWithNewLines}</>;
};
