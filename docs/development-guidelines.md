# Development guidelines

Framework: react. Environment: basic.

## Responsive UI
Use responsive CSS Grid/Flexbox, minmax(), clamp(), rem/em, percentages, svh/dvh and fluid sizing. Avoid hardcoded px layouts and viewport-specific magic numbers; fixed px only where technically justified (hairlines etc.).

## Change classification
Purely visual/UI changes (spacing, typography, styling, layout, colors) do NOT require a change log unless they change behavior, logic, accessibility semantics, data, routing, or contracts. Mixed changes count as logical.

## Quality
Read nearby code, make focused edits, preserve compatibility. Never claim checks passed without running them.
