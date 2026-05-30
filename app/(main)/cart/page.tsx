'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { SHIPPING_COST, TAX_RATE } from '@/lib/constants';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const getCartTotal = useStore((state) => state.getCartTotal);

  const total = getCartTotal();
  const tax = total * TAX_RATE;
  const shipping = cart.length > 0 ? SHIPPING_COST : 0;
  const grandTotal = total + tax + shipping;

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.error(`${name} removed from cart`);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
             <ShoppingBag className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-serif font-black text-slate-900 mb-4">Your bag is empty</h1>
          <p className="text-slate-500 mb-10 text-lg">It looks like you haven&apos;t added any royal sweets to your collection yet.</p>
          <Button
            asChild
            className="w-full bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 transition-all hover:-translate-y-1"
          >
            <Link href="/menu">Browse Collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-2">Shopping Bag</h1>
                <p className="text-slate-500 font-bold text-sm">{cart.length} delicacies selected</p>
            </div>
            <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col sm:flex-row gap-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">{item.name}</h3>
                            <p className="text-orange-600 font-bold text-xs uppercase tracking-widest">{item.category}</p>
                        </div>
                        <button
                            onClick={() => handleRemove(item._id, item.name)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                            <button
                                onClick={() => updateCartQuantity(item._id, Math.max(1, item.quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-white rounded-lg transition-all font-black text-xl"
                            >
                                −
                            </button>
                            <span className="w-12 text-center font-black text-slate-900">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-white rounded-lg transition-all font-black text-xl"
                            >
                                +
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                            <p className="text-2xl font-black text-slate-900">
                                ₹{(item.price * item.quantity).toFixed(0)}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            ))}

            <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Bulk Discount Applied</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        You&apos;re eligible for our royal packaging and priority handling. Your sweets will be packed in our signature gold-embossed boxes.
                    </p>
                </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white sticky top-28 shadow-2xl">
              <h2 className="text-3xl font-serif font-black mb-10">Order Summary</h2>

              <div className="space-y-6 mb-10 border-b border-white/10 pb-10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Bag Subtotal</span>
                  <span className="font-black">₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Taxes & Fees</span>
                  <span className="font-black">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Royal Shipping</span>
                  <span className="font-black text-green-400">₹{shipping.toFixed(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-12">
                <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Total Amount</p>
                    <p className="text-5xl font-black">₹{grandTotal.toFixed(0)}</p>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-orange-600 hover:bg-orange-700 text-white h-20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-2xl shadow-orange-950/20"
              >
                <Link href="/checkout" className="flex items-center gap-3">
                  Checkout Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
