'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Leaf,
  Clock,
  Share2,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

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
  weightOptions?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    fetchItem();
    const wishlist = JSON.parse(localStorage.getItem('sk-wishlist') || '[]');
    setIsFavorite(wishlist.includes(id));
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/menu/${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
        if (data.weightOptions?.length > 0) {
          setSelectedWeight(data.weightOptions[0]);
        }
      } else {
        toast.error('Product not found');
        router.push('/menu');
      }
    } catch (error) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    const wishlist = JSON.parse(localStorage.getItem('sk-wishlist') || '[]');
    let updated;
    if (isFavorite) {
      updated = wishlist.filter((i: string) => i !== id);
      toast.error('Removed from favorites');
    } else {
      updated = [...wishlist, id];
      toast.success('Added to favorites');
    }
    localStorage.setItem('sk-wishlist', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    if (item) {
      addToCart(item, quantity);
      toast.success(`${quantity}x ${item.name} added to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => router.push('/cart'),
        },
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Royal Details...</p>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="pt-24 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 py-4">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/menu" className="hover:text-orange-600">Menu</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{item.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Product Image */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-xl group">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                priority
              />
              <div className="absolute top-8 right-8 flex flex-col gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`p-4 rounded-2xl shadow-xl backdrop-blur-md transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-slate-900 hover:bg-white'
                  }`}
                >
                  <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 rounded-2xl bg-white/90 text-slate-900 shadow-xl backdrop-blur-md hover:bg-white transition-all"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              {item.isFeatured && (
                <div className="absolute bottom-8 left-8">
                  <Badge className="bg-amber-400 text-slate-900 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-none shadow-xl">
                    Royal Choice
                  </Badge>
                </div>
              )}
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-4">
               {[
                 { icon: Leaf, text: '100% Pure Ghee', color: 'bg-green-50 text-green-600' },
                 { icon: Clock, text: 'Freshly Prepared', color: 'bg-blue-50 text-blue-600' },
                 { icon: ShieldCheck, text: 'Quality Assured', color: 'bg-orange-50 text-orange-600' }
               ].map((f, i) => (
                 <div key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 text-center gap-3">
                    <div className={`p-3 rounded-xl ${f.color}`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{f.text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-none">
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span className="text-sm font-black text-slate-900">{item.rating || '4.8'}</span>
                  <span className="text-xs text-slate-400 font-bold ml-1">(120+ Reviews)</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-900 mb-2 leading-tight">
                {item.name}
              </h1>
              {item.hindiName && (
                <p className="text-3xl font-serif text-orange-600 mb-6">{item.hindiName}</p>
              )}

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black text-slate-900">₹{item.price}</span>
                <span className="text-slate-400 font-bold text-lg line-through">₹{Math.round(item.price * 1.2)}</span>
                <span className="text-green-500 font-black text-sm uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg">20% OFF</span>
              </div>

              <p className="text-slate-500 text-lg leading-relaxed mb-10 border-l-4 border-orange-600 pl-6 bg-white py-6 rounded-r-3xl">
                {item.description}
              </p>
            </div>

            {/* Weight Selection */}
            {item.weightOptions && item.weightOptions.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Serving Size</p>
                <div className="flex flex-wrap gap-4">
                  {item.weightOptions.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                        selectedWeight === weight
                          ? 'border-orange-600 bg-orange-600 text-white shadow-xl shadow-orange-100'
                          : 'border-white bg-white text-slate-500 hover:border-orange-200 shadow-sm'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA */}
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-black text-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-14 text-center font-black text-xl text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-black text-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className="flex-1 h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-orange-100 transition-all hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  {item.available ? 'Add to Collection' : 'Out of Stock'}
                </Button>
              </div>

              {/* Delivery Promise */}
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center gap-6">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Truck className="w-7 h-7 text-orange-400" />
                 </div>
                 <div>
                    <h4 className="font-black uppercase tracking-widest text-xs mb-1">Guaranteed Fast Delivery</h4>
                    <p className="text-slate-400 text-sm">Order in the next 2 hours for same-day dispatch.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for extra info */}
        <div className="mt-32">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start gap-12 rounded-none h-auto p-0 mb-12">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-orange-600 rounded-none bg-transparent font-black text-xs uppercase tracking-[0.2em] pb-6 px-0 text-slate-400 data-[state=active]:text-slate-900"
              >
                Gourmet Details
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-orange-600 rounded-none bg-transparent font-black text-xs uppercase tracking-[0.2em] pb-6 px-0 text-slate-400 data-[state=active]:text-slate-900"
              >
                Ingredients & Nutrition
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-4 data-[state=active]:border-orange-600 rounded-none bg-transparent font-black text-xs uppercase tracking-[0.2em] pb-6 px-0 text-slate-400 data-[state=active]:text-slate-900"
              >
                Customer Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 mt-0">
               <div className="grid md:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-3xl font-serif font-black text-slate-900 mb-8">Crafting Perfection</h3>
                    <p className="text-slate-500 leading-relaxed mb-6">
                      Our {item.name} is the result of years of refinement. Using traditional copper vessels and slow-cooking techniques, we ensure that every bite delivers the same authentic taste that has made us a favorite since 1998.
                    </p>
                    <ul className="space-y-4">
                       {[
                         'No Artificial Preservatives',
                         'Prepared in Small Batches',
                         'Traditional Hand-rolling Technique',
                         'Premium Packaging included'
                       ].map((l, i) => (
                         <li key={i} className="flex items-center gap-3 font-bold text-slate-900">
                           <CheckCircle2 className="w-5 h-5 text-orange-600" /> {l}
                         </li>
                       ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 rounded-[2rem] p-10 flex flex-col justify-center">
                    <h4 className="font-black text-orange-600 uppercase tracking-widest text-xs mb-4">Chef's Recommendation</h4>
                    <p className="text-slate-700 italic font-medium leading-relaxed">
                      "Best served slightly warm with a glass of spiced milk or cold Rabri. This particular sweet pairs excellently with any festive occasion or as a royal gift."
                    </p>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="ingredients" className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 mt-0">
               <div className="max-w-2xl">
                 <h3 className="text-3xl font-serif font-black text-slate-900 mb-8">What's Inside?</h3>
                 <p className="text-slate-500 leading-relaxed mb-10">
                   We believe in total transparency. Our ingredients are sourced directly from farmers to ensure maximum freshness and purity.
                 </p>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="pb-4 border-b border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Main Components</p>
                         <p className="font-bold text-slate-900">Milk Solids (Khoya), Pure Desi Ghee, Saffron, Green Cardamom, Refined Sugar.</p>
                      </div>
                      <div className="pb-4 border-b border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Allergy Info</p>
                         <p className="font-bold text-red-500">Contains Milk and Nuts (Pistachio/Almond garnish).</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-8 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Nutrition per 100g</p>
                      <div className="space-y-4">
                         {[
                           { label: 'Energy', value: '420 kcal' },
                           { label: 'Total Fat', value: '18g' },
                           { label: 'Carbohydrates', value: '54g' },
                           { label: 'Protein', value: '6g' }
                         ].map((n, i) => (
                           <div key={i} className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-500">{n.label}</span>
                              <span className="font-black text-slate-900">{n.value}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 </div>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
