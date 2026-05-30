# SK Sweets - Developer Guide

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Initialize database
pnpm ts-node scripts/init-db.ts

# Create indexes
pnpm ts-node scripts/create-indexes.ts

# Start development
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
SK Sweets/
├── app/
│   ├── (main)/           # Customer-facing pages
│   │   ├── page.tsx      # Home page
│   │   ├── menu/         # Product menu
│   │   ├── bookings/     # Corporate orders
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Payment page
│   │   ├── orders/       # Order history
│   │   ├── profile/      # User profile
│   │   ├── about/        # About page
│   │   └── contact/      # Contact page
│   ├── auth/             # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── admin/            # Admin dashboard
│   │   ├── login/
│   │   └── dashboard/
│   ├── api/              # REST API endpoints
│   │   ├── auth/         # Authentication
│   │   ├── menu/         # Menu management
│   │   ├── orders/       # Order management
│   │   └── bookings/     # Booking management
│   ├── error.tsx         # Error boundary
│   ├── not-found.tsx     # 404 page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
│
├── components/
│   ├── Navbar.tsx        # Navigation component
│   ├── theme-provider.tsx# Theme setup
│   └── ui/               # shadcn/ui components
│
├── lib/
│   ├── auth.ts          # JWT & authentication
│   ├── db.ts            # Database connection
│   ├── constants.ts     # App constants
│   ├── validation.ts    # Zod validation schemas
│   ├── logger.ts        # Logging utility
│   └── utils.ts         # Helper functions
│
├── store/
│   └── useStore.ts      # Zustand state management
│
├── scripts/
│   ├── init-db.ts       # Database initialization
│   └── create-indexes.ts # Create DB indexes
│
├── public/              # Static assets
├── styles/              # CSS files
│
├── SETUP.md             # Setup instructions
├── IMPROVEMENTS_SUMMARY.md # What was fixed
└── DEPLOYMENT_CHECKLIST.md # Pre-deployment steps
```

## Key Technologies

- **Next.js 16**: React framework with API routes
- **MongoDB**: Document database
- **Zustand**: Lightweight state management
- **Zod**: TypeScript-first schema validation
- **JWT**: Secure authentication
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: Headless component library

## Authentication Flow

```
User Registration/Login
     ↓
POST /api/auth/register | /api/auth/login
     ↓
Validate with Zod schemas
     ↓
Hash password (bcryptjs)
     ↓
Generate JWT token
     ↓
Set HTTP-only cookie
     ↓
Client stores in Zustand (NOT localStorage for user data)
     ↓
Subsequent requests use cookie for auth
```

## Database Connection

Connection pooling enabled with:
- Max 10 connections
- Min 2 connections
- Automatic reconnection
- Connection reuse

**To get DB instance:**
```typescript
import { getDb } from '@/lib/db';

const db = await getDb();
const collection = db.collection('users');
```

## Validation

All API endpoints use Zod schemas from `lib/validation.ts`:

```typescript
import { registerSchema, loginSchema, menuItemSchema, bookingSchema, orderSchema } from '@/lib/validation';

// Example usage
const result = registerSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { error: 'Invalid data', details: result.error.errors },
    { status: 400 }
  );
}
```

## State Management (Zustand)

Store located in `store/useStore.ts`:

```typescript
import { useStore } from '@/store/useStore';

// In components
const cart = useStore((state) => state.cart);
const addToCart = useStore((state) => state.addToCart);
const user = useStore((state) => state.user);

// Persists: cart only (NOT user data for security)
```

## Logging

Use logger utility instead of console:

```typescript
import { logger } from '@/lib/logger';

logger.error('Error message', error);  // Always logged
logger.warn('Warning message', data);  // Always logged
logger.info('Info message', data);     // Dev only
logger.debug('Debug message', data);   // Dev only
```

## Creating API Routes

**Template:**
```typescript
import { getDb } from '@/lib/db';
import { getAuthFromCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { someSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // 1. Check auth if needed
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get request body
    const body = await request.json();

    // 3. Validate with schema
    const validation = someSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    // 4. Process request
    const db = await getDb();
    const collection = db.collection('items');
    const result = await collection.insertOne(validation.data);

    // 5. Log and respond
    logger.info('Item created', { itemId: result.insertedId });
    return NextResponse.json({ _id: result.insertedId.toString(), ...validation.data });
    
  } catch (error) {
    logger.error('Error in POST endpoint', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Creating UI Components

Use shadcn/ui components:

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MyComponent() {
  return (
    <Card className="p-4">
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

## Protected Admin Routes

```typescript
export async function POST(request: NextRequest) {
  const auth = await getAuthFromCookie();
  
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 401 }
    );
  }
  
  // Admin logic here
}
```

## Constants

Keep values in `lib/constants.ts`:

```typescript
import { SHIPPING_COST, TAX_RATE, BULK_DISCOUNTS } from '@/lib/constants';

// Usage
const shipping = SHIPPING_COST; // 50
const tax = total * TAX_RATE; // 0.1
```

## Common Patterns

### Fetch with Auth
```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  credentials: 'include', // Include cookies
});
```

### Error Handling
```typescript
if (!response.ok) {
  const error = await response.json();
  console.error(error.error);
  setError(error.error);
  return;
}
```

### Pagination
```typescript
// Request
?page=1&limit=10

// Response
{
  items: [...],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
}
```

## Testing Locally

```bash
# Register new user
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123456",
  "phone": "+91 98765-43210"
}

# Login
POST /api/auth/login
{
  "username": "testuser",
  "password": "Test123456"
}

# Get menu (public)
GET /api/menu?category=Traditional

# Create order (authenticated)
POST /api/orders
{
  "items": [...],
  "customerInfo": {...},
  "total": 500
}
```

## Performance Tips

1. **Database**: Use indexes created by `create-indexes.ts`
2. **Queries**: Use pagination to limit results
3. **Caching**: Consider Redis for frequently accessed data
4. **Images**: Ensure Next.js image optimization is enabled
5. **Code splitting**: Use React.lazy() for heavy components

## Security Checklist

- ✅ Never commit `.env.local`
- ✅ Always validate input with Zod
- ✅ Always check auth for protected routes
- ✅ Use HTTP-only cookies for auth tokens
- ✅ Hash passwords with bcryptjs
- ✅ Never expose admin credentials
- ✅ Sanitize user input
- ✅ Use prepared statements (MongoDB does this)
- ✅ Rate limit sensitive endpoints (future)
- ✅ Use HTTPS in production

## Debugging

**Check environment variables:**
```bash
# In code
console.log(process.env.JWT_SECRET); // Only in dev
```

**Debug database:**
```bash
# Using MongoDB CLI
mongosh
use sk_sweets
db.users.find().pretty()
db.orders.find().pretty()
```

**Debug API:**
```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123456"}'
```

**Check logs:**
```typescript
// All logs appear in terminal with timestamp
// Production logs handled by platform (Vercel)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `pnpm install`, check TypeScript errors |
| DB connection error | Verify MONGODB_URI, DB_NAME in .env.local |
| Auth not working | Check JWT_SECRET is set, cookies enabled |
| Slow APIs | Create missing indexes with create-indexes.ts |
| Validation errors | Check schema in lib/validation.ts |

## Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Zod Docs](https://zod.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [shadcn/ui](https://ui.shadcn.com)

## Best Practices

1. **Always validate input** with Zod
2. **Always check auth** for protected routes
3. **Always use logger** instead of console
4. **Always handle errors** with try-catch
5. **Always use constants** for repeated values
6. **Always add TypeScript types** to functions
7. **Always add JSDoc comments** to complex functions
8. **Always test locally** before pushing

---

**Happy coding! 🎉**

For questions or issues, refer to SETUP.md and DEPLOYMENT_CHECKLIST.md.
