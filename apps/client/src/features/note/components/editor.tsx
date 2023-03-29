import { useState, useEffect, FC } from 'react';
import dynamic from 'next/dynamic';
import { useNoteSocket } from '@/features/socket/hooks/use-note-socket';
import { SOCKET_EVENT } from '@nifty/api-live/types';
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
  const [code, setCode] = useState<{ source: string; content: string; isLoading?: boolean }>({
    source: 'local',
    content: '',
    isLoading: true,
  });
  const [autoSaved, setAutoSaved] = useState(false);
  const handleProcedureContentChange = (content, delta, source, editor) => {
    console.log('cursor locations', editor.getSelection());

    if (content === code.content) {
      return;
    }

    setAutoSaved(false);
    setCode({ ...code, content, source: 'local' });
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
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log('GOT', data);
      if (data.type === SOCKET_EVENT.DOCUMENT_UPDATE) {
        setCode({ ...code, content: data.content, source: 'remote', isLoading: false });
      } else if (data.type === SOCKET_EVENT.DOCUMENT_SAVE) {
        setAutoSaved(true);
      } else if (data.type === SOCKET_EVENT.DOCUMENT_LOAD) {
        setCode({ ...code, content: data.content, source: 'remote', isLoading: false });
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || socket.readyState !== socket.OPEN) return;
    // only relay local changes to the server
    console.log('attempting', code);
    if (code.source === 'remote') return;

    socket.send(
      JSON.stringify({
        type: 'document:update',
        content: code.content,
        documentId: documentId,
      })
    );
  }, [code]);

  return (
    <>
      {autoSaved && <div>Saved</div>}
      {!code.isLoading && (
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={code.content}
          onChange={handleProcedureContentChange}
        />
      )}
    </>
  );
};

export default DocumentEditor;
