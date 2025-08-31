# eSIM Mobile App

## Overview

This project is a mobile-first eSIM management application that enables users to browse, purchase, and manage eSIM packages globally. It also includes a partner dashboard for resellers. The application aims to provide a seamless and intuitive experience for mobile connectivity management, leveraging a modern full-stack monorepo architecture.

## User Preferences

Preferred communication style: Simple, everyday language.
Project Mode: Design-focused prototype for development team handoff - all features should work regardless of data availability.
Currency: Always use € (Euro) as the currency unit.
Language: User communicates in Turkish but prefers English for technical implementation.

## Recent Updates (August 31, 2025)

### Profile Page Update (August 31, 2025)
- Removed Notifications menu from profile page per user request
- Removed Privacy & Security menu from profile page per user request
- Connected Terms of Service link to https://esimfo.com/terms-conditions
- Connected Privacy Policy link to https://esimfo.com/privacy-policy
- Removed logo from profile footer, kept text "Version 1.2.3 • Made with ❤️ for travelers"
- Removed Preferences section (language/currency selectors) from personal-info page
- Removed Two-Factor Authentication option from personal-info page
- Removed Notifications section (Email/Push/Marketing notifications) from personal-info page
- Profile menu now focuses on essential account settings only
- UI/UX remains consistent with streamlined menu options

## Previous Updates (August 16, 2025)

### Workspace Preview Fix Attempts (August 16, 2025)
- ISSUE: Workspace iframe preview showing "Kablosuz Ağ Bağlantısı" error on mobile
- WORKING: Deploy URL https://esimfo-mobil-yogurtcusahin5.replit.app/ confirmed working
- FIXES APPLIED: 
  - X-Frame-Options changed to ALLOWALL for iframe compatibility
  - Enhanced CSP with replit.com frame-ancestors permissions  
  - Added iframe communication scripts for workspace preview
  - VM restart with `kill 1` command executed
  - Third-party cookie compatibility scripts added
- FINAL FIX: Workspace preview yanlış URL kullanıyordu (dev vs prod)
- Production URL tespit edildi: https://abcbfb76-74d4-478f-9f83-ba1befaab60e.kirk.prod.repl.run/
- Custom iframe handler production URL'yi kullanacak şekilde güncellendi
- STATUS: Workspace preview production URL ile düzeltildi

### QR Code Tap-to-Save Feature  
- Added tap functionality to QR code for automatic gallery saving
- Implemented Canvas-based PNG file generation and download
- Added Turkish notification messages for user feedback
- Visual feedback with hover and active states on QR code
- Successfully tested and working in development environment

### Manual Installation System
- Positioned above Installation Guide as card-style tappable area
- Modal popup displays ICCID and activation codes
- Copy buttons for easy manual entry
- Professional border and hover effects

### Real Geolocation System (August 16, 2025)
- Dual API system: ipapi.co primary, ip-api.com fallback
- 40+ country mapping with proper flag emojis
- Dynamic flag generation for unmapped countries using Unicode
- Loading states and success indicators
- Console logging for debugging API responses
- Replaces simulated time-based country detection

### Deployment Status
- Application fully functional on https://09004862-5261-4aba-a3f0-851185a3053e-00-asnzibgjpsfs.kirk.replit.dev
- All APIs responding correctly (countries, packages, purchase flow)
- QR code generation and saving features working
- Direct preview available at /direct-preview endpoint
- Ready for production deployment

## System Architecture

The application adopts a full-stack monorepo architecture, separating client, server, and shared components.

### Frontend
- **Technology**: React with Vite for building a mobile-first web application.
- **Styling**: Tailwind CSS and shadcn/ui components for a responsive and consistent UI.
- **State Management**: TanStack Query (React Query) for efficient server state management.
- **Routing**: Wouter for lightweight client-side navigation.
- **Design Principles**: Emphasizes mobile-first design with custom CSS classes, organized into reusable UI components, pages, and shared components. Includes comprehensive dark mode support with auto-detection and theme options (Light, Dark, System).

### Backend
- **Technology**: Express.js REST API server built with TypeScript.
- **Data Access**: Utilizes Drizzle ORM for type-safe PostgreSQL database operations.
- **Architecture**: Features a structured RESTful API with a clear data access layer.

### Database
- **Technology**: PostgreSQL with Drizzle ORM.
- **Key Entities**: Users, Countries, Packages, eSIMs, Partner Stats, and Sales to support core functionalities like user management, eSIM provisioning, and sales tracking.

### Core Features & Design Decisions
- **Onboarding System**: Advanced multi-layered parallax backgrounds and step-specific visual themes with smooth swipe gestures for an engaging user onboarding experience.
- **Error Handling**: Professional 404 page, network and server error handling with retry functionality, and smart error detection.
- **UI Polish**: Consistent UI elements, custom iconography (e.g., continent icons, modal icons), and optimized spacing for a pixel-perfect mobile experience.
- **Tab & Navigation System**: Consistent tab designs across the application (e.g., Home, Destinations, Packages) with swipe navigation support.
- **Package Management**: Dual tab system for "Data" and "Data / Calls / Text" packages, with detailed package card designs and interactive selection.
- **eSIM Management**: "My eSIM" dashboard with visual data usage progress bars, smart notifications (e.g., 80% usage alert), and multi-eSIM management capabilities featuring:
  - Apple-style slide animations for modal navigation (300ms timing)
  - Real-time touch feedback during swipe gestures  
  - Smooth slide transitions without zoom or bounce effects
  - Professional modal system with swipe gestures and keyboard navigation
- **Purchase-to-Delivery Flow**: Complete end-to-end purchase workflow from package selection to QR code delivery:
  - Checkout modal with multiple payment methods (Apple Pay, Card, AMEX, PayPal, Crypto)
  - Design-focused purchase API that always succeeds for prototype purposes
  - Automatic navigation to QR code page upon purchase completion
  - Real-time purchase tracking with console debugging capabilities
- **Device Detection**: Advanced multi-method device detection for optimizing user experience and future native app readiness.
- **Sharing System**: Native sharing capabilities with platform detection (iOS, Android) and fallbacks to clipboard.

## External Dependencies

### Core Framework Dependencies
- `@tanstack/react-query`: Server state management and caching.
- `wouter`: Lightweight client-side routing.
- `drizzle-orm`: Type-safe ORM for PostgreSQL.
- `@neondatabase/serverless`: PostgreSQL database connection.

### UI/UX Dependencies
- `@radix-ui/*`: Headless UI components for accessibility.
- `tailwindcss`: Utility-first CSS framework.
- `class-variance-authority`: Component variant management.
- `lucide-react`: Icon library.

### Development Dependencies
- `vite`: Build tool and development server.
- `typescript`: Type checking and compilation.
- `tsx`: TypeScript execution for development.