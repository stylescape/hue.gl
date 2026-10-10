# Supported Formats and Environments

Every format is generated from the same palette definition, so all of them
carry identical colors. Paths are relative to the installed package
(`node_modules/hue.gl/`).

## Available

| Category                  | File                                     | Description                                                 |
| :------------------------ | :--------------------------------------- | :---------------------------------------------------------- |
| **Style Sheet Languages** | `dist/css/hue.gl.css`                    | CSS custom properties (`--color-N####`) and utility classes |
|                           | `src/scss/index.scss` (`@use 'hue.gl'`)  | Sass variables, maps, functions and mixins                  |
|                           | `dist/formats/hue.gl.less`               | LESS variables (`@N####`)                                   |
|                           | `dist/formats/hue.gl.styl`               | Stylus variables                                            |
| **Programming Languages** | `dist/js/index.mjs`, `dist/js/index.cjs` | JavaScript library (ESM and CommonJS)                       |
|                           | `dist/js/index.d.ts`                     | TypeScript declarations                                     |
|                           | `dist/formats/hue_gl.py`                 | Python module (`HueGL`, `colors`)                           |
|                           | `dist/formats/hue.gl.tex`                | LaTeX `xcolor` definitions                                  |
| **Data Interchange**      | `dist/formats/hue.gl.json`               | JSON grouped by hue, with hex, RGB and HCL                  |
|                           | `src/hue.json`                           | Flat JSON map of name to hex                                |
|                           | `dist/formats/hue.gl.md`                 | Markdown palette table                                      |
| **Desktop Applications**  | `dist/formats/hue.gl.sketchpalette`      | Sketch Palettes plugin                                      |
|                           | `dist/formats/hue.gl.gpl`                | GIMP and Inkscape palette                                   |
|                           | `src/gh/hue_gl_to_gh.gh`                 | Rhino Grasshopper definition                                |

## Planned

Not generated yet: Go (`.go`), Julia (`.jl`), CSV (`.csv`), SVG swatches
(`.svg`), Open Color Tools (`.oco`), PANTONE (`.ptc`), Adobe formats (`.ase`,
`.aco`, `.acb`, `.acbl`, `.grd`, `.clr`, `.inx`), GIMP gradients (`.ggr`),
PowerPaint (`.rcpx`), AutoCAD (`.ctb`), Apple Color Picker (`.colorpicker`),
BlackMagic (`.bcp`), ImageMagick (`.mgk`), ColorSchemer (`.cs`), SketchUp
(`.style`), OmniGraffle (`.gdiagramstyle`), Painter (`.pal`) and a Tailwind
preset.
