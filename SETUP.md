# SK Sweets - Website Setup Guide

## Overview

This is a full-stack e-commerce website for SK Sweets, a premium Indian sweet manufacturer. Built with Next.js, MongoDB, and React. Includes customer-facing features (menu, ordering, bulk orders) and an admin dashboard.

## Features

### Customer Features
- User authentication (signup/login)
- Browse sweet menu with filtering and search
- Shopping cart and checkout
- Order tracking
- Corporate bulk orders with pricing
- User profile management
- Wishlist functionality

### Admin Features
- Secure admin dashboard (role-based access)
- Dashboard with analytics
- Order management and status updates
- Bulk order/booking management
- Menu item management
- Revenue tracking

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- MongoDB instance (local or cloud)

## Installation & Setup

### 1. Install Dependencies
```bash
pnpm install
```

**Important:** Also install Zod for validation:
```bash
pnpm add zod
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sk_sweets

# Database name
DB_NAME=sk_sweets

# JWT Secret - MUST be a strong random string in production!
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-strong-random-secret-key-here

# Node Environment
NODE_ENV=development
```

**⚠️ IMPORTANT SECURITY NOTES:**
- **JWT_SECRET**: Generate a strong random secret for production. Never use the default value.
- **MONGODB_URI**: Use environment variables for credentials. Never commit credentials to version control.
- **Node.js Crypto**: Generate JWT secret using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**For MongoDB:**
- **Local**: Install MongoDB Community Edition or use Docker
- **Atlas**: Get your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 3. Initialize Database

Run the initialization script to create collections and seed data:

```bash
pnpm ts-node scripts/init-db.ts
```

This will:
- Create collections (users, menu_items, orders, bookings)
- Create sample data and indexes
- Set up admin user (credentials provided during setup)

### 4. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Usage

### Public Pages
- **Home** (`/`): Welcome page with featured sweets
- **Menu** (`/menu`): Browse and search sweet products
- **Corporate Orders** (`/bookings`): Bulk order form with discounts
- **About** (`/about`): Company information
- **Contact** (`/contact`): Contact form and FAQ
- **Login** (`/auth/login`): Customer login
- **Signup** (`/auth/signup`): Create new account

### Customer Flow
1. Sign up or login at `/auth/login`
2. Browse menu at `/menu`
3. Add items to cart
4. Proceed to checkout at `/checkout`
5. Place order
6. Track orders at `/orders`
7. Manage profile at `/profile`

### Admin Flow
1. Go to `/admin/login`
2. Enter admin credentials (provided in init-db.ts output)
3. Access admin dashboard at `/admin/dashboard`
4. Manage orders, bookings, and menu items

## Project Structure

```
app/
├── (main)/              # Customer pages
│   ├── page.tsx        # Home
│   ├── menu/           # Menu browsing
│   ├── bookings/       # Corporate orders
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout page
│   ├── orders/         # Order history
│   ├── profile/        # User profile
│   ├── about/          # About page
│   └── contact/        # Contact page
├── auth/               # Authentication pages
│   ├── login/
│   └── signup/
├── admin/              # Admin dashboard
│   ├── login/
│   └── dashboard/
└── api/                # Backend APIs
    ├── auth/           # Authentication
    ├── menu/           # Menu operations
    ├── orders/         # Order management
    └── bookings/       # Booking management

components/
├── Navbar.tsx          # Navigation component
├── theme-provider.tsx  # Theme provider
└── ui/                 # shadcn components

lib/
├── db.ts              # Database connection (with pooling)
├── auth.ts            # Authentication utilities
├── validation.ts      # Zod validation schemas
├── constants.ts       # App constants
└── logger.ts          # Logging utility

store/
└── useStore.ts        # Zustand state management

scripts/
└── init-db.ts         # Database initialization
```

## Key Technologies

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with connection pooling
- **Authentication**: JWT with HTTP-only cookies (secure)
- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion

## Authentication

The app uses JWT (JSON Web Tokens) with HTTP-only cookies for secure authentication.

### Login Flow
1. User submits credentials
2. Server validates against MongoDB
3. JWT token generated and stored in HTTP-only cookie
4. Token automatically sent with requests
5. Server verifies token on protected routes

### Creating New Admin User

To create additional admin users, update the `scripts/init-db.ts` file or use MongoDB directly:

```javascript
db.users.insertOne({
  username: "newadmin",
  email: "admin@example.com",
  password: bcryptjs.hashSync("password123", 10),
  role: "admin",
  createdAt: new Date()
})
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu` - Get menu items (supports ?category filter)
- `POST /api/menu` - Create menu item (admin only)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/[id]` - Update booking status (admin only)

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings
4. Deploy automatically on push

### Other Platforms
1. Build: `pnpm build`
2. Start: `pnpm start`
3. Ensure MongoDB URI is accessible from deployment platform

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running locally or check Atlas connection string
- Ensure `MONGODB_URI` in `.env.local` is correct
- Check firewall settings if using MongoDB Atlas

### Admin Access
- Admin account: `itzsahil123` / `itzsahil1234`
- Must be created via `scripts/init-db.ts`
- Admin role must be set to `'admin'` in database

### Authentication Issues
- Clear browser cookies and try again
- Check `JWT_SECRET` is set in environment variables
- Verify token expiration (set to 7 days by default)

## Development Tips

### Adding Menu Items
Menu items can be added through MongoDB or via API once admin authentication is implemented.

### Customizing Colors
Edit `app/globals.css` and `tailwind.config.ts` to change the color scheme. Currently uses an Indian cultural aesthetic with amber and orange tones.

### Modifying Database
Collections are defined in `scripts/init-db.ts`. Modify and re-run script to reset database.

## Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- MongoDB passwords should be strong
- Enable MongoDB authentication
- Use environment variables for sensitive data
- Implement rate limiting for APIs in production

## Future Enhancements

- Email notifications for orders
- Payment gateway integration (Stripe)
- Real-time order tracking
- Customer reviews and ratings
- Loyalty program
- Multi-language support
- Analytics dashboard improvements
- SMS notifications

## Support

For issues or questions, refer to the documentation for individual packages:
- [Next.js](https://nextjs.org/docs)
- [MongoDB](https://docs.mongodb.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)
