// import Feedback from 'feeder-react-feedback';
import dynamic from 'next/dynamic';
import { FC } from 'react';
const Feedback = dynamic(() => import('feeder-react-feedback'), { ssr: false });

export const FeedbackLayout: FC = ({}) => {
  return (
    <div className="fixed bg-transparent">
      {/* @ts-ignore */}
      <Feedback projectId="643e12815cbe9f0002456020" />
    </div>
  );
};
