'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowRight, Package, Users, Calendar, Zap, Building2, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CorporateOrdersPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '50',
    eventType: 'Corporate Event',
    sweetTypes: [] as string[],
    quantity: '500',
    occasion: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const sweetOptions = [
    'Gulab Jamun',
    'Rasgulla',
    'Burfi',
    'Laddu',
    'Kaju Katli',
    'Peda',
    'Jalebi',
    'Assorted Box'
  ];

  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    const basePrice = 180; // Royal base price

    let discount = 0;
    if (qty >= 2000) discount = 0.20;
    else if (qty >= 1000) discount = 0.15;
    else if (qty >= 500) discount = 0.1;
    else if (qty >= 200) discount = 0.05;

    const price = basePrice * qty * (1 - discount);
    setCalculatedPrice(price);
  }, [formData.quantity, formData.guestCount]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSweet = (sweet: string) => {
    setFormData((prev) => ({
      ...prev,
      sweetTypes: prev.sweetTypes.includes(sweet)
        ? prev.sweetTypes.filter((s) => s !== sweet)
        : [...prev.sweetTypes, sweet],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sweetTypes.length === 0) {
      toast.error('Please select at least one sweet variety');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalPrice: calculatedPrice,
          orderType: 'corporate',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Inquiry submitted successfully');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      toast.error('A connection error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-xl">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-serif font-black text-slate-900 mb-6">
            Inquiry Received.
          </h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed">
            Thank you for choosing SK Sweets for your corporate requirements. Our concierge team will review your request and contact you within 4 business hours with a personalized quote.
          </p>
          <div className="flex flex-col items-center gap-4">
             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 animate-progress"></div>
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Returning to Home</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-6">
            <Building2 className="w-3.5 h-3.5" /> B2B & Wholesale
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-8 leading-[0.9]">
            Royal <span className="text-orange-600">Bulk</span> Gifting & Events.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Elevate your corporate events and celebrations with our premium catering services. From customized packaging to priority shipping, we handle every detail with royal precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Contact Section */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Partner Details</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Royal Jaipur Pvt Ltd"
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Representative Name</label>
                      <Input
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Event Section */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Event Specification</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nature of Event</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full h-14 rounded-2xl bg-slate-50 border-none px-4 focus:ring-2 focus:ring-orange-600 font-bold outline-none"
                      >
                        <option>Corporate Event</option>
                        <option>Wedding Gala</option>
                        <option>Festive Celebration</option>
                        <option>Employee Appreciation</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Date</label>
                      <Input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest / Unit Count</label>
                      <Input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                        min="20"
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Pieces Required</label>
                      <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="100"
                        className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-orange-600 font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sweets Selection */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Select Varieties</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {sweetOptions.map((sweet) => (
                      <button
                        key={sweet}
                        type="button"
                        onClick={() => toggleSweet(sweet)}
                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                          formData.sweetTypes.includes(sweet)
                            ? 'border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-100'
                            : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-orange-200'
                        }`}
                      >
                        {sweet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customization Requests</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="e.g. Branded packaging, specific nut allergies, premium gift tags..."
                      rows={4}
                      className="w-full rounded-3xl bg-slate-50 border-none p-6 focus:ring-2 focus:ring-orange-600 font-bold outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-20 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all hover:scale-[1.01] shadow-2xl disabled:opacity-50"
                >
                  {isLoading ? 'Processing Royal Request...' : 'Send Inquiry Request'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-orange-600 rounded-[3rem] p-12 text-white shadow-2xl">
                <p className="text-orange-200 font-black text-[10px] uppercase tracking-widest mb-2">Estimated Value</p>
                <div className="text-6xl font-black mb-10">₹{calculatedPrice.toLocaleString()}</div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-300 mt-1 shrink-0" />
                        <p className="text-sm font-bold text-orange-100 leading-relaxed">Includes Premium B2B Tier Discount</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-300 mt-1 shrink-0" />
                        <p className="text-sm font-bold text-orange-100 leading-relaxed">Complimentary Royal Packaging</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-300 mt-1 shrink-0" />
                        <p className="text-sm font-bold text-orange-100 leading-relaxed">Dedicated Account Concierge</p>
                    </div>
                </div>

                <p className="mt-12 text-[10px] font-black text-orange-200/60 uppercase tracking-widest">
                    * Final quote may vary based on specific customization and logistical requirements.
                </p>
            </div>

            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl space-y-12">
                <div className="space-y-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Direct Concierge</h4>
                        <p className="text-xl font-bold text-slate-600">+91 99999 88888</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Corporate Relations</h4>
                        <p className="text-xl font-bold text-slate-600">royal@sksweets.com</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
