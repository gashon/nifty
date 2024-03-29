import React, { memo, useCallback, useMemo, useEffect, useState, useRef } from 'react';
import {
  createEditor,
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
import { useGetNote, useUpdateNote } from '@/features/note/api';

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

function SaveStatus({ status, onClick }) {
  if (status === 'saved') {
    return <p className={`opacity-25 cursor-default fixed right-10 bottom-10`}>Saved</p>;
  } else if (status === 'saving') {
    return <p className={`opacity-50 pointer fixed right-10 bottom-10`}>Saving...</p>;
  } else {
    return (
      <button onClick={onClick} className={`opacity-50 pointer fixed right-10 bottom-10`}>
        Not Saved
      </button>
    );
  }
}

const SaveStatusComponent = memo(SaveStatus);

const MarkdownShortcuts = ({ documentId }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), []);
  const { data: note, isFetched } = useGetNote(documentId);
  const { mutateAsync: updateNote } = useUpdateNote(documentId);
  const [noteHandler, setNoteHandler] = useState<{
    isMounted: boolean;
    saveStatus: 'not_saved' | 'saved' | 'saving';
  }>({
    isMounted: false,
    saveStatus: 'saved',
  });
  const noteHandlerRef = useRef(noteHandler);

  useEffect(() => {
    noteHandlerRef.current = noteHandler;
  }, [noteHandler]);

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

  const handleSave = useCallback(() => {
    setNoteHandler(prevNoteHandler => ({ ...prevNoteHandler, saveStatus: 'saving' }));
    updateNote({
      content: JSON.stringify(editor.children),
      note_id: documentId,
    });
    setNoteHandler(prevNoteHandler => ({ ...prevNoteHandler, saveStatus: 'saved' }));
  }, []);

  // autosave, note
  useEffect(() => {
    if (!noteHandler.isMounted) {
      setNoteHandler(prevNoteHandler => ({ ...prevNoteHandler, isMounted: true }));
      setInterval(() => {
        if (noteHandlerRef.current.saveStatus === 'not_saved') {
          handleSave();
        }
      }, 7000);
    }

    return () => {
      if (noteHandlerRef.current.saveStatus === 'not_saved') handleSave();
    };
  }, []);

  if (!note?.data) return <p className="underline text-xl">Loading...</p>;

  return (
    <>
      <SaveStatusComponent status={noteHandler.saveStatus} onClick={handleSave} />
      <Slate
        editor={editor}
        value={
          (note.data?.content.length !== 0 &&
            note.data?.content !== '[]' &&
            JSON.parse(note.data.content)) || [
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
          ]
        }
        onChange={value => {
          // @ts-ignore
          if (value[0]?.children[0].text === '') return;
          setNoteHandler(prevNoteHandler => ({ ...prevNoteHandler, saveStatus: 'not_saved' }));
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
    </>
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