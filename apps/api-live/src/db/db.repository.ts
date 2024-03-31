import { db } from '@nifty/common/db';
import type { KysleyDB } from '@nifty/common/types';

export class DBRepository {
  private db: KysleyDB;

  constructor() {
    this.db = db;
  }

  async getNotePermissions(documentId: number) {
    const note = await this.db
      .selectFrom('note')
      .select('publicPermissions')
      .where('id', '=', documentId)
      .executeTakeFirst();
    if (!note) throw new Error('Document not found');

    return note.publicPermissions;
  }

  async getCollaborator(userId: number, documentId: number) {
    return this.db
      .selectFrom('collaborator')
      .innerJoin(
        'noteCollaborator',
        'noteCollaborator.collaboratorId',
        'collaborator.id'
      )
      .selectAll()
      .where('collaborator.userId', '=', userId)
      .where('noteCollaborator.noteId', '=', documentId)
      .executeTakeFirst();
  }

  async updateCollaboratorLastViewedAt(collaboratorId: number): Promise<void> {
    await this.db
      .updateTable('collaborator')
      .set({ lastViewedAt: new Date() })
      .where('id', '=', collaboratorId)
      .execute();
  }

  async writeNoteToDisk(documentId: number, state: Buffer) {
    return this.db
      .updateTable('note')
      .set({ content: state })
      .where('id', '=', documentId)
      .execute();
  }

  async readNoteFromDisk(documentId: number) {
    const note = await this.db
      .selectFrom('note')
      .select('content')
      .where('id', '=', documentId)
      .executeTakeFirst();
    if (!note) throw new Error('Document not found');

    return note.content;
  }
}
