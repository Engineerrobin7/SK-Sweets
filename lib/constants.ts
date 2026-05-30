// Shipping and pricing constants
export const SHIPPING_COST = 50; // in rupees
export const TAX_RATE = 0.1; // 10% tax

// Bulk order discounts
export const BULK_DISCOUNTS = [
  { min: 1000, discount: 0.15 },
  { min: 500, discount: 0.1 },
  { min: 100, discount: 0.05 },
];

// Base menu item price
export const BASE_MENU_PRICE = 150; // in rupees

// Auth settings
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
export const COOKIE_NAME = 'auth-token';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
