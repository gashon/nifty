import { useState, useEffect, FC } from 'react';
import dynamic from 'next/dynamic';
import { useNoteSocket } from '@/features/socket/hooks/use-note-socket';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ size: [] }],
    [{ font: [] }],
    [{ align: ['right', 'center', 'justify'] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ color: ['red', '#785412'] }],
    [{ background: ['red', '#785412'] }],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'color',
  'image',
  'background',
  'align',
  'size',
  'font',
];

type DocumentEditorProps = {
  documentId: string;
};

// todo, consider using the class component (well supported)
export const DocumentEditor: FC<DocumentEditorProps> = ({ documentId }) => {
  const [code, setCode] = useState('hellllo');
  const handleProcedureContentChange = (content, delta, source, editor) => {
    setCode(content);
    //let has_attribues = delta.ops[1].attributes || "";
    //console.log(has_attribues);
    //const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    //this.quill.setSelection(cursorPosition + 1);
  };
  const socket = useNoteSocket(documentId);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      const message = {
        type: 'document:update',
        content: 'this is a test',
        documentId: documentId,
      };
      socket.send(JSON.stringify(message));
    };

    socket.onmessage = event => {
      console.log('Got msg:', JSON.parse(event.data));
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  }, [socket]);

  useEffect(() => {
    console.log('useEffect', code);
  }, [code]);

  return (
    <>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={code}
        onChange={handleProcedureContentChange}
      />
    </>
  );
};

export default DocumentEditor;
