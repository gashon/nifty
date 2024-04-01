import { WebSocketStatus } from '@hocuspocus/provider';
import { EditorContent } from '@tiptap/react';
import { FC, useMemo } from 'react';
import type { Selectable, User } from '@nifty/common/types';

import { BubbleMenu } from './components';
import { useSocket } from './hooks';

export const Editor: FC<{ user: Selectable<User>; documentId: string }> = ({
  user,
  documentId,
}) => {
  if (!documentId) {
    return <div>No documentId provided</div>;
  }

  const { status, editor } = useSocket(documentId, user);

  const wordCount = useMemo(() => {
    // @ts-ignore
    return editor?.storage.characterCount.words();
    // @ts-ignore
  }, [editor?.storage?.characterCount?.words()]);

  const characterCount = useMemo(() => {
    // @ts-ignore
    return editor?.storage.characterCount.characters();
    // @ts-ignore
  }, [editor?.storage?.characterCount?.characters()]);

  if (status !== WebSocketStatus.Connected) {
    return <p className="opacity-25">{status}...</p>;
  }

  return (
    <div className="editor">
      {editor && <BubbleMenu editor={editor} />}
      {/* @ts-ignore https://github.com/steven-tey/novel/issues/316 */}
      <EditorContent className="editor__content" editor={editor} />
      <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {/* {status === WebSocketStatus.Connected */}
          {/*   ? `${editor?.storage.collaborationCursor.users.length} user${ */}
          {/*       editor?.storage.collaborationCursor.users.length === 1 */}
          {/*         ? '' */}
          {/*         : 's' */}
          {/*     } online in ${documentId}` */}
          {/*   : 'offline'} */}
        </div>
        <div className="opacity-25 w-full flex justify-end mt-5">
          {/* <p className="">{status}</p> */}
          <p className="">
            {wordCount} {characterCount}
          </p>
        </div>
      </div>
    </div>
  );
};
