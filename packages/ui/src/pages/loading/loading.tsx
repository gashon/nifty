// loading page

import { FC } from 'react';
import { Spinner } from '../../atoms/spinner';

export const LoadingPage: FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size={30} />
    </div>
  );
};
