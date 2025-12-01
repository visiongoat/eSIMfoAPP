## Design Approach

**Style Direction**: Modern gradient-driven interface with Material Design 3 principles for depth and motion. Dark mode as primary interface with vibrant gradient accents creating visual hierarchy.

---

## Typography

**Font Stack**: Inter (Google Fonts)
- Headers: 600-700 weight, tight letter-spacing (-0.02em)
- Body: 400-500 weight
- Stats/Numbers: 700 weight, tabular-nums

**Scale**:
- Screen titles: text-2xl (mobile) → text-3xl (desktop)
- Card headings: text-lg font-semibold
- Body text: text-base
- Labels/meta: text-sm text-gray-400

---

## Layout System

**Mobile-First Spacing**: Use Tailwind units 3, 4, 6, 8, 12
- Screen padding: px-4 py-6
- Card gaps: gap-4
- Section spacing: space-y-6
- Component internal padding: p-4 to p-6

**Container Strategy**:
- Full-width cards with horizontal scroll containers
- Fixed bottom navigation (h-16)
- Top status bar safe area (pt-safe)

---

## Component Library

### Gradient Cards
**Primary Pattern**: `bg-gradient-to-br from-orange-500 to-orange-600` or `from-blue-500 to-blue-600`
- Border radius: rounded-2xl
- Padding: p-6
- Shadow: shadow-xl with slight glow effect
- White text overlay with proper contrast

**Quick Action Cards** (smaller):
- rounded-xl
- Gradient backgrounds with icons
- Compact p-4
- Arranged in 2-column grid (grid-cols-2 gap-3)

### Horizontal Carousels
**eSIM Plans Carousel**:
- snap-x snap-mandatory scroll container
- Each card: min-w-[280px] snap-center
- Padding between cards: gap-4
- Show partial next card to indicate scrollability

**Usage History Carousel**:
- Data usage cards with gradient backgrounds
- Chart/graph integration within cards
- Date ranges prominently displayed

### Data Display Cards
**Current Plan Card**:
- Large gradient card at top (hero position)
- Data usage ring/circular progress
- Remaining GB prominent (text-4xl font-bold)
- Expiration date and renewal info
- Primary CTA button with backdrop-blur-md bg-white/20

**Available eSIMs Grid**:
- Vertical scrolling list
- Each eSIM: white/10 background, rounded-xl
- Country flag icon + name
- Status indicator (Active/Inactive) with colored dot
- Swipe actions for delete/manage

### Navigation
**Bottom Tab Bar**:
- Fixed position with backdrop-blur
- bg-gray-900/95 border-t border-gray-800
- Icons with labels
- Active state: orange-500 color
- 4 tabs: Home, Plans, Usage, Profile

**Top App Bar**:
- Title + action buttons
- Transparent with text overlay on gradient hero
- Or solid bg-gray-900 on scrolled state

### Buttons & CTAs
**Primary Buttons**:
- Gradient backgrounds (orange/blue)
- rounded-xl, px-6 py-3
- font-semibold
- When on images/gradients: backdrop-blur-md bg-white/20 border border-white/30

**Secondary Buttons**:
- bg-white/10 border border-white/20
- rounded-xl

### Form Elements
**Input Fields**:
- bg-gray-800/50 border border-gray-700
- rounded-xl, p-4
- Focus: border-orange-500
- Placeholder: text-gray-500

---

## Dark Mode Specification

**Base Colors**:
- Background: bg-gray-950
- Surface: bg-gray-900
- Cards: bg-gray-800 or gradient overlays
- Text primary: text-white
- Text secondary: text-gray-400
- Borders: border-gray-800

**Accent Colors**:
- Orange: Tailwind orange-500/600 for primary actions
- Blue: Tailwind blue-500/600 for informational elements
- Success: green-500 (active eSIMs)
- Warning: amber-500 (low data)

---

## Images

**App Screens**: No large hero image. This is a utility app focused on card-based interface.

**Icon Assets**:
- Country flag icons for eSIM regions (small, circular)
- Network signal/connectivity icons
- Data usage chart illustrations
- Credit card illustration for payment section

**Decorative Elements**:
- Subtle grid pattern overlay on gradient cards
- Soft glow effects behind gradient cards (using shadows)
- Abstract connectivity patterns in empty states

---

## Screen Structure

**Home Screen**:
1. Active eSIM hero card (gradient, large, data usage)
2. Quick actions grid (2x2: Buy Plan, Top Up, Settings, Support)
3. Recent Activity carousel
4. Recommended Plans carousel

**Plans Library**:
1. Search/filter bar
2. Regional categories (horizontal scroll chips)
3. Plan cards grid with pricing, data, duration
4. Each card: gradient header + white details section

**Usage Dashboard**:
1. Time period selector (tabs)
2. Usage chart card (gradient background)
3. App-wise data breakdown list
4. Historical carousel

**Profile/Settings**:
1. User info card (gradient)
2. Settings list (grouped sections with rounded-xl containers)
3. Logout/danger zone at bottom