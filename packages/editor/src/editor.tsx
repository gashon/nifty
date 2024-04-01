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

  return (
    <div className="editor">
      {/* {editor && <MenuBar editor={editor} />} */}
      {editor && <BubbleMenu editor={editor} />}
      <EditorContent className="editor__content" editor={editor} />
      <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {status === WebSocketStatus.Connected
            ? `${editor?.storage.collaborationCursor.users.length} user${
                editor?.storage.collaborationCursor.users.length === 1
                  ? ''
                  : 's'
              } online in ${documentId}`
            : 'offline'}
        </div>
        <div className="editor__name">
          <button>{user.email}</button>
        </div>
      </div>
    </div>
  );
};
