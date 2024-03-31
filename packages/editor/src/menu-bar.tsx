import React, { FC, Fragment } from 'react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';

import MenuItem from './menu-item';
import { Editor } from '@tiptap/react';

const MenuBar: FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={
          editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''
        }
      >
        purple
      </button>
    </>
  );
};

//
// export default ({ editor }: { editor: Editor }) => {
//   const items = [
//     {
//       icon: 'bold',
//       title: 'Bold',
//       action: () => editor.chain().focus().toggleBold().run(),
//       isActive: () => editor.isActive('bold'),
//     },
//     {
//       icon: 'italic',
//       title: 'Italic',
//       action: () => editor.chain().focus().toggleItalic().run(),
//       isActive: () => editor.isActive('italic'),
//     },
//     {
//       icon: 'strikethrough',
//       title: 'Strike',
//       action: () => editor.chain().focus().toggleStrike().run(),
//       isActive: () => editor.isActive('strike'),
//     },
//     {
//       icon: 'code-view',
//       title: 'Code',
//       action: () => editor.chain().focus().toggleCode().run(),
//       isActive: () => editor.isActive('code'),
//     },
//     {
//       icon: 'mark-pen-line',
//       title: 'Highlight',
//       action: () => editor.chain().focus().toggleHighlight().run(),
//       isActive: () => editor.isActive('highlight'),
//     },
//     {
//       type: 'divider',
//     },
//     {
//       icon: 'h-1',
//       title: 'Heading 1',
//       action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
//       isActive: () => editor.isActive('heading', { level: 1 }),
//     },
//     {
//       icon: 'h-2',
//       title: 'Heading 2',
//       action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
//       isActive: () => editor.isActive('heading', { level: 2 }),
//     },
//     {
//       icon: 'paragraph',
//       title: 'Paragraph',
//       action: () => editor.chain().focus().setParagraph().run(),
//       isActive: () => editor.isActive('paragraph'),
//     },
//     {
//       icon: 'list-unordered',
//       title: 'Bullet List',
//       action: () => editor.chain().focus().toggleBulletList().run(),
//       isActive: () => editor.isActive('bulletList'),
//     },
//     {
//       icon: 'list-ordered',
//       title: 'Ordered List',
//       action: () => editor.chain().focus().toggleOrderedList().run(),
//       isActive: () => editor.isActive('orderedList'),
//     },
//     {
//       icon: 'list-check-2',
//       title: 'Task List',
//       action: () => editor.chain().focus().toggleTaskList().run(),
//       isActive: () => editor.isActive('taskList'),
//     },
//     {
//       icon: 'code-box-line',
//       title: 'Code Block',
//       action: () => editor.chain().focus().toggleCodeBlock().run(),
//       isActive: () => editor.isActive('codeBlock'),
//     },
//     {
//       type: 'divider',
//     },
//     {
//       icon: 'double-quotes-l',
//       title: 'Blockquote',
//       action: () => editor.chain().focus().toggleBlockquote().run(),
//       isActive: () => editor.isActive('blockquote'),
//     },
//     {
//       icon: 'separator',
//       title: 'Horizontal Rule',
//       action: () => editor.chain().focus().setHorizontalRule().run(),
//     },
//     {
//       type: 'divider',
//     },
//     {
//       icon: 'text-wrap',
//       title: 'Hard Break',
//       action: () => editor.chain().focus().setHardBreak().run(),
//     },
//     {
//       icon: 'format-clear',
//       title: 'Clear Format',
//       action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
//     },
//     {
//       type: 'divider',
//     },
//     {
//       icon: 'arrow-go-back-line',
//       title: 'Undo',
//       action: () => editor.chain().focus().undo().run(),
//     },
//     {
//       icon: 'arrow-go-forward-line',
//       title: 'Redo',
//       action: () => editor.chain().focus().redo().run(),
//     },
//   ];
//
//   return (
//     <div className="editor__header">
//       {items.map((item, index) => (
//         <Fragment key={index}>
//           {item.type === 'divider' ? (
//             <div className="divider" />
//           ) : (
//             <MenuItem {...item} />
//           )}
//         </Fragment>
//       ))}
//     </div>
//   );
// };

export default MenuBar;
