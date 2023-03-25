import { Container } from 'inversify';
import {
  IDirectoryController,
  IDirectoryService,
  IDirectoryRepository,
  DirectoryController,
  DirectoryService,
  DirectoryRepository,
  TYPES as DIRECTORY_TYPES,
} from './domains/directory';

const container = new Container();

container.bind<IDirectoryService>(DIRECTORY_TYPES.DirectoryService).to(DirectoryService);
container.bind<IDirectoryRepository>(DIRECTORY_TYPES.DirectoryRepository).to(DirectoryRepository);
container.bind<IDirectoryController>(DIRECTORY_TYPES.DirectoryController).to(DirectoryController);

export { container };