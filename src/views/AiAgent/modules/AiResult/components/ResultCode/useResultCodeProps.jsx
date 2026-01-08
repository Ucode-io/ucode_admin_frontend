import { useEffect, useRef } from "react";
import { buildProject, initEsbuild } from "../../../../bundler/build";

const project = {
  project_name: "Enterprise CRM Admin Panel",
  files: [
    {
      path: "src/App.jsx",
      content:
        "import React, { useState, useEffect } from 'react';\nimport axios from 'axios';\nimport Sidebar from './components/Sidebar';\nimport Header from './components/Header';\nimport ContentArea from './components/ContentArea';\n\nconst API_URL = 'https://api.admin.u-code.io/v3/menus?parent_id=96ae1665-19fb-40c9-b5c6-e6fef7f538db&project-id=7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1';\nconst API_KEY = 'P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP';\n\nexport default function App() {\n  const [menus, setMenus] = useState([]);\n  const [activeLabel, setActiveLabel] = useState('Dashboard');\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const fetchMenus = async () => {\n      try {\n        const response = await axios.get(API_URL, {\n          headers: {\n            'Authorization': 'API-KEY',\n            'X-API-KEY': API_KEY\n          }\n        });\n        setMenus(response.data.menus || []);\n      } catch (error) {\n        console.error('Error fetching menu:', error);\n      } finally {\n        setLoading(false);\n      }\n    };\n    fetchMenus();\n  }, []);\n\n  return (\n    <div className=\"flex h-screen bg-[#0a0a0a] text-zinc-300 font-sans\">\n      <Sidebar \n        menus={menus} \n        activeLabel={activeLabel} \n        setActiveLabel={setActiveLabel} \n        loading={loading} \n      />\n      <div className=\"flex-1 flex flex-col min-w-0 overflow-hidden\">\n        <Header activeLabel={activeLabel} />\n        <ContentArea activeLabel={activeLabel} />\n      </div>\n    </div>\n  );\n}",
    },
    {
      path: "src/components/Sidebar.jsx",
      content:
        'import React from \'react\';\n\nexport default function Sidebar({ menus, activeLabel, setActiveLabel, loading }) {\n  return (\n    <aside className="w-64 border-r border-zinc-800 bg-[#0f0f0f] flex flex-col">\n      <div className="p-6 border-b border-zinc-800">\n        <h1 className="text-white font-bold tracking-tight text-xl">CRM <span className="text-zinc-500 font-light">ADMIN</span></h1>\n      </div>\n      \n      <nav className="flex-1 overflow-y-auto p-4 space-y-1">\n        {loading ? (\n          <div className="animate-pulse space-y-4 px-2">\n            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-zinc-800 rounded w-full"></div>)}\n          </div>\n        ) : (\n          menus.map((menu) => (\n            <button\n              key={menu.id}\n              onClick={() => setActiveLabel(menu.label)}\n              className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-colors ${\n                activeLabel === menu.label \n                ? \'bg-zinc-800 text-white font-medium\' \n                : \'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200\'\n              }`}\n            >\n              {menu.label}\n            </button>\n          ))\n        )}\n      </nav>\n\n      <div className="p-4 border-t border-zinc-800">\n        <div className="flex items-center gap-3 px-2">\n          <div className="w-8 h-8 rounded-full bg-zinc-700"></div>\n          <div className="text-xs">\n            <p className="text-white font-medium">Admin User</p>\n            <p className="text-zinc-500">Enterprise Tier</p>\n          </div>\n        </div>\n      </div>\n    </aside>\n  );\n}',
    },
    {
      path: "src/components/Header.jsx",
      content:
        'import React from \'react\';\n\nexport default function Header({ activeLabel }) {\n  return (\n    <header className="h-16 border-b border-zinc-800 bg-[#0a0a0a] flex items-center justify-between px-8">\n      <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">/ {activeLabel}</h2>\n      <div className="flex gap-4">\n        <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800"></div>\n        <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800"></div>\n      </div>\n    </header>\n  );\n}',
    },
    {
      path: "src/components/ContentArea.jsx",
      content:
        'import React from \'react\';\n\nexport default function ContentArea({ activeLabel }) {\n  return (\n    <main className="flex-1 overflow-auto p-8 bg-[#0a0a0a]">\n      <div className="max-w-6xl mx-auto">\n        <div className="mb-8">\n          <h1 className="text-3xl font-semibold text-white">{activeLabel}</h1>\n          <p className="text-zinc-500 mt-2">Manage and overview your {activeLabel.toLowerCase()} data in real-time.</p>\n        </div>\n\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n          <div className="h-32 rounded-lg border border-zinc-800 bg-[#0f0f0f] p-6">\n            <p className="text-xs text-zinc-500 uppercase">Metric A</p>\n            <p className="text-2xl font-bold text-white mt-1">0.00</p>\n          </div>\n          <div className="h-32 rounded-lg border border-zinc-800 bg-[#0f0f0f] p-6">\n            <p className="text-xs text-zinc-500 uppercase">Metric B</p>\n            <p className="text-2xl font-bold text-white mt-1">0.00</p>\n          </div>\n          <div className="h-32 rounded-lg border border-zinc-800 bg-[#0f0f0f] p-6">\n            <p className="text-xs text-zinc-500 uppercase">Metric C</p>\n            <p className="text-2xl font-bold text-white mt-1">0.00</p>\n          </div>\n        </div>\n        \n        <div className="mt-8 h-96 rounded-lg border border-zinc-800 bg-[#0f0f0f] flex items-center justify-center border-dashed">\n           <p className="text-zinc-600 italic font-mono text-sm">Displaying view for: {activeLabel}</p>\n        </div>\n      </div>\n    </main>\n  );\n}',
    },
    {
      path: "tailwind.config.js",
      content:
        "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    \"./index.html\",\n    \"./src/**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {\n      fontFamily: {\n        sans: ['Inter', 'system-ui', 'sans-serif'],\n      },\n    },\n  },\n  plugins: [],\n}",
    },
    {
      path: "src/index.css",
      content:
        "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  margin: 0;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background-color: #0a0a0a;\n}",
    },
  ],
};
const projectV2 = {
  files: [
    {
      content:
        '{\n  "name": "enterprise-crm-admin-panel",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "serve": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "axios": "^0.21.1"\n  },\n  "devDependencies": {\n    "vite": "^4.0.0",\n    "@vitejs/plugin-react": "^3.0.0",\n    "tailwindcss": "^3.0.0",\n    "postcss": "^8.0.0",\n    "autoprefixer": "^10.0.0"\n  }\n}',
      path: "package.json",
    },
    {
      content:
        '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Enterprise CRM Admin Panel</title>\n  <link rel="stylesheet" href="/src/index.css">\n</head>\n<body class="font-sans bg-gray-100">\n  <div id="root"></div>\n  <script type="module" src="/src/main.jsx"></script>\n</body>\n</html>',
      path: "index.html",
    },
    {
      content:
        "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()]\n});",
      path: "vite.config.js",
    },
    {
      content:
        "module.exports = {\n  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {\n      fontFamily: {\n        sans: ['Inter', 'system-ui', 'sans-serif']\n      }\n    }\n  },\n  plugins: []\n};",
      path: "tailwind.config.cjs",
    },
    {
      content:
        "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {}\n  }\n};",
      path: "postcss.config.cjs",
    },
    {
      content:
        "VITE_API_URL=https://api.admin.u-code.io\nVITE_PROJECT_ID=f1c4ae97-ee0f-4868-b4fc-1b26869ebc69\nVITE_MAIN_MENU_ID=c57eedc3-a954-4262-a0af-376c65b5a284\nVITE_X_API_KEY=P-wkLyW3aBURDx6oSwtlhk33WQn8Q3VhIc",
      path: ".env.example",
    },
    {
      content:
        "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  @apply bg-gray-100 text-gray-900;\n}\n\n.sidebar {\n  @apply fixed top-0 left-0 h-full w-72 bg-white shadow-md;\n}\n\n.content {\n  @apply ml-72 p-4;\n}",
      path: "src/index.css",
    },
    {
      content:
        "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
      path: "src/main.jsx",
    },
    {
      content:
        "import React from 'react';\nimport Sidebar from './components/Sidebar';\nimport ContentArea from './components/ContentArea';\n\nfunction App() {\n  return (\n    <div className=\"flex\">\n      <Sidebar />\n      <ContentArea />\n    </div>\n  );\n}\n\nexport default App;",
      path: "src/App.jsx",
    },
    {
      content:
        "import axios from 'axios';\n\nconst apiClient = axios.create({\n  baseURL: import.meta.env.VITE_API_URL,\n  headers: {\n    'Authorization': 'API-KEY',\n    'X-API-KEY': import.meta.env.VITE_X_API_KEY\n  }\n});\n\nexport const fetchSidebarMenus = () => {\n  return apiClient.get(`/v3/menus`, {\n    params: {\n      'parent_id': import.meta.env.VITE_MAIN_MENU_ID,\n      'project-id': import.meta.env.VITE_PROJECT_ID\n    }\n  });\n};\n\nexport const fetchTableDetails = (menuId) => {\n  return apiClient.get(`/v3/table_details`, {\n    params: {\n      'menu_id': menuId,\n      'project-id': import.meta.env.VITE_PROJECT_ID\n    }\n  });\n};",
      path: "src/api.js",
    },
    {
      content:
        "import React, { useEffect, useState } from 'react';\nimport { fetchSidebarMenus } from '../api';\n\nfunction Sidebar() {\n  const [menus, setMenus] = useState([]);\n\n  useEffect(() => {\n    fetchSidebarMenus().then(response => {\n      setMenus(response.data.menus);\n    });\n  }, []);\n\n  return (\n    <div className=\"sidebar\">\n      <ul>\n        {menus.map(menu => (\n          <li key={menu.id} className=\"p-4 border-b\">\n            {menu.label}\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default Sidebar;",
      path: "src/components/Sidebar.jsx",
    },
    {
      content:
        "import React, { useState } from 'react';\nimport GeneratedForm from './GeneratedForm';\nimport DataTable from './DataTable';\n\nfunction ContentArea() {\n  const [selectedMenu, setSelectedMenu] = useState(null);\n\n  return (\n    <div className=\"content\">\n      {selectedMenu ? (\n        <>\n          <GeneratedForm menuId={selectedMenu.id} />\n          <DataTable menuId={selectedMenu.id} />\n        </>\n      ) : (\n        <p>Select a menu item to view details.</p>\n      )}\n    </div>\n  );\n}\n\nexport default ContentArea;",
      path: "src/components/ContentArea.jsx",
    },
    {
      content:
        'import React, { useEffect, useState } from \'react\';\nimport { fetchTableDetails } from \'../api\';\n\nfunction GeneratedForm({ menuId }) {\n  const [fields, setFields] = useState([]);\n\n  useEffect(() => {\n    fetchTableDetails(menuId).then(response => {\n      setFields(response.data.fields);\n    });\n  }, [menuId]);\n\n  return (\n    <form className="space-y-4">\n      {fields.map(field => {\n        switch (field.type) {\n          case \'SINGLE_LINE\':\n            return <input key={field.id} type="text" placeholder={field.label} className="w-full p-2 border" />;\n          case \'NUMBER\':\n            return <input key={field.id} type="number" placeholder={field.label} className="w-full p-2 border" />;\n          case \'TEXT\':\n            return <textarea key={field.id} placeholder={field.label} className="w-full p-2 border"></textarea>;\n          case \'BOOLEAN\':\n            return <label key={field.id} className="flex items-center">\n              <input type="checkbox" className="mr-2" /> {field.label}\n            </label>;\n          case \'DATE\':\n            return <input key={field.id} type="date" className="w-full p-2 border" />;\n          case \'ENUM\':\n            return (\n              <select key={field.id} className="w-full p-2 border">\n                {field.options.map(option => (\n                  <option key={option.value} value={option.value}>{option.label}</option>\n                ))}\n              </select>\n            );\n          default:\n            return null;\n        }\n      })}\n    </form>\n  );\n}\n\nexport default GeneratedForm;',
      path: "src/components/GeneratedForm.jsx",
    },
    {
      content:
        'import React, { useEffect, useState } from \'react\';\nimport { fetchTableDetails } from \'../api\';\n\nfunction DataTable({ menuId }) {\n  const [data, setData] = useState([]);\n\n  useEffect(() => {\n    fetchTableDetails(menuId).then(response => {\n      setData(response.data.rows);\n    });\n  }, [menuId]);\n\n  return (\n    <table className="min-w-full bg-white">\n      <thead>\n        <tr>\n          {data.length > 0 && Object.keys(data[0]).map(key => (\n            <th key={key} className="py-2 px-4 border-b">{key}</th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {data.map((row, index) => (\n          <tr key={index} className="hover:bg-gray-100">\n            {Object.values(row).map((value, i) => (\n              <td key={i} className="py-2 px-4 border-b">{value}</td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}\n\nexport default DataTable;',
      path: "src/components/DataTable.jsx",
    },
    {
      content:
        "# Enterprise CRM Admin Panel\n\nThis project is a frontend-only application built with React 18, Vite, and Tailwind CSS. It is designed to provide a light and professional ERP UI with a fixed left sidebar and content area to the right.\n\n## Setup\n\n1. Clone the repository.\n2. Install dependencies:\n   ```bash\n   npm install\n   ```\n3. Create a `.env` file based on `.env.example` and fill in the necessary environment variables.\n4. Run the development server:\n   ```bash\n   npm run dev\n   ```\n\n## Build\n\nTo build the project for production, run:\n```bash\nnpm run build\n```\n\n## Preview\n\nTo preview the production build, run:\n```bash\nnpm run serve\n```\n\n## Features\n\n- Light and professional ERP UI\n- Fixed left sidebar with dynamic menu fetching\n- Dynamic form and data table generation based on API responses\n\n## Technologies Used\n\n- React 18\n- Vite\n- Tailwind CSS\n- Axios\n",
      path: "README.md",
    },
  ],
  project_name: "enterprise-crm-admin-panel",
};

const fileTypeToLanguage = {
  html: "html",
  css: "css",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
};

const files = projectV2.files.reduce((acc, file) => {
  acc[file.path] = {
    path: file.path,
    language:
      file.language ||
      fileTypeToLanguage[
        file.path.split(".")[file.path.split(".").length - 1]
      ] ||
      file.path.split(".")[file.path.split(".").length - 1],
    value: file.content,
  };
  return acc;
}, {});

console.log(files);

export const useResultCodeProps = () => {
  const models = new Map();

  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const esbuildReady = useRef(false);

  function handleEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;
  }

  // const files = {
  //   "index.jsx": {
  //     path: "index.jsx",
  //     language: "javascript",
  //     value: `import App from "./App"`,
  //   },
  //   "App.jsx": {
  //     path: "App.jsx",
  //     language: "javascript",
  //     value: `export default () => <div>Hello</div>`,
  //   },
  // }

  function getModel(file, monaco) {
    if (models.has(file.path)) return models.get(file.path);

    const model = monaco.editor.createModel(
      file.value,
      file.language,
      monaco.Uri.parse(`file:///src/${file.path}`),
    );

    models.set(file.path, model);
    return model;
  }

  function openFile(path) {
    const monaco = monacoRef.current;
    const editor = editorRef.current;

    const file = files[path];
    const model = getModel(file, monaco);
    editor.setModel(model);
  }

  const runCode = async () => {
    if (!esbuildReady.current) {
      await initEsbuild().then(() => {
        esbuildReady.current = true;
      });
    }

    const js = await buildProject(monacoRef.current);
    iframeEval(js);
  };

  function iframeEval(code) {
    const iframe = document.getElementById("preview");

    iframe.contentWindow?.postMessage(
      {
        type: "EXECUTE",
        code,
      },
      "*",
    );
  }

  useEffect(() => {
    if (esbuildReady.current) return;

    initEsbuild().then(() => {
      esbuildReady.current = true;
    });

    return () => {
      esbuildReady.current = false;
    };
  }, []);

  return {
    openFile,
    files,
    handleEditorMount,
    runCode,
  };
};
