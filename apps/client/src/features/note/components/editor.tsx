import React, { useCallback, useMemo } from 'react';
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Point,
  Range,
  Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { BulletedListElement } from '../types';

const SHORTCUTS = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six',
};

const MarkdownShortcuts = () => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), []);

  const handleDOMBeforeInput = useCallback(
    (e: InputEvent) => {
      queueMicrotask(() => {
        const pendingDiffs = ReactEditor.androidPendingDiffs(editor);

        const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
          if (!diff.text.endsWith(' ')) {
            return false;
          }

          const { text } = SlateNode.leaf(editor, path);
          const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1);
          if (!(beforeText in SHORTCUTS)) {
            return;
          }

          const blockEntry = Editor.above(editor, {
            at: path,
            match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
          });
          if (!blockEntry) {
            return false;
          }

          const [, blockPath] = blockEntry;
          return Editor.isStart(editor, Editor.start(editor, path), blockPath);
        });

        if (scheduleFlush) {
          ReactEditor.androidScheduleFlush(editor);
        }
      });
    },
    [editor]
  );

  return (
    <Slate
      editor={editor}
      value={[
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ]}
      onChange={value => {
        console.log('CAUGHT', value);
      }}
    >
      <Editable
        onDOMBeforeInput={handleDOMBeforeInput}
        renderElement={renderElement}
        placeholder="Write some markdown..."
        spellCheck
        autoFocus
      />
    </Slate>
  );
};

const withShortcuts = editor => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range) + text.slice(0, -1);
      const type = SHORTCUTS[beforeText];

      if (type) {
        Transforms.select(editor, range);

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor);
        }

        const newProperties: Partial<SlateElement> = {
          type,
        };
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        });

        if (type === 'list-item') {
          const list: BulletedListElement = {
            type: 'bulleted-list',
            children: [],
          };
          Transforms.wrapNodes(editor, list, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
          });
        }

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'bulleted-list',
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return (
        <h1 className="text-5xl" {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 className="text-3xl" {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 className="text-2xl" {...attributes}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 className="text-xl" {...attributes}>
          {children}
        </h4>
      );
    case 'heading-five':
      return (
        <h5 className="text-xl" {...attributes}>
          {children}
        </h5>
      );
    case 'heading-six':
      return (
        <h6 className="text-xl" {...attributes}>
          {children}
        </h6>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return (
        <p className="text-xl" {...attributes}>
          {children}
        </p>
      );
  }
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: 'heading-two',
    children: [{ text: 'Try it out!' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
];

export default MarkdownShortcuts;

// import { useState, useEffect, FC } from 'react';
// import dynamic from 'next/dynamic';
// import { useNoteSocket } from '@/features/socket/hooks/use-note-socket';
// import { SOCKET_EVENT } from '@nifty/api-live/types';
// import 'react-quill/dist/quill.snow.css';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ size: [] }],
//     [{ font: [] }],
//     [{ align: ['right', 'center', 'justify'] }],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     ['link', 'image'],
//     [{ color: ['red', '#785412'] }],
//     [{ background: ['red', '#785412'] }],
//   ],
// };

// const formats = [
//   'header',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'link',
//   'color',
//   'image',
//   'background',
//   'align',
//   'size',
//   'font',
// ];

// type DocumentEditorProps = {
//   documentId: string;
// };

// // todo, consider using the class component (well supported)
// export const DocumentEditor: FC<DocumentEditorProps> = ({ documentId }) => {
//   const [code, setCode] = useState<{ source: string; content: string; isLoading?: boolean }>({
//     source: 'local',
//     content: '',
//     isLoading: true,
//   });
//   const [autoSaved, setAutoSaved] = useState(false);
//   const handleProcedureContentChange = (content, delta, source, editor) => {
//     console.log('cursor locations', editor.getSelection());

//     if (content === code.content) {
//       return;
//     }

//     setAutoSaved(false);
//     setCode({ ...code, content, source: 'local' });
//     //let has_attribues = delta.ops[1].attributes || "";
//     //console.log(has_attribues);
//     //const cursorPosition = e.quill.getSelection().index;
//     // this.quill.insertText(cursorPosition, "★");
//     //this.quill.setSelection(cursorPosition + 1);
//   };
//   const socket = useNoteSocket(documentId);

//   useEffect(() => {
//     if (!socket) return;

//     socket.onopen = () => {
//       console.log('Connected to WebSocket server');
//     };

//     socket.onmessage = event => {
//       const data = JSON.parse(event.data);
//       console.log('GOT', data);
//       if (data.type === SOCKET_EVENT.DOCUMENT_UPDATE) {
//         setCode({ ...code, content: data.content, source: 'remote', isLoading: false });
//       } else if (data.type === SOCKET_EVENT.DOCUMENT_SAVE) {
//         setAutoSaved(true);
//       } else if (data.type === SOCKET_EVENT.DOCUMENT_LOAD) {
//         setCode({ ...code, content: data.content, source: 'remote', isLoading: false });
//       }
//     };

//     socket.onclose = () => {
//       console.log('Disconnected from WebSocket server');
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (!socket || socket.readyState !== socket.OPEN) return;
//     // only relay local changes to the server
//     console.log('attempting', code);
//     if (code.source === 'remote') return;

//     socket.send(
//       JSON.stringify({
//         type: 'document:update',
//         content: code.content,
//         documentId: documentId,
//       })
//     );
//   }, [code]);

//   return (
//     <>
//       {autoSaved && <div>Saved</div>}
//       {!code.isLoading && (
//         <ReactQuill
//           theme="snow"
//           modules={modules}
//           formats={formats}
//           value={code.content}
//           onChange={handleProcedureContentChange}
//         />
//       )}
//     </>
//   );
// };

// export default DocumentEditor;
