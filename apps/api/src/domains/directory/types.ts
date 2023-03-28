import { IDirectory } from "./interfaces"

export enum DIRECTORY_TYPES {
  SERVICE = "DirectoryService",
  CONTROLLER = "DirectoryController"
};

export type DirectoryCreateResponse = {
  data: IDirectory,
}