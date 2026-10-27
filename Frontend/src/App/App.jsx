
import './App.css';
import { Editor } from '@monaco-editor/react';

function App() {
  const handleMount = (editor, monaco) => {
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

  return (
    <main className="mocha-studio flex min-h-screen gap-4 p-6">
      <aside className="users-panel min-h-[500px] w-1/4 rounded-lg">
      </aside>

      <section className="editor-panel min-h-[500px] min-w-0 flex-1 overflow-hidden rounded-lg">
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
      </section>
    </main>
  );
}

export default App;
