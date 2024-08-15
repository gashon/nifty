import * as Y from 'yjs';
import { TiptapTransformer } from '@hocuspocus/transformer';

export function decodeYDocBuffer(bufferContent: Buffer) {
  // Create a new YDoc
  const ydoc = new Y.Doc();

  // Apply the buffer content to the YDoc
  Y.applyUpdate(ydoc, bufferContent);

  // Transform the YDoc content to a format Tiptap can use
  const jsonContent = TiptapTransformer.fromYdoc(ydoc, 'default');

  return jsonContent;
}
