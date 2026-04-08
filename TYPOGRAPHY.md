# Typography Guidelines

This document serves as a reference for the typography guidelines and standards used across the Valle Studio application.

## Core Principles

1. **Use `rem` for Font Sizes:**
   - We consistently use `rem` (root em) units for font sizes. Unlike pixel (`px`) values which are fixed, `rem` units scale relative to the root font size set by the browser.

2. **Use `px` Only for Non-Text UI Elements:**
   - Fixed `px` dimensions are permitted for precise structural styling like borders, shadows, and icon sizing `size-6`.
   - Never use `px` for typography (e.g., avoid `text-[15px]`, use `text-[0.9375rem]`).

3. **Breakpoints for Responsiveness:**
   - Make typography layout adjustments sparingly across the standard Tailwind thresholds:
     - `sm`: ≥ 640px
     - `md`: ≥ 768px
     - `lg`: ≥ 1024px
     - `xl`: ≥ 1280px
   - Only adjust font sizes or structural UI elements where necessary (like bumping up headings or hero text). Try to keep layout simple rather than excessively resizing text inside each breakpoint.

4. **Implement Fluid Typography:**
   - Fluid typography automatically interpolates between a minimum and maximum text size proportional to the screen's viewport width.
   - Use `clamp()` for the largest hero elements to provide a naturally scaling presentation without managing endless utility breakpoints.

## Understanding Fluid Units

### What `vw` means

- `vw` stands for Viewport Width. `1vw` is equivalent to 1% of the total width of the user's viewport (browser window). If a screen is `1000px` wide, `1vw` is `10px`.

### What `clamp()` does

- `clamp(min, preferred, max)` takes three parameters. It allows fluid scaling but bounds it safely so it never gets too small or excessively large.
- Example: `font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);`
  - **Min:** The text will never drop below `2.5rem` (40px) on very small mobile phones.
  - **Preferred:** Between the minimum and maximum boundaries, it attempts to resolve `5vw + 1rem` dynamically. As the screen stretches from mobile to desktop sizes, the letters gracefully inflate.
  - **Max:** Once the screen becomes massive (like an ultrawide monitor), it gracefully halts scaling at a tight `4.5rem` (72px) ceiling to avoid overwhelming the view.
