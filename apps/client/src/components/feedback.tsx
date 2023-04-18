import { FC } from 'react';
import dynamic from 'next/dynamic';
const Feedback = dynamic(() => import('feeder-react-feedback'), { ssr: false });

export const UserFeedback: FC<{ projectId: string }> = ({ projectId }) => {
  return (
    <div className="text-black">
      <Feedback
        // @ts-ignore
        projectId={projectId}
      />
    </div>
  );
};
