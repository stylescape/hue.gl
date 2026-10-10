import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: ['dist/', 'coverage/', 'node_modules/', '**/*.min.js', 'tst/example/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        // Node build scripts
        files: ['src/js/**/*.js'],
        languageOptions: {
            globals: { process: 'readonly', console: 'readonly' },
        },
    },
    {
        rules: {
            'no-var': 'warn',
            'no-nested-ternary': 'warn',
            'no-console': 'warn',
            'no-template-curly-in-string': 'warn',
            'no-self-compare': 'warn',
            'arrow-body-style': 'warn',
        },
    },
)
