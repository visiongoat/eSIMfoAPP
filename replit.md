# eSIM Mobile App

## Overview

This is a mobile-first eSIM management application built with React, Express.js, and PostgreSQL. The app allows users to browse and purchase eSIM packages for different countries, manage their active eSIMs, and provides a partner dashboard for resellers. The application uses a modern tech stack with TypeScript, Drizzle ORM, and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client, server, and shared components:

- **Frontend**: React-based mobile-first web application using Vite as the build tool
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

## Key Components

### Frontend Architecture
- **Mobile-First Design**: Custom CSS classes for mobile containers, cards, and navigation
- **Component Structure**: Organized into reusable UI components, pages, and shared components
- **Responsive Design**: Uses Tailwind CSS with custom mobile-specific styling
- **State Management**: React Query for API state, local React state for UI state

### Backend Architecture
- **RESTful API**: Express.js server with structured route handlers
- **Data Access Layer**: Abstract storage interface with memory-based implementation
- **Type Safety**: Full TypeScript integration with shared schema types
- **Development Setup**: Vite integration for hot module replacement in development

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Authentication and partner status management
- **Countries**: Geographic regions with coverage information
- **Packages**: eSIM data packages with pricing and features
- **eSIMs**: Individual eSIM instances with activation status
- **Partner Stats**: Revenue and performance tracking for partners
- **Sales**: Transaction records for partner dashboard

## Data Flow

1. **User Journey**: Splash screen → Onboarding → Home → Country selection → Package selection → Purchase → QR code generation
2. **API Communication**: Frontend makes REST API calls to Express server endpoints
3. **Database Operations**: Server uses Drizzle ORM to perform type-safe database operations
4. **State Synchronization**: React Query manages server state caching and synchronization

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: PostgreSQL database connection

### UI/UX Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Uses Vite development server with Express API integration
- Hot module replacement for fast development iterations
- Environment-based configuration for database connections

### Production Build
- **Frontend**: Vite builds React app to static assets in `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory
- **Environment Variables**: Requires `DATABASE_URL` for PostgreSQL connection

### Key Build Commands
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build both frontend and backend for production
- `npm run start`: Start production server
- `npm run db:push`: Push database schema changes using Drizzle

The application is designed to be deployed as a single Node.js application serving both the API and static frontend assets, with PostgreSQL as the database backend.

## Recent Changes

### Complete Dark Mode System with Auto Theme Detection (January 25, 2025)
- Comprehensive dark mode system with theme provider and CSS variables
- **System theme auto-detection**: Automatically detects user's device theme preference on app startup
- **Real-time theme tracking**: Responds instantly to device theme changes while app is running
- **Three theme options**: Light, Dark, and System (follows device setting)
- Complete UI adaptation for home page including cards, search bar, tabs, and navigation
- Row-based stagger animations for natural card appearance sequence
- Tab bar and all interactive elements fully adapted for dark theme
- Live chat modal enhanced with dark mode compatibility and improved sizing (85vh)
- Profile page theme selector with visual indicators for current theme mode
- localStorage persistence for user theme preferences

### Advanced Error Handling & 404 System (January 25, 2025)
- **Professional 404 page**: Custom not found page with navigation options and dark mode support
- **Network error handling**: Dedicated component for connection issues with retry functionality
- **Server error handling**: Comprehensive server error display with error codes and support info
- **React Query enhancement**: 3-attempt retry with exponential backoff and 5-10 minute stale time
- **Smart error detection**: Automatic categorization of error types (network/server/timeout/generic)
- **Graceful degradation**: Critical vs non-critical error handling with inline displays
- **Global retry system**: One-click retry for all failed API calls
- **Dark mode compatibility**: All error states fully adapted for both light and dark themes
- **Production-ready**: Enterprise-level error handling with user-friendly messaging

### UI Polish & Icon Design (January 25, 2025)
- **Custom 404 icon**: Artistic vector sad face with smooth curves and professional design
- **Logo dark mode fixes**: esimfo brand logo fully visible in both light and dark themes
- **Button contrast improvements**: Enhanced visibility for secondary buttons in light mode
- **Complete offline mode support**: Real-time connection status tracking with useOnlineStatus hook
- **Pixel-perfect design**: All UI elements optimized for mobile-first experience with consistent spacing

### Tab System Consistency & Premium + Button Modal (January 25, 2025)
- **Perfect tab consistency**: Home and destinations pages now use identical tab system design
- **Unified icons**: Same SVG icons (location pin, map, globe) across both pages with matching colors
- **Consistent styling**: Exact gradient backgrounds, rounded corners, hover effects, and animations
- **Centered alphabet filters**: Alphabetic filter buttons centered for better visual balance
- **Premium + button modal**: JetPass-inspired bottom modal with "machine feel" design
- **Three eSIM categories**: Local (blue), Regional (green), Global (purple) with premium gradients
- **Micro-interactions**: Handle bar, slide animations, hover effects, and scale transforms
- **Universal functionality**: + button active on all pages with contextual navigation

### Enhanced Mobile UX & Soft Gradients (January 25, 2025)
- **Mobile touch optimization**: Enter key for quick search selection, ESC for clearing with keyboard dismiss
- **Touch feedback**: Active scale effects (0.98x), haptic feedback simulation, touch-manipulation
- **Consistent ESC badges**: Unified keyboard shortcut hints across home and destinations search bars
- **Optimized spacing**: Destinations page bottom margin reduced for better content-to-tab-bar ratio
- **Soft gradient system**: Light mode enhanced with subtle blue-to-purple gradients on background and cards
- **Dark mode parity**: Light mode now features elegant gradient transitions similar to dark mode's soft aesthetics
- **Brand-friendly naming**: "Buy eSIM fo" header adds playful brand consistency to destinations page

### Advanced Parallax Onboarding System (January 26, 2025)
- **Multi-layered parallax backgrounds**: 3 layers per step moving at different speeds (20%, 50%, 80%) during swipe
- **Step-specific visual themes**: Global Coverage (world map + satellites), Easy Setup (circuit boards + QR elements), Instant Activation (lightning + signal waves)
- **Grid notebook backgrounds**: Subtle fade-out mask from top and bottom for professional appearance
- **Swipe gesture integration**: Touch handlers with visual feedback and haptic simulation
- **Color wave transitions**: Dynamic gradient overlays during step changes based on theme colors
- **Optimized UI controls**: Clean Skip button (always visible) and simple Back text for navigation
- **Performance optimized**: GPU-accelerated transforms with smooth 60fps animations

### Perfect Onboarding Consistency & Layout Alignment (January 26, 2025)
- **Icon container standardization**: 32x32 (128px) consistent size across all three onboarding steps with 140px fixed height area
- **Title positioning consistency**: 120px minimum height container with perfect center alignment and text-3xl uniform font size
- **Navigation button alignment**: Fixed positioning for Continue/Back buttons with consistent pb-12 sm:pb-16 md:pb-20 spacing
- **Content container optimization**: 460px fixed height with 20px paddingTop for uniform element positioning
- **Badge layout refinement**: Global Coverage badges optimized to single row display with compact text ("200+ Countries", "No Fees", "Global")
- **Responsive safe area support**: Perfect iPhone notch and home indicator compatibility across all screen sizes
- **Premium visual hierarchy**: All onboarding steps now maintain identical element positioning and sizing for professional consistency

### Premium Packages Page Design (January 27, 2025)
- **Example-inspired layout**: Based on provided screenshot design with dark theme adaptation to light/dark mode support
- **Tab system implementation**: "Data" and "Data / Calls / Text" toggle buttons with active state styling
- **Package card design**: Card-based layout with duration, data amount, pricing, and discount badges (-51%, -69%, -77%)
- **Interactive selection**: Orange border highlight for selected packages with smooth transitions
- **Plan details section**: Countries/operators info and plan type display with icons
- **eSIM quantity selector**: Plus/minus buttons for quantity selection with responsive design
- **Payment button integration**: Bottom-positioned purchase button with dynamic pricing
- **Full theme compatibility**: Complete light mode support with dark mode fallback using Tailwind dark: variants
- **Mobile-optimized UX**: Touch-friendly buttons, proper spacing, and responsive typography

### Plan Details Collapsible System (January 27, 2025)
- **Compact collapsible sections**: Network, Plan, and Features sections with chevron indicators
- **Smart initial state**: Network section opens by default (most important info), Plan and Features collapsed
- **Color-coded organization**: Blue for Network, Green for Plan, Purple for Features sections
- **Quick Facts grid**: LTE Ready, No eKYC, US IP badges prominently displayed at top
- **Minimal design approach**: Clean sections without info icons or tooltips per user preference
- **Dynamic padding system**: Collapsed sections use p-2 (compact), expanded sections use p-4 (comfortable)
- **Smooth animations**: Slide-in effects and hover states for better interaction feedback
- **Mobile-first spacing**: Optimized margins and padding for mobile viewing experience

### Final UI Polish & Tab Enhancement (January 27, 2025)
- **Compact header design**: Flag icon integration with reduced padding (py-2) and smaller elements
- **Natural tab count system**: Package counts displayed in parentheses "Data (4)" for organic appearance
- **Minimal count approach**: Avoided badges and extra styling to maintain tab simplicity
- **Header flag integration**: Country flags (5x4px) with rounded corners next to country names
- **Balanced visual hierarchy**: All elements sized proportionally for mobile-first experience

### Advanced Device Detection System (January 27, 2025)
- **Multi-method detection**: 5 different detection approaches (UserAgentData, UserAgent, WebGL, CSS, Touch)
- **Hardware identifier mapping**: iPhone16,1 -> iPhone 15 Pro, Samsung SM-S928 -> Galaxy S24 Ultra
- **iOS version correlation**: iOS 18.5 -> iPhone 15 series estimation for web environment
- **Native app readiness**: Architecture designed for easy transition to React Native device detection
- **Debug logging system**: Console output showing detection method success/failure chain
- **eSIM compatibility logic**: Version-based eSIM support determination for different platforms
- **Future native integration**: Foundation ready for react-native-device-info integration

### Enhanced Package System with Voice/SMS Support (January 27, 2025)
- **Dual tab system**: Separate Data and Data/Calls/Text package categories
- **Voice and SMS integration**: Data/Calls/Text packages include voice minutes and SMS counts
- **Package duration updates**: 7, 15, 20, 30 day periods with corresponding GB allocations (1GB, 3GB, 5GB, 10GB)
- **Smart layout design**: Data/duration on left, voice/SMS in middle, price/signal on right for combination packages
- **Visual differentiation**: Orange border styling for Data/Calls/Text packages vs blue for data-only
- **Realistic pricing**: Premium pricing for combination packages reflecting added voice and SMS value

### Swipe Navigation System (January 27, 2025)
- **Home page swipe**: Horizontal swipe gestures for tab switching between Local → Regional → Global
- **Packages page swipe**: Horizontal swipe gestures for tab switching between Data and Data/Calls/Text
- **Destinations page swipe**: Three-tab navigation with swipe support (Countries → Regions → Global)
- **Touch sensitivity**: 50px minimum swipe distance with horizontal dominance detection
- **Smooth transitions**: Natural left/right swipe behavior matching mobile app standards
- **Touch event handling**: Passive event listeners for optimal performance without interfering with scrolling
- **Debug logging**: Console messages for swipe detection testing and development

### Floating Satellite Animation System (January 27, 2025)
- **Global Coverage onboarding**: Premium floating satellite animations in space-like environment
- **Realistic satellite design**: SVG satellites with solar panels, antenna, and main body components
- **Smooth floating motion**: Custom CSS keyframe animation with 8s and 10s cycles, Y/X translation and rotation
- **Signal wave effects**: Concentric ping animations around each satellite for communication visualization
- **Orbital path indicators**: Elliptical dashed paths showing satellite trajectories
- **Earth/Planet glow**: Pulsing blue glow effect representing Earth with connection beams to satellites
- **Layered animation**: Non-intrusive overlay system preserving existing onboarding design integrity
- **Performance optimized**: GPU-accelerated transforms with opacity-based visibility control

### Complete Custom Continent Icon System (January 28, 2025)
- **6 custom continent icons**: Europa, Asia, Americas, Africa, Middle East, Oceania with unique map designs
- **Professional PNG integration**: Replaced all SVG icons with transparent background PNG assets
- **Consistent sizing**: 40x40px icons within 48x48px colored containers across both pages
- **Color-coded containers**: Blue (Europa), Green (Asia), Orange (Americas), Yellow (Africa), Purple (Middle East), Teal (Oceania)
- **Dark mode consistency**: All container colors properly adjusted for uniform appearance in dark theme
- **Dual page implementation**: Icons active on both Home → Regional tab and Destinations → Regions tab
- **Brand consistency**: Custom-designed map icons maintaining esimfo visual identity
- **Responsive design**: Icons scale properly with hover effects and touch feedback
- **Complete SVG replacement**: All continent regional icons now use custom PNG assets with transparent backgrounds

### "How Does eSIMfo Work?" Modal Icon System (January 28, 2025)
- **Complete custom icon integration**: All three steps now use custom PNG icons instead of generic SVG icons
- **Step-specific icons**: locationpin.png (destination), qrscan.png (setup), signalesim.png (activation)
- **Consistent sizing**: 64x64px source icons displayed at 48x48px (w-12 h-12) for optimal clarity
- **Container-free design**: Removed circular background containers to showcase custom icon designs
- **Professional appearance**: Transparent background PNG assets maintain clean, modern aesthetics
- **Brand consistency**: Custom-designed icons align with esimfo visual identity and mobile app standards
- **Enhanced modal animations**: Stagger animations for step reveal, icon hover effects, and smooth transitions
- **Step numbering system**: Color-coded gradient badges (red, blue, green) with step numbers for clear progression
- **Improved spacing**: Wider modal container (max-w-lg) with increased padding for better content readability
- **Flow connection lines**: Subtle dotted lines between steps to visualize progression flow with fade-in animations

### Native Sharing System with Platform Detection (January 28, 2025)
- **Smart platform detection**: iOS, Android, and app environment detection for optimal sharing experience
- **Native iOS sharing**: Apple share sheet integration with title, text, and URL parameters
- **Android platform options**: Custom modal with WhatsApp, Telegram, and clipboard sharing options
- **Dynamic content generation**: Live package data integration with country-specific URLs for web sharing
- **App store redirects**: Dedicated app download messaging for mobile app environment
- **Touch feedback integration**: Haptic vibration support for enhanced mobile UX
- **Premium modal design**: Bottom sheet with platform-specific icons and smooth animations
- **Fallback mechanisms**: Clipboard copying as universal fallback for unsupported platforms
- **Share icon placement**: Positioned next to currency unit in packages page header for easy access

### Enhanced My eSIM Page with Smart Features (January 28, 2025)
- **Data usage notifications**: 80% threshold alerts with orange warning badges and pulse animation
- **Visual progress bars**: Color-coded data usage bars (green/orange/red) with smooth transitions
- **Enhanced statistics**: Compact 4-column stats with color-coded metrics (eSIMs, Countries, Data Used, Savings)
- **eSIM sharing system**: Native share functionality for eSIM details and QR codes with fallback clipboard
- **Multiple eSIM management**: Smart control panel for users with 2+ active eSIMs showing auto-switching status
- **Improved UX patterns**: Consistent share icons, status indicators, and responsive mobile-first design
- **Performance optimization**: Fixed infinite useEffect loops and optimized notification rendering

### Complete My eSIM Dashboard Redesign (January 28, 2025)
- **Dashboard-style stats**: 3-card layout (Total eSIMs, Countries, Data Used) with individual cards and professional spacing
- **Compact eSIM cards**: Single-card design with flag (10x7px), country name, eSIM ID, and status badge in header
- **Package detail boxes**: Gray background containers showing plan name, data, duration, and price with bullet separators
- **Active eSIM progress bars**: Color-coded usage indicators (green/yellow/orange) only for active eSIMs with warning icons at 80%
- **Clean action buttons**: "View QR", "Reorder", and share icons positioned in footer with proper spacing
- **Multi-eSIM status panel**: Gradient background panel for users with 2+ active eSIMs showing auto-switching capabilities
- **English consistency**: All labels maintained in English for professional mobile app feel
- **Design-first approach**: Static demo data (Turkey flag, Istanbul Travel package) for visual design validation