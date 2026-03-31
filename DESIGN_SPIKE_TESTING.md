# Design Spike Testing Guide

## ⚡ Quick Start

### 1. Start Your Dev Server
```bash
cd server
npm start
```

Open your site at `http://localhost:5173` (or your configured port)

---

## 🎨 Toggle Between Designs

### Option A: Browser Console (Easiest for Quick Testing)
Open your browser's Developer Console (F12 or Cmd+Opt+I) and paste:

```javascript
// Enable Spike Design
toggleDesignMode('spike')

// Or toggle back to default
toggleDesignMode()
```

### Option B: Add a Toggle Button (Recommended for Visual Testing)
The spike design system includes support for a design toggle button. Look in your navbar/header for a button labeled **"🎨 Spike Design"** (or **"✨ Classic Mode"** when spike is active).

If you don't see it yet, you can manually add it to your navbar component or footer:

```html
<button id="designModeToggle" 
        class="button button--secondary" 
        aria-label="Toggle design mode"
        onclick="import('/assets/js/theme.js').then(m => m.toggleDesignMode())">
  🎨 Spike Design
</button>
```

### Option C: Manual Data Attribute (Developer Testing)
Edit `index.html` and change this line:
```html
<html lang="en">
```
to:
```html
<html lang="en" data-theme="spike">
```

Then refresh your browser. Change back to test the default design.

---

## 🔍 What to Look For

### Visual Changes in Spike Design
✅ **Header**: Navy background with cyan bottom border, bolder navigation  
✅ **Buttons**: Stronger magenta gradient, elevated shadows, uppercase text  
✅ **Cards**: Colored left border accent (cyan/magenta/lime alternating)  
✅ **Hero Section**: Animated gradient overlay, more dramatic spacing  
✅ **Accents**: Electric cyan, hot magenta, lime green throughout  
✅ **Typography**: Bolder weights, uppercase section titles with colored bars  

### Testing Checklist
- [ ] Header is readable (white text on navy)
- [ ] CTA button is prominent and pops visually
- [ ] Card borders cycle through colors (no jarring transitions)
- [ ] Hero section feels fresh and energetic
- [ ] Mobile menu still looks good (test at 980px or below)
- [ ] Colors don't clash on hover states
- [ ] All text has sufficient contrast (readable)
- [ ] Animations are smooth (no jank)

---

## 🛠️ Technical Details

### New CSS File
- **Location**: `assets/css/design-spike.css`
- **Size**: ~3.5kb (minimal impact)
- **Approach**: CSS custom property overrides + component-specific rules
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

### How It Works
1. The spike CSS uses `:root[data-theme="spike"]` selector
2. Overrides design tokens (colors, shadows, spacing)
3. Adds new component styles (borders, glows, animations)
4. Falls back to default design when `data-theme` is not "spike"

### Updated Files
- ✅ `assets/css/design-spike.css` — NEW (all experimental styles)
- ✅ `assets/js/theme.js` — UPDATED (added design mode functions)
- ✅ `index.html` — UPDATED (added spike CSS import, updated theme init)
- ✅ `assets/js/main.min.js` — REBUILT (includes new theme functions)

---

## 📊 Comparison: Default vs. Spike

| Aspect | Default | Spike |
|--------|---------|-------|
| **Background** | Pure black (#000) | Navy (#0f1626) |
| **Primary Accent** | Yellow (#f7e30b) | Magenta (#ff006e) |
| **Secondary** | Blue (#b3c2f2) | Cyan (#00f0ff) |
| **Text** | Soft white (#f5f7ff) | Pure white (#fff) |
| **Button Style** | Minimalist, quiet | Bold, aggressive gradients |
| **Card Style** | No border accent | Colored left border |
| **Spacing** | Tight, dense | Generous, breathing |
| **Vibe** | Sophisticated, subtle | Energetic, playful |

---

## 🔄 Iteration Workflow

1. **View Spike Design**: Toggle the design via console or button
2. **Note Issues**: Take screenshots, check mobile breakpoints
3. **Edit Spike CSS**: Tweak colors, spacing, components in `design-spike.css`
4. **Rebuild**: Run `npm run build:assets` in `/server` folder
5. **Refresh Browser**: See your changes (hard refresh if needed: Ctrl+Shift+R)
6. **Repeat**: Keep iterating until you love it

---

## 🚀 Next Steps

### If You Love This Direction:
1. Merge `design/bold-colorful-refresh` branch to `main`
2. Delete or archive the original `components.css` styles
3. Consider creating alternate design variants (e.g., `spike-minimal.css`)

### If You Want to Pivot:
1. Edit `design-spike.css` directly—try different colors:
   - Swap magenta → gold for warmer vibe
   - Swap cyan → purple for moodier feel
   - Keep lime green or swap for orange for friendlier feel
2. Adjust spacing, shadow strength, animations
3. Test at different breakpoints

### If You Want to Start Over:
1. Delete `assets/css/design-spike.css`
2. Remove the import from `index.html`
3. Revert `theme.js` changes (or leave them for future exploration)
4. Git: `git reset --hard` to go back to main branch

---

## 🐛 Troubleshooting

**Colors not changing?**
- Did you rebuild? Run `npm run build:assets`
- Does `data-theme="spike"` appear in your HTML element? (Check DevTools)
- Try a hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

**Spike toggle button not showing?**
- Check browser console for errors (F12)
- Make sure `id="designModeToggle"` is added to an element in your navbar
- Verify `main.min.js` was rebuilt with new theme.js

**Text not readable in spike design?**
- This shouldn't happen if built correctly. Check console for CSS errors
- All colors have 4.5:1+ contrast ratio (WCAG AA compliant)

**Want to disable spike entirely while keeping default?**
- Remove the line importing `design-spike.css` from `index.html`
- The toggle will still work but won't do anything

---

## 📝 Notes

- **Breakpoints**: Spike design respects all existing responsive breakpoints (560px, 640px, 980px, 1120px, 1220px)
- **Backward Compatible**: Default design is untouched—spike is additive only
- **Git Branch**: You're on `design/bold-colorful-refresh` to keep changes isolated
- **Build Process**: Spike CSS is automatically included in `app.min.css` minified bundle

Enjoy experimenting! 🎨✨
