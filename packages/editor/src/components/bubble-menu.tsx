import { BubbleMenu as TipTapBubbleMenu, Editor } from '@tiptap/react';
import { FC } from 'react';

export const BubbleMenu: FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <TipTapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
    </TipTapBubbleMenu>
  );
};
