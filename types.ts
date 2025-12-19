export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export enum CheckoutStep {
  AUTH = 0,
  SHIPPING = 1,
  PAYMENT = 2,
  SUCCESS = 3
}

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'Delivered' | 'Processing' | 'Shipped';
  date: string;
}