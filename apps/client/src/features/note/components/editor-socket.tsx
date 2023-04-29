import {
  FC,
  useCallback,
  useMemo,
  useState,
  ReactElement,
  useReducer,
} from 'react';
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
import { useNoteSocket, useSocketMessageHandler } from '@/features/socket/';
import { BulletedListElement } from '../types';
import { useWordCount } from '@/features/note';

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

type MarkdownShortcutsProps = {
  documentId: string;
  fallBackEditor: ReactElement;
};

const MarkdownShortcuts: FC<MarkdownShortcutsProps> = ({
  documentId,
  fallBackEditor,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  );
  const [_, forceRerender] = useReducer((s) => s + 1, 0);
  const { socket, connectionFailed } = useNoteSocket(documentId);
  const [initValue, setInitValue] = useState<Descendant[] | undefined>(
    undefined
  );

  const onDocumentLoad = useCallback((note) => {
    setInitValue(
      note.content
        ? JSON.parse(note.content)
        : [
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]
    );
  }, []);
  const updateEditorContent = (newContent: Descendant[]) => {
    // Replace the entire editor content with new content
    editor.children = newContent;
    // Re-render the editor
    Editor.normalize(editor, { force: true });
    // Focus the editor to ensure updates are displayed immediately
    ReactEditor.focus(editor);
    forceRerender();
  };

  const onDocumentUpdate = useCallback(
    (note: any) => {
      // todo handle collaboration
      updateEditorContent(JSON.parse(note.content));
    },
    [editor]
  );
  const { sendDocumentUpdate } = useSocketMessageHandler({
    socket,
    documentId,
    onDocumentLoad,
    onDocumentUpdate,
  });

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
            match: (n) =>
              SlateElement.isElement(n) && Editor.isBlock(editor, n),
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

  if (!initValue) return <p className="underline text-xl">Loading...</p>;
  if (connectionFailed) return fallBackEditor;

  return (
    <>
      <Slate editor={editor} value={initValue}>
        <Editable
          onDOMBeforeInput={handleDOMBeforeInput}
          renderElement={renderElement}
          placeholder="Write some markdown..."
          spellCheck
          autoFocus
          onKeyUp={() => {
            // todo send cursor updates
            let value = editor.children;
            if (value.length === 0) {
              value = [
                {
                  type: 'paragraph',
                  children: [{ text: '' }],
                },
              ];
            }
            sendDocumentUpdate(JSON.stringify(value));
          }}
        />
      </Slate>
    </>
  );
};

const withShortcuts = (editor) => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
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
          match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        });

        if (type === 'list-item') {
          const list: BulletedListElement = {
            type: 'bulleted-list',
            children: [],
          };
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item',
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
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
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
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'bulleted-list',
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
      return (
        <ul className="editor-list text-xl" {...attributes}>
          {children}
        </ul>
      );
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

export default MarkdownShortcuts;
