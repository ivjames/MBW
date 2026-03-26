Fixes applied:
- Replaced hero flex layout with a constrained CSS grid to prevent the dashboard column from collapsing.
- Added min-width: 0 to hero and card internals so content can shrink correctly.
- Hardened dashboard grid columns with minmax(0, 1fr).
- Added wrap controls for quote and metric text.
- Added breakpoint changes so dashboard cards stack before they become unreadable.
