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
@each $name, $color in hue.$hue-colors {
    .bg-#{$name} {
        background-color: $color;
    }
}
```

### TypeScript / JavaScript

Import colors and utilities for programmatic access:

```typescript
import { ColorSwatch, ColorScheme, hueConfig, hueNames } from 'hue.gl'

// Create a custom color swatch
const customBlue = new ColorSwatch(240, 50, 50, 'CustomBlue')
console.log(customBlue.hex()) // '#4169E1'
console.log(customBlue.rgb()) // { r: 65, g: 105, b: 225 }
console.log(customBlue.hcl()) // { h: 240, c: 50, l: 50 }

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

```css
.card {
    background-color: var(--n-0001);
    border-color: var(--n-2405);
}
```

### Python

```python
from hue_gl import HueGL, colors

# Create a palette instance
palette = HueGL()

# Access colors by hue and shade
blue5 = palette.get_color('Blue', 5)
print(blue5.hex)    # Hex value
print(blue5.rgb)    # RGB tuple (r, g, b)

# Access via dictionary
grey = colors['Grey']['N0001']
print(grey.css_rgb)  # 'rgb(250, 250, 250)'
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

| Format           | File                   | Use Case                 |
| ---------------- | ---------------------- | ------------------------ |
| SCSS Variables   | `hue.gl.scss`          | Sass/SCSS projects       |
| SCSS Maps        | `hue.gl-map.scss`      | Dynamic color access     |
| CSS Variables    | `hue.gl.css`           | Modern CSS theming       |
| TypeScript Enums | `hue.gl.ts`            | Type-safe JS/TS apps     |
| Python           | `hue_gl.py`            | Python applications      |
| JSON             | `hue.json`             | Data interchange         |
| Sketch Palette   | `hue.gl.sketchpalette` | Sketch design tool       |
| Inkscape         | `hue.gl.inkscape`      | Inkscape vector graphics |

## Next Steps

- [Color Palette Reference](palette.md) - View all 225 colors
- [Specifications](specifications/formats.md) - Detailed format documentation
- [Examples](examples/index.md) - Real-world usage examples
