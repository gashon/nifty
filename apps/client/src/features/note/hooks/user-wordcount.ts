import { useEffect, useState } from 'react';
import { Descendant } from 'slate';
const countWords = (value: Descendant[]) =>
  value.reduce((memo, node) => {
    // @ts-ignore TODO fix
    if (node?.children[0]?.text) {
      // @ts-ignore TODO fix
      return memo + node.children[0].text.split(' ').length;
    }
    return memo;
  }, 0);

export const useWordCount = (editorValue: Descendant[]) => {
  const [wordCount, setWordCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!editorValue) return;

    setWordCount(countWords(editorValue));
  }, [editorValue]);

  return { wordCount, countWords };
};
