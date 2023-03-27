import { createContext, Dispatch, SetStateAction } from 'react';
import { IDirectory } from '@nifty/server-lib/models/directory';

type ModuleListContextType = {
  directories: IDirectory[] | undefined;
  setDirectories: Dispatch<SetStateAction<IDirectory[] | undefined>>;
};
export const ModuleListContext = createContext<ModuleListContextType>(undefined);
