
import './App.css';
import { Editor } from '@monaco-editor/react';
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

function App() {
  const [users, setUsers] = useState([]);
  const [provider, setProvider] = useState(null);
  const bindingRef = useRef(null);
  const editorRef = useRef(null)
  const[username,setUsername]=useState(()=>{
    const params = new URLSearchParams(window.location.search);
    return params.get("username") || "";
  })
  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ ydoc ])
  const handleMount = (editor, monaco) => {
  editorRef.current = editor;

  if (!provider) return;

  bindingRef.current = new MonacoBinding(
    yText,
    editor.getModel(),
    new Set([editor]),
    provider.awareness
  );
   
    

    
    monaco.editor.defineTheme('mocha-cream', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: 'A18A79', fontStyle: 'italic' },
        { token: 'keyword', foreground: '986044', fontStyle: 'bold' },
        { token: 'string', foreground: '71815B' },
        { token: 'number', foreground: 'B47748' },
        { token: 'delimiter', foreground: '796657' },
        { token: 'identifier', foreground: '493830' },
        { token: 'type', foreground: '896B8D' },
        { token: 'function', foreground: '9B6248' },
      ],
      
colors: {
  'editor.background': '#E8D8C3',
  'editor.foreground': '#49372B',
  'editorLineNumber.foreground': '#AA9078',
  'editorLineNumber.activeForeground': '#6D4C3D',
  'editorCursor.foreground': '#9B6248',
  'editor.selectionBackground': '#CDB397',
  'editor.inactiveSelectionBackground': '#DCC7B0',
  'editor.lineHighlightBackground': '#E2D0B9',
  'editorIndentGuide.background1': '#D4BFA7',
  'editorIndentGuide.activeBackground1': '#B99A7D',
  'editorWhitespace.foreground': '#D0BBA4',
  'editorWidget.background': '#F0E3D1',
  'editorWidget.border': '#C8AD92',
  'editorGutter.background': '#E8D8C3',
  'scrollbarSlider.background': '#B99A7D80',
  'scrollbarSlider.hoverBackground': '#9E7B6080',
  'scrollbarSlider.activeBackground': '#89664F80',
},

    });

    monaco.editor.setTheme('mocha-cream');
    console.log('Mocha Studio theme applied!');
  };
  
useEffect(() => {
  if (!username) return;

  const socketProvider = new SocketIOProvider(
    "http://localhost:3000",
    "monaco",
    ydoc,
    { autoConnect: true }
  );

  setProvider(socketProvider);

  socketProvider.awareness.setLocalStateField("user", {
    username,
  });

const updateUsers = () => {
  const states = Array.from(
    socketProvider.awareness.getStates().values()
  );

  // Show each username only once
  const uniqueUsers = new Map();

  states.forEach((state) => {
    const name = state.user?.username?.trim();

    if (name) {
      uniqueUsers.set(name, { username: name });
    }
  });

  setUsers(Array.from(uniqueUsers.values()));
};

socketProvider.awareness.on("change", updateUsers);
updateUsers();

  socketProvider.awareness.on("change", updateUsers);
  updateUsers();

  return () => {
    socketProvider.awareness.off("change", updateUsers);
    bindingRef.current?.destroy();
    bindingRef.current = null;
    socketProvider.disconnect();
    setProvider(null);
  };
}, [username, ydoc]);



  const handleJoin = (e) => {
  e.preventDefault();

  const name = e.currentTarget.username.value.trim();

  if (!name) return;

  setUsername(name);

  window.history.pushState(
    {},
    "",
    "?username=" + encodeURIComponent(name)
  );
};

  
if (!username) {
  return (
    <main className="mocha-studio flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleJoin}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-[#F0E3D1] p-8 shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold text-[#49372B]">
          Mocha Studio ☕
        </h1>

        <p className="text-center text-sm text-[#896B8D]">
          Enter your username to start coding together.
        </p>

        <input
          type="text"
          placeholder="Enter your username"
          className="rounded-lg border border-[#C8AD92] bg-[#FFF9F0] p-3 text-[#49372B] outline-none focus:ring-2 focus:ring-[#B99A7D]"
          name="username"
          required
          minLength={2}
        />

        <button
          type="submit"
          className="rounded-lg bg-[#986044] p-3 font-bold text-white transition hover:bg-[#7D4C35]"
        >
          Join Workspace →
        </button>
      </form>
    </main>
  );
}

  


  return (
    <main className="mocha-studio flex min-h-screen gap-4 p-6">
      <aside className="users-panel min-h-[500px] w-1/4 rounded-lg">
       <h2 className="text-2xl font-bold p-4 border-b border-gray-300">Users</h2>
        <ul className="p-4">
          {users.map((user, index) => (
            <li key={index} className="p-2 bg-gray-800 text-white rounded mb-2">
              {user.username}
            </li>
          ))}
        </ul>
      </aside>

      <section className="editor-panel min-h-[500px] min-w-0 flex-1 overflow-hidden rounded-lg">
       {provider && (
  <Editor
    height="100%"
    defaultLanguage="javascript"
    theme="mocha-cream"
    onMount={handleMount}
    options={{
      minimap: { enabled: false },
      fontSize: 14,
      automaticLayout: true,
      padding: { top: 16 },
      scrollBeyondLastLine: false,
      roundedSelection: true,
    }}
  />
)}
      </section>
    </main>
  );
}

export default App;
