import { defineConfig } from 'tsup';

export default defineConfig([
    // Main library build (ESM + CJS)
    {
        entry: { 'index': 'src/ts/index.ts' },
        format: ['esm', 'cjs'],
        // tsup injects `baseUrl` into the declaration build, which TypeScript 6
        // reports as deprecated and turns into a hard error.
        dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
        outDir: 'dist/js',
        outExtension({ format }) {
            return {
                js: format === 'esm' ? '.mjs' : '.cjs',
            };
        },
        target: 'es2020',
        splitting: false,
        sourcemap: true,
        clean: false,
        minify: false,
    },
]);
