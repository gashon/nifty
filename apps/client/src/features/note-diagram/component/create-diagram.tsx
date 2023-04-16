import { FC } from 'react';
import { Button } from '@nifty/ui/atoms';
import {
  createNoteDiagram,
  useCreateNoteDiagram,
} from '@/features/note-diagram';

export const CreateNoteDiagram: FC<{ documentId: string }> = ({
  documentId,
}) => {
  // Todo force websocket disk flush on create
  const { mutateAsync: createNoteDiagramMutation } =
    useCreateNoteDiagram(documentId);

  return (
    <>
      <Button onClick={() => createNoteDiagramMutation(documentId)}>
        Create Note Diagram
      </Button>
    </>
  );
};
