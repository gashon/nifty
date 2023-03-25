import { Container } from 'inversify';
import { IDirectoryService, IDirectoryRepository, DirectoryService, DirectoryRepository } from './domains/directory';

const container = new Container();

container.bind<IDirectoryService>('DirectoryService').to(DirectoryService);
container.bind<IDirectoryRepository>('DirectoryRepository').to(DirectoryRepository);

export default container;