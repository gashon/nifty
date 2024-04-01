import { BubbleMenu as TipTapBubbleMenu, Editor } from '@tiptap/react';
import { FC } from 'react';

export const BubbleMenu: FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <TipTapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <button
        //@ts-ignore
        onClick={() => editor.chain().focus().toggleBold().run()}
        //@ts-ignore
        className={`menu-button ${editor.isActive('bold') ? 'is-active' : ''}`}
      >
        bold
      </button>
      <button
        //@ts-ignore
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`menu-button ${
          //@ts-ignore
          editor?.isActive('italic') ? 'is-active' : ''
        }`}
      >
        italic
      </button>
      <button
        //@ts-ignore
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`menu-button ${
          //@ts-ignore
          editor?.isActive('strike') ? 'is-active' : ''
        }`}
      >
        strike
      </button>
    </TipTapBubbleMenu>
  );
};
