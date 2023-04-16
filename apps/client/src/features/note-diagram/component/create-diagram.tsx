import { FC } from 'react';
import { Button } from '@nifty/ui/atoms';
import { axios } from '@/lib/axios';
import { createNoteDiagram } from '@/features/note-diagram';

export const CreateNoteDiagram: FC<{ documentId: string }> = ({
  documentId,
}) => {
  const handleClick = async () => {
    const { data } = await createNoteDiagram(documentId);
    console.log(data);
  };

  return (
    <>
      <Button onClick={handleClick}>Create Note Diagram</Button>
    </>
  );
};
