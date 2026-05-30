import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Menu schemas
export const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  hindiName: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Invalid image URL'),
  available: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(4.5),
  weightOptions: z.array(z.string()).default(['250g', '500g', '1kg']),
});

// Booking schemas
export const bookingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  eventDate: z.string().datetime('Invalid date'),
  guestCount: z.string().transform(Number).pipe(z.number().min(1, 'Guest count must be at least 1')),
  eventType: z.string().min(1, 'Event type is required'),
  sweetTypes: z.array(z.string()).min(1, 'Select at least one sweet type'),
  quantity: z.string().transform(Number).pipe(z.number().min(1, 'Quantity must be at least 1')),
  occasion: z.string().optional(),
  message: z.string().optional(),
});

// Order schemas
export const orderSchema = z.object({
  items: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().positive(),
  })).min(1, 'Order must contain at least one item'),
  customerInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().regex(/^\d{5,6}$/, 'Invalid postal code'),
  }),
  total: z.number().positive('Total must be positive'),
  giftMessage: z.string().max(200, 'Message is too long').optional(),
  couponCode: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
