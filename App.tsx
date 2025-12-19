import React, { useState } from 'react';
import Flow1_WebOnboarding from './flows/Flow1_WebOnboarding';
import Flow2_ProductPage from './flows/Flow2_ProductPage';
import Flow3_Dashboard from './flows/Flow3_Dashboard';
import Flow4_MobileOnboarding from './flows/Flow4_MobileOnboarding';
import Flow5_Checkout from './flows/Flow5_Checkout';
import { LayoutGrid, ShoppingBag, PieChart, Smartphone, CreditCard, Home } from 'lucide-react';

const App = () => {
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);

  const flows = [
    { id: 'flow1', name: 'Web Onboarding', component: <Flow1_WebOnboarding />, icon: LayoutGrid, color: 'bg-teal-100 text-teal-800' },
    { id: 'flow2', name: 'Product Page', component: <Flow2_ProductPage />, icon: ShoppingBag, color: 'bg-orange-100 text-orange-800' },
    { id: 'flow3', name: 'Dashboard', component: <Flow3_Dashboard />, icon: PieChart, color: 'bg-blue-100 text-blue-800' },
    { id: 'flow4', name: 'Mobile Onboarding', component: <Flow4_MobileOnboarding />, icon: Smartphone, color: 'bg-purple-100 text-purple-800' },
    { id: 'flow5', name: 'Checkout', component: <Flow5_Checkout />, icon: CreditCard, color: 'bg-green-100 text-green-800' },
  ];

  if (!currentFlow) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold text-teal-900 font-sans tracking-tight">SK Sweets Online</h1>
            <p className="text-xl text-gray-500 font-light">Interactive Prototype Showcase</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {flows.map((flow) => (
              <button
                key={flow.id}
                onClick={() => setCurrentFlow(flow.id)}
                className="group relative bg-white p-8 rounded-3xl shadow-sm border border-orange-100 hover:shadow-xl hover:border-orange-300 transition-all duration-300 text-left flex flex-col gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${flow.color} group-hover:scale-110 transition-transform`}>
                  <flow.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-900 transition-colors">{flow.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Click to view flow</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-center text-xs text-gray-400 pt-12">
            Prototype built with React, Tailwind & Recharts
          </div>
        </div>
      </div>
    );
  }

  const ActiveComponent = flows.find(f => f.id === currentFlow)?.component;

  return (
    <div className="relative">
      {ActiveComponent}
      
      {/* Floating Home Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setCurrentFlow(null)}
          className="bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 hover:scale-110 transition-all flex items-center gap-2"
        >
          <Home size={20} />
          <span className="font-medium text-sm pr-1">All Flows</span>
        </button>
      </div>
    </div>
  );
};

export default App;