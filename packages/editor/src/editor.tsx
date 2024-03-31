import {
  HocuspocusProviderWebsocket,
  HocuspocusProvider,
  TiptapCollabProviderWebsocket,
  TiptapCollabProvider,
} from '@hocuspocus/provider';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import type { Selectable, User } from '@nifty/common/types';

import MenuBar from './menu-bar';

const ydoc = new Y.Doc();

export const Editor: FC<{ user: Selectable<User>; documentId: string }> = ({
  user,
  documentId,
}) => {
  const [status, setStatus] = useState('connecting');
  console.log('user', user);

  if (!documentId) {
    return <div>No documentId provided</div>;
  }

  const socket = useMemo(() => {
    return new TiptapCollabProviderWebsocket({
      baseUrl: 'ws://localhost:8080',
      connect: true,
    });
  }, []);

  const websocketProvider = useMemo(() => {
    return new TiptapCollabProvider({
      name: documentId,
      document: ydoc,
      websocketProvider: socket,
      onAuthenticationFailed: ({ reason }) => {
        console.log('reason', reason);
      },
    });
  }, [socket, documentId, ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
      }),
    ],
  });

  useEffect(() => {
    // Update status changes
    websocketProvider.on('status', (event) => {
      setStatus(event.status);
    });
  }, []);

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && user) {
      editor
        .chain()
        .focus()
        .updateUser({
          name: user.email,
          avatar: user.avatarUrl,
        })
        .run();
    }
  }, [editor, user]);

  return (
    <div className="editor">
      {/* {editor && <MenuBar editor={editor} />} */}
      <EditorContent className="editor__content" editor={editor} />
      <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {status === 'connected'
            ? `${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1 ? '' : 's'
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
