'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const cartCount = cart.length;

  useEffect(() => {
    setMounted(true);
    checkAuth();
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      // Auth check failed - continue as guest
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      router.push('/');
      setIsOpen(false);
    } catch (error) {
      // Logout failed silently
    }
  };

  if (!mounted) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/bookings', label: 'Corporate Orders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isOpen
          ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-white font-serif font-black text-xl tracking-tighter">SK</span>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity -z-10"></div>
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-xl font-black text-slate-900 tracking-tight">SK SWEETS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-bold">The Royal Taste</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-full transition-all duration-300 font-bold text-sm uppercase tracking-wider ${
                  isActive(link.href)
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                    : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 bg-slate-50 hover:bg-orange-50 rounded-xl transition-all group border border-slate-100"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-orange-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-md font-bold text-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[100px]">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-red-50 rounded-xl transition-all text-red-500 hover:text-red-600 border border-transparent hover:border-red-100"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-5 py-2 text-slate-700 hover:text-orange-600 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              title="Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border animate-in">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all font-medium ${
                    isActive(link.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-all font-medium"
                    >
                      My Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-all font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-all font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
