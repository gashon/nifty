import { FC, ComponentProps, useState } from 'react';
import Greeting from '@nifty/ui/molecules/greeting';

export type GreetingHeaderProps = Omit<ComponentProps<typeof Greeting>, 'isLoading'>;

export const GreetingHeader: FC<GreetingHeaderProps> = ({ greeting, quote }) => {
  // todo fetch daily quote
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return <Greeting isLoading={isLoading} greeting={greeting} quote={quote} />;
};

export default GreetingHeader;
