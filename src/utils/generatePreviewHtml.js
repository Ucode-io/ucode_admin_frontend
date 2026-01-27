import { INSPECTOR_SCRIPT } from "./constants/preview-scripts";


export function generatePreviewHtml(bundledCode, dependenciesMap = {}) {

  const REACT_VERSION = "18.0.0";

  const depsParam = `?deps=react@${REACT_VERSION},react-dom@${REACT_VERSION}`;
  
  const imports = {
    "react": `https://esm.sh/react@${REACT_VERSION}`,
    "react-dom": `https://esm.sh/react-dom@${REACT_VERSION}`,
    "react-dom/client": `https://esm.sh/react-dom@${REACT_VERSION}/client`,
    "react-dom/server": `https://esm.sh/react-dom@${REACT_VERSION}/server`,

    "react-router-dom": `https://esm.sh/react-router-dom@6.3.0${depsParam}`,
    
    "lucide-react": `https://esm.sh/lucide-react@0.294.0${depsParam}`,
    
    "axios": "https://esm.sh/axios@1.6.0",
    "clsx": "https://esm.sh/clsx",
    "tailwind-merge": "https://esm.sh/tailwind-merge",
  };

  Object.entries(dependenciesMap).forEach(([name, versionSpec]) => {
    if (imports[name]) return;
    if (name === "react" || name === "react-dom") return;

    const version = versionSpec || "latest";

    imports[name] = `https://esm.sh/${name}@${version}${depsParam}`;
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      
      <script>
        window.process = { env: { NODE_ENV: 'production' } };
      </script>

      <script type="importmap">
        ${JSON.stringify({ imports }, null, 2)}
      </script>

      <style>
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        
        /* Исправление для Leaflet в Dark Mode (если будет использоваться) */
        html.dark .leaflet-layer,
        html.dark .leaflet-control { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
        
        /* Notion Dark Mode Colors */
        html.dark body { background-color: #191919; color: #D4D4D4; }
      </style>
      
      <!-- Глобальный CSS для Leaflet (на всякий случай) -->
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    </head>
    <body>
      <div id="root"></div>

      <script>
        window.addEventListener('error', (e) => {
            if (e.message && e.message.includes('ResizeObserver')) return;
            console.error("Preview Error:", e);
        });
      </script>

      <script type="module">
        ${bundledCode}
      </script>

      <script>
        ${INSPECTOR_SCRIPT}
      </script>
    </body>
    </html>
  `;
}