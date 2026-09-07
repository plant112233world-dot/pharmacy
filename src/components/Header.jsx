import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Pill, 
  AlertTriangle, 
  Clock, 
  Plus, 
  ShoppingCart, 
  Store, 
  User, 
  LogOut,
  Bell
} from 'lucide-react';

export const Header = ({ onOpenAddMed, onOpenNewPatient }) => {
  const { 
    shopInfo, 
    searchQuery, 
    setSearchQuery, 
    lowStockCount, 
    expiringSoonCount, 
    expiredCount, 
    setActiveTab, 
    setIsAuthenticated 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Store Title & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-extrabold text-xl">
              💊
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                {shopInfo.name}
                <span className="text-[10px] font-semibold tracking-wide bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full uppercase">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-teal-400" />
                <span>Lic: {shopInfo.licenseNo}</span>
              </p>
            </div>
          </div>

          {/* Mobile Only Alerts Badge */}
          <div className="flex md:hidden items-center gap-2">
            {(lowStockCount > 0 || expiredCount > 0) && (
              <button 
                onClick={() => setActiveTab('alerts')}
                className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {lowStockCount + expiredCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:w-80 lg:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicines, generic name, patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Actions & Alerts */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Low Stock Alert Button */}
          {lowStockCount > 0 && (
            <button
              onClick={() => setActiveTab('alerts')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition pulse-amber"
              title="Click to view low stock items"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockCount} Low Stock</span>
            </button>
          )}

          {/* Expired Alert Button */}
          {(expiredCount > 0 || expiringSoonCount > 0) && (
            <button
              onClick={() => setActiveTab('alerts')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition"
              title="Click to view expiring medicines"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{expiredCount > 0 ? `${expiredCount} Expired` : `${expiringSoonCount} Expiring`}</span>
            </button>
          )}

          {/* Quick POS Billing Button */}
          <button
            onClick={() => setActiveTab('billing')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl gradient-bg-primary text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>POS Billing</span>
          </button>

          {/* Pharmacist Admin Avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">Dr. Rajesh</p>
              <p className="text-[10px] text-slate-400">Pharmacist</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Logout from Shop Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
