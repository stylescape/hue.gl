# hue.gl TODO

Completed items are moved to `CHANGELOG.md`. `[ ]` = not done, or not verified; the note on the line says which.

## Open items from the bug sweep (2026-10-07/08)

All changes from the sweep are uncommitted on `dev`; see `CHANGELOG.md` → Unreleased.

Needs a decision:

- [ ] Review `.github/workflows/publish_package.yml` before the next `v*` tag: it now publishes from the repository root (0.1.2 on npm was clearly packed from the root; the old `cd dist && npm publish` used a generated manifest with wrong paths), runs on Node 22 (vite 8 / vitest 4 need ≥ 20.19) and runs lint and typecheck. Not run in CI yet.
- [ ] Version for the release: the changes under Breaking in `CHANGELOG.md` suggest 0.2.0.
- [ ] License headers: the Stylus and LaTeX templates said Apache-2.0; they now say MIT like `LICENSE`, `package.json` and the Python template. Revert if Apache was intended.
- [ ] `dist/` is not ignored (`# dist/` is commented out in `.gitignore`), so build output shows as untracked. Ignore it, or say why it is left visible.
- [ ] Unused templates: `src/jinja/hue.gl.js.jinja`, `hue.gl.oco.jinja`, `hue.gl.code-snippets.jinja` and `_config.yml.jinja` are empty; `hue.gl.rcpx.jinja` has an open-color layout for a different color count; `hue.gl.css.jinja` uses `--N####` while the shipped CSS uses `--color-N####`; the HTML templates (`index`, `palette`, `api`, …) and all of `src/hbs/` (an unadapted open-color copy, `--oc-` names) are not rendered by anything. Fill them in and add them to `FORMATS` in `src/js/formats.js`, or delete them.

Needs doing:

- [ ] Release the dependency cleanup. The published 0.1.2 lists the build tools `@getkist/action-nunjucks` and `@getkist/action-sass` under `dependencies` (`dev` has only `tslib`). unit.gl now depends on `hue.gl` (its Sass loads `pkg:hue.gl`), so every unit.gl install pulls these in until the next hue.gl release ships. Found in the unit.gl sweep of 2026-10-08; see `unit.gl/TODO.md` → Upstream.
- [ ] `dist/formats/hue.gl.tex` has not been compiled: no TeX installation on the machine used. Check it with `pdflatex` and `\usepackage{xcolor}`.
- [ ] `src/scss/hue/_hue.gl-rgb-var.scss` and `_hue.gl-rgb-map.scss` differ from what the library computes in the last digit of some percentages (86.65% vs 86.66%): the original generator used a slightly different D50→D65 adaptation matrix. Hex values are identical. Regenerate them from the templates (`hue.gl-rgb-*.scss.jinja` need a `srgb()` helper in `src/js/formats.js`), or leave them.
- [ ] The generated constants (`src/scss/hue/*`, `src/ts/constants/*`) have no script that writes them; `test/formats.test.ts` only checks that the templates reproduce them. Add a `generate:constants` step if they should be regenerable.
- [ ] Formatting: a Prettier pass outside the sweep (2026-10-07 23:52, extended by 2026-10-08) reformatted configs, docs, the generated constants, `src/scss/maps` and `test/example`, but `npx prettier --check src test eslint.config.js` still fails on the sweep files (`src/js/*`, `src/scss/functions/*`, `eslint.config.js`, `test/scss.test.ts`, `test/formats.test.ts`, …) and cannot parse `src/hbs/hue.gl.rcpx.hbs`, `hue.gl.sketchpalette.hbs` and `hue.gl.svg.hbs` (add `src/hbs/` and `src/jinja/` to `.prettierignore`, or resolve the template item above first). Run `npm run format` once and commit it separately from the sweep.
- [ ] The docs deploy (`.github/workflows/deploy_docs.yml`, tag `docs`) has not run since the MkDocs fixes; `mkdocs build --strict` passes locally. `mkdocs<2` is pinned because Material for MkDocs does not support MkDocs 2.0; plan the migration.
- [ ] Planned formats in `doc/specifications/formats.md` (Go, Julia, CSV, SVG swatches, Adobe and other desktop palette formats, Tailwind preset).
