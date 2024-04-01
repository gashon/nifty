import { useMemo, useState } from 'react';
import * as Y from 'yjs';
import {
  HocuspocusProviderWebsocket,
  HocuspocusProvider,
  TiptapCollabProviderWebsocket,
  TiptapCollabProvider,
  WebSocketStatus,
} from '@hocuspocus/provider';
import { useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import StarterKit from '@tiptap/starter-kit';
import { Selectable, User } from '@nifty/common/types';
import { generateBrightColor } from '../utils';

export const useSocket = (documentId: string, user: Selectable<User>) => {
  const [status, setStatus] = useState<WebSocketStatus>(
    WebSocketStatus.Connecting
  );
  const ydoc = useMemo(() => {
    const ydoc = new Y.Doc();
    return ydoc;
  }, []);

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
      onStatus: ({ status }) => {
        setStatus(status);
      },
    });
  }, [socket, documentId, ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Placeholder.configure({
        placeholder: 'Write something …',
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
    // update user
    onUpdate: ({ editor }) => {
      if (editor && user) {
        editor
          .chain()
          .focus()
          .updateUser({
            name: user.email,
            avatar: user.avatarUrl,
            color: generateBrightColor(),
          })
          .run();
      }
    },
  });

  return { editor, status, websocketProvider, ydoc };
};
