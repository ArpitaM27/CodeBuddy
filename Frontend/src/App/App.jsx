
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
        className="flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-[#D4BFA7] bg-[#F0E3D1] p-12 shadow-2xl sm:p-16"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#49372B] sm:text-5xl">
            Mocha Studio ☕
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#896B8D] sm:text-lg">
            Your collaborative coding space.
            <br />
            Enter your username to start coding together.
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter your username"
          className="w-full rounded-xl border border-[#C8AD92] bg-[#FFF9F0] p-4 text-lg text-[#49372B] outline-none transition focus:ring-2 focus:ring-[#B99A7D]"
          name="username"
          required
          minLength={2}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[#986044] p-4 text-lg font-bold text-white transition hover:bg-[#7D4C35]"
        >
          Join Workspace →
        </button>

        <p className="text-center text-[20px] text-[#808080]">
          Made for ideas, shared in real time.
        </p>
      </form>
    </main>
  );
}

  



return (
  <main className="mocha-studio flex min-h-screen gap-5 bg-[#E8D8C3] p-6">

    <aside className="users-panel min-h-[500px] w-1/4 overflow-hidden rounded-2xl border border-[#C8AD92] bg-[#F0E3D1] shadow-lg">

      <h2 className="border-b border-[#C8AD92] bg-[#49372B] p-5 text-xl font-bold tracking-wide text-[#F0E3D1]">
        Users
        <span className="ml-2 rounded-full bg-[#B99A7D] px-2 py-1 text-sm text-[#49372B]">
          {users.length}
        </span>
      </h2>

      <ul className="space-y-3 p-4">
        {users.map((user, index) => (
          <li
            key={index}
            className="flex items-center gap-3 rounded-xl border border-[#D4BFA7] bg-[#EDE2D3] px-4 py-3 text-[#49372B] shadow-sm transition hover:border-[#B99A7D] hover:bg-[#E8D8C3]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCC7B0] font-bold text-[#79513B]">
              {user.username.charAt(0).toUpperCase()}
            </span>

            <span className="truncate font-medium">
              {user.username}
            </span>

            <span
              className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#71815B]"
              title="Connected"
            />
          </li>
        ))}
      </ul>
    </aside>

    <section className="editor-panel flex min-h-[500px] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#C8AD92] bg-[#F0E3D1] shadow-lg">

      <header className="flex items-center justify-between border-b border-[#6D4C3D] bg-[#49372B] px-6 py-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-[#F0E3D1]">
            Code Editor
          </h2>
          <p className="mt-1 text-sm text-[#D4BFA7]">
            Mocha Studio · Live Collaboration
          </p>
        </div>

        
      </header>

      <div className="min-h-0 flex-1">
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
      </div>
    </section>

  </main>
);

}

export default App;
