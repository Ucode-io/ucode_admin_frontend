import { useEffect, useRef } from "react";
import { buildProject, initEsbuild } from "../../../../bundler/build";

const project = {
  files: [
    {
      content:
        '{\n  "name": "ucode-admin-panel",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "serve": "vite preview"\n  },\n  "dependencies": {\n    "axios": "^0.21.1",\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "react-icons": "^4.2.0"\n  },\n  "devDependencies": {\n    "@vitejs/plugin-react": "^1.0.0",\n    "autoprefixer": "^10.2.5",\n    "postcss": "^8.2.15",\n    "tailwindcss": "2.2.19",\n    "vite": "^2.4.4"\n  }\n}',
      path: "package.json",
    },
    {
      content:
        "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000\n  }\n});",
      path: "vite.config.js",
    },
    {
      content:
        "module.exports = {\n  purge: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],\n  darkMode: 'class',\n  theme: {\n    extend: {},\n  },\n  variants: {\n    extend: {},\n  },\n  plugins: [],\n};",
      path: "tailwind.config.cjs",
    },
    {
      content:
        "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};",
      path: "postcss.config.cjs",
    },
    {
      content: "VITE_ADMIN_BASE_URL=https://admin-api.ucode.run",
      path: ".env.example",
    },
    {
      content:
        "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);",
      path: "src/main.jsx",
    },
    {
      content:
        "import React from 'react';\nimport DashboardLayout from './layouts/DashboardLayout';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport DashboardHome from './pages/DashboardHome';\nimport DynamicTablePage from './pages/DynamicTablePage';\n\nfunction App() {\n  return (\n    <Router>\n      <DashboardLayout>\n        <Routes>\n          <Route path=\"/\" element={<DashboardHome />} />\n          <Route path=\"/table/:slug\" element={<DynamicTablePage />} />\n        </Routes>\n      </DashboardLayout>\n    </Router>\n  );\n}\n\nexport default App;",
      path: "src/App.jsx",
    },
    {
      content:
        "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  font-family: 'Inter', sans-serif;\n}\n\n.dark-mode {\n  background-color: #1a202c;\n  color: #cbd5e0;\n}",
      path: "src/index.css",
    },
    {
      content:
        'import React, { useEffect, useState } from \'react\';\nimport Sidebar from \'../components/Sidebar\';\n\nconst DashboardLayout = ({ children }) => {\n  return (\n    <div className="flex">\n      <Sidebar />\n      <div className="ml-64 h-screen flex flex-col">\n        <header className="h-16 fixed top-0 left-64 right-0 z-30 bg-gray-900 text-white flex items-center justify-between px-4">\n          <h1 className="text-xl font-bold">ERP Admin Panel</h1>\n        </header>\n        <main className="flex-1 overflow-y-auto mt-16">\n          {children}\n        </main>\n      </div>\n    </div>\n  );\n};\n\nexport default DashboardLayout;',
      path: "src/layouts/DashboardLayout.jsx",
    },
    {
      content:
        "import axios from 'axios';\n\nconst instance = axios.create({\n  baseURL: import.meta.env.VITE_ADMIN_BASE_URL,\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'API-KEY',\n    'X-API-KEY': 'P-wkLyW3aBURDx6oSwtlhk33WQn8Q3VhIc'\n  }\n});\n\nexport default instance;",
      path: "src/api/axios.js",
    },
    {
      content:
        'import React, { useEffect, useState } from \'react\';\nimport axios from \'../api/axios\';\n\nconst Sidebar = () => {\n  const [menus, setMenus] = useState([]);\n\n  useEffect(() => {\n    const fetchMenus = async () => {\n      const response = await axios.get(`/v3/menus?parent_id=c57eedc3-a954-4262-a0af-376c65b5a284&project-id=f1c4ae97-ee0f-4868-b4fc-1b26869ebc69`);\n      setMenus(response.data?.data?.menus || []);\n    };\n    fetchMenus();\n  }, []);\n\n  return (\n    <div className="h-screen w-64 fixed bg-gray-900 text-gray-300">\n      <nav className="mt-10">\n        {menus.map((menu) => (\n          <a key={menu.id} href={menu.path} className="flex items-center p-2 hover:bg-blue-600 hover:text-white">\n            <img src={menu.icon} className="w-5 h-5 filter invert brightness-200" onError={(e) => { e.currentTarget.style.display = \'none\'; }} />\n\n            <span className="ml-3 capitalize">{menu.name}</span>\n          </a>\n        ))}\n      </nav>\n    </div>\n  );\n};\n\nexport default Sidebar;',
      path: "src/components/Sidebar.jsx",
    },
    {
      content:
        'import React, { useEffect, useState } from \'react\';\nimport axios from \'../api/axios\';\n\nconst DynamicTable = ({ slug }) => {\n  const [fields, setFields] = useState([]);\n\n  useEffect(() => {\n    const fetchTableDetails = async () => {\n      const response = await axios.post(`/v1/table-details/${slug}`, { data: {} });\n      setFields(response.data?.data?.data?.fields || []);\n    };\n    fetchTableDetails();\n  }, [slug]);\n\n  return (\n    <div className="table-container overflow-x-auto relative">\n      <table className="min-w-full border-collapse">\n        <thead className="bg-gray-800">\n          <tr>\n            {fields.map((field) => (\n              <th key={field.id} className="sticky top-0 z-20 border border-gray-700 text-gray-200 uppercase text-xs font-bold tracking-wider">\n                {field.name}\n              </th>\n            ))}\n          </tr>\n        </thead>\n        <tbody>\n          {/* Render table rows here */}\n        </tbody>\n      </table>\n    </div>\n  );\n};\n\nexport default DynamicTable;',
      path: "src/components/DynamicTable.jsx",
    },
    {
      content:
        'import React from \'react\';\n\nexport const ElementLink = ({ value, disabled = true, required, placeholder = "", onBlur = () => {} }) => {\n  const [innerValue, setInnerValue] = React.useState(value);\n  return (\n    <label className="flex items-center gap-2 border border-gray-700 p-2 rounded-md bg-gray-800 shadow-sm focus-within:ring-2 ring-blue-500">\n      <input className="flex-1 outline-none bg-transparent text-white placeholder-gray-500" defaultValue={innerValue} disabled={disabled} required={required} placeholder={placeholder} onBlur={(e) => { onBlur(e); setInnerValue(e.target.value); }} />\n      <a href={innerValue} className={"ml-2 px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors " + (!innerValue ? "pointer-events-none opacity-50" : "") } target="_blank" rel="noreferrer">OPEN</a>\n    </label>\n  );\n};\n\nexport const ElementText = ({ row = {}, value }) => {\n  return <div className="text-sm text-gray-300 font-medium p-2">{value ?? row?.label}</div>;\n};',
      path: "src/components/DynamicForm.jsx",
    },
    {
      content:
        'import React from \'react\';\n\nconst DashboardHome = () => {\n  return (\n    <div className="p-4">\n      <h2 className="text-2xl font-bold text-gray-300">Welcome to the ERP Admin Panel</h2>\n      <p className="mt-2 text-gray-400">Use the sidebar to navigate through the application.</p>\n    </div>\n  );\n};\n\nexport default DashboardHome;',
      path: "src/pages/DashboardHome.jsx",
    },
    {
      content:
        "import React from 'react';\nimport { useParams } from 'react-router-dom';\nimport DynamicTable from '../components/DynamicTable';\n\nconst DynamicTablePage = () => {\n  const { slug } = useParams();\n  return (\n    <div className=\"p-4\">\n      <h2 className=\"text-2xl font-bold text-gray-300 capitalize\">{slug?.replace(/_/g, ' ')}</h2>\n      <DynamicTable slug={slug} />\n    </div>\n  );\n};\n\nexport default DynamicTablePage;",
      path: "src/pages/DynamicTablePage.jsx",
    },
  ],
  project_name: "ucode-admin-panel",
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

const files = project.files.reduce((acc, file) => {
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
