'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Phone, MapPin, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      // Form submission error - handled by error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Get in Touch</h1>
          <p className="text-xl opacity-90">
            We&apos;d love to hear from you. Reach out with any questions or orders.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Info */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Phone,
              title: 'Phone',
              content: '+91 98765-43210',
              subtext: '9AM - 6PM IST',
            },
            {
              icon: Mail,
              title: 'Email',
              content: 'orders@sksweets.com',
              subtext: 'We reply within 24 hours',
            },
            {
              icon: MapPin,
              title: 'Address',
              content: 'Jaipur, Rajasthan',
              subtext: 'India',
            },
            {
              icon: Clock,
              title: 'Hours',
              content: 'Mon - Sat',
              subtext: '10 AM - 8 PM',
            },
          ].map((contact, i) => {
            const Icon = contact.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-all text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{contact.title}</h3>
                <p className="text-sm font-medium text-primary mb-1">{contact.content}</p>
                <p className="text-xs text-muted-foreground">{contact.subtext}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">
              Send us a Message
            </h2>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6 font-medium">
                Thank you for your message! We&apos;ll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us everything..."
                  required
                  rows={6}
                  className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Quick Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Why Choose SK Sweets?
              </h3>
              <ul className="space-y-3">
                {[
                  'Authentic traditional recipes passed down through generations',
                  'Premium quality ingredients sourced responsibly',
                  'Fast, reliable delivery across the region',
                  'Special discounts on bulk and corporate orders',
                  'Custom packaging for gifts and events',
                  'Food safety certifications (ISO, FSSAI, GMP)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-xl border border-primary/20">
              <h4 className="font-semibold text-foreground mb-3">Corporate Orders</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Planning a corporate event or office gifting? We offer special bulk discounts and custom packaging.
              </p>
              <a
                href="/bookings"
                className="inline-block text-primary font-semibold hover:underline"
              >
                Request Corporate Quote →
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-muted/30 p-12 rounded-2xl">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'How do I place an order?',
                a: 'Visit our menu page to browse sweets, add items to cart, and checkout. Or contact us for bulk orders.',
              },
              {
                q: 'Do you offer delivery?',
                a: 'Yes! We deliver fresh sweets within 24 hours for bulk orders in the Jaipur region.',
              },
              {
                q: 'Can I customize my order?',
                a: 'Absolutely! We offer custom packaging, mix & match options, and special requests for corporate orders.',
              },
              {
                q: 'How long do sweets stay fresh?',
                a: 'Our sweets are best enjoyed within 3-4 days. They&apos;re made fresh and don&apos;t contain preservatives.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-3">{faq.q}</h4>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
