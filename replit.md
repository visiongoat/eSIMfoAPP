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