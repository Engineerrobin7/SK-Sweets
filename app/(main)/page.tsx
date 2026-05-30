'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Heart, Truck, Star, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function HomePage() {
  const featuredCategories = [
    {
      name: 'Gulab Jamun',
      image: 'https://images.unsplash.com/photo-1594142410420-5615d909564d?auto=format&fit=crop&q=80&w=400',
      description: 'The Golden Classic'
    },
    {
      name: 'Kaju Katli',
      image: 'https://images.unsplash.com/photo-1610450508930-58c03e878342?auto=format&fit=crop&q=80&w=400',
      description: 'Diamond of Delicacy'
    },
    {
      name: 'Rasgulla',
      image: 'https://images.unsplash.com/photo-1626132646545-0d35817d23f7?auto=format&fit=crop&q=80&w=400',
      description: 'Spongy Perfection'
    },
    {
      name: 'Laddus',
      image: 'https://images.unsplash.com/photo-1567184109411-e2862bbbb270?auto=format&fit=crop&q=80&w=400',
      description: 'Festive Rounds'
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section - High Impact */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=2000"
            alt="Indian Sweets Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Est. 1998 • Authentic Royal Recipes
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-serif font-black text-slate-900 leading-[0.9] mb-8"
            >
              The <span className="text-orange-600">Royal</span> Taste of Indian Heritage.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl"
            >
              Indulge in the finest handcrafted sweets, made with pure desi ghee and generations of tradition. Delivered fresh from our kitchen to your heart.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all"
              >
                Shop the Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:-translate-y-1 transition-all"
              >
                Bulk & Corporate
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Product Image */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-[45%] h-[70%] z-20"
        >
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1594142410420-5615d909564d?auto=format&fit=crop&q=80&w=1000"
              alt="Hero Sweet"
              fill
              className="object-contain drop-shadow-[0_35px_35px_rgba(251,146,60,0.4)] animate-float"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Grid */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-6">
                Our Signature Masterpieces
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every piece is a story of tradition, crafted with the finest ingredients sourced from the heart of India.
              </p>
            </div>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700"
            >
              View Full Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCategories.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative h-[450px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-2">{item.description}</p>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.name}</h3>
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-orange-600 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern Cards */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-orange-50 p-12 rounded-[3rem] border border-orange-100 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center mb-10">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Uncompromising Quality Standards</h3>
                <p className="text-slate-600 leading-relaxed">
                  We use 100% pure cow ghee and premium nuts. No artificial preservatives or colors ever touch our products.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-slate-900">Certified Authentic</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10">
                  <Truck className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Same Day Fresh Delivery</h3>
                <p className="text-slate-300 leading-relaxed">
                  Made fresh every morning and delivered to your doorstep within hours. Experience the warmth of our kitchen.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <span className="font-bold">Lightning Fast</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center mb-10">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Crafted with Pure Passion</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every sweet is hand-rolled and finished by master artisans who have perfected their craft over decades.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                   ))}
                </div>
                <span className="font-bold text-slate-900">10k+ Happy Customers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto relative rounded-[4rem] overflow-hidden bg-slate-900 py-24 px-8 md:px-20 text-center"
        >
          <Image
             src="https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=2000"
             alt="CTA Background"
             fill
             className="object-cover opacity-20"
          />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-8">
              Experience the Taste of <br/> Royalty in Every Bite.
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Whether it&apos;s a wedding, festival, or a simple craving, we have the perfect sweet for every occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/menu"
                className="px-12 py-6 bg-orange-600 text-white rounded-2xl font-bold text-xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-950/20"
              >
                Order Now Online
              </Link>
              <Link
                href="/contact"
                className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all"
              >
                Inquire for Events
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section - Premium */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[3rem] p-12 md:p-20 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-6">
                Join the <span className="text-orange-600">Royal</span> Club.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Subscribe to receive exclusive festive offers, new product launches, and royal gifting inspiration directly in your inbox.
              </p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                try {
                  const res = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                    headers: { 'Content-Type': 'application/json' }
                  });
                  if (res.ok) {
                    alert('Welcome to the Royal Club!');
                    (e.target as HTMLFormElement).reset();
                  }
                } catch (err) {
                  alert('Something went wrong. Please try again.');
                }
              }}
              className="flex-1 w-full flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your royal email..."
                className="flex-1 h-16 rounded-2xl bg-slate-50 border-none px-6 font-bold outline-none focus:ring-2 focus:ring-orange-600 transition-all"
              />
              <button
                type="submit"
                className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg"
              >
                Join Now
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Small Social / Trust Bar */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mb-12">As Featured & Trusted By</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale">
             <div className="text-2xl font-serif font-black">FoodBlogger</div>
             <div className="text-2xl font-serif font-black">RoyalJaipur</div>
             <div className="text-2xl font-serif font-black">SweetTreats</div>
             <div className="text-2xl font-serif font-black">IndianDine</div>
          </div>
        </div>
      </section>
    </div>
  );
}
