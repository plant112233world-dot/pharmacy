import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Pill, 
  Users, 
  Receipt, 
  AlertTriangle, 
  Settings, 
  TrendingUp,
  FileText
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    lowStockCount, 
    expiredCount, 
    expiringSoonCount 
  } = useApp();

  const totalAlerts = lowStockCount + expiredCount;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stock', label: 'Stock Inventory', icon: Pill },
    { id: 'patients', label: 'Patient Directory & Reports', icon: Users },
    { id: 'billing', label: 'POS Counter Sale', icon: Receipt },
    { 
      id: 'alerts', 
      label: 'Low Stock & Expiry Alerts', 
      icon: AlertTriangle,
      badge: totalAlerts > 0 ? totalAlerts : null,
      badgeColor: expiredCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
    },
    { id: 'settings', label: 'Shop Settings', icon: Settings }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-row md:flex-col justify-between shrink-0">
      <div className="w-full">
        <div className="px-3 py-2 hidden md:block">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Navigation</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-400 border border-teal-500/30 shadow-md shadow-teal-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Summary Card at Bottom of Sidebar */}
      <div className="hidden md:block mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <p className="text-xs font-bold text-slate-200">System Status</p>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Local database synchronized. Real-time stock alerts active.
        </p>
      </div>
    </aside>
  );
};
