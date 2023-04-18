import { FC } from 'react';
import dynamic from 'next/dynamic';
const Feedback = dynamic(() => import('feeder-react-feedback'), { ssr: false });

export const UserFeedback: FC<{ projectId: string }> = ({ projectId }) => {
  return (
    <div className="text-black">
      <Feedback
        // @ts-ignore
        projectId={process.env.NEXT_PUBLIC_FEEDER_PROJECT_ID}
      />
    </div>
  );
};
