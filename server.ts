import path from 'node:path'

const PORT = Number(process.env.PORT ?? 3000)
const CLIENT_BASE = '/_build'
const CLIENT_DIR = path.resolve(process.cwd(), 'dist/client')
const SERVER_ENTRY = path.resolve(process.cwd(), 'dist/server/server.js')

type ServerModule = {
  fetch: (request: Request) => Promise<Response> | Response
  default?: {
    fetch: (request: Request) => Promise<Response> | Response
  }
}

const serverEntry = import(SERVER_ENTRY) as Promise<ServerModule>

const serveStaticFromBuild = async (url: URL) => {
  const assetPath = url.pathname.slice(CLIENT_BASE.length) || '/index.html'
  const diskPath = path.join(CLIENT_DIR, assetPath)
  const file = Bun.file(diskPath)
  if (await file.exists()) {
    return new Response(file)
  }
  return null
}

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname.startsWith(CLIENT_BASE)) {
      const assetResponse = await serveStaticFromBuild(url)
      if (assetResponse) {
        return assetResponse
      }
    }

    const entry = await serverEntry
    const handler = entry.default?.fetch ?? entry.fetch

    return handler(request)
  },
})

console.log(`🚗  NEV Efficiency Check running at http://localhost:${server.port}`)
