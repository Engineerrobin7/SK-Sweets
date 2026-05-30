'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Package,
  ArrowUpRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
  isFeatured?: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.items || []);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...products.find(p => p._id === id), available: !current }),
      });
      if (response.ok) {
        toast.success(`Product is now ${!current ? 'Available' : 'Out of Stock'}`);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search by product name..."
            className="h-14 pl-12 rounded-2xl bg-white border-slate-100 font-bold focus:ring-orange-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
           <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filter
           </Button>
           <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-slate-200">
              <Plus className="w-5 h-5" /> Add New Sweet
           </Button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Info</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Featured</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-10 py-8"><div className="h-12 bg-slate-50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : filtered.map((product) => (
                <tr key={product._id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                         <p className="font-black text-slate-900 text-lg">{product.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {product._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <Badge variant="outline" className="px-3 py-1 rounded-lg border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-900 text-lg">₹{product.price}</p>
                  </td>
                  <td className="px-10 py-6">
                    <button
                      onClick={() => toggleAvailability(product._id, product.available)}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                        product.available
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}
                    >
                      {product.available ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {product.available ? 'Available' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="px-10 py-6">
                    {product.isFeatured ? (
                      <div className="flex items-center gap-2 text-amber-500">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900">
                          <Edit className="w-5 h-5" />
                       </button>
                       <button className="p-2.5 hover:bg-red-50 rounded-xl transition-all text-slate-400 hover:text-red-500">
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="p-20 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-slate-400 font-bold">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Star(props: any) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
