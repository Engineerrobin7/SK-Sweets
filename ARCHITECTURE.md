# SK Sweets - Technical Architecture & Design Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  (React 19, Next.js 16, Tailwind CSS, shadcn/ui)           │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    (HTTP/REST API)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         API Routes (/api/*)                         │   │
│  │  - Authentication (register, login, logout)         │   │
│  │  - Menu Management (CRUD)                           │   │
│  │  - Orders (create, read, update)                    │   │
│  │  - Bookings (create, read)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Middleware & Utilities                      │   │
│  │  - JWT Authentication & Cookies                     │   │
│  │  - Zod Validation                                   │   │
│  │  - Error Handling & Logging                         │   │
│  │  - Database Connection Pooling                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    (MongoDB Wire Protocol)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                       │   │
│  │  - users (with indexes on username, email)          │   │
│  │  - menu_items (with text search index)              │   │
│  │  - orders (with userId, createdAt, status)          │   │
│  │  - bookings (with userId, status, eventDate)        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User Signup/Login
   │
   ├─→ POST /api/auth/register | /api/auth/login
   │
   ├─→ Validate with Zod schemas
   │
   ├─→ Check username/email in MongoDB
   │
   ├─→ Hash password with bcryptjs (if registering)
   │
   ├─→ Verify password with bcryptjs (if logging in)
   │
   ├─→ Generate JWT token (expires in 7 days)
   │
   ├─→ Set HTTP-only, Secure cookie
   │
   └─→ Return user data + 200 OK

2. Authenticated Requests
   │
   ├─→ Browser sends cookie automatically
   │
   ├─→ API routes call getAuthFromCookie()
   │
   ├─→ JWT verified and decoded
   │
   ├─→ User ID and role available in route
   │
   └─→ Process request with auth context

3. Logout
   │
   ├─→ POST /api/auth/logout
   │
   ├─→ Delete auth cookie
   │
   └─→ Clear user from Zustand store
```

## Data Flow - Shopping Cart

```
Customer Browse Menu
   ↓
GET /api/menu
   ↓
MongoDB returns menu_items (with pagination)
   ↓
Display in React component
   ↓
Customer clicks "Add to Cart"
   ↓
Zustand store updates (addToCart)
   ↓
Data persists to localStorage
   ↓
Cart count updates in Navbar
   ↓
Customer goes to checkout
   ↓
POST /api/orders (requires auth)
   ├─ Validate with orderSchema (Zod)
   ├─ Link order to authenticated user (userId)
   ├─ Create order in MongoDB
   └─ Clear cart from Zustand & localStorage
   ↓
Redirect to /order-confirmation
   ↓
Customer can view orders at /orders (filtered by userId)
```

## Data Flow - Admin Dashboard

```
Admin Login
   ├─ POST /api/auth/login
   ├─ Verify admin role in response
   └─ Redirect to /admin/dashboard
   ↓
Admin Dashboard Loads
   ├─ GET /api/orders (admin sees all)
   ├─ GET /api/bookings (admin sees all)
   └─ Display statistics
   ↓
Admin Updates Order Status
   ├─ PATCH /api/orders/{id}
   ├─ Validate admin role (required)
   ├─ Update status in MongoDB
   └─ Return success response
   ↓
Admin Creates Menu Item
   ├─ POST /api/menu
   ├─ Validate menu item schema
   ├─ Check admin role
   ├─ Insert into menu_items collection
   └─ Return created item with _id
```

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "username": "string (unique)",
  "email": "string (unique, email format)",
  "password": "string (hashed with bcryptjs)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "role": "user | admin",
  "createdAt": "Date"
}

// Indexes
- username: unique
- email: unique
- role: regular
```

### Menu Items Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "hindiName": "string (optional)",
  "description": "string",
  "price": "number (positive, in rupees)",
  "category": "Traditional | Seasonal | Premium | Bulk | Gift Packs",
  "image": "string (URL)",
  "available": "boolean",
  "createdAt": "Date"
}

// Indexes
- category: regular
- name + hindiName + description: text (for search)
- available: regular
```

### Orders Collection
```json
{
  "_id": ObjectId,
  "userId": "ObjectId (references users._id)",
  "items": [
    {
      "_id": "ObjectId",
      "name": "string",
      "price": "number",
      "quantity": "number"
    }
  ],
  "customerInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string"
  },
  "total": "number",
  "status": "pending | processing | shipped | delivered | cancelled",
  "createdAt": "Date",
  "updatedAt": "Date (optional)"
}

// Indexes
- userId: regular
- createdAt: descending
- status: regular
- userId + createdAt: compound (for user order history)
```

### Bookings Collection
```json
{
  "_id": ObjectId,
  "userId": "ObjectId (references users._id)",
  "companyName": "string",
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "eventDate": "string (ISO datetime)",
  "guestCount": "number",
  "eventType": "string",
  "sweetTypes": ["string"],
  "quantity": "number",
  "occasion": "string (optional)",
  "message": "string (optional)",
  "totalPrice": "number",
  "status": "confirmed | pending | cancelled",
  "createdAt": "Date"
}

// Indexes
- userId: regular
- createdAt: descending
- status: regular
- eventDate: regular
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────────────────────────────┐
│   Request with Cookie                   │
├─────────────────────────────────────────┤
│   GET /api/protected-endpoint            │
│   Cookie: auth-token=<JWT_TOKEN>        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   getAuthFromCookie()                   │
├─────────────────────────────────────────┤
│   1. Extract token from cookie          │
│   2. Verify signature with JWT_SECRET   │
│   3. Decode JWT payload                 │
│   4. Return { userId, username, role }  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Check Authorization                   │
├─────────────────────────────────────────┤
│   if (auth.role !== 'admin') {         │
│     return 401 Unauthorized             │
│   }                                     │
└─────────────────────────────────────────┘
              ↓
        Process Request
```

### Password Security
```
Registration: password → bcryptjs.hash() → hashed → stored in DB

Login: 
  input_password + stored_hash → bcryptjs.compare() → true/false

Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
```

### Input Validation
```
Request Data
    ↓
Zod Schema Parsing
    ├─ Type checking
    ├─ Format validation
    ├─ Custom validations (email, phone, etc)
    └─ Returns SafeParseResult
    ↓
If invalid → Return 400 with error details
If valid → Process request
```

## State Management (Zustand)

```
Store Structure:
┌──────────────────────────────────┐
│   useStore                       │
├──────────────────────────────────┤
│   Auth State:                    │
│   - user: User | null            │
│   - isAuthenticated: boolean     │
│   - setUser(user)                │
│   - logout()                     │
│                                  │
│   Cart State:                    │
│   - cart: CartItem[]             │
│   - addToCart(item, qty)         │
│   - removeFromCart(itemId)       │
│   - updateCartQuantity(id, qty)  │
│   - clearCart()                  │
│   - getCartTotal(): number       │
│                                  │
│   UI State:                      │
│   - isLoading: boolean           │
│   - setLoading(bool)             │
└──────────────────────────────────┘
         ↓
    Persist to localStorage
         ↓
   Cart data only (for security)
```

## Error Handling Strategy

```
API Layer:
  try {
    validate input with Zod
    check authentication
    perform database operation
    return success response
  } catch (error) {
    logger.error('Operation failed', error)
    return 500 error response
  }

Frontend Layer:
  try {
    fetch('/api/endpoint')
    handle response
  } catch (error) {
    setError(error.message)
    display error to user
  }

Global Error Boundary:
  Catches React component errors
  Displays error.tsx fallback
  Prevents white screen of death
```

## Performance Optimization

### Database Optimization
```
Connection Pooling:
  ├─ maxPoolSize: 10
  ├─ minPoolSize: 2
  └─ Connection reuse

Indexes:
  ├─ users: username, email (unique)
  ├─ menu_items: category, text search
  ├─ orders: userId, createdAt, status
  └─ bookings: userId, status, eventDate

Pagination:
  ├─ Default: 10 items per page
  ├─ Max: 100 items per page
  └─ Cursor-free offset-based
```

### Code Optimization
```
Next.js Features:
  ├─ Static generation where possible
  ├─ Image optimization enabled
  ├─ Code splitting automatic
  └─ CSS minification

Client-Side:
  ├─ Zustand for efficient state
  ├─ Only cart persists (small)
  ├─ React 19 concurrent features
  └─ Tailwind CSS purging
```

## Deployment Architecture

```
Production Setup:
┌─────────────────────────────────────┐
│   Vercel Edge Network (CDN)         │
│   ├─ Global edge caching            │
│   ├─ Automatic SSL/TLS              │
│   └─ DDoS protection                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Vercel Serverless Functions       │
│   ├─ Auto-scaling                   │
│   ├─ Pay-per-request                │
│   └─ Automatic deployments          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   MongoDB Atlas (Cloud)             │
│   ├─ Geo-distributed clusters       │
│   ├─ Automated backups              │
│   ├─ Built-in security              │
│   └─ Scalable storage               │
└─────────────────────────────────────┘
```

## Scalability Considerations

### Current Capacity
- MongoDB Atlas (free tier): up to 512MB
- Vercel (free): 1000GB bandwidth/month
- Handles ~1000 concurrent users comfortably

### Scaling Options
```
If traffic increases:
1. Upgrade MongoDB tier (paid)
2. Enable MongoDB sharding
3. Add Redis cache layer
4. Use CDN for static assets
5. Implement rate limiting

If database grows:
1. Archive old orders
2. Implement data retention policies
3. Add more indexes for frequent queries
```

## Security Best Practices Implemented

✅ **Authentication**
- JWT tokens (7-day expiration)
- HTTP-only cookies (prevents XSS)
- Password hashing with bcryptjs

✅ **Authorization**
- Role-based access control (user/admin)
- User isolation (can only see own orders)
- Admin-only endpoints protected

✅ **Input Validation**
- Zod schemas for all endpoints
- Type checking and format validation
- Prevents injection attacks

✅ **Data Protection**
- Only cart persists to localStorage
- User data stored securely
- Passwords never exposed
- Connection pooling for DB

✅ **Environment Management**
- Secrets in .env.local (not committed)
- Different configs for dev/prod
- No hardcoded credentials

## Future Enhancements

```
Short Term (1-2 weeks):
  - Rate limiting on auth endpoints
  - Email notifications for orders
  - Password reset functionality
  - Admin activity logging

Medium Term (1-2 months):
  - Two-factor authentication
  - Payment gateway integration
  - SMS notifications
  - Order tracking with timeline
  - Inventory management

Long Term (3-6 months):
  - Mobile app (React Native)
  - Analytics dashboard
  - Machine learning recommendations
  - Multi-language support
  - Advanced search with filters
```

## Monitoring & Debugging

```
Development:
  - Next.js dev console
  - Browser DevTools
  - MongoDB Compass GUI
  - Email logs to terminal

Production:
  - Vercel Analytics
  - MongoDB Atlas monitoring
  - Error tracking (Sentry)
  - Custom logging to file
  - Performance metrics
```

---

**Document Version:** 1.0
**Last Updated:** May 27, 2026
**Author:** SK Sweets Development Team
