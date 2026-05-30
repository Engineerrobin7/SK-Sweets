'use client';

import { Suspense, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, Printer, Mail, MapPin, Calendar, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = use(searchParams);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="pt-32 pb-32 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Success Header */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center justify-center -z-10">
               <div className="w-64 h-64 bg-green-50 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <div className="w-24 h-24 bg-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200 animate-in zoom-in duration-500">
               <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-6 leading-tight">
              A Royal Order <br/> <span className="text-green-600">Successfully</span> Placed.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
              Thank you for choosing SK Sweets. Your order <span className="font-black text-slate-900">#{id?.slice(-8).toUpperCase()}</span> has been confirmed and is now being prepared by our master chefs.
            </p>
          </div>

          {/* Next Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                   <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Step 1</h3>
                <p className="font-bold text-slate-900 text-sm">Confirmation Email Sent</p>
             </div>
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                   <ShoppingBag className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Step 2</h3>
                <p className="font-bold text-slate-900 text-sm">Packing with Care</p>
             </div>
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                   <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Step 3</h3>
                <p className="font-bold text-slate-900 text-sm">Fast Dispatch</p>
             </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Button
                asChild
                className="px-12 h-20 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-2xl"
             >
                <Link href="/orders">Track your order</Link>
             </Button>
             <Button
                asChild
                variant="outline"
                className="px-12 h-20 bg-white text-slate-900 border-2 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all"
             >
                <Link href="/menu">Browse More Sweets</Link>
             </Button>
          </div>

          <div className="mt-20 pt-20 border-t border-slate-100 flex flex-col items-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Tell us about your experience</p>
             <div className="flex gap-4">
                {[1,2,3,4,5].map(i => (
                  <button key={i} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-all">
                     <Star className="w-6 h-6" />
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
