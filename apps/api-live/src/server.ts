import dotenv from 'dotenv';
dotenv.config();

import { Database } from '@hocuspocus/extension-database';
import { Logger } from '@hocuspocus/extension-logger';
import { onAuthenticatePayload, Server } from '@hocuspocus/server';

import { verifyToken } from '@nifty/api/lib/jwt';
import { isPermitted, Permission } from '@nifty/api/util/handle-permissions';
import { AccessTokenJwt } from '@nifty/common/types';
import { DBRepository } from './db';
import logger from './lib/logger';
import { getAccessTokenString } from './socket';

const dbRepository = new DBRepository();

const server = Server.configure({
  onAuthenticate: async (data: onAuthenticatePayload) => {
    const tokenStr = getAccessTokenString(data.requestHeaders.cookie);
    const token = verifyToken<AccessTokenJwt>(tokenStr);
    if (!token) {
      throw new Error('Unauthorized');
    }

    const documentId = Number(data.documentName);

    const notePermissions = await dbRepository.getNotePermissions(documentId);

    const hasPublicWritePermissions = isPermitted(
      await dbRepository.getNotePermissions(documentId),
      Permission.ReadWrite
    );
    const hasPublicReadPermissions = isPermitted(
      notePermissions,
      Permission.Read
    );

    if (hasPublicWritePermissions) {
      return { user: token.user };
    }

    const collaborator = await dbRepository.getCollaborator(
      token.user.id,
      documentId
    );
    if (!collaborator && hasPublicReadPermissions) {
      data.connection.readOnly = true;
      return { user: token.user };
    }

    if (!collaborator) throw new Error('Unauthorized');

    if (!isPermitted(collaborator.permissions, Permission.ReadWrite)) {
      console.log('setting readonly');
      data.connection.readOnly = true;
    }

    // update last viewed at asynchonously
    dbRepository.updateCollaboratorLastViewedAt(collaborator.id);

    return { user: token.user };
  },
  extensions: [
    new Logger({
      log: (msg) => {
        logger.info(msg);
      },
    }),
    new Database({
      fetch: async ({ documentName }) => {
        const documentId = parseInt(documentName, 10);

        const doc = await dbRepository.readNoteFromDisk(documentId);

        if (doc) {
          console.log('doc loaded from disk', documentName);
        }
        return doc;
      },
      store: async ({ documentName, state }) => {
        await dbRepository.writeNoteToDisk(Number(documentName), state);
      },
    }),
  ],
});

const main = async () => {
  await server.listen(8080);
  console.log('Server is running on port 8080');
};

main();
