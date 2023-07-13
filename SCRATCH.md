<header>
<p align="center">
    <img src=".github/images/logo_niji.png" width="20%" height="20%" alt="Niji Logo">
</p>
<h1 align='center' style='border-bottom: none;'>Niji</h1>
<h3 align='center'>Natural Colour Spectrum</h3>
</header>


<br/>
<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
- [Quick Start](#quick-start)
- [Usage](#usage)

</details>



NIJI is an [open-source](https://en.wikipedia.org/wiki/Open-source_software) color scheme optimized for UI like font, background, border, etc.


## About




NIJI is ...
- a color sysrem
- based on HCL ...
- Compatible with RGB web color space
- Compatible with CMYK print color space

- CSS Colors Module 4
- implementable as SCSS functions


A little recent history: the CSS Color Module Level 4 specification become a candidate recommendation on July 5, 2022.
https://www.w3.org/TR/css-color-4/

Specification
- 36 Hues
- 9 Chromas per Hue
- 324 Colors in total per scheme
- 2 schemes



Schemes
- Dark Scheme
- Light Scheme





## Hues

We use 




https://github.com/vinaypillai/ac-colors
https://colorjs.io/

https://www.w3.org/TR/css-color-4/#color-conversion-code

The okay versions of lab and lch come with additional improvements. You can learn more about it Chris Lilley's presentation “Better than Lab? Gamut reduction CIE Lab & OKLab”.
https://www.youtube.com/watch?v=dOsp6u4bIwI

https://bottosson.github.io/posts/oklab/

https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab


https://www.learnui.design/blog/the-hsb-color-system-practicioners-primer.html



https://observablehq.com/@d3/working-with-color
### LCH lch
LCH is the polar form of Lab. Instead of juggling a and b, you specify a Hue angle (starting from the positive a axis) and a Chroma, or colorfulness, which is zero for neutral greys and increases as a color becomes more intensely colorful.



The benefits of OKLCH:

Unlike rgb() or hex (#ca0000), OKLCH is human readable. You can easily understand what color an OKLCH value represents simply by looking at the numbers. It works like HSL, but OKLCH encodes lightness better than HSL.
Unlike hsl(), OKLCH is better for color modifications. It uses perceptual lightness. No more unexpected results, like we had with darken() in Sass.
Further, with its predictable lightness, OKLCH has better a11y. Especially for palette generation in design systems.
OKLCH can be used for wide-gamut P3 colors. For instance, new devices (like those from Apple) can display more colors than old sRGB monitors, and we can use OKLCH to specify these new colors.

But, that being said, alongside OKLCH comes two challenges:

With OKLCH and LCH, not all combinations of L, C, and H will result in colors that are supported by every monitor. Although browsers will try to find the closest supported color, it’s still safer to check colors using our color picker.
OKLCH is a new color space. At least for now, at the time of this writing in 2022, its ecosystem is still limited. But we already have oklch() polyfill, palette generator, color picker, and many converters.

### Scape Style

NIJI is a staging development for Scape Style.

<p align="center">
    <a href="https://github.com/scape-agency/kyu">
        <img src=".github/images/logo_kyu.png" width="10%" height="10%" alt="Kyū Logo">
    </a>
    <a href="https://github.com/scape-agency/yoki">
        <img src=".github/images/logo_yoki.png" width="10%" height="10%" alt="Yōki Logo">
    </a>
    <a href="https://github.com/scape-agency/kaida">
        <img src=".github/images/logo_kaida.png" width="10%" height="10%" alt="Kaidā Logo">
    </a>
    <a href="https://github.com/scape-agency/niji">
        <img src=".github/images/logo_niji.png" width="10%" height="10%" alt="Niji Logo">
    </a>
    <a href="https://github.com/scape-agency/suru">
        <img src=".github/images/logo_suru.png" width="10%" height="10%" alt="Suru Logo">
    </a>
    <a href="https://github.com/scape-agency/shodo">
        <img src=".github/images/logo_shodo.png" width="10%" height="10%" alt="Shodō Logo">
    </a>
</p>


## Quick Start



## Usage

## Available Colors

![available colors](https://yeun.github.io/open-color/asset/images/open-color.svg)


### Supported Formats, Language Environments, Libraries

|                   |                           |
| ----------------- | ------------------------- |
| `.css`            | CSS                       |
| `.scss`           | Sass                      |
| `.less`           | Less                      |
| `.stylus`         | Stylus                    |
| `.svg`            | SVG                       |
| `.tex`            | LaTex                     |
|                   | Tailwind                  |


#### Language Environments

| ----------------- | ------------------------- |
| `.go`             | Go                        |
| `.jl`             | Julia                     |
| `.py`             | Python                    |
| `.d.ts`           | TypeScript                |
| `.js`             | JavaScript                |


#### Data-interchange Formats

| ----------------- | ------------------------- |
| `.csv`            |                           |
| `.json`           | JSON                      |


#### Desktop Applications

| ----------------- | ------------------------- |
| `.oco`            | Open Color Tools          |
| `.ase`            | Adobe Swatch Exchange     |
| `.aco`            | Adobe Photoshop           |
| `.clr`            | Adobe Animate Color Set   |
| `.sketchpalette`  | Sketch                    |
| `.gpl`            | GIMP Palette, Inkscape    |
| `.rcpx`           | PowerPaint                |





## Links

#### Colours


#### Colour Spaces

##### HCL

- https://en.wikipedia.org/wiki/HCL_color_space


#### Colour Standards


##### RAL 
- https://www.w3schools.com/colors/colors_ral.asp
- https://codepen.io/dennissnov/pen/OEQPJy

##### Copic
- https://github.com/tnsicdr/copic-sass-colors/blob/master/_copic.scss
- https://www.extremraym.com/en/copic-color-experiments/


#### Packages

- https://colorjs.io/get/








https://en.wikipedia.org/wiki/CIELAB_color_space
https://en.wikipedia.org/wiki/CIELUV
https://en.wikipedia.org/wiki/YUV

asdasdasdg

https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems
https://accessiblepalette.com/?lightness=98,90,80,70,60,50,40,30,20,10&1aa997=0,0&e59459=1,0&f9d87a=1,0&89BF1D=1,0&57c27a=1,0&399b8b=1,0&028c98=1,0&0089b0=1,0&009eff=1,0&3a3893=1,0&8a0084=1,0&ff7eaf=1,0&c24f79=1,0&f90c85=1,0&808080=0,0&EAE8DE=0,0&768092=0,0

https://gka.github.io/chroma.js/


https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/
https://css.land/lch/

https://www.w3.org/TR/css-color-4/

https://www.w3.org/TR/WCAG21/#contrast-minimum

https://hypejunction.github.io/color-wizard/


https://www.boronine.com/2012/03/26/Color-Spaces-for-Human-Beings/
https://bootcamp.uxdesign.cc/perception-based-color-palettes-for-customizable-ui-themes-33f596faf23d
https://www.hsluv.org/
https://github.com/boronine/colorspaces.js


https://imfeld.dev/writing/transferring_color_palettes


http://colormine.org/convert/rgb-to-lch



https://gist.github.com/Myndex/47c793f8a054041bd2b52caa7ad5271c



REF
https://github.com/yeun/open-color



# Open color

Open color is an [open-source](https://en.wikipedia.org/wiki/Open-source_software) color scheme optimized for UI like font, background, border, etc.

## Goals

- All colors shall have adequate use
- Provide general color for UI design
- All colors will be beautiful in itself and harmonious
- At the same brightness level, the perceived brightness will be constant

**Note**

* The colors are subject to change in the future. Thus, using an Open color as a main identity color is not recommended.

## Available Colors

![available colors](https://yeun.github.io/open-color/asset/images/open-color.svg)

## Installation

```
$ npm install open-color
```
or
```
$ bower install open-color
```



## Variable Convention

### Sass, SCSS

```sass
$oc-(color)-(number)
```

### Less

```less
@oc-(color)-(number)
```

### Stylus

```styl
oc-(color)-(number)
```
### CSS

```css
--oc-(color)-(number)
```

---

- `oc`:  Abbreviation for Open color
- `(color)`: Color name such as gray, red, lime, etc.
- `(number)`: 0 to 9. Brightness spectrum.

## How to Use

Import the file to your project and use the variables.

**Example for Sass, SCSS**

```sass
@import 'path/open-color';

.body {
  background-color: $oc-gray-0;
  color: $oc-gray-7;
}

a {
  color: $oc-teal-7;

  &:hover,
  &:focus,
  &:active {
    color: $oc-indigo-7;
  }
}
```

**Example for Tailwind CSS**

```js
module.exports = {
  presets: [require("./open-color.js")],
  purge: [],
  mode: "jit",
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

```

**Example for Less**

```less
@import 'path/open-color';

.body {
  background-color: @oc-gray-0;
  color: @oc-gray-7;
}

a {
  color: @oc-teal-7;

  &:hover,
  &:focus,
  &:active {
    color: @oc-indigo-7;
  }
}
```

**Example for Stylus**

```styl
@import 'path/open-color.styl'

.body
  background-color: oc-gray-0
  color: oc-gray-7

a
  color: oc-teal-7

  &:hover
  &:focus
  &:active
    color: oc-indigo-7
```

**Example for CSS**

```css
@import 'path/open-color.css';

.body {
  background-color: var(--oc-gray-0);
  color: var(--oc-gray-7);
}

a {
  color: var(--oc-teal-7);
}

a:hover,
a:focus,
a:active {
  color: var(--oc-indigo-7);
}
```

## Other Language Bindings

- Julia : [OpenColor.jl](https://github.com/appleparan/OpenColor.jl)
- Go : [opencolor](https://pkg.go.dev/github.com/jsynacek/go-open-color/opencolor)
