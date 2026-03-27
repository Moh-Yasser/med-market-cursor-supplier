# Design System Documentation: B2B Medical Marketplace

## 1. Overview & Creative North Star: "The Clinical Curator"

This design system moves away from the sterile, rigid grids of traditional medical software. Our Creative North Star is **"The Clinical Curator"**—a philosophy that balances the precision of a laboratory with the high-end editorial feel of a premium consultancy. 

We break the "SaaS template" look through **intentional asymmetry** and **tonal depth**. Instead of boxing data into small cells, we treat information as curated content. By utilizing generous white space (the "Medical White") and sophisticated layering, we create an environment that feels authoritative yet effortless. The interface doesn't just display data; it organizes it with a signature, professional grace.

---

## 2. Colors & Surface Architecture

The palette is rooted in deep, authoritative blues (`primary`) and clean, sterile neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Layout boundaries must be established through background color shifts. For example, a `surface-container-low` sidebar sitting against a `surface` main content area creates a natural, sophisticated break without the "clutter" of lines.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted glass or fine stationery.
- **Base Layer:** `surface` (#f7f9fb)
- **Secondary Layout Elements:** `surface-container-low` (#f2f4f6)
- **Primary Content Cards:** `surface-container-lowest` (#ffffff)
- **Nesting Logic:** To highlight a specific data point within a card, use `surface-container-high` (#e6e8ea) to create a subtle "inset" feel.

### Glass & Gradient Rule
For floating navigation or high-level modals, use **Glassmorphism**. Apply `surface` at 80% opacity with a `20px` backdrop-blur. 
- **Signature Texture:** Primary CTAs should not be flat. Use a subtle linear gradient from `primary` (#003178) to `primary_container` (#0d47a1) at a 135° angle to give the button a "jewel-like" depth.

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to distinguish between **Data** and **Direction**.

*   **Display & Headlines (Manrope):** Used for high-level page titles and section headers. Manrope’s geometric yet friendly curves provide a modern, high-end feel.
    *   *Headline-LG:* 2rem — Use for page titles to establish clear hierarchy.
*   **Body & Labels (Inter):** Used for all functional data, forms, and secondary text. Inter’s high x-height ensures maximum readability for complex medical SKU data and business metrics.
    *   *Body-MD:* 0.875rem — The workhorse for all marketplace listings.
    *   *Label-SM:* 0.6875rem — Used for metadata (e.g., "SKU: 10293") to keep the UI clean.

**RTL Support:** Typography must maintain the same optical weight when mirrored. Ensure line heights are generous (1.5x minimum) to accommodate Arabic script scripts without clipping.

---

## 4. Elevation & Depth

We convey importance through **Tonal Layering** rather than structural scaffolding.

*   **The Layering Principle:** Place a `surface-container-lowest` card (Pure White) on a `surface-container-low` background. This creates a "soft lift" that feels architectural.
*   **Ambient Shadows:** For interactive elements like "Hovered Cards," use a custom shadow: 
    *   `0px 12px 32px rgba(25, 28, 30, 0.06)`
    *   The shadow is tinted with the `on-surface` color to mimic natural light, avoiding the "dirty" look of pure grey shadows.
*   **The Ghost Border:** If a border is required for accessibility in form fields, use `outline_variant` at **20% opacity**. Never use 100% opaque borders for decorative purposes.

---

## 5. Components

### Cards (The Signature Element)
*   **Radius:** Always `xl` (1.5rem / 24px) for main containers; `lg` (1rem / 16px) for nested items.
*   **Layout:** No dividers. Use spacing (`spacing-6`) to separate header, body, and footer sections within the card.

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `full` roundedness. 
*   **Secondary:** `surface-container-high` background with `primary` text. No border.
*   **Tertiary:** Transparent background with `on-surface-variant` text; shifts to `primary` on hover.

### Structured Form Fields
*   **Background:** `surface-container-lowest` (White).
*   **States:** Default has no border; Focus uses a 2px `surface-tint` (#2b5bb5) "glow" and a subtle `outline`.
*   **Labels:** `label-md` in `on-surface-variant` positioned strictly above the field for RTL/LTR consistency.

### Medical Data Chips
*   **Selection Chips:** Use `secondary_container` with `on_secondary_container` text. 
*   **Status Chips:** Use `tertiary_fixed` for high-priority alerts (e.g., "Low Stock") to introduce a professional, warm contrast to the deep blues.

### Specialized Marketplace Components
*   **Business ID Badge:** A small, high-contrast component using `on_primary_fixed` to highlight verified medical suppliers.
*   **Entity Cards:** For Users/Companies. Use a large `xl` radius, `surface-container-lowest` background, and a 40px icon/avatar with a `surface-variant` background.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., wider margins on the leading side) to create an editorial, "non-template" feel.
*   **Do** prioritize vertical rhythm using the `spacing-4` (1rem) base unit.
*   **Do** ensure all icons are "Line Art" style with a 1.5px stroke to match the refined typography.

### Don't
*   **Don't** use 1px solid dividers to separate list items; use a `spacing-2` gap and a subtle background shift on hover instead.
*   **Don't** use high-contrast pure black (#000) for text; use `on_surface` (#191c1e) for a softer, premium medical aesthetic.
*   **Don't** cram data. If a table feels crowded, move secondary data into a `surface-container-high` drawer or expandable section.

---

## 7. RTL Implementation
This system is "Direction Agnostic." All spacing, icon placements (leading/trailing), and typography alignments must flip automatically.
*   **Mirroring:** Surfaces with `surface-container` shifts must maintain their relationship.
*   **Icons:** Only mirror directional icons (arrows, chevrons). Medical equipment icons (microscopes, stethoscopes) should remain unmirrored to maintain technical accuracy.