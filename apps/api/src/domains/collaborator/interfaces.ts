import { Request, Response } from 'express';
import { ICollaborator, CollaboratorDocument } from "@nifty/server-lib/models/collaborator";
interface ICollaboratorController {

}

interface ICollaboratorService {
  findCollaboratorById(id: string): Promise<CollaboratorDocument | null>;
  findCollaboratorByDirectoryIdAndUserId(directoryId: string, userId: string): Promise<CollaboratorDocument | null>;
}

export { ICollaborator, ICollaboratorController, ICollaboratorService };