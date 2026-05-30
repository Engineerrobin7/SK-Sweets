import { Navbar } from '@/components/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {children}
      </main>
      <footer className="bg-amber-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-amber-100">Experience authentic Indian cuisine with modern culinary techniques.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <p className="text-amber-100">Mon - Sun: 11:00 AM - 11:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-amber-100">+1 (555) 123-4567</p>
              <p className="text-amber-100">info@spicekitchen.com</p>
            </div>
          </div>
          <div className="border-t border-amber-700 pt-8 text-center text-amber-100">
            <p>&copy; 2025 Spice Kitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
