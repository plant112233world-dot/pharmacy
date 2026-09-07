import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, Download, Upload, Store, ShieldCheck } from 'lucide-react';

export const ShopSettings = () => {
  const { shopInfo, setShopInfo, showToast, medicines, patients, transactions } = useApp();

  const [form, setForm] = useState(shopInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShopInfo(form);
    showToast('Shop details updated successfully!', 'success');
  };

  const handleExportData = () => {
    const backupObj = {
      shopInfo,
      medicines,
      patients,
      transactions,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MediCare_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON exported successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-400" />
            Medical Shop Settings & Pharmacy Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure drug license numbers, store contact info, and backup inventory database.
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2">
          Pharmacy Details & License Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pharmacy / Medical Store Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Drug License Number</label>
            <input
              type="text"
              value={form.licenseNo}
              onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Chief Pharmacist Name & Qualification</label>
            <input
              type="text"
              value={form.pharmacistName}
              onChange={(e) => setForm({ ...form, pharmacistName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Store Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Pharmacy Full Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none"
            required
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl gradient-bg-primary text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>

      {/* Data Backup Card */}
      <div className="glass-card p-6 border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
          Database Backup & Data Portability
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <p className="font-bold text-sm text-slate-200">Export Store Data Backup</p>
            <p className="text-xs text-slate-400 mt-0.5">Download JSON file containing all medicines, stock levels, patient reports, and sales records.</p>
          </div>

          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-bold border border-slate-700 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>
        </div>
      </div>

    </div>
  );
};
