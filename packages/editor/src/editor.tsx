import { WebSocketStatus } from '@hocuspocus/provider';
import { EditorContent, useEditor } from '@tiptap/react';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import type { Selectable, User } from '@nifty/common/types';

import { MenuBar } from './components/menu-bar';
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
    return editor?.storage.characterCount.words();
  }, [editor?.storage?.characterCount?.words()]);

  const characterCount = useMemo(() => {
    return editor?.storage.characterCount.characters();
  }, [editor?.storage?.characterCount?.characters()]);

  if (status !== WebSocketStatus.Connected) {
    return <p className="opacity-25">{status}...</p>;
  }

  return (
    <div className="editor">
      {editor && <BubbleMenu editor={editor} />}
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
