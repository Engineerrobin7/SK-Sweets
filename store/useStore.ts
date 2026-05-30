import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface MenuItem {
  _id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
}

interface Store {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // UI
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Wishlist Sync
  syncWishlist: () => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) get().syncWishlist();
      },
      logout: () => set({ user: null, isAuthenticated: false }),

      cart: [],
      addToCart: (item, quantity) =>
        set((state) => {
          const existing = state.cart.find((ci) => ci._id === item._id);
          if (existing) {
            return {
              cart: state.cart.map((ci) =>
                ci._id === item._id ? { ...ci, quantity: ci.quantity + quantity } : ci
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity }] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== itemId),
        })),
      updateCartQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      syncWishlist: async () => {
        const localWishlist = JSON.parse(localStorage.getItem('sk-wishlist') || '[]');
        if (localWishlist.length > 0) {
          try {
            await fetch('/api/user/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ wishlist: localWishlist }),
            });
          } catch (e) { /* ignore */ }
        }
      }
    }),
    {
      name: 'sk-sweets-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
