import { IDirectory } from './interfaces';

export enum DIRECTORY_TYPES {
  SERVICE = 'DirectoryService',
  MODEL = 'DirectoryModel',
  CONTROLLER = 'DirectoryController',
}

export type DirectoryCreateResponse = {
  data: IDirectory;
};
