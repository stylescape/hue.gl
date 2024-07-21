# Reference Standards

`hue.gl` includes a variety of additional color standards for reference purposes. Below is a list of these standards along with their corresponding SCSS map files:

| Standard               | SCSS Map File                           | Description |
| :--------------------- | :-------------------------------------- | :---------- |
| **AS2700**             | `_as2700_hex_map.scss`                  | Australian Standard for Colors |
| **BS381**              | `_bs381_hex_map.scss`                   | British Standard 381C for Colours for Specific Purposes |
| **Copic**              | `_copic_hex_map.scss`                   | Copic marker color system |
| **Flat Design**        | `_flat_design_hex_map.scss`             | Popular color palette for flat UI design |
| **FS595**              | `_fs595_hex_map.scss`                   | Federal Standard 595 color system used by the US government |
| **Material Design**    | `_material_design_hex_map.scss`         | Google's Material Design color palette |
| **NBS**                | `_nbs_hex_map.scss`                     | National Bureau of Standards color names |
| **NCS**                | `_ncs_hex_map.scss`                     | Natural Color System, a perceptual color model |
| **RAL**                | `_ral_hex_map.scss`                     | RAL classic color system used in Europe |
| **Tailwind**           | `_tailwind_hex_map.scss`                | Tailwind CSS framework's color palette |
| **X11**                | `_x11_hex_map.scss`                     | X11 color names used in web colors |

## Sample Usage

Here's an example of how to use a color from the RAL standard in your SCSS:

``` scss
@import 'path/to/hue.gl/scss/standards/_ral_hex_map.scss';

.my-element {
  background-color: map-get($ral, RAL 5002); // Ultramarine Blue
}

```
