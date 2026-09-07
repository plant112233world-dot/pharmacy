import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Clock, RefreshCw, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AlertsOverview = () => {
  const { 
    medicines, 
    lowStockCount, 
    expiredCount, 
    expiringSoonCount, 
    restockMedicine, 
    deleteMedicine,
    isMedicineExpired,
    isMedicineExpiringSoon
  } = useApp();

  const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);
  const expiredMedicines = medicines.filter(m => isMedicineExpired(m.expiryDate));
  const expiringSoonMedicines = medicines.filter(m => isMedicineExpiringSoon(m.expiryDate));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-amber-500/20">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Stock & Expiry Risk Management Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated alerts for inventory below reorder point, near-expiry medicines (&lt;30 days), and expired stock write-offs.
          </p>
        </div>
      </div>

      {/* Low Stock Table Card */}
      <div className="glass-card p-5 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Low Stock Medicines ({lowStockMedicines.length})
          </h3>
        </div>

        {lowStockMedicines.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            No low stock medicines right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Current Stock</th>
                  <th>Min Reorder Level</th>
                  <th>Rack Location</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockMedicines.map(med => (
                  <tr key={med.id}>
                    <td className="font-bold text-slate-100">{med.name} <span className="text-xs text-slate-400">({med.genericName})</span></td>
                    <td className="font-extrabold text-amber-400">{med.stock} units</td>
                    <td className="text-slate-300">{med.minStock} units</td>
                    <td className="text-teal-400 font-mono text-xs">{med.rackNo}</td>
                    <td className="text-right">
                      <button
                        onClick={() => restockMedicine(med.id, 50)}
                        className="px-3 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 font-bold text-xs border border-teal-500/30 transition inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        + Restock 50 Units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expired / Near Expiry Table Card */}
      <div className="glass-card p-5 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            Expired & Expiring Soon Inventory ({expiredMedicines.length + expiringSoonMedicines.length})
          </h3>
        </div>

        {expiredMedicines.length === 0 && expiringSoonMedicines.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            No expired or near-expiry medicines.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Batch No</th>
                  <th>Expiry Date</th>
                  <th>Quantity In Hand</th>
                  <th>Risk Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {expiredMedicines.map(med => (
                  <tr key={med.id} className="bg-rose-950/20">
                    <td className="font-bold text-slate-100">{med.name}</td>
                    <td className="font-mono text-xs text-slate-300">{med.batchNo}</td>
                    <td className="font-bold text-rose-400">{med.expiryDate}</td>
                    <td className="text-slate-300">{med.stock} units</td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full badge-expired text-[11px] font-extrabold">
                        🚨 EXPIRED
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Dispose expired stock for ${med.name}?`)) {
                            deleteMedicine(med.id);
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/30 transition inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Write Off & Dispose
                      </button>
                    </td>
                  </tr>
                ))}

                {expiringSoonMedicines.map(med => (
                  <tr key={med.id} className="bg-amber-950/20">
                    <td className="font-bold text-slate-100">{med.name}</td>
                    <td className="font-mono text-xs text-slate-300">{med.batchNo}</td>
                    <td className="font-bold text-amber-400">{med.expiryDate}</td>
                    <td className="text-slate-300">{med.stock} units</td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full badge-warning text-[11px] font-extrabold">
                        ⏳ Expiring Soon (&lt;30 days)
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-xs text-slate-400">Prioritize Sale</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
