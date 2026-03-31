# Design Spike: Bold & Colorful Refresh

## Concept
A radically refreshed design moving away from the subtly-tinted dark aesthetic toward a **vibrant, high-contrast** experience with intentional color blocking, stronger visual hierarchy, and modern minimalist spacing.

## Design Principles
- **High Contrast**: Bolder color separation, clearer visual zones
- **Vibrant Accents**: Saturated, energetic brand colors as primary design drivers
- **Playful Geometry**: Subtle rounded corners paired with angular asymmetry
- **Generous Whitespace**: Breathing room between sections, less dense layouts
- **Modern Typography**: Bold, assertive headings; calm, readable body text

## Color Palette Changes

### Current Theme (Dark Subtle)
- Background: Pure black (#000000)
- Text: Soft white (#f5f7ff)
- Accents: Yellow (#f7e30b), Orange (#ff8000), Purple (#735cdd), Blue (#b3c2f2)
- Approach: Muted, tinted, glass-like

### Spike Direction (Bold Colorful)
- **Primary BG**: Deep navy (#0f1a3d) or charcoal (#1a1a2e)
- **Secondary BG**: Vibrant accent stripes/blocks (hot magenta, electric teal, lime)
- **Text**: Crisp white (#ffffff) with high contrast
- **Primary Accent**: Neon pink/magenta (#ff006e or #ff0080)
- **Secondary**: Electric teal (#00f0ff)
- **Tertiary**: Lime green (#00ff00 or #00ff88)
- **Warning/Status**: Hot orange (#ff6b35)
- **Success**: Bright green (#22ff00)

## Layout Changes
- Add **accent color dividers** between sections (horizontal bars, 4-8px height)
- **Hero section**: Split into asymmetric zones (text on dark, visual on colored background)
- **Buttons**: Bolder, larger padding, more aggressive hover states
- **Cards**: Subtle colored left-border accent (3-5px), elevated shadow
- **Navigation**: Darker, more structured; accent line under active items

## Implementation Strategy
1. ✅ Create `design-spike.css` with new token overrides
2. ✅ Add HTML `data-theme="spike"` toggle to test
3. ✅ Modify key component colors
4. ✅ Test on multiple pages
5. ✅ Iterate based on visual feedback

## Files to Modify
- **Primary**: `assets/css/design-spike.css` (NEW - all changes here)
- **Secondary**: `index.html` (add data-theme toggle button for testing)
- **Optional**: `assets/js/theme.js` (extend theme switcher if needed)

## Quick Testing Checklist
- [ ] Header/navbar contrast readable
- [ ] CTA buttons pop visually
- [ ] Hero section layout feels fresh
- [ ] Color dividers don't feel forced
- [ ] Mobile breakpoints still work
- [ ] Text contrast meets WCAG AA
- [ ] No color clashing on component interactions

## Success Criteria
- Noticeably different from current design
- All text readable (contrast ratio ≥ 4.5:1)
- Maintains responsive behavior
- Visual hierarchy clearer than before
