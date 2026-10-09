# hue.gl TODO

Completed items are moved to `CHANGELOG.md`. `[ ]` = not done, or not verified; the note on the line says which.

## Open items from the bug sweep (2026-10-07/08)

All changes from the sweep are uncommitted on `dev`; see `CHANGELOG.md` → Unreleased.

Needs a decision:

- [ ] Review `.github/workflows/publish_package.yml` before the next `v*` tag: it now publishes from the repository root (0.1.2 on npm was clearly packed from the root; the old `cd dist && npm publish` used a generated manifest with wrong paths), runs on Node 22 (vite 8 / vitest 4 need ≥ 20.19) and runs lint and typecheck. Not run in CI yet.
- [ ] Version for the release: the changes under Breaking in `CHANGELOG.md` suggest 0.2.0.
- [ ] License headers: the Stylus and LaTeX templates said Apache-2.0; they now say MIT like `LICENSE`, `package.json` and the Python template. Revert if Apache was intended.
- [ ] `dist/` is not ignored (`# dist/` is commented out in `.gitignore`), so build output shows as untracked. Ignore it, or say why it is left visible.
- [ ] Unused templates (checked 2026-10-09): `npm run build:formats` renders the 7 templates in `FORMATS` and `npm run generate:constants` the 9 in `CONSTANTS` (`src/js/formats.js`); nothing renders the other 18. Empty: `_config.yml.jinja`, `hue.gl.js.jinja`, `hue.gl.oco.jinja`, `hue.gl.code-snippets.jinja`. Stubs or mismatches: `hue.gl.d.ts.jinja` (header only), `hue.gl.svg.jinja` and `square.svg.jinja` (one swatch, identical), `hue.gl_rgb.scss.jinja` (a debug dump of `a98rgb()[0]`), `hue.gl.rcpx.jinja` (open-color layout for a different color count), `hue.gl.css.jinja` (`--N####` while the shipped CSS uses `--color-N####`). The HTML templates (`base`, `index`, `palette`, `api`, `formats`, `getting-started`, `color-theory`, `accessibility`) and all of `src/hbs/` (an unadapted open-color copy, `--oc-` names) are not rendered either. Fill them in and add them to `FORMATS`, or delete them.

Needs doing:

- [ ] Release the dependency cleanup. The published 0.1.2 lists the build tools `@getkist/action-nunjucks` and `@getkist/action-sass` under `dependencies` (`dev` has only `tslib`). unit.gl now depends on `hue.gl` (its Sass loads `pkg:hue.gl`), so every unit.gl install pulls these in until the next hue.gl release ships. Found in the unit.gl sweep of 2026-10-08; see `unit.gl/TODO.md` → Upstream.
- [ ] `dist/formats/hue.gl.tex` has not been compiled: no TeX installation on the machine used. Check it with `pdflatex` and `\usepackage{xcolor}`.
- [ ] Formatting: a Prettier pass outside the sweep (2026-10-07 23:52, extended by 2026-10-08) reformatted configs, docs, the generated constants, `src/scss/maps` and `test/example`, but `npx prettier --check src test eslint.config.js` still fails on the sweep files (`src/js/*`, `src/scss/functions/*`, `eslint.config.js`, `test/scss.test.ts`, `test/formats.test.ts`, …). Run `npm run format` once and commit it separately from the sweep.
- [ ] The docs deploy (`.github/workflows/deploy_docs.yml`, tag `docs`) has not run since the MkDocs fixes; `mkdocs build --strict` passes locally. `mkdocs<2` is pinned because Material for MkDocs does not support MkDocs 2.0; plan the migration.
- [ ] Planned formats in `doc/specifications/formats.md` (Go, Julia, CSV, SVG swatches, Adobe and other desktop palette formats, Tailwind preset).
