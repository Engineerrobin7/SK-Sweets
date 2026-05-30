# SK Sweets - Premium Indian Sweet Manufacturer Website

## 🎉 Project Overview

SK Sweets is a beautiful, modern e-commerce website for a premium Indian sweet manufacturer. The website showcases traditional sweets with a contemporary design, featuring saffron, gold, and green color scheme inspired by Indian heritage.

**Admin Credentials:**
- Username: `itzsahil123`
- Password: `itzsahil1234`

---

## 🌟 Key Features

### 1. **Public-Facing Pages (No Login Required)**
- **Home**: Stunning hero section with featured sweets, benefits, and customer testimonials
- **Menu**: Beautiful sweet product cards with Hindi names, categories (Traditional, Seasonal, Premium, Bulk, Gift Packs), and wishlist functionality
- **Corporate Orders**: Advanced bulk order form with quantity-based discount calculator and sweet selection interface
- **About**: Company story, master artisans, values, and certifications
- **Contact**: Complete contact information, FAQ, and inquiry form

### 2. **Design & UX**
- **Color Scheme**: Saffron (#E6A422), White, Green (#2D5016), with Gold accents
- **Typography**: Elegant serif fonts for headings, clean sans-serif for body
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Smooth Animations**: Hover effects, transitions, and interactive elements
- **Visual Elements**: Generated sweet imagery, gradient backgrounds, card-based layouts

### 3. **Shopping Cart**
- Guest cart support using localStorage (no login needed)
- Persistent cart across browser sessions
- Real-time cart count display in navbar
- Beautiful cart/checkout pages

### 4. **Navigation**
- Fixed, elegant navbar with SK Sweets branding
- Responsive mobile menu
- Quick links to all main pages
- Cart and user profile access
- Sign In/Sign Up buttons for optional authentication

### 5. **Product Features**
- Sweet varieties with Hindi names
- Detailed descriptions
- Wishlist/favorite functionality
- Category filtering
- Search functionality
- Special pricing for bulk orders

### 6. **Corporate Orders System**
- Company information collection
- Event details and date selection
- Guest count and quantity fields
- Sweet selection with multi-select
- Real-time price calculation with bulk discounts:
  - 5% off for 100+ units
  - 10% off for 500+ units
  - 15% off for 1000+ units
- Special requirements form

### 7. **Admin Features**
- Protected admin dashboard
- Menu item management
- Order management
- Reservation/booking management
- Analytics and statistics
- User activity tracking

### 8. **Authentication**
- JWT-based authentication with HTTP-only cookies
- Secure password hashing with bcryptjs
- User registration and login
- Optional for browsing/shopping (guests can add to cart)
- Required for order placement and order tracking

---

## 📁 Project Structure

```
/app
  /(main)
    ├── page.tsx              # Home page
    ├── menu/page.tsx         # Menu & sweets catalog
    ├── bookings/page.tsx     # Corporate orders form
    ├── about/page.tsx        # About us
    ├── contact/page.tsx      # Contact & FAQ
    ├── cart/page.tsx         # Shopping cart
    ├── checkout/page.tsx     # Order checkout
    ├── order-confirmation/   # Order confirmation page
    ├── profile/page.tsx      # User profile
    └── orders/page.tsx       # Order history
  
  /auth
    ├── login/page.tsx        # Customer login
    └── signup/page.tsx       # Customer registration
  
  /admin
    ├── login/page.tsx        # Admin login
    └── dashboard/page.tsx    # Admin panel
  
  /api
    ├── /auth
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   └── me/route.ts
    ├── /menu/route.ts        # Menu items CRUD
    ├── /orders/route.ts      # Order management
    └── /bookings/route.ts    # Booking management

/components
  └── Navbar.tsx             # Main navigation

/store
  └── useStore.ts            # Zustand store for cart & auth

/lib
  ├── db.ts                  # MongoDB connection
  └── auth.ts                # JWT utilities

/public
  ├── sweets-hero.jpg        # Generated hero image
  └── sweets-collection.jpg  # Generated sweets image
```

---

## 🎨 Design System

### Colors
- **Primary**: Saffron (#E6A422) - Brand color
- **Secondary**: Forest Green (#2D5016) - Accent
- **Tertiary**: Gold (#C9A961) - Highlights
- **Background**: Warm Cream (#F9F7F2)
- **Foreground**: Deep Brown (#2A1810)

### Typography
- **Headings**: Serif font (elegant, traditional)
- **Body**: Sans-serif (clean, modern)
- **Font Scale**: 5xl for major headings, 2xl for sections, base for body

### Components
- Card-based layouts
- Hover effects with smooth transitions
- Gradient backgrounds (subtle)
- Rounded corners (medium-large radius)
- Box shadows for depth
- Icon integration with Lucide React

---

## 🔧 Tech Stack

- **Frontend**: React 19 + Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + Custom CSS
- **State Management**: Zustand with localStorage persistence
- **Authentication**: JWT + bcryptjs
- **Database**: MongoDB
- **UI Components**: shadcn/ui + custom components
- **Icons**: Lucide React
- **Images**: Next.js Image + Generated images

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)

### Installation

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   Create `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_for_jwt
   ```

3. **Initialize the database**
   ```bash
   pnpm ts-node scripts/init-db.ts
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open browser**
   Visit `http://localhost:3000`

---

## 📝 Sweet Categories

### Available Sweets
- **Traditional**: Gulab Jamun, Rasgulla, Burfi, Laddu, Jalebi, Kheer, Barfi Mix
- **Seasonal**: Limited-time specials
- **Premium**: High-end varieties with superior ingredients
- **Bulk**: Wholesale quantities with discounts
- **Gift Packs**: Curated assortments for gifting

---

## 💳 Pricing Structure

- **Base Price**: ₹150 per piece
- **Bulk Discounts**:
  - 100-499 pieces: 5% discount
  - 500-999 pieces: 10% discount
  - 1000+ pieces: 15% discount

---

## 📊 Admin Dashboard Features

- Order management with status updates
- Reservation/booking tracking
- Analytics with charts and statistics
- Menu item management
- User activity monitoring
- Revenue reports
- Quick action buttons

---

## ✨ Highlights

1. **No Login Required for Browsing**: Visitors can explore menu and add items to cart without creating an account
2. **Persistent Guest Cart**: Cart stored in localStorage survives page reloads
3. **Beautiful Typography**: Serif fonts for traditional feel, clean sans-serif for readability
4. **Responsive Mobile**: Optimized for all screen sizes
5. **Wishlist Feature**: Save favorite sweets for later
6. **Smart Bulk Pricing**: Real-time discount calculation in corporate orders
7. **Authentic Details**: Hindi sweet names, Indian cultural aesthetics
8. **Professional Polish**: Smooth animations, hover effects, micro-interactions
9. **Comprehensive Content**: Detailed about page, FAQ, testimonials
10. **Security**: Secure authentication, password hashing, protected admin routes

---

## 🎯 User Journeys

### Guest Shopper
1. Land on home page → Browse featured sweets
2. Visit menu → Filter by category → Search by name
3. View sweet details → Add to cart → Continue shopping
4. View cart → Proceed to checkout (may need to sign up)
5. Complete order

### Corporate Buyer
1. Navigate to Corporate Orders
2. Fill in company and event details
3. Select sweet varieties
4. Enter quantity → See real-time discount
5. Submit inquiry → Receive quotation call

### Admin
1. Log in at `/admin/login`
2. Access dashboard
3. View orders, manage inventory
4. Process bulk orders
5. Track analytics

---

## 🔐 Security Features

- JWT-based authentication
- Secure password hashing (bcryptjs)
- HTTP-only cookies for tokens
- Protected admin routes
- Input validation
- Database connection security
- Environment variable management

---

## 📦 Deployment Ready

This website is ready to deploy to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS**
- **Docker containers**

Simply push to GitHub and connect to your deployment platform.

---

## 🎓 Learning Resources

The code follows best practices for:
- Component composition
- State management
- Form handling
- Authentication flows
- Database integration
- Error handling
- Responsive design
- Accessibility

---

## 🤝 Support

For issues or questions:
- Check the Contact page
- Email: orders@sksweets.com
- Phone: +91 98765-43210

---

## 📄 License

This project is custom-built for SK Sweets.

---

**Built with love for SK Sweets** 🍭✨
