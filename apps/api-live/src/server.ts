import { Database } from '@hocuspocus/extension-database';
import { Logger } from '@hocuspocus/extension-logger';
import { Server } from '@hocuspocus/server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import * as Y from 'yjs';
import { DBRepository } from './db';

const dbRepository = new DBRepository();

const server = Server.configure({
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        const documentId = parseInt(documentName, 10);

        const doc = await dbRepository.readNoteFromDisk(documentId);
        //
        // const doc = await readFile(`./data/${documentName}.bin`).catch(
        //   () => null
        // );

        if (doc) {
          console.log('doc loaded from disk', documentName);
        }
        return doc;
      },
      store: async ({ documentName, state }) => {
        await dbRepository.writeNoteToDisk(documentName, state);
        await writeFile(`./data/${documentName}.bin`, state);
      },
    }),
  ],

  onLoadDocument: async ({ documentName }) => {
    const doc = new Y.Doc();

    console.log('doc created', documentName);

    const content = doc.getMap('content');

    return doc;
  },

  onStoreDocument: async ({ documentName, document }) => {
    await writeFile(
      `./data/${documentName}.json`,
      JSON.stringify(document.getMap('content').toJSON())
    );
  },
});

const main = async () => {
  await mkdir('./data', { recursive: true }).catch(() => null);
  await server.listen(8080);
  console.log('Server is running on port 8080');
};

main();
