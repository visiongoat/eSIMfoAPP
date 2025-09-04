# eSIM Mobile App

A comprehensive mobile-first eSIM management application that enables users to browse, purchase, and manage eSIM packages globally. Built with modern full-stack architecture and includes advanced gamification features.

## 🌟 Features

### Core Functionality
- **Global eSIM Packages**: Browse and purchase eSIM packages for 195+ countries
- **Real-time Package Management**: View data usage, expiration dates, and activation status
- **QR Code Generation**: Instant QR codes for eSIM activation with tap-to-save functionality
- **Multi-eSIM Management**: Handle multiple active eSIMs simultaneously
- **Real-time Geolocation**: Automatic country detection using dual API system

### Advanced Features
- **Traveler Levels Gamification**: 4-tier spending-based ranking system with exclusive benefits
  - 🌍 Traveler (€0-49.99) - Default starting level
  - ✈️ Explorer (€50-199.99) - €1 bonus credit and priority support
  - 🗺️ Expert Traveler (€200-499.99) - 5% extra credit earnings and VIP support
  - 🏆 Globetrotter (€500+) - Premium support and exclusive promotions
- **Smart Filtering**: Filter eSIMs by status (All, Ready to Activate, Active, Expired)
- **Balance Management**: fo Balance system with transaction history
- **Referral System**: Invite friends and earn €3 credits
- **Dark Mode Support**: Complete dark/light theme with auto-detection
- **Manual Installation Guide**: Alternative setup methods with ICCID and activation codes

### User Experience
- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **Apple-style Animations**: Smooth slide transitions and touch feedback
- **Multi-layered Parallax**: Advanced onboarding experience
- **Real-time Notifications**: Smart alerts for data usage (80% threshold)
- **Professional Error Handling**: Network error handling with retry functionality

## 🛠 Tech Stack

### Frontend
- **React 18** with **Vite** for fast development and building
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling and components
- **TanStack Query (React Query)** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Radix UI** for accessible headless components

### Backend
- **Express.js** REST API server with TypeScript
- **Drizzle ORM** for type-safe PostgreSQL operations
- **PostgreSQL** database (Neon-compatible)
- **RESTful API** architecture with clear data access layer

### Development & Deployment
- **Vite** for development server and build tooling
- **ESBuild** for fast transpilation
- **Replit** deployment ready
- **Environment variables** for configuration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd esim-mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/esim_db
   
   # Development
   NODE_ENV=development
   PORT=5000
   
   # Optional: For production deployment
   REPL_ID=your-repl-id
   REPLIT_DOMAINS=your-domain.replit.app
   ```

4. **Database Setup**
   
   The database schema will be automatically created when you first run the application. The app includes:
   - User management tables
   - Country and package data
   - eSIM management
   - Transaction history
   - Traveler levels tracking

5. **Start the application**
   ```bash
   npm run dev
   ```

   This starts both the Express server and Vite development server on port 5000.

6. **Access the application**
   - Local: `http://localhost:5000`
   - The app automatically serves the frontend and API on the same port

## 🏗 Project Structure

```
esim-mobile-app/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── mobile-container.tsx
│   │   │   ├── navigation-bar.tsx
│   │   │   ├── tab-bar.tsx
│   │   │   └── esim-card.tsx
│   │   ├── pages/            # Application pages
│   │   │   ├── home.tsx      # Main dashboard
│   │   │   ├── my-esims.tsx  # eSIM management
│   │   │   ├── profile.tsx   # User profile
│   │   │   ├── packages.tsx  # Package browsing
│   │   │   ├── purchase.tsx  # Purchase flow
│   │   │   ├── qr-code.tsx   # QR code display
│   │   │   └── traveler-levels.tsx # Gamification
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configurations
│   │   ├── contexts/         # React contexts (theme, etc.)
│   │   └── App.tsx           # Main app component
├── server/                   # Backend Express application
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database operations
│   ├── db.ts                # Database connection
│   └── index.ts             # Server entry point
├── shared/                  # Shared types and schemas
│   └── schema.ts            # Database schema and types
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── drizzle.config.ts       # Database migration configuration
└── README.md
```

## 🎯 API Endpoints

### Core Endpoints
- `GET /api/countries` - Get all available countries
- `GET /api/packages/popular` - Get popular eSIM packages
- `GET /api/packages/:countryId` - Get packages for specific country
- `GET /api/esims` - Get user's eSIMs
- `POST /api/esims/:packageId/purchase` - Purchase eSIM package
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Advanced Features
- `GET /api/transactions` - Get transaction history
- `POST /api/balance/add` - Add balance to account
- `GET /api/traveler-levels` - Get all traveler levels
- `POST /api/referrals` - Create referral

## 🎮 Gamification System

The app includes a comprehensive traveler levels system:

### Level Calculation
- Levels are based on total spending amount
- Progress tracking with visual indicators
- Automatic level upgrades
- Benefits unlock at each tier

### Benefits by Level
- **Traveler**: Standard support
- **Explorer**: €1 bonus credit + priority support
- **Expert Traveler**: 5% extra credit earnings + VIP support
- **Globetrotter**: Premium support + exclusive promotions

## 🎨 Design System

### Color Scheme
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Primary font: System fonts (optimized for mobile)
- Font sizes: Responsive scale from 12px to 32px
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- Mobile-first responsive design
- Touch-friendly interactive elements
- Consistent spacing using Tailwind's spacing scale
- Accessible color contrasts and focus states

## 🔧 Development

### Available Scripts

```bash
# Development server (starts both frontend and backend)
npm run dev

# Build for production
npm run build

# Database migrations
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

### Development Features
- Hot module replacement (HMR)
- TypeScript type checking
- Automatic server restart on changes
- Console logging for debugging
- Mobile viewport debugging

## 📱 Mobile Optimization

### Performance
- Optimized bundle size with code splitting
- Lazy loading for non-critical components
- Efficient image loading and caching
- Smooth animations with hardware acceleration

### User Experience
- Touch-friendly interface design
- Swipe gesture support
- Responsive layouts for all screen sizes
- Offline-capable PWA features

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Import project to Replit
2. Set environment variables in Replit Secrets
3. The app automatically configures for Replit hosting
4. Supports Replit Database integration

### Traditional Hosting
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy the `dist` folder and server files

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
PORT=5000
REPL_ID=your-repl-id (for Replit hosting)
REPLIT_DOMAINS=your-domain.replit.app (for Replit hosting)
```

## 🧪 Testing

The application includes comprehensive error handling and logging:
- Network error recovery
- Database connection testing
- API endpoint validation
- Mobile device compatibility testing

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support or questions:
- Email: support@esimfo.com
- WhatsApp: +43 676 644 0122

## 🔄 Version History

### v1.2.3 (Current)
- ✅ Implemented Traveler Levels gamification system
- ✅ Added smart filtering for eSIM management
- ✅ Enhanced mobile responsiveness
- ✅ Removed Help Center to reduce project complexity
- ✅ Improved QR code functionality with tap-to-save
- ✅ Real geolocation system with dual API support
- ✅ Complete dark mode implementation

### v1.2.2
- Enhanced error handling and user feedback
- Improved purchase flow with multiple payment methods
- Added manual installation system

### v1.2.1
- Initial mobile-first implementation
- Core eSIM management features
- Basic profile and balance management

---

**Made with ❤️ for travelers worldwide**