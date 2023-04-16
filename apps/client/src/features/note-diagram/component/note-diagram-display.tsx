import { FC } from 'react';
import { useGetNoteDiagram } from '@/features/note-diagram';

export const NoteDiagramDisplay: FC<{ documentId: string | undefined }> = ({
  documentId,
}) => {
  const { data: noteDiagram } = useGetNoteDiagram(documentId);

  if (!noteDiagram) return null;

  const reactDiagramWithNewlines = noteDiagram.data.content
    .split('\n')
    .map((line) => {
      return (
        <span>
          {line}
          <br></br>
        </span>
      );
    });

  console.log(reactDiagramWithNewlines);

  return <>{reactDiagramWithNewlines}</>;
};
