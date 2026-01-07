export function virtualFsPlugin(fs) {
  return {
    name: "virtual-fs",
    setup(build) {

      // 1️⃣ ENTRY POINT — разрешаем явно
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === "entry-point") {
          return {
            path: normalizePath(args.path),
            namespace: "virtual",
          }
        }

        // 2️⃣ ОТНОСИТЕЛЬНЫЕ ИМПОРТЫ ./ ../
        if (args.path.startsWith(".")) {
          const baseDir = args.importer.substring(
            0,
            args.importer.lastIndexOf("/")
          )

          const resolved = normalizePath(`${baseDir}/${args.path}`)

          return {
            path: resolved,
            namespace: "virtual",
          }
        }

        // 3️⃣ АБСОЛЮТНЫЕ ПУТИ /src/...
        if (args.path.startsWith("/")) {
          return {
            path: normalizePath(args.path),
            namespace: "virtual",
          }
        }

        if (args.path === "react") {
          return { path: "/shims/react.js", namespace: "virtual" };
        }

        if (args.path === "react-dom") {
          return { path: "/shims/react-dom.js", namespace: "virtual" };
        }

        if (args.path === "react-dom/client") {
          return { path: "/shims/react-dom-client.js", namespace: "virtual" };
        }

        if (args.path === "axios") {
          return { path: "/shims/axios.js", namespace: "virtual" };
        }                

        // 4️⃣ 🚨 BARE IMPORTS (react, react-dom, etc)
        // НЕ трогаем — пусть esbuild сам обработает + external
        return null
      })

      // 5️⃣ LOAD ТОЛЬКО virtual namespace
      build.onLoad({ filter: /.*/, namespace: "virtual" }, (args) => {
        const possiblePaths = [
          args.path,
          `${args.path}.js`,
          `${args.path}.jsx`,
          `${args.path}.ts`,
          `${args.path}.tsx`,
        ]

        for (const path of possiblePaths) {
          if (fs[path] != null) {
            return {
              contents: fs[path],
              loader: getLoader(path),
            }
          }
        }

        return {
          errors: [{ text: `File not found: ${args.path}` }],
        }
      })
    },
  }
}

function normalizePath(path) {
  const parts = path.split("/")
  const stack = []

  for (const part of parts) {
    if (part === "." || part === "") continue
    if (part === "..") stack.pop()
    else stack.push(part)
  }

  return "/" + stack.join("/")
}

function getLoader(path) {
  if (path.endsWith(".tsx")) return "tsx"
  if (path.endsWith(".ts")) return "ts"
  if (path.endsWith(".jsx")) return "jsx"
  return "js"
}
