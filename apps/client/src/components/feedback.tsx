import { FC } from 'react';
import storage from '@/lib/storage';
import { AuthUserDTO } from '@/features/auth';
import Feedback from 'feeder-react-feedback';

export const UserFeedback: FC<{ projectId: string }> = ({ projectId }) => {
  const user = storage.get<AuthUserDTO>('user');

  return (
    <div className="text-black">
      <Feedback
        // @ts-ignore
        emailDefaultValue={user?.email}
        // @ts-ignore
        projectId={projectId}
      />
    </div>
  );
};

export default UserFeedback;
