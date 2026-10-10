import { exec } from 'child_process'
import { createReadStream, existsSync } from 'fs'
import { join, normalize, sep } from 'path'
import { promisify } from 'util'
import { defineConfig } from 'vite'

const execAsync = promisify(exec)

// The demo page is styled with stylescape (a devDependency). Its compiled CSS
// is served from node_modules rather than copied into dist/, which is the
// published package.
const STYLESCAPE_CSS = join(process.cwd(), 'node_modules', 'stylescape', 'css')

function serveStylescape(req, res, next) {
    const file = normalize(join(STYLESCAPE_CSS, decodeURIComponent(req.url.split('?')[0])))
    if (!file.startsWith(STYLESCAPE_CSS + sep) || !file.endsWith('.css') || !existsSync(file))
        return next()
    res.setHeader('Content-Type', 'text/css; charset=utf-8')
    createReadStream(file).pipe(res)
}

let lastBuild = 0

async function runKist(server) {
    const now = Date.now()
    if (now - lastBuild < 500) return
    lastBuild = now

    console.log('[Kist] Running build...')
    try {
        const { stdout, stderr } = await execAsync('npx kist --config ./kist.yml')
        if (stdout) console.log('[Kist] stdout:', stdout)
        if (stderr) console.error('[Kist] stderr:', stderr)
        console.log('[Kist] Build complete')

        setTimeout(() => {
            server?.ws.send({
                type: 'full-reload',
                path: '*',
            })
        }, 200)
    } catch (err) {
        console.error('[Kist] Build failed:', err.stderr || err.message)
    }
}

export default defineConfig({
    root: '.',
    publicDir: false,
    server: {
        port: 3000,
        open: true,
        fs: { strict: false },
    },
    plugins: [
        {
            name: 'stylescape-vendor',
            apply: 'serve',
            configureServer(server) {
                server.middlewares.use('/vendor/stylescape', serveStylescape)
            },
        },
        {
            name: 'kist-watch',
            apply: 'serve',
            configureServer(server) {
                // Vitest also starts a Vite server; the build has no place in a test run.
                if (process.env.VITEST) return

                runKist(server)

                // Watch for file changes to trigger kist rebuild
                server.watcher.on('change', (file) => {
                    if (file.includes('/src/') || file.includes('kist.yml')) {
                        runKist(server)
                    }
                })
            },
        },
    ],
    test: {
        globals: true,
        environment: 'node',
        include: ['tst/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/ts/**/*.ts'],
            exclude: ['src/ts/constants/**/*.ts'],
        },
    },
})
