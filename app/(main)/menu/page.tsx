'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { ShoppingCart, Heart, Star, Search, SlidersHorizontal, ArrowUpRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  _id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  isFeatured?: boolean;
  rating?: number;
}

const categories = ['All', 'Traditional', 'Premium', 'Seasonal', 'Gift Packs', 'Bulk'];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    fetchMenuItems();
    const saved = localStorage.getItem('sk-wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (val.length > 2) {
      setIsSearching(true);
      // Simulate Algolia Instant Search
      await new Promise(r => setTimeout(r, 300));
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(val.toLowerCase()) ||
        item.category.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredItems(filtered);
      setIsSearching(false);
    } else if (val.length === 0) {
      setFilteredItems(items);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        setFilteredItems(data.items || []);
      }
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = items;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (searchTerm && searchTerm.length <= 2) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.hindiName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, items]);

  const toggleWishlist = (id: string, name: string) => {
    const isAdding = !wishlist.includes(id);
    const updated = isAdding
      ? [...wishlist, id]
      : wishlist.filter((i) => i !== id);
    setWishlist(updated);
    localStorage.setItem('sk-wishlist', JSON.stringify(updated));
    toast.success(isAdding ? `${name} added to favorites` : `${name} removed from favorites`);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    toast.success(`${item.name} added to cart`, {
      description: 'You can view your items in the cart page',
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    });
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Preparing Royal Delicacies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 bg-slate-50 min-h-screen">
      {/* Header & Search */}
      <div className="bg-white border-b border-slate-100 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3" /> The Complete Collection
             </div>
             <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-6">
               Curated <span className="text-orange-600">Sweets.</span>
             </h1>
             <p className="text-xl text-slate-500 max-w-2xl mx-auto">
               From traditional classics to premium luxury assortments, explore our world of handcrafted Indian heritage.
             </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              {isSearching ? (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              )}
              <Input
                type="text"
                placeholder="Search by name, category or flavor..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-orange-600 font-medium transition-all"
              />
            </div>
            <button className="h-14 px-6 bg-slate-900 text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-slate-800 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex overflow-x-auto pb-4 gap-3 mb-16 no-scrollbar"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 -translate-y-1'
                  : 'bg-white text-slate-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  {/* Image Wrapper */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                      <div className="flex flex-col gap-2">
                         {item.isFeatured && (
                           <span className="px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg pointer-events-auto">
                              <Star className="w-3 h-3 fill-current" /> Bestseller
                           </span>
                         )}
                         <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm pointer-events-auto">
                            {item.category}
                         </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(item._id, item.name);
                        }}
                        className={`p-3 rounded-2xl backdrop-blur-md transition-all pointer-events-auto ${
                          wishlist.includes(item._id)
                            ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                            : 'bg-white/90 text-slate-900 hover:bg-white'
                        }`}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={wishlist.includes(item._id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>

                    {/* Quick View Button (Desktop) */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Link
                          href={`/menu/${item._id}`}
                          className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                       >
                          Details <ArrowUpRight className="w-4 h-4" />
                       </Link>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </h3>
                        {item.hindiName && (
                          <p className="text-orange-600 font-serif text-lg leading-none">{item.hindiName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                         <span className="text-xs font-black text-slate-900">{item.rating || '4.5'}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting at</span>
                         <span className="text-3xl font-black text-slate-900">
                          ₹{item.price}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          item.available
                            ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 hover:bg-orange-700 hover:-translate-y-1'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {item.available ? 'Add' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Search className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-xl">No royal delicacies found matching your search</p>
                <button
                  onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                  className="mt-6 text-orange-600 font-black text-sm uppercase tracking-widest underline decoration-2 underline-offset-8"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
