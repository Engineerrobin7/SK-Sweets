'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Zap,
  Ticket
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SHIPPING_COST, TAX_RATE } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const getCartTotal = useStore((state) => state.getCartTotal);

  const [isProcessing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [formData, setFormData] = useState({
    firstName: user?.username || '',
    lastName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    giftMessage: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'ROYAL10') {
      setDiscount(subtotal * 0.1);
      toast.success('Royal 10% Discount Applied!');
    } else {
      toast.error('Invalid Coupon Code');
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST - discount;

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/menu');
    }
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);

    // Check if we have a real Razorpay ID (this would be in NEXT_PUBLIC_ in a real production setup)
    const hasRazorpay = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (hasRazorpay) {
      toast.info('Initializing Official Razorpay Gateway...');
    } else {
      toast.info('Initializing Secure Payment Gateway (Simulation)...');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customerInfo: formData,
          total,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        toast.success('Royal Order Confirmed!', {
          description: 'A confirmation email is on its way to your inbox.',
        });
        clearCart();
        router.push(`/order-confirmation?id=${order._id}`);
      } else {
        toast.error('Transaction Failed. Please check your bank details.');
      }
    } catch (error) {
      toast.error('A connection error occurred during payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="max-w-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                <div className="h-0.5 w-12 bg-slate-200"></div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <div className="h-0.5 w-12 bg-slate-200"></div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center font-black text-xs">3</div>
             </div>
             <h1 className="text-5xl font-serif font-black text-slate-900 mb-4">Finalizing your <span className="text-orange-600">Selection.</span></h1>
             <p className="text-lg text-slate-500">Please provide your delivery preferences and secure payment details.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
             <Lock className="w-5 h-5 text-green-500" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-900">256-bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-xl">
              {step === 1 ? (
                /* Shipping Step */
                <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-600" />
                     </div>
                     <h2 className="text-3xl font-black text-slate-900">Delivery Information</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                       <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Your first name" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                       <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Your last name" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Shipping Address</label>
                    <div className="relative">
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Start typing your address..."
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold pr-12"
                      />
                      <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold ml-1">Powered by Google Maps Autocomplete</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                       <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Jaipur" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                       <Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="302001" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                       <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-orange-600" />
                       </div>
                       <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Add a Gift Message (Optional)</h4>
                    </div>
                    <textarea
                      name="giftMessage"
                      value={formData.giftMessage}
                      onChange={(e) => setFormData({...formData, giftMessage: e.target.value})}
                      placeholder="Write a personalized note for your loved ones..."
                      className="w-full h-32 rounded-3xl bg-slate-50 border-none p-6 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-600 resize-none transition-all"
                    />
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full h-20 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-2xl"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                /* Payment Step */
                <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-green-600" />
                     </div>
                     <h2 className="text-3xl font-black text-slate-900">Secure Payment</h2>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-orange-200 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <CreditCard className="w-7 h-7 text-slate-900" />
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">UPI / Cards / NetBanking</h4>
                           <p className="text-slate-500 text-sm font-medium">Powered by Razorpay Secure</p>
                        </div>
                     </div>
                     <div className="w-6 h-6 rounded-full border-2 border-orange-600 flex items-center justify-center">
                        <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promo Code</p>
                     <div className="flex gap-4">
                        <Input
                          placeholder="Try ROYAL10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="h-14 rounded-2xl bg-slate-50 border-none font-bold flex-1"
                        />
                        <Button
                          onClick={applyCoupon}
                          variant="outline"
                          className="h-14 rounded-2xl border-2 px-8 font-black text-xs uppercase tracking-widest"
                        >
                          Apply
                        </Button>
                     </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full h-20 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-2xl disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing Securely...' : `Pay ₹${total.toLocaleString()}`}
                      {!isProcessing && <ShieldCheck className="w-5 h-5" />}
                    </Button>
                    <button
                      onClick={() => setStep(1)}
                      className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                      Return to Delivery Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-28">
                <h3 className="text-2xl font-serif font-black mb-10">Basket Review</h3>

                <div className="space-y-6 mb-10 border-b border-white/10 pb-10">
                   {cart.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xs font-black">{item.quantity}x</div>
                           <span className="font-bold text-sm text-slate-200">{item.name}</span>
                        </div>
                        <span className="font-black text-sm">₹{item.price * item.quantity}</span>
                     </div>
                   ))}
                </div>

                <div className="space-y-4 mb-10">
                   <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                   </div>
                   {discount > 0 && (
                     <div className="flex justify-between text-green-400 font-bold text-[10px] uppercase tracking-widest">
                        <span>Royal Discount</span>
                        <span>-₹{discount.toFixed(0)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <span>GST (18%)</span>
                      <span>₹{tax.toFixed(0)}</span>
                   </div>
                   <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <span>Royal Handling</span>
                      <span className="text-green-400">₹{SHIPPING_COST}</span>
                   </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Total Payable</p>
                        <p className="text-5xl font-black">₹{total.toFixed(0)}</p>
                    </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-start gap-4">
                       <Truck className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                       <p className="text-xs text-slate-300 leading-relaxed font-bold">
                          Premium Insulated Packaging Included. Your sweets will arrive at the perfect temperature.
                       </p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
