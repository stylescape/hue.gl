# Changelog

## Unreleased

Bug sweep of 2026-10-07/08. Open follow-ups are in `TODO.md`.

### Breaking

- `ColorSwatch.srgb()` returns `[r, g, b]` like every other conversion method, instead of `{ coords }`.
- `color_contrast` and `hue_contrast_text_color` (SCSS) pick black or white by WCAG contrast instead of HSL lightness, so some colors flip (N2405 now gets black text).
- `Color.to()` throws for an unknown color space instead of returning sRGB with a console warning.
- The npm publish job publishes from the repository root instead of `dist/`, on Node 22.

### Fixed

- SCSS: every function except `hue_color` and `color_contrast` returned `null` through `@use 'hue.gl'` (`hue_color` was not in scope). `hue_apply_filter` and all mixins were not exported. Undefined helpers (`contrast-ratio`, `hue-contrast`, `sepia()`, `brightness()`) and the placeholder `hue_contrast_ratio`/`hue_to_grayscale` are implemented. No deprecated global built-ins remain.
- SCSS: `hue_color_scale` returned alternating light/dark colors; it now runs light to dark.
- `dist/css/hue.gl.css` was empty; it now has the 225 `--color-N####` custom properties and the `.text-`, `.bg-`, `.border-` utility classes (`src/scss/hue.gl.scss`).
- `src/scss/hue/_hue.gl-hcl-var.scss` contained rgb values; it now has HCL values.
- TS: `setHCL()` left `swatch.model` stale; `NaN`/`Infinity` passed validation; `p3()`, `oklab()`, `oklch()`, `rec2020()`, `a98rgb()`, `acescg()`, `prophoto()`, `ictcp()`, `jzazbz()`, `jzczhz()`, `rec2100pq()`, `rec2100hlg()` and `lab_d65()` returned sRGB/Lab data; `Color` exposed its cached array to callers.
- TS: `ColorPicker.get('HSL', …)` always returned `null`; `ColorPicker.get('HEX', 'constructor')` returned a function.
- TS: `ColorScheme` grouped unnamed hues under `"undefined"` and looped forever with `h_step: 0`.
- Type declarations were not built under TypeScript 6 (`tsup.config.ts`).
- `npm run lint` could not run (no ESLint flat config, no TypeScript parser) and hid it with `|| true`.
- `npm test` also ran the Kist build (`vite.config.js`).
- `package.json`: wrong `sass` path; Kist actions listed as runtime dependencies.
- Demo page (`index.html`): missing Grey row; export names in the wrong order; selected color never tracked; favorites bar threw on first favorite; contrast checker crashed on open and duplicated its options; accessibility ratios computed from lightness; documented a JS/SCSS API that does not exist.
- Docs: MkDocs could not build (`docs/` vs `doc/`, invalid `lang`, missing nav pages, uninstalled Mermaid plugin); palette page linked 225 nonexistent images; examples, quick start and standards used functions and paths that do not exist; `formats.md` listed about 40 formats as supported.
- Docs workflow: unquoted `mkdocstrings[python]>=0.18` was a shell redirect.

### Changed

- The demo page reads the palette configuration, hue names and lightness/chroma steps from the library (`/dist/js/index.mjs`) instead of a copy of the formula; colorjs.io is kept only for gamut mapping. Checked in headless Chrome on 2026-10-08: all 225 swatches match `hue_hex`, no errors.
- SCSS `rgb()` constants (`_hue.gl-rgb-var.scss`, `_hue.gl-rgb-map.scss`) are regenerated from the library's own sRGB conversion; 71 of 225 colors change in the last digit of a percentage (at most 0.043 points, about 0.1 on the 0-255 scale). Hex values are unchanged.
- `.prettierignore` skips the `src/hbs/` and `src/jinja/` templates, which Prettier cannot parse.
- `package-lock.json` is written by npm 10 (Node 22, as in CI), which drops the `libc` fields Dependabot's npm added; `npm ci --dry-run` accepts it.

### Added

- Format files in `dist/formats/`: LESS, Stylus, Python (`hue_gl.py`), LaTeX, JSON, Sketch palette, GIMP/Inkscape (`.gpl`) and Markdown, rendered from `src/jinja` by `src/js/generator.js` during `npm run build`.
- `ColorSwatch.to(space)`, the `ColorSpace`, `ColorKey`, `ColorSchemeConfig` types, and the converter functions exported from the package root.
- SCSS: `hue_luminance`, `hue_contrast`, `hue_utility_classes`, and `generate-css-variables` as a real mixin.
- `npm run typecheck`, `npm run generate`; lint and typecheck steps in the publish workflow.
- `npm run generate:constants` writes `src/scss/hue/*` and `src/ts/constants/hue_*.ts` from the `src/jinja` templates and the built library (with the `package.json` version in the header); the tests check that the committed files match the templates byte for byte.
- Tests for the converters, SCSS library and format templates (58 → 113).
