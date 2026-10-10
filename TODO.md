# hue.gl TODO

Completed items are moved to `CHANGELOG.md`. `[ ]` = not done, or not verified; the note on the line says which.

## Open items from the bug sweep (2026-10-07/08)

See `CHANGELOG.md` → 0.2.0, including its Decisions section. The 0.2.0 release, the separate Prettier commit and the Go and Julia formats were done on 2026-10-10 and moved there.

Needs doing:

- [ ] Publish 0.2.0 to npm. **2026-10-10:** tag `v0.2.0` pushed; the Publish Package run (38044663007) built, tested and created the GitHub release, but `npm publish` failed with `E404 Not Found - PUT https://registry.npmjs.org/hue.gl`, i.e. the `PUBLISH_NPM_TOKEN` org secret (from 2024-09) is not accepted. The v0.1.2 run failed the same way; 0.1.2 was published by hand. Fix either by renewing the secret and running `gh run rerun 38044663007 -R stylescape/hue.gl --failed`, or by configuring npm trusted publishing for hue.gl (as unit.gl and stylescape use: `permissions: id-token: write`, Node 24, no token) and tagging again. unit.gl stays on `hue.gl ^0.1.2` until then.
- [ ] `dist/formats/hue.gl.tex` has not been compiled: no TeX installation on the machine used. Check it with `pdflatex` and `\usepackage{xcolor}`. **2026-10-10:** still open, `pdflatex` is not installed here.
- [ ] The docs deploy (`.github/workflows/deploy_docs.yml`, tag `docs`) has not run since the MkDocs fixes; `mkdocs build --strict` passes locally (re-checked 2026-10-10). `mkdocs<2` is pinned because Material for MkDocs does not support MkDocs 2.0; plan the migration. **2026-10-10:** not triggered; pushing the `docs` tag was not part of the 0.2.0 release.
- [ ] Fleet follow-ups outside this repo from the 2026-10-10 decisions: `icon.gl/README.md` still says code is Apache 2.0; boot.gl, icon.gl, move.gl and font.gl still track `dist/`. **2026-10-10:** `unit.gl/README.md` fixed; the others are outside the stylescape/unit.gl/hue.gl release scope.
- [ ] Planned formats in `doc/specifications/formats.md`. Done 2026-10-10: CSV, SVG swatch sheet, Tailwind preset, Go and Julia. Left: Adobe (`.ase`, `.aco`, ...) and the other desktop palette formats. **2026-10-10:** left open; they are binary or app-specific and need the target applications to verify.
