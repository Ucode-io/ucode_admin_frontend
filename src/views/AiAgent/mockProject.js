export const resp = {
  "status": "OK",
  "description": "The request has succeeded",
  "data": {
    "project_name": "ucode-erp-admin-panel",
    "files": [
      {
        "path": "package.json",
        "content": "{\n  \"name\": \"ucode-erp-admin-panel\",\n  \"private\": true,\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\",\n    \"react-router-dom\": \"^6.20.0\",\n    \"axios\": \"^1.6.2\"\n  },\n  \"devDependencies\": {\n    \"@vitejs/plugin-react\": \"^4.2.0\",\n    \"autoprefixer\": \"^10.4.16\",\n    \"postcss\": \"^8.4.32\",\n    \"tailwindcss\": \"^2.2.19\",\n    \"vite\": \"^5.0.7\"\n  }\n}\n"
      },
      {
        "path": "vite.config.js",
        "content": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000,\n    open: true\n  }\n});\n"
      },
      {
        "path": "tailwind.config.js",
        "content": "module.exports = {\n  content: [\n    './index.html',\n    './src/**/*.{js,jsx,ts,tsx}'\n  ],\n  theme: {\n    extend: {\n      colors: {\n        notion: {\n          text: 'rgb(55, 53, 47)',\n          textSecondary: 'rgba(55, 53, 47, 0.65)',\n          textMuted: 'rgba(55, 53, 47, 0.45)',\n          border: 'rgba(55, 53, 47, 0.16)',\n          divider: 'rgba(55, 53, 47, 0.12)',\n          activeMenu: '#F0F0EF',\n          hoverMenu: 'rgba(55, 53, 47, 0.06)',\n          primary: '#007AFF',\n          secondaryBg: 'rgba(55, 53, 47, 0.08)',\n          secondaryBorder: 'rgba(55, 53, 47, 0.16)'\n        }\n      },\n      fontFamily: {\n        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']\n      }\n    }\n  },\n  plugins: []\n};\n"
      },
      {
        "path": "postcss.config.js",
        "content": "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {}\n  }\n};\n"
      },
      {
        "path": "index.html",
        "content": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Ucode ERP Admin Panel</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.jsx\"></script>\n  </body>\n</html>\n"
      },
      {
        "path": ".env.example",
        "content": "VITE_ADMIN_BASE_URL=https://admin-api.ucode.run\nVITE_PROJECT_ID=1c85eeca-8ef0-4b2d-9146-c2fd095c5e22\nVITE_PARENT_ID=c57eedc3-a954-4262-a0af-376c65b5a284\nVITE_X_API_KEY=P-K2djp9mU2RNYZth8GuwKYMB08lZYDSRH\n"
      },
      {
        "path": ".env",
        "content": "VITE_ADMIN_BASE_URL=https://admin-api.ucode.run\nVITE_PROJECT_ID=1c85eeca-8ef0-4b2d-9146-c2fd095c5e22\nVITE_PARENT_ID=c57eedc3-a954-4262-a0af-376c65b5a284\nVITE_X_API_KEY=P-K2djp9mU2RNYZth8GuwKYMB08lZYDSRH\n"
      },
      {
        "path": "README_HOW_TO_RUN.txt",
        "content": "# Ucode ERP Admin Panel - Setup Instructions\n\n## Prerequisites\n- Node.js 18+ installed\n- npm or yarn package manager\n\n## Setup Steps\n\n1. Install dependencies:\n   npm install\n\n2. Environment variables are already configured in .env file:\n   - VITE_ADMIN_BASE_URL=https://admin-api.ucode.run\n   - VITE_PROJECT_ID=1c85eeca-8ef0-4b2d-9146-c2fd095c5e22\n   - VITE_PARENT_ID=c57eedc3-a954-4262-a0af-376c65b5a284\n   - VITE_X_API_KEY=P-K2djp9mU2RNYZth8GuwKYMB08lZYDSRH\n\n3. Start development server:\n   npm run dev\n\n4. Open browser at http://localhost:3000\n\n## Build for Production\n\nnpm run build\n\nThe build output will be in the 'dist' directory.\n\n## Preview Production Build\n\nnpm run preview\n\n## Features\n\n- Dynamic menu loading from Ucode API\n- Dynamic table rendering with resizable columns\n- Inline cell editing\n- Advanced filtering and search\n- Status field with dropdown selector\n- Pagination support\n- Create item drawer\n- Professional Notion-like UI\n- Light mode theme\n- Responsive layout\n\n## Troubleshooting\n\nIf you encounter any issues:\n1. Clear node_modules and reinstall: rm -rf node_modules && npm install\n2. Check that .env file exists and contains correct API key\n3. Verify Node.js version: node --version (should be 18+)\n"
      },
      {
        "path": "src/main.jsx",
        "content": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n"
      },
      {
        "path": "src/index.css",
        "content": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody,\n#root {\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background-color: #FFFFFF;\n  color: rgb(55, 53, 47);\n}\n\n/* Scrollbar styling */\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n::-webkit-scrollbar-thumb {\n  background: rgba(55, 53, 47, 0.16);\n  border-radius: 4px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(55, 53, 47, 0.24);\n}\n\n/* Remove default button styles */\nbutton {\n  font-family: inherit;\n  cursor: pointer;\n}\n\n/* Input focus states */\ninput:focus,\nselect:focus,\ntextarea:focus {\n  outline: none;\n}\n"
      },
      {
        "path": "src/App.jsx",
        "content": "import React from 'react';\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\nimport DashboardLayout from './layouts/DashboardLayout';\nimport DashboardHome from './pages/DashboardHome';\nimport DynamicTablePage from './pages/DynamicTablePage';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path=\"/\" element={<DashboardLayout />}>\n          <Route index element={<DashboardHome />} />\n          <Route path=\"tables/:tableSlug\" element={<DynamicTablePage />} />\n        </Route>\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\nexport default App;\n"
      },
      {
        "path": "src/api/axios.js",
        "content": "import axios from 'axios';\n\nconst apiClient = axios.create({\n  baseURL: import.meta.env.VITE_ADMIN_BASE_URL,\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'API-KEY',\n    'X-API-KEY': import.meta.env.VITE_X_API_KEY\n  }\n});\n\nexport const fetchMenus = async () => {\n  const response = await apiClient.get('/v3/menus', {\n    params: {\n      'parent_id': import.meta.env.VITE_PARENT_ID,\n      'project-id': import.meta.env.VITE_PROJECT_ID\n    }\n  });\n  return response?.data?.data?.menus ?? [];\n};\n\nexport const fetchTableDetails = async (tableSlug) => {\n  const response = await apiClient.post(`/v1/table-details/${tableSlug}`, {\n    data: {}\n  });\n  return response?.data?.data?.data ?? null;\n};\n\nexport const fetchTableData = async (tableSlug, params = {}) => {\n  const response = await apiClient.get(`/v2/items/${tableSlug}`, {\n    params: {\n      limit: params.limit || 20,\n      offset: params.offset || 0,\n      search: params.search || '',\n      sort_by: params.sort_by || '',\n      sort_order: params.sort_order || ''\n    }\n  });\n  return {\n    rows: response?.data?.data?.data?.response ?? [],\n    count: response?.data?.data?.data?.count ?? 0\n  };\n};\n\nexport const createTableItem = async (tableSlug, itemData) => {\n  const response = await apiClient.post(`/v2/items/${tableSlug}`, {\n    data: itemData\n  });\n  return response.data;\n};\n\nexport const updateTableItem = async (tableSlug, itemId, itemData) => {\n  const response = await apiClient.put(`/v2/items/${tableSlug}/${itemId}`, {\n    data: itemData\n  });\n  return response.data;\n};\n\nexport default apiClient;\n"
      },
      {
        "path": "src/layouts/DashboardLayout.jsx",
        "content": "import React, { useState, useEffect } from 'react';\nimport { Outlet, useLocation } from 'react-router-dom';\nimport Sidebar from '../components/Sidebar';\nimport Header from '../components/Header';\nimport { fetchMenus } from '../api/axios';\n\nfunction DashboardLayout() {\n  const [menus, setMenus] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);\n  const [selectedMenu, setSelectedMenu] = useState(null);\n  const location = useLocation();\n\n  useEffect(() => {\n    loadMenus();\n  }, []);\n\n  useEffect(() => {\n    // Update selected menu based on current route\n    if (location.state?.menuItem) {\n      setSelectedMenu(location.state.menuItem);\n    }\n  }, [location]);\n\n  const loadMenus = async () => {\n    try {\n      setLoading(true);\n      const data = await fetchMenus();\n      setMenus(data);\n    } catch (error) {\n      console.error('Error loading menus:', error);\n      setMenus([]);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  const toggleSidebar = () => {\n    setSidebarCollapsed(!sidebarCollapsed);\n  };\n\n  return (\n    <div id=\"dashboard-layout\" className=\"flex h-screen w-full overflow-hidden\" style={{ backgroundColor: '#FFFFFF' }}>\n      <Sidebar\n        menus={menus}\n        loading={loading}\n        collapsed={sidebarCollapsed}\n        onToggle={toggleSidebar}\n        onMenuSelect={setSelectedMenu}\n      />\n      <div className=\"flex flex-col flex-1 overflow-hidden\">\n        <Header selectedMenu={selectedMenu} />\n        <main className=\"flex-1 overflow-hidden\" style={{ backgroundColor: '#FFFFFF' }}>\n          <Outlet />\n        </main>\n      </div>\n    </div>\n  );\n}\n\nexport default DashboardLayout;\n"
      },
      {
        "path": "src/components/Sidebar.jsx",
        "content": "import React from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport SidebarItem from './SidebarItem';\n\nfunction Sidebar({ menus, loading, collapsed, onToggle, onMenuSelect }) {\n  const navigate = useNavigate();\n\n  const handleMenuClick = (menuItem) => {\n    onMenuSelect(menuItem);\n    \n    if (menuItem.type === 'TABLE' && menuItem.data?.table?.slug) {\n      navigate(`/tables/${menuItem.data.table.slug}`, {\n        state: { menuItem }\n      });\n    }\n  };\n\n  return (\n    <div\n      id=\"main-sidebar\"\n      className=\"flex flex-col h-full transition-all duration-300 ease-in-out\"\n      style={{\n        width: collapsed ? '60px' : '260px',\n        backgroundColor: '#FFFFFF',\n        borderRight: '1px solid rgba(55, 53, 47, 0.16)',\n        overflow: 'hidden'\n      }}\n    >\n      {/* Sidebar Header */}\n      <div\n        className=\"flex items-center justify-between px-4 flex-shrink-0 relative\"\n        style={{\n          height: '56px',\n          borderBottom: '1px solid rgba(55, 53, 47, 0.12)',\n          overflow: 'visible'\n        }}\n      >\n        <div\n          className=\"font-semibold text-base transition-opacity duration-300\"\n          style={{\n            color: 'rgb(55, 53, 47)',\n            opacity: collapsed ? 0 : 1,\n            whiteSpace: 'nowrap'\n          }}\n        >\n          Ucode ERP\n        </div>\n        \n        {/* Toggle Button */}\n        <button\n          onClick={onToggle}\n          className=\"flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-notion-hoverMenu\"\n          style={{\n            width: '25px',\n            height: '25px',\n            borderRadius: '50%',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            backgroundColor: '#FFFFFF',\n            position: 'absolute',\n            right: '-12.5px',\n            top: '50%',\n            transform: 'translateY(-50%)',\n            zIndex: 20\n          }}\n        >\n          <span\n            className=\"text-xs transition-transform duration-300\"\n            style={{\n              color: 'rgb(55, 53, 47)',\n              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)'\n            }}\n          >\n            ‹\n          </span>\n        </button>\n      </div>\n\n      {/* Menu List */}\n      <nav\n        className=\"flex-1 py-2 px-2\"\n        style={{\n          overflowY: collapsed ? 'hidden' : 'auto',\n          overflowX: 'hidden'\n        }}\n      >\n        {loading ? (\n          <div className=\"flex items-center justify-center py-8\">\n            <div\n              className=\"animate-spin rounded-full border-2 border-t-transparent\"\n              style={{\n                width: '24px',\n                height: '24px',\n                borderColor: 'rgba(55, 53, 47, 0.16)',\n                borderTopColor: 'transparent'\n              }}\n            />\n          </div>\n        ) : menus.length === 0 ? (\n          <div\n            className=\"text-center py-8 text-sm\"\n            style={{ color: 'rgba(55, 53, 47, 0.45)' }}\n          >\n            {collapsed ? '' : 'No menus available'}\n          </div>\n        ) : (\n          <ul className=\"space-y-1\">\n            {menus.map((menuItem, index) => (\n              <SidebarItem\n                key={menuItem.id || index}\n                item={menuItem}\n                collapsed={collapsed}\n                onClick={() => handleMenuClick(menuItem)}\n              />\n            ))}\n          </ul>\n        )}\n      </nav>\n    </div>\n  );\n}\n\nexport default Sidebar;\n"
      },
      {
        "path": "src/components/SidebarItem.jsx",
        "content": "import React from 'react';\n\nfunction SidebarItem({ item, collapsed, onClick }) {\n  const icon = item.icon || '📁';\n  const label = item.label || item.attributes?.label || 'Untitled';\n\n  return (\n    <li id={`sidebar-item-${item.id}`}>\n      <button\n        onClick={onClick}\n        className=\"w-full flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-150\"\n        style={{\n          backgroundColor: 'transparent',\n          border: 'none',\n          color: 'rgb(55, 53, 47)',\n          fontSize: '14px',\n          textAlign: 'left'\n        }}\n        onMouseEnter={(e) => {\n          e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.06)';\n        }}\n        onMouseLeave={(e) => {\n          e.currentTarget.style.backgroundColor = 'transparent';\n        }}\n      >\n        <span className=\"flex-shrink-0\" style={{ fontSize: '16px' }}>\n          {icon}\n        </span>\n        {!collapsed && (\n          <span\n            className=\"truncate\"\n            style={{\n              opacity: 1,\n              transition: 'opacity 0.3s'\n            }}\n          >\n            {label}\n          </span>\n        )}\n      </button>\n    </li>\n  );\n}\n\nexport default SidebarItem;\n"
      },
      {
        "path": "src/components/Header.jsx",
        "content": "import React from 'react';\n\nfunction Header({ selectedMenu }) {\n  const pageTitle = selectedMenu?.label || selectedMenu?.attributes?.label || 'Dashboard';\n\n  return (\n    <header\n      id=\"main-header\"\n      className=\"flex items-center px-6 flex-shrink-0\"\n      style={{\n        height: '56px',\n        backgroundColor: '#FFFFFF',\n        borderBottom: '1px solid rgba(55, 53, 47, 0.12)'\n      }}\n    >\n      <h1\n        className=\"text-xl font-semibold\"\n        style={{ color: 'rgb(55, 53, 47)' }}\n      >\n        {pageTitle}\n      </h1>\n    </header>\n  );\n}\n\nexport default Header;\n"
      },
      {
        "path": "src/components/Loader.jsx",
        "content": "import React from 'react';\n\nfunction Loader({ message = 'Loading...' }) {\n  return (\n    <div id=\"loader\" className=\"flex flex-col items-center justify-center h-full w-full\">\n      <div\n        className=\"animate-spin rounded-full border-4 border-t-transparent mb-4\"\n        style={{\n          width: '48px',\n          height: '48px',\n          borderColor: 'rgba(55, 53, 47, 0.16)',\n          borderTopColor: 'transparent'\n        }}\n      />\n      <p\n        className=\"text-sm\"\n        style={{ color: 'rgba(55, 53, 47, 0.65)' }}\n      >\n        {message}\n      </p>\n    </div>\n  );\n}\n\nexport default Loader;\n"
      },
      {
        "path": "src/components/Table.jsx",
        "content": "import React, { useState, useRef, useEffect } from 'react';\nimport TableCell from './TableCell';\n\nfunction Table({ fields, rows, onCellUpdate, onSort, sortBy, sortOrder }) {\n  const [columnWidths, setColumnWidths] = useState({});\n  const [resizing, setResizing] = useState(null);\n  const tableRef = useRef(null);\n\n  const visibleFields = fields.filter(\n    (field) =>\n      !['id', 'guid'].includes(field.slug) &&\n      !field.slug.endsWith('_id') &&\n      !field.slug.endsWith('_id_data')\n  );\n\n  useEffect(() => {\n    const initialWidths = {};\n    visibleFields.forEach((field) => {\n      initialWidths[field.slug] = 220;\n    });\n    setColumnWidths(initialWidths);\n  }, [fields]);\n\n  const handleMouseDown = (e, fieldSlug) => {\n    e.preventDefault();\n    setResizing({ field: fieldSlug, startX: e.clientX, startWidth: columnWidths[fieldSlug] || 220 });\n  };\n\n  useEffect(() => {\n    if (!resizing) return;\n\n    const handleMouseMove = (e) => {\n      const diff = e.clientX - resizing.startX;\n      const newWidth = Math.max(220, resizing.startWidth + diff);\n      setColumnWidths((prev) => ({\n        ...prev,\n        [resizing.field]: newWidth\n      }));\n    };\n\n    const handleMouseUp = () => {\n      setResizing(null);\n    };\n\n    document.addEventListener('mousemove', handleMouseMove);\n    document.addEventListener('mouseup', handleMouseUp);\n\n    return () => {\n      document.removeEventListener('mousemove', handleMouseMove);\n      document.removeEventListener('mouseup', handleMouseUp);\n    };\n  }, [resizing]);\n\n  const handleSort = (fieldSlug) => {\n    if (sortBy === fieldSlug) {\n      onSort(fieldSlug, sortOrder === 'asc' ? 'desc' : 'asc');\n    } else {\n      onSort(fieldSlug, 'asc');\n    }\n  };\n\n  if (visibleFields.length === 0) {\n    return (\n      <div\n        id=\"data-table-empty\"\n        className=\"flex items-center justify-center h-full\"\n        style={{ color: 'rgba(55, 53, 47, 0.45)' }}\n      >\n        No columns to display\n      </div>\n    );\n  }\n\n  return (\n    <div id=\"data-table\" className=\"h-full w-full overflow-auto\" ref={tableRef}>\n      <table\n        className=\"border-collapse\"\n        style={{\n          width: 'max-content',\n          minWidth: '100%'\n        }}\n      >\n        <thead>\n          <tr>\n            {visibleFields.map((field) => (\n              <th\n                key={field.slug}\n                className=\"text-left font-medium text-xs relative\"\n                style={{\n                  minWidth: `${columnWidths[field.slug] || 220}px`,\n                  maxWidth: `${columnWidths[field.slug] || 220}px`,\n                  width: `${columnWidths[field.slug] || 220}px`,\n                  height: '32px',\n                  padding: '0 12px',\n                  backgroundColor: '#FFFFFF',\n                  color: 'rgba(55, 53, 47, 0.65)',\n                  border: '1px solid rgba(55, 53, 47, 0.16)',\n                  position: 'sticky',\n                  top: 0,\n                  zIndex: 10,\n                  whiteSpace: 'nowrap',\n                  overflow: 'hidden',\n                  textOverflow: 'ellipsis',\n                  cursor: 'pointer',\n                  userSelect: 'none'\n                }}\n                onClick={() => handleSort(field.slug)}\n              >\n                <div className=\"flex items-center justify-between\">\n                  <span>{field.label || field.slug}</span>\n                  {sortBy === field.slug && (\n                    <span style={{ fontSize: '10px', marginLeft: '4px' }}>\n                      {sortOrder === 'asc' ? '▲' : '▼'}\n                    </span>\n                  )}\n                </div>\n                <div\n                  className=\"absolute top-0 right-0 w-1 h-full cursor-col-resize\"\n                  style={{\n                    backgroundColor: resizing?.field === field.slug ? 'rgba(55, 53, 47, 0.3)' : 'transparent'\n                  }}\n                  onMouseDown={(e) => handleMouseDown(e, field.slug)}\n                  onMouseEnter={(e) => {\n                    if (!resizing) {\n                      e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.2)';\n                    }\n                  }}\n                  onMouseLeave={(e) => {\n                    if (!resizing) {\n                      e.currentTarget.style.backgroundColor = 'transparent';\n                    }\n                  }}\n                />\n              </th>\n            ))}\n          </tr>\n        </thead>\n        <tbody>\n          {rows.length === 0 ? (\n            <tr>\n              <td\n                colSpan={visibleFields.length}\n                className=\"text-center py-12\"\n                style={{\n                  color: 'rgba(55, 53, 47, 0.45)',\n                  border: '1px solid rgba(55, 53, 47, 0.16)'\n                }}\n              >\n                No data available\n              </td>\n            </tr>\n          ) : (\n            rows.map((row, rowIndex) => (\n              <tr\n                key={row.guid || row.id || rowIndex}\n                id={`data-table-row-${rowIndex}`}\n                className=\"transition-colors duration-100\"\n                style={{\n                  backgroundColor: '#FFFFFF'\n                }}\n                onMouseEnter={(e) => {\n                  e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.03)';\n                }}\n                onMouseLeave={(e) => {\n                  e.currentTarget.style.backgroundColor = '#FFFFFF';\n                }}\n              >\n                {visibleFields.map((field) => (\n                  <TableCell\n                    key={`${row.guid || row.id}-${field.slug}`}\n                    field={field}\n                    value={row[field.slug]}\n                    rowData={row}\n                    width={columnWidths[field.slug] || 220}\n                    onUpdate={(newValue) => onCellUpdate(row, field.slug, newValue)}\n                  />\n                ))}\n              </tr>\n            ))\n          )}\n        </tbody>\n      </table>\n    </div>\n  );\n}\n\nexport default Table;\n"
      },
      {
        "path": "src/components/TableCell.jsx",
        "content": "import React, { useState, useRef, useEffect } from 'react';\nimport StatusDropdown from './StatusDropdown';\n\nfunction TableCell({ field, value, rowData, width, onUpdate }) {\n  const [isEditing, setIsEditing] = useState(false);\n  const [editValue, setEditValue] = useState(value ?? '');\n  const [showStatusDropdown, setShowStatusDropdown] = useState(false);\n  const cellRef = useRef(null);\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    setEditValue(value ?? '');\n  }, [value]);\n\n  useEffect(() => {\n    if (isEditing && inputRef.current) {\n      inputRef.current.focus();\n    }\n  }, [isEditing]);\n\n  const handleClick = () => {\n    if (field.type === 'TEXT') return;\n    if (field.type === 'STATUS') {\n      setShowStatusDropdown(true);\n      return;\n    }\n    setIsEditing(true);\n  };\n\n  const handleBlur = () => {\n    setIsEditing(false);\n    if (editValue !== value) {\n      onUpdate(editValue);\n    }\n  };\n\n  const handleKeyDown = (e) => {\n    if (e.key === 'Enter') {\n      handleBlur();\n    } else if (e.key === 'Escape') {\n      setEditValue(value ?? '');\n      setIsEditing(false);\n    }\n  };\n\n  const handleStatusSelect = (selectedValue) => {\n    setShowStatusDropdown(false);\n    if (selectedValue !== value) {\n      onUpdate(selectedValue);\n    }\n  };\n\n  const renderCellContent = () => {\n    if (field.type === 'STATUS') {\n      const statusValue = value || '';\n      let statusOption = null;\n      let categoryColor = '#007AFF';\n\n      if (field.attributes) {\n        const todoOptions = field.attributes.todo?.options || [];\n        const progressOptions = field.attributes.progress?.options || [];\n        const completeOptions = field.attributes.complete?.options || [];\n\n        statusOption = [...todoOptions, ...progressOptions, ...completeOptions].find(\n          (opt) => opt.value === statusValue\n        );\n\n        if (statusOption) {\n          categoryColor = statusOption.color || '#007AFF';\n        }\n      }\n\n      const displayLabel = statusOption?.label_ru || statusOption?.label_en || statusOption?.value || statusValue || 'Not set';\n\n      return (\n        <div className=\"relative\">\n          <div\n            className=\"inline-flex items-center px-2 py-1 rounded text-xs font-medium\"\n            style={{\n              color: categoryColor,\n              backgroundColor: `${categoryColor}1A`,\n              border: 'none'\n            }}\n          >\n            {displayLabel}\n          </div>\n          {showStatusDropdown && (\n            <StatusDropdown\n              field={field}\n              currentValue={statusValue}\n              onSelect={handleStatusSelect}\n              onClose={() => setShowStatusDropdown(false)}\n              anchorRef={cellRef}\n            />\n          )}\n        </div>\n      );\n    }\n\n    if (isEditing) {\n      let inputType = 'text';\n      if (field.type === 'NUMBER' || field.type === 'FLOAT') {\n        inputType = 'number';\n      }\n\n      return (\n        <input\n          ref={inputRef}\n          type={inputType}\n          value={editValue}\n          onChange={(e) => setEditValue(e.target.value)}\n          onBlur={handleBlur}\n          onKeyDown={handleKeyDown}\n          step={field.type === 'FLOAT' ? 'any' : undefined}\n          style={{\n            width: '100%',\n            height: '100%',\n            border: 'none',\n            outline: 'none',\n            backgroundColor: 'transparent',\n            color: 'rgb(55, 53, 47)',\n            fontSize: '13px',\n            fontFamily: 'inherit',\n            padding: 0\n          }}\n        />\n      );\n    }\n\n    return (\n      <span\n        style={{\n          whiteSpace: 'nowrap',\n          overflow: 'hidden',\n          textOverflow: 'ellipsis',\n          display: 'block'\n        }}\n      >\n        {value ?? ''}\n      </span>\n    );\n  };\n\n  const isEditable = !['TEXT'].includes(field.type);\n\n  return (\n    <td\n      ref={cellRef}\n      onClick={handleClick}\n      className=\"transition-colors duration-100\"\n      style={{\n        minWidth: `${width}px`,\n        maxWidth: `${width}px`,\n        width: `${width}px`,\n        height: '36px',\n        padding: '0 12px',\n        color: 'rgb(55, 53, 47)',\n        fontSize: '13px',\n        border: '1px solid rgba(55, 53, 47, 0.16)',\n        backgroundColor: '#FFFFFF',\n        cursor: isEditable ? 'pointer' : 'default',\n        whiteSpace: 'nowrap',\n        overflow: 'hidden',\n        textOverflow: 'ellipsis',\n        position: 'relative'\n      }}\n    >\n      {renderCellContent()}\n    </td>\n  );\n}\n\nexport default TableCell;\n"
      },
      {
        "path": "src/components/StatusDropdown.jsx",
        "content": "import React, { useRef, useEffect } from 'react';\n\nfunction StatusDropdown({ field, currentValue, onSelect, onClose, anchorRef }) {\n  const dropdownRef = useRef(null);\n\n  useEffect(() => {\n    const handleClickOutside = (e) => {\n      if (\n        dropdownRef.current &&\n        !dropdownRef.current.contains(e.target) &&\n        anchorRef.current &&\n        !anchorRef.current.contains(e.target)\n      ) {\n        onClose();\n      }\n    };\n\n    const handleEscape = (e) => {\n      if (e.key === 'Escape') {\n        onClose();\n      }\n    };\n\n    document.addEventListener('mousedown', handleClickOutside);\n    document.addEventListener('keydown', handleEscape);\n\n    return () => {\n      document.removeEventListener('mousedown', handleClickOutside);\n      document.removeEventListener('keydown', handleEscape);\n    };\n  }, [onClose, anchorRef]);\n\n  const categories = [\n    {\n      label: 'To Do',\n      options: field.attributes?.todo?.options || [{ value: 'todo', label_en: 'To Do' }]\n    },\n    {\n      label: 'In Progress',\n      options: field.attributes?.progress?.options || [{ value: 'in_progress', label_en: 'In Progress' }]\n    },\n    {\n      label: 'Complete',\n      options: field.attributes?.complete?.options || [{ value: 'complete', label_en: 'Complete' }]\n    }\n  ];\n\n  return (\n    <div\n      ref={dropdownRef}\n      className=\"absolute z-50 mt-1 rounded shadow-lg\"\n      style={{\n        backgroundColor: '#FFFFFF',\n        border: '1px solid rgba(55, 53, 47, 0.16)',\n        minWidth: '200px',\n        maxHeight: '300px',\n        overflowY: 'auto',\n        top: '100%',\n        left: 0\n      }}\n    >\n      {categories.map((category, catIndex) => (\n        <div key={catIndex} className=\"py-1\">\n          <div\n            className=\"px-3 py-1 text-xs font-medium\"\n            style={{ color: 'rgba(55, 53, 47, 0.45)' }}\n          >\n            {category.label}\n          </div>\n          {category.options.map((option, optIndex) => {\n            const label = option.label_ru || option.label_en || option.value;\n            const color = option.color || '#007AFF';\n            const isSelected = option.value === currentValue;\n\n            return (\n              <button\n                key={optIndex}\n                onClick={() => onSelect(option.value)}\n                className=\"w-full text-left px-3 py-1.5 text-sm transition-colors duration-100\"\n                style={{\n                  backgroundColor: isSelected ? 'rgba(55, 53, 47, 0.06)' : 'transparent',\n                  border: 'none',\n                  color: color,\n                  cursor: 'pointer'\n                }}\n                onMouseEnter={(e) => {\n                  if (!isSelected) {\n                    e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.06)';\n                  }\n                }}\n                onMouseLeave={(e) => {\n                  if (!isSelected) {\n                    e.currentTarget.style.backgroundColor = 'transparent';\n                  }\n                }}\n              >\n                <span\n                  className=\"inline-flex items-center px-2 py-0.5 rounded text-xs\"\n                  style={{\n                    color: color,\n                    backgroundColor: `${color}1A`\n                  }}\n                >\n                  {label}\n                </span>\n              </button>\n            );\n          })}\n        </div>\n      ))}\n    </div>\n  );\n}\n\nexport default StatusDropdown;\n"
      },
      {
        "path": "src/components/TableSubHeader.jsx",
        "content": "import React, { useState } from 'react';\n\nfunction TableSubHeader({ onSearchChange, onSortToggle, onFilterToggle, onCreateClick, sortOrder }) {\n  const [activeView, setActiveView] = useState('table');\n  const [searchValue, setSearchValue] = useState('');\n\n  const views = [\n    { id: 'table', label: 'Table', icon: '☰' },\n    { id: 'board', label: 'Board', icon: '▦' },\n    { id: 'timeline', label: 'Timeline', icon: '─' },\n    { id: 'calendar', label: 'Calendar', icon: '📅' },\n    { id: 'tree', label: 'Tree', icon: '🌳' }\n  ];\n\n  const handleSearchChange = (e) => {\n    const value = e.target.value;\n    setSearchValue(value);\n    onSearchChange(value);\n  };\n\n  return (\n    <div\n      id=\"table-sub-header\"\n      className=\"flex items-center justify-between px-6 flex-shrink-0\"\n      style={{\n        height: '48px',\n        backgroundColor: '#FFFFFF',\n        borderBottom: '1px solid rgba(55, 53, 47, 0.12)'\n      }}\n    >\n      {/* Left: View Tabs */}\n      <div className=\"flex items-center gap-1 overflow-x-auto\" style={{ maxWidth: '50%' }}>\n        {views.map((view) => (\n          <button\n            key={view.id}\n            onClick={() => setActiveView(view.id)}\n            className=\"flex items-center gap-1.5 px-3 py-1 rounded text-sm whitespace-nowrap transition-all duration-150\"\n            style={{\n              backgroundColor: activeView === view.id ? '#F0F0EF' : 'transparent',\n              color: activeView === view.id ? 'rgb(55, 53, 47)' : 'rgba(55, 53, 47, 0.65)',\n              border: 'none',\n              fontWeight: activeView === view.id ? '500' : '400'\n            }}\n          >\n            <span style={{ fontSize: '14px' }}>{view.icon}</span>\n            <span>{view.label}</span>\n          </button>\n        ))}\n      </div>\n\n      {/* Right: Actions */}\n      <div className=\"flex items-center gap-2\">\n        {/* Search */}\n        <input\n          type=\"text\"\n          placeholder=\"Search...\"\n          value={searchValue}\n          onChange={handleSearchChange}\n          className=\"px-3 py-1.5 rounded text-sm transition-all duration-150\"\n          style={{\n            width: '180px',\n            backgroundColor: 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: 'rgb(55, 53, 47)',\n            outline: 'none'\n          }}\n          onFocus={(e) => {\n            e.target.style.borderColor = 'rgba(55, 53, 47, 0.3)';\n          }}\n          onBlur={(e) => {\n            e.target.style.borderColor = 'rgba(55, 53, 47, 0.16)';\n          }}\n        />\n\n        {/* Sort Button */}\n        <button\n          onClick={onSortToggle}\n          className=\"px-3 py-1.5 rounded text-sm transition-all duration-150 flex items-center gap-1.5\"\n          style={{\n            backgroundColor: 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: 'rgb(55, 53, 47)'\n          }}\n          onMouseEnter={(e) => {\n            e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.12)';\n          }}\n          onMouseLeave={(e) => {\n            e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';\n          }}\n        >\n          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>\n          <span>Sort</span>\n        </button>\n\n        {/* Filter Button */}\n        <button\n          onClick={onFilterToggle}\n          className=\"px-3 py-1.5 rounded text-sm transition-all duration-150\"\n          style={{\n            backgroundColor: 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: 'rgb(55, 53, 47)'\n          }}\n          onMouseEnter={(e) => {\n            e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.12)';\n          }}\n          onMouseLeave={(e) => {\n            e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';\n          }}\n        >\n          Filter\n        </button>\n\n        {/* Create Item Button */}\n        <button\n          onClick={onCreateClick}\n          className=\"px-4 py-1.5 rounded text-sm font-medium transition-all duration-150\"\n          style={{\n            backgroundColor: '#007AFF',\n            border: 'none',\n            color: '#FFFFFF'\n          }}\n          onMouseEnter={(e) => {\n            e.currentTarget.style.backgroundColor = '#0066DD';\n          }}\n          onMouseLeave={(e) => {\n            e.currentTarget.style.backgroundColor = '#007AFF';\n          }}\n        >\n          Create item\n        </button>\n      </div>\n    </div>\n  );\n}\n\nexport default TableSubHeader;\n"
      },
      {
        "path": "src/components/FilterPanel.jsx",
        "content": "import React from 'react';\n\nfunction FilterPanel({ fields, onClose }) {\n  const visibleFields = fields.filter(\n    (field) =>\n      !['id', 'guid'].includes(field.slug) &&\n      !field.slug.endsWith('_id') &&\n      !field.slug.endsWith('_id_data')\n  );\n\n  return (\n    <div\n      id=\"filter-panel\"\n      className=\"flex items-center px-6 flex-shrink-0\"\n      style={{\n        height: '48px',\n        backgroundColor: '#FFFFFF',\n        borderBottom: '1px solid rgba(55, 53, 47, 0.12)'\n      }}\n    >\n      <div className=\"flex items-center gap-4 w-full overflow-x-auto\">\n        <span className=\"text-sm font-medium\" style={{ color: 'rgb(55, 53, 47)' }}>\n          Filters:\n        </span>\n        {visibleFields.slice(0, 3).map((field) => (\n          <div key={field.slug} className=\"flex items-center gap-2\">\n            <label className=\"text-sm\" style={{ color: 'rgba(55, 53, 47, 0.65)' }}>\n              {field.label || field.slug}\n            </label>\n            <input\n              type=\"text\"\n              placeholder=\"...\"\n              className=\"px-2 py-1 rounded text-sm\"\n              style={{\n                width: '120px',\n                backgroundColor: 'rgba(55, 53, 47, 0.08)',\n                border: '1px solid rgba(55, 53, 47, 0.16)',\n                color: 'rgb(55, 53, 47)',\n                outline: 'none'\n              }}\n            />\n          </div>\n        ))}\n        <button\n          onClick={onClose}\n          className=\"ml-auto px-3 py-1 rounded text-sm transition-all duration-150\"\n          style={{\n            backgroundColor: 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: 'rgb(55, 53, 47)'\n          }}\n          onMouseEnter={(e) => {\n            e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.12)';\n          }}\n          onMouseLeave={(e) => {\n            e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';\n          }}\n        >\n          Close\n        </button>\n      </div>\n    </div>\n  );\n}\n\nexport default FilterPanel;\n"
      },
      {
        "path": "src/components/CreateItemDrawer.jsx",
        "content": "import React, { useState, useEffect } from 'react';\nimport { createTableItem } from '../api/axios';\n\nfunction CreateItemDrawer({ tableSlug, fields, onClose, onSuccess }) {\n  const [formData, setFormData] = useState({});\n  const [loading, setLoading] = useState(false);\n\n  const visibleFields = fields.filter(\n    (field) =>\n      !['id', 'guid'].includes(field.slug) &&\n      !field.slug.endsWith('_id') &&\n      !field.slug.endsWith('_id_data')\n  );\n\n  useEffect(() => {\n    const initialData = {};\n    visibleFields.forEach((field) => {\n      initialData[field.slug] = field.defaultValue || '';\n    });\n    setFormData(initialData);\n  }, [fields]);\n\n  const handleChange = (fieldSlug, value) => {\n    setFormData((prev) => ({\n      ...prev,\n      [fieldSlug]: value\n    }));\n  };\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    setLoading(true);\n    try {\n      await createTableItem(tableSlug, formData);\n      onSuccess();\n      onClose();\n    } catch (error) {\n      console.error('Error creating item:', error);\n      alert('Failed to create item');\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  return (\n    <>\n      {/* Overlay */}\n      <div\n        className=\"fixed inset-0 bg-black bg-opacity-20 z-40\"\n        onClick={onClose}\n        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}\n      />\n\n      {/* Drawer */}\n      <div\n        id=\"create-item-drawer\"\n        className=\"fixed top-0 right-0 h-full z-50 shadow-2xl flex flex-col\"\n        style={{\n          width: '420px',\n          backgroundColor: '#FFFFFF',\n          borderLeft: '1px solid rgba(55, 53, 47, 0.16)'\n        }}\n      >\n        {/* Header */}\n        <div\n          className=\"flex items-center justify-between px-6 flex-shrink-0\"\n          style={{\n            height: '56px',\n            borderBottom: '1px solid rgba(55, 53, 47, 0.12)'\n          }}\n        >\n          <h2 className=\"text-lg font-semibold\" style={{ color: 'rgb(55, 53, 47)' }}>\n            Create New Item\n          </h2>\n          <button\n            onClick={onClose}\n            className=\"text-xl\"\n            style={{\n              border: 'none',\n              backgroundColor: 'transparent',\n              color: 'rgba(55, 53, 47, 0.65)',\n              cursor: 'pointer'\n            }}\n          >\n            ×\n          </button>\n        </div>\n\n        {/* Form */}\n        <form onSubmit={handleSubmit} className=\"flex-1 overflow-y-auto px-6 py-4\">\n          <div className=\"space-y-4\">\n            {visibleFields.map((field) => (\n              <div key={field.slug}>\n                <label\n                  className=\"block text-sm font-medium mb-1.5\"\n                  style={{ color: 'rgb(55, 53, 47)' }}\n                >\n                  {field.label || field.slug}\n                  {field.required && <span style={{ color: '#FF3B30' }}> *</span>}\n                </label>\n                {field.type === 'NUMBER' || field.type === 'FLOAT' ? (\n                  <input\n                    type=\"number\"\n                    step={field.type === 'FLOAT' ? 'any' : undefined}\n                    value={formData[field.slug] || ''}\n                    onChange={(e) => handleChange(field.slug, e.target.value)}\n                    required={field.required}\n                    className=\"w-full px-3 py-2 rounded text-sm\"\n                    style={{\n                      backgroundColor: 'rgba(55, 53, 47, 0.08)',\n                      border: '1px solid rgba(55, 53, 47, 0.16)',\n                      color: 'rgb(55, 53, 47)',\n                      outline: 'none'\n                    }}\n                  />\n                ) : (\n                  <input\n                    type=\"text\"\n                    value={formData[field.slug] || ''}\n                    onChange={(e) => handleChange(field.slug, e.target.value)}\n                    required={field.required}\n                    className=\"w-full px-3 py-2 rounded text-sm\"\n                    style={{\n                      backgroundColor: 'rgba(55, 53, 47, 0.08)',\n                      border: '1px solid rgba(55, 53, 47, 0.16)',\n                      color: 'rgb(55, 53, 47)',\n                      outline: 'none'\n                    }}\n                  />\n                )}\n              </div>\n            ))}\n          </div>\n        </form>\n\n        {/* Footer */}\n        <div\n          className=\"flex items-center justify-end gap-2 px-6 flex-shrink-0\"\n          style={{\n            height: '64px',\n            borderTop: '1px solid rgba(55, 53, 47, 0.12)'\n          }}\n        >\n          <button\n            type=\"button\"\n            onClick={onClose}\n            className=\"px-4 py-2 rounded text-sm transition-all duration-150\"\n            style={{\n              backgroundColor: 'rgba(55, 53, 47, 0.08)',\n              border: '1px solid rgba(55, 53, 47, 0.16)',\n              color: 'rgb(55, 53, 47)'\n            }}\n            onMouseEnter={(e) => {\n              e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.12)';\n            }}\n            onMouseLeave={(e) => {\n              e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';\n            }}\n          >\n            Cancel\n          </button>\n          <button\n            type=\"submit\"\n            onClick={handleSubmit}\n            disabled={loading}\n            className=\"px-4 py-2 rounded text-sm font-medium transition-all duration-150\"\n            style={{\n              backgroundColor: loading ? 'rgba(0, 122, 255, 0.5)' : '#007AFF',\n              border: 'none',\n              color: '#FFFFFF',\n              cursor: loading ? 'not-allowed' : 'pointer'\n            }}\n            onMouseEnter={(e) => {\n              if (!loading) {\n                e.currentTarget.style.backgroundColor = '#0066DD';\n              }\n            }}\n            onMouseLeave={(e) => {\n              if (!loading) {\n                e.currentTarget.style.backgroundColor = '#007AFF';\n              }\n            }}\n          >\n            {loading ? 'Creating...' : 'Create'}\n          </button>\n        </div>\n      </div>\n    </>\n  );\n}\n\nexport default CreateItemDrawer;\n"
      },
      {
        "path": "src/components/Pagination.jsx",
        "content": "import React from 'react';\n\nfunction Pagination({ currentPage, pageSize, totalCount, onPageChange, onPageSizeChange }) {\n  const totalPages = Math.ceil(totalCount / pageSize);\n  const pageSizes = [10, 20, 50];\n\n  const handlePrevious = () => {\n    if (currentPage > 1) {\n      onPageChange(currentPage - 1);\n    }\n  };\n\n  const handleNext = () => {\n    if (currentPage < totalPages) {\n      onPageChange(currentPage + 1);\n    }\n  };\n\n  return (\n    <div\n      id=\"table-pagination\"\n      className=\"flex items-center justify-between px-6 flex-shrink-0\"\n      style={{\n        height: '48px',\n        backgroundColor: '#FFFFFF',\n        borderTop: '1px solid rgba(55, 53, 47, 0.12)'\n      }}\n    >\n      {/* Left: Page size selector */}\n      <div className=\"flex items-center gap-2\">\n        <span className=\"text-sm\" style={{ color: 'rgba(55, 53, 47, 0.65)' }}>\n          Show\n        </span>\n        <select\n          value={pageSize}\n          onChange={(e) => onPageSizeChange(Number(e.target.value))}\n          className=\"px-2 py-1 rounded text-sm\"\n          style={{\n            backgroundColor: 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: 'rgb(55, 53, 47)',\n            outline: 'none',\n            cursor: 'pointer'\n          }}\n        >\n          {pageSizes.map((size) => (\n            <option key={size} value={size}>\n              {size}\n            </option>\n          ))}\n        </select>\n        <span className=\"text-sm\" style={{ color: 'rgba(55, 53, 47, 0.65)' }}>\n          items\n        </span>\n      </div>\n\n      {/* Center: Page info */}\n      <div className=\"text-sm\" style={{ color: 'rgba(55, 53, 47, 0.65)' }}>\n        Page {currentPage} of {totalPages || 1} ({totalCount} total)\n      </div>\n\n      {/* Right: Navigation buttons */}\n      <div className=\"flex items-center gap-2\">\n        <button\n          onClick={handlePrevious}\n          disabled={currentPage <= 1}\n          className=\"px-3 py-1 rounded text-sm transition-all duration-150\"\n          style={{\n            backgroundColor: currentPage <= 1 ? 'rgba(55, 53, 47, 0.04)' : 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: currentPage <= 1 ? 'rgba(55, 53, 47, 0.3)' : 'rgb(55, 53, 47)',\n            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'\n          }}\n          onMouseEnter={(e) => {\n            if (currentPage > 1) {\n              e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.12)';\n            }\n          }}\n          onMouseLeave={(e) => {\n            if (currentPage > 1) {\n              e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';\n            }\n          }}\n        >\n          Previous\n        </button>\n        <button\n          onClick={handleNext}\n          disabled={currentPage >= totalPages}\n          className=\"px-3 py-1 rounded text-sm transition-all duration-150\"\n          style={{\n            backgroundColor: currentPage >= totalPages ? 'rgba(55, 53, 47, 0.04)' : 'rgba(55, 53, 47, 0.08)',\n            border: '1px solid rgba(55, 53, 47, 0.16)',\n            color: currentPage >= totalPages ? 'rgba(55, 53, 47, 0.3)' : 'rgb(55, 53, 47)',\n            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'\n          }}\n          onMouseEnter={(e) => {\n            if (currentPage < totalPages) {\n              e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.12)';\n            }\n          }}\n          onMouseLeave={(e) => {\n            if (currentPage < totalPages) {\n              e.currentTarget.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';\n            }\n          }}\n        >\n          Next\n        </button>\n      </div>\n    </div>\n  );\n}\n\nexport default Pagination;\n"
      },
      {
        "path": "src/pages/DashboardHome.jsx",
        "content": "import React from 'react';\n\nfunction DashboardHome() {\n  return (\n    <div\n      id=\"dashboard-home-page\"\n      className=\"flex items-center justify-center h-full w-full\"\n      style={{ backgroundColor: '#FFFFFF' }}\n    >\n      <div className=\"text-center\">\n        <h1\n          className=\"text-3xl font-semibold mb-2\"\n          style={{ color: 'rgb(55, 53, 47)' }}\n        >\n          Welcome to Ucode ERP\n        </h1>\n        <p\n          className=\"text-base\"\n          style={{ color: 'rgba(55, 53, 47, 0.65)' }}\n        >\n          Select a table from the menu to get started\n        </p>\n      </div>\n    </div>\n  );\n}\n\nexport default DashboardHome;\n"
      },
      {
        "path": "src/pages/DynamicTablePage.jsx",
        "content": "import React, { useState, useEffect } from 'react';\nimport { useParams } from 'react-router-dom';\nimport { fetchTableDetails, fetchTableData, updateTableItem } from '../api/axios';\nimport Loader from '../components/Loader';\nimport Table from '../components/Table';\nimport TableSubHeader from '../components/TableSubHeader';\nimport FilterPanel from '../components/FilterPanel';\nimport CreateItemDrawer from '../components/CreateItemDrawer';\nimport Pagination from '../components/Pagination';\n\nfunction DynamicTablePage() {\n  const { tableSlug } = useParams();\n  const [loading, setLoading] = useState(true);\n  const [tableDetails, setTableDetails] = useState(null);\n  const [rows, setRows] = useState([]);\n  const [totalCount, setTotalCount] = useState(0);\n  const [currentPage, setCurrentPage] = useState(1);\n  const [pageSize, setPageSize] = useState(20);\n  const [searchQuery, setSearchQuery] = useState('');\n  const [sortBy, setSortBy] = useState('');\n  const [sortOrder, setSortOrder] = useState('asc');\n  const [showFilter, setShowFilter] = useState(false);\n  const [showCreateDrawer, setShowCreateDrawer] = useState(false);\n\n  useEffect(() => {\n    if (tableSlug) {\n      loadTableData();\n    }\n  }, [tableSlug, currentPage, pageSize, searchQuery, sortBy, sortOrder]);\n\n  const loadTableData = async () => {\n    try {\n      setLoading(true);\n      \n      const details = await fetchTableDetails(tableSlug);\n      setTableDetails(details);\n\n      const offset = (currentPage - 1) * pageSize;\n      const { rows: tableRows, count } = await fetchTableData(tableSlug, {\n        limit: pageSize,\n        offset,\n        search: searchQuery,\n        sort_by: sortBy,\n        sort_order: sortOrder\n      });\n\n      setRows(tableRows);\n      setTotalCount(count);\n    } catch (error) {\n      console.error('Error loading table data:', error);\n      setTableDetails(null);\n      setRows([]);\n      setTotalCount(0);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  const handleCellUpdate = async (row, fieldSlug, newValue) => {\n    try {\n      const itemId = row.guid || row.id;\n      await updateTableItem(tableSlug, itemId, { [fieldSlug]: newValue });\n      \n      setRows((prevRows) =>\n        prevRows.map((r) =>\n          (r.guid || r.id) === itemId ? { ...r, [fieldSlug]: newValue } : r\n        )\n      );\n    } catch (error) {\n      console.error('Error updating cell:', error);\n      alert('Failed to update cell');\n    }\n  };\n\n  const handleSort = (field, order) => {\n    setSortBy(field);\n    setSortOrder(order);\n  };\n\n  const handleSearchChange = (query) => {\n    setSearchQuery(query);\n    setCurrentPage(1);\n  };\n\n  const handlePageChange = (newPage) => {\n    setCurrentPage(newPage);\n  };\n\n  const handlePageSizeChange = (newSize) => {\n    setPageSize(newSize);\n    setCurrentPage(1);\n  };\n\n  const handleCreateSuccess = () => {\n    loadTableData();\n  };\n\n  if (loading) {\n    return <Loader message=\"Loading table data...\" />;\n  }\n\n  if (!tableDetails) {\n    return (\n      <div\n        id=\"dynamic-table-page-error\"\n        className=\"flex items-center justify-center h-full\"\n        style={{ color: 'rgba(55, 53, 47, 0.45)' }}\n      >\n        Table not found\n      </div>\n    );\n  }\n\n  const fields = tableDetails.fields || [];\n\n  return (\n    <div id=\"dynamic-table-page\" className=\"flex flex-col h-full\" style={{ backgroundColor: '#FFFFFF' }}>\n      <TableSubHeader\n        onSearchChange={handleSearchChange}\n        onSortToggle={() => handleSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}\n        onFilterToggle={() => setShowFilter(!showFilter)}\n        onCreateClick={() => setShowCreateDrawer(true)}\n        sortOrder={sortOrder}\n      />\n\n      {showFilter && (\n        <FilterPanel\n          fields={fields}\n          onClose={() => setShowFilter(false)}\n        />\n      )}\n\n      <div className=\"flex-1 overflow-hidden\">\n        <Table\n          fields={fields}\n          rows={rows}\n          onCellUpdate={handleCellUpdate}\n          onSort={handleSort}\n          sortBy={sortBy}\n          sortOrder={sortOrder}\n        />\n      </div>\n\n      <Pagination\n        currentPage={currentPage}\n        pageSize={pageSize}\n        totalCount={totalCount}\n        onPageChange={handlePageChange}\n        onPageSizeChange={handlePageSizeChange}\n      />\n\n      {showCreateDrawer && (\n        <CreateItemDrawer\n          tableSlug={tableSlug}\n          fields={fields}\n          onClose={() => setShowCreateDrawer(false)}\n          onSuccess={handleCreateSuccess}\n        />\n      )}\n    </div>\n  );\n}\n\nexport default DynamicTablePage;\n"
      }
    ],
    "file_graph": {
      ".env": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": ".env"
      },
      ".env.example": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": ".env.example"
      },
      "README_HOW_TO_RUN.txt": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": "README_HOW_TO_RUN.txt"
      },
      "index.html": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": "index.html"
      },
      "package.json": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": "package.json"
      },
      "postcss.config.js": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": "postcss.config.js"
      },
      "src/App.jsx": {
        "deps": [
          "src/layouts/DashboardLayout.jsx",
          "src/pages/DashboardHome.jsx",
          "src/pages/DynamicTablePage.jsx"
        ],
        "imports": [
          "react",
          "react-router-dom",
          "./layouts/DashboardLayout",
          "./pages/DashboardHome",
          "./pages/DynamicTablePage"
        ],
        "kind": "component",
        "path": "src/App.jsx"
      },
      "src/api/axios.js": {
        "deps": [],
        "imports": [
          "axios"
        ],
        "kind": "api",
        "path": "src/api/axios.js"
      },
      "src/components/CreateItemDrawer.jsx": {
        "deps": [
          "src/api/axios.js"
        ],
        "imports": [
          "react",
          "../api/axios"
        ],
        "kind": "component",
        "path": "src/components/CreateItemDrawer.jsx"
      },
      "src/components/FilterPanel.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/FilterPanel.jsx"
      },
      "src/components/Header.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/Header.jsx"
      },
      "src/components/Loader.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/Loader.jsx"
      },
      "src/components/Pagination.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/Pagination.jsx"
      },
      "src/components/Sidebar.jsx": {
        "deps": [
          "src/components/SidebarItem.jsx"
        ],
        "imports": [
          "react",
          "react-router-dom",
          "./SidebarItem"
        ],
        "kind": "component",
        "path": "src/components/Sidebar.jsx"
      },
      "src/components/SidebarItem.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/SidebarItem.jsx"
      },
      "src/components/StatusDropdown.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/StatusDropdown.jsx"
      },
      "src/components/Table.jsx": {
        "deps": [
          "src/components/TableCell.jsx"
        ],
        "imports": [
          "react",
          "./TableCell"
        ],
        "kind": "component",
        "path": "src/components/Table.jsx"
      },
      "src/components/TableCell.jsx": {
        "deps": [
          "src/components/StatusDropdown.jsx"
        ],
        "imports": [
          "react",
          "./StatusDropdown"
        ],
        "kind": "component",
        "path": "src/components/TableCell.jsx"
      },
      "src/components/TableSubHeader.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "component",
        "path": "src/components/TableSubHeader.jsx"
      },
      "src/index.css": {
        "deps": [],
        "imports": [],
        "kind": "style",
        "path": "src/index.css"
      },
      "src/layouts/DashboardLayout.jsx": {
        "deps": [
          "src/components/Sidebar.jsx",
          "src/components/Header.jsx",
          "src/api/axios.js"
        ],
        "imports": [
          "react",
          "react-router-dom",
          "../components/Sidebar",
          "../components/Header",
          "../api/axios"
        ],
        "kind": "layout",
        "path": "src/layouts/DashboardLayout.jsx"
      },
      "src/main.jsx": {
        "deps": [
          "src/App.jsx",
          "src/index.css"
        ],
        "imports": [
          "react",
          "react-dom/client",
          "./App",
          "./index.css"
        ],
        "kind": "config",
        "path": "src/main.jsx"
      },
      "src/pages/DashboardHome.jsx": {
        "deps": [],
        "imports": [
          "react"
        ],
        "kind": "page",
        "path": "src/pages/DashboardHome.jsx"
      },
      "src/pages/DynamicTablePage.jsx": {
        "deps": [
          "src/api/axios.js",
          "src/components/Loader.jsx",
          "src/components/Table.jsx",
          "src/components/TableSubHeader.jsx",
          "src/components/FilterPanel.jsx",
          "src/components/CreateItemDrawer.jsx",
          "src/components/Pagination.jsx"
        ],
        "imports": [
          "react",
          "react-router-dom",
          "../api/axios",
          "../components/Loader",
          "../components/Table",
          "../components/TableSubHeader",
          "../components/FilterPanel",
          "../components/CreateItemDrawer",
          "../components/Pagination"
        ],
        "kind": "page",
        "path": "src/pages/DynamicTablePage.jsx"
      },
      "tailwind.config.js": {
        "deps": [],
        "imports": [],
        "kind": "config",
        "path": "tailwind.config.js"
      },
      "vite.config.js": {
        "deps": [],
        "imports": [
          "vite",
          "@vitejs/plugin-react"
        ],
        "kind": "config",
        "path": "vite.config.js"
      }
    },
    "env": {
      "VITE_ADMIN_BASE_URL": "https://admin-api.ucode.run",
      "VITE_PARENT_ID": "c57eedc3-a954-4262-a0af-376c65b5a284",
      "VITE_PROJECT_ID": "1c85eeca-8ef0-4b2d-9146-c2fd095c5e22",
      "VITE_X_API_KEY": "P-K2djp9mU2RNYZth8GuwKYMB08lZYDSRH"
    }
  },
  "custom_message": ""
}