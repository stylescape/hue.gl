# Quick Start

Get started with hue.gl, the perceptual color system designed for consistent visual experiences.

## Installation

### npm

```bash
npm install hue.gl
```

### yarn

```bash
yarn add hue.gl
```

### pnpm

```bash
pnpm add hue.gl
```

## Usage

### SCSS / Sass

Import the SCSS module to access color variables, maps, and mixins:

```scss
@use 'hue.gl' as hue;

// Use color variables
.button {
    background-color: hue.$N2405; // Blue shade 5
    color: hue.$N0001; // Light grey
}

// Use the color map
@each $name, $color in hue.$hue {
    .bg-#{$name} {
        background-color: $color;
    }
}

// Pick readable text for any palette color (WCAG contrast)
.badge {
    background-color: hue.hue_color(N2409);
    color: hue.hue_contrast_text_color(N2409);
}

// Emit all colors as custom properties, or the utility classes
:root {
    @include hue.generate-css-variables;
}
@include hue.hue_utility_classes;
```

### TypeScript / JavaScript

Import colors and utilities for programmatic access:

```typescript
import { ColorPicker, ColorSwatch, ColorScheme, hueConfig, hueNames } from 'hue.gl'

// Create a custom color swatch
const customBlue = new ColorSwatch(240, 50, 50, 'CustomBlue')
console.log(customBlue.hex()) // '#0085C0'
console.log(customBlue.rgb()) // { r: 0, g: 133, b: 192 }
console.log(customBlue.hcl()) // { h: 240, c: 50, l: 50 }
console.log(customBlue.oklch()) // [L, C, H] in OKLCH
console.log(customBlue.p3()) // Display P3 coordinates (0-1)

// Look up a published value
ColorPicker.get('HSL', 'N2405') // 'hsl(198.6, 56.3%, 48.4%)'

// Generate a full color scheme
const scheme = new ColorScheme(hueConfig, hueNames)
const colors = scheme.getColorList()
console.log(`Generated ${colors.length} colors`)

// Access colors by group
const blueGroup = scheme.getColorDict()['Blue']
Object.entries(blueGroup).forEach(([name, color]) => {
    console.log(`${name}: ${color.hex()}`)
})
```

### CSS Custom Properties

Use the generated CSS file for easy theming:

```html
<link rel="stylesheet" href="node_modules/hue.gl/dist/css/hue.gl.css" />
```

The stylesheet defines every color as a `--color-N####` custom property and
ships `.text-N####`, `.bg-N####` and `.border-N####` utility classes.

```css
.card {
    background-color: var(--color-N0001);
    border-color: var(--color-N2405);
}
```

### Python

Copy `dist/formats/hue_gl.py` from the npm package into your project. It has no
dependencies.

```python
from hue_gl import HueGL, colors

# Create a palette instance
palette = HueGL()

# Access colors by hue and shade
blue5 = palette.get_color('Blue', 5)
print(blue5.hex)    # '#3696c1'
print(blue5.rgb)    # RGB tuple (r, g, b)

# Access via dictionary
grey = colors['Grey']['N0001']
print(grey.css_rgb)  # 'rgb(226, 226, 226)'
```

## Color System Overview

hue.gl provides:

- **25 Hue Groups**: Grey, Salmon, Orange, Amber, Yellow, Lime, Ecru, Olive, Green, Forest, Jade, Mint, Cyan, Teal, Capri, Sky, Blue, Azure, Indigo, Violet, Magenta, Purple, Rose, Pink, Red
- **9 Shades per Hue**: From light (1) to dark (9)
- **225 Total Colors**: Perceptually uniform using the LCH color space

### Naming Convention

Colors follow the pattern `N{HUE}{SHADE}`:

- `N0001` - Grey, shade 1 (lightest)
- `N2405` - Blue (hue 240°), shade 5 (middle)
- `N3609` - Red (hue 360°), shade 9 (darkest)

## Available Formats

hue.gl exports colors in multiple formats:

| Format           | File                                  | Use Case                 |
| ---------------- | ------------------------------------- | ------------------------ |
| SCSS             | `@use 'hue.gl'`                       | Sass/SCSS projects       |
| CSS Variables    | `dist/css/hue.gl.css`                 | Modern CSS theming       |
| JS / TypeScript  | `dist/js/index.mjs` + `index.d.ts`    | Type-safe JS/TS apps     |
| LESS / Stylus    | `dist/formats/hue.gl.less`, `.styl`   | LESS and Stylus projects |
| Python           | `dist/formats/hue_gl.py`              | Python applications      |
| JSON             | `dist/formats/hue.gl.json`            | Data interchange         |
| LaTeX            | `dist/formats/hue.gl.tex`             | Documents (`xcolor`)     |
| Sketch Palette   | `dist/formats/hue.gl.sketchpalette`   | Sketch design tool       |
| GIMP / Inkscape  | `dist/formats/hue.gl.gpl`             | GIMP and Inkscape        |

See [Formats](specifications/formats.md) for the full list.

## Next Steps

- [Color Palette Reference](palette.md) - View all 225 colors
- [Specifications](specifications/formats.md) - Detailed format documentation
- [Examples](examples/index.md) - Real-world usage examples
