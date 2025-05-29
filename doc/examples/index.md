# Examples

These examples will provide your users with practical ways to implement the features of your SCSS toolkit, enhancing their understanding and ease of use.

## Accessing Colors

```scss
.element {
  background-color: #c6727d; // Using the 'Salmon' color
}
```

```scss
.element {
  background-color: $N0155; // Using the 'Salmon' color
}
```

```scss
.element {
  background-color: hue(N0155); // Using the 'Salmon' color
}
```

Using the `hue-color` function to apply a specific color from the hue.gl color map:

```scss
.element {
  background-color: hue-color(N1201); // Using the 'Green' color
}
```

## Dynamic Text Color for Readability

Applying dynamic text color for better readability based on the background color:

```scss
.element {
  background-color: hue-color(N2551); // Azure color
  color: dynamic-text-color(N2551); // Text color for best contrast
}
```

## Complementary Colors

Generating a complementary color for design harmony:

```scss
.element {
  background-color: hue-color(N3001); // Magenta color
  border-color: complementary-color(N3001); // Complementary color to Magenta
}
```

## Opacity Variants

Creating color variants with different opacities:

```scss
.element {
  background-color: hue-color-opacity(N1951, 0.5); // 50% opacity Teal color
}
```

## Color Shades and Tints

Applying shades and tints for hover states, disabled states, or gradients:

```scss
.element {
  background-color: hue-shade(N0751, 15%); // Darker Lime color
}
.hover-element:hover {
  background-color: hue-tint(N0751, 15%); // Lighter Lime color
}
```

## Accessible Text Color

Ensuring text color contrasts well with its background:

```scss
.element {
  @include accessible-text-color(N2701); // Accessible text color based on Indigo background
}
```

## Gradient Backgrounds

Creating a linear gradient background:

```scss
.element {
  @include gradient-bg(N2251, N2401); // Gradient from Sky to Blue
}
```

## Theming Components

Applying themes to components like buttons:

```scss
.button {
  @include button-theme(N3601, N0001); // Red background with Grey text
}
```

## Blending Colors

Blending two colors for a unique background:

```scss
.element {
  @include blend-colors(N0151, N3001, 50%); // Blend of Salmon and Magenta
}
```

## Utility Classes in HTML

Using generated utility classes for quick styling:

```html
<div class="text-N1201 bg-N3301"> // Green text on Rose background
  Sample Text
</div>
```

### Using CSS Variables

Applying CSS variables in your HTML:

```html
<div style="color: var(--color-N1201); background-color: var(--color-N3301);">
  Sample Text
</div>
```
