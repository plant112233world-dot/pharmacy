import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Pill, 
  AlertTriangle, 
  Clock, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  ShieldAlert, 
  Plus, 
  ArrowRight,
  CheckCircle2,
  FileText,
  Thermometer,
  Zap,
  Activity,
  Wind,
  Droplets,
  HeartPulse,
  Cross
} from 'lucide-react';

export const Dashboard = ({ onOpenAddMed, onOpenAddPatient }) => {
  const { 
    medicines, 
    patients, 
    transactions, 
    lowStockCount, 
    expiredCount, 
    expiringSoonCount, 
    setActiveTab, 
    setSelectedCategory,
    categories,
    isMedicineExpired,
    isMedicineExpiringSoon,
    restockMedicine
  } = useApp();

  // Metrics
  const totalStockUnits = medicines.reduce((sum, m) => sum + m.stock, 0);
  const totalPatientReports = patients.reduce((sum, p) => sum + (p.reports ? p.reports.length : 0), 0);
  
  // Today's Revenue
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTx = transactions.filter(t => t.date.startsWith(todayStr));
  const todayRevenue = todayTx.reduce((sum, t) => sum + t.total, 0);

  // Category counts
  const categoryCounts = categories.filter(c => c.id !== 'all').map(cat => {
    const count = medicines.filter(m => m.category === cat.id).length;
    return { ...cat, count };
  });

  const lowStockItems = medicines.filter(m => m.stock <= m.minStock).slice(0, 4);
  const expiringItems = medicines.filter(m => isMedicineExpired(m.expiryDate) || isMedicineExpiringSoon(m.expiryDate)).slice(0, 4);

  const categoryIcons = {
    fever: Thermometer,
    headache: Zap,
    stomach: Activity,
    antibiotics: ShieldAlert,
    cold_allergy: Wind,
    cough: Droplets,
    vitamins: HeartPulse,
    surgical: Cross
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-teal-500/20">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Welcome, Pharmacist Admin 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Overview of store inventory, critical low stock alerts, patient lab reports & sales performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddMed}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Add Medicine</span>
          </button>

          <button
            onClick={onOpenAddPatient}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Add Patient</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg-primary text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition"
          >
            <IndianRupee className="w-4 h-4" />
            <span>New Counter Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Inventory */}
        <div className="glass-card p-5 border-slate-800 hover:border-teal-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{medicines.length} Items</div>
            <p className="text-xs text-slate-400 mt-0.5">{totalStockUnits.toLocaleString()} units in stock</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div 
          onClick={() => setActiveTab('alerts')}
          className={`glass-card p-5 cursor-pointer transition ${
            lowStockCount > 0 ? 'border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/30' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 pulse-amber' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{lowStockCount} Items</div>
            <p className="text-xs text-amber-400 mt-0.5 font-medium">Reorder required soon</p>
          </div>
        </div>

        {/* Expired / Near Expiry Warnings */}
        <div 
          onClick={() => setActiveTab('alerts')}
          className={`glass-card p-5 cursor-pointer transition ${
            expiredCount > 0 ? 'border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/30' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Warnings</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              expiredCount > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 pulse-danger' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{expiredCount} Expired</div>
            <p className="text-xs text-slate-400 mt-0.5">
              +{expiringSoonCount} expiring within 30 days
            </p>
          </div>
        </div>

        {/* Registered Patients & Reports */}
        <div 
          onClick={() => setActiveTab('patients')}
          className="glass-card p-5 border-slate-800 hover:border-cyan-500/30 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patients & Reports</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">{patients.length} Patients</div>
            <p className="text-xs text-cyan-400 mt-0.5 font-medium">{totalPatientReports} Lab Reports attached</p>
          </div>
        </div>

      </div>

      {/* Categories Quick Filter Pills */}
      <div className="glass-card p-5 border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🏷️ Medical Stock Categories</span>
          </h3>
          <button 
            onClick={() => setActiveTab('stock')}
            className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
          >
            View Inventory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categoryCounts.map((cat) => {
            const IconComponent = categoryIcons[cat.id] || Pill;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('stock');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-800/80 transition text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 group-hover:scale-110 flex items-center justify-center transition mb-2 border border-teal-500/20">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200 line-clamp-1">{cat.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{cat.count} Items</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Widgets: Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Urgent Stock & Expiry Widget */}
        <div className="glass-card p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-slate-200 text-sm">Urgent Reorder & Expiry Alerts</h3>
              </div>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                Manage All
              </button>
            </div>

            <div className="space-y-3">
              {lowStockItems.length === 0 && expiringItems.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                  All stock levels healthy! No expired or low stock items.
                </div>
              ) : (
                <>
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-amber-500/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-100">{item.name}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full badge-warning font-bold">
                            Low Stock: {item.stock} left
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Rack: {item.rackNo} | Min Threshold: {item.minStock}</p>
                      </div>
                      <button
                        onClick={() => restockMedicine(item.id, 50)}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 border border-teal-500/40 hover:text-slate-950 font-bold text-xs transition"
                      >
                        + Restock 50
                      </button>
                    </div>
                  ))}

                  {expiringItems.map(item => {
                    const isExp = isMedicineExpired(item.expiryDate);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-rose-500/20">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-100">{item.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isExp ? 'badge-expired' : 'badge-warning'}`}>
                              {isExp ? 'EXPIRED' : 'Expiring Soon'} ({item.expiryDate})
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Batch: {item.batchNo} | Qty in stock: {item.stock}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Patient Activity & Recent Lab Reports */}
        <div className="glass-card p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-200 text-sm">Recent Patient Lab Reports & History</h3>
              </div>
              <button
                onClick={() => setActiveTab('patients')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View Patients
              </button>
            </div>

            <div className="space-y-3">
              {patients.slice(0, 3).map(patient => {
                const latestReport = patient.reports && patient.reports[0];
                return (
                  <div key={patient.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-100">{patient.name}</p>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                          {patient.bloodGroup} | {patient.age}y
                        </span>
                      </div>
                      {latestReport ? (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
                          <span>Report: {latestReport.title}</span>
                          <span className="text-slate-500">({latestReport.date})</span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 mt-1">No lab reports attached yet.</p>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab('patients')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
