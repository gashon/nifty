import type { IDirectory } from '@nifty/server-lib/models/directory';

export enum DIRECTORY_TYPES {
  SERVICE = 'DirectoryService',
  MODEL = 'DirectoryModel',
  CONTROLLER = 'DirectoryController',
}

export type DirectoryCreateResponse = {
  data: IDirectory;
};
