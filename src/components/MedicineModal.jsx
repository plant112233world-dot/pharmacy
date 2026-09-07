import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Pill, X, Save } from 'lucide-react';

export const MedicineModal = ({ isOpen, onClose, medicineToEdit = null }) => {
  const { addMedicine, updateMedicine, categories } = useApp();

  const [form, setForm] = useState({
    name: '',
    genericName: '',
    category: 'fever',
    batchNo: '',
    rackNo: 'A1-01',
    price: '',
    stock: '',
    minStock: 20,
    expiryDate: '',
    manufacturer: '',
    description: '',
    dosage: ''
  });

  useEffect(() => {
    if (medicineToEdit) {
      setForm({
        name: medicineToEdit.name || '',
        genericName: medicineToEdit.genericName || '',
        category: medicineToEdit.category || 'fever',
        batchNo: medicineToEdit.batchNo || '',
        rackNo: medicineToEdit.rackNo || 'A1-01',
        price: medicineToEdit.price || '',
        stock: medicineToEdit.stock || '',
        minStock: medicineToEdit.minStock || 20,
        expiryDate: medicineToEdit.expiryDate || '',
        manufacturer: medicineToEdit.manufacturer || '',
        description: medicineToEdit.description || '',
        dosage: medicineToEdit.dosage || ''
      });
    } else {
      setForm({
        name: '',
        genericName: '',
        category: 'fever',
        batchNo: `BTC-${Math.floor(1000 + Math.random() * 9000)}`,
        rackNo: 'A1-01',
        price: '',
        stock: '',
        minStock: 20,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturer: '',
        description: '',
        dosage: ''
      });
    }
  }, [medicineToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      minStock: Number(form.minStock)
    };

    if (medicineToEdit) {
      updateMedicine(medicineToEdit.id, payload);
    } else {
      addMedicine(payload);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl p-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-400" />
            {medicineToEdit ? 'Edit Medicine Details' : 'Add New Medicine to Stock'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Medicine Name</label>
              <input
                type="text"
                placeholder="e.g. Dolo 650mg, Combiflam"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Generic Chemical Composition</label>
              <input
                type="text"
                placeholder="e.g. Paracetamol 650mg"
                value={form.genericName}
                onChange={(e) => setForm({ ...form, genericName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Number</label>
              <input
                type="text"
                value={form.batchNo}
                onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rack / Shelf Location</label>
              <input
                type="text"
                placeholder="e.g. A1-02"
                value={form.rackNo}
                onChange={(e) => setForm({ ...form, rackNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Alert Threshold</label>
              <input
                type="number"
                min="1"
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. Cipla, Sun Pharma"
                value={form.manufacturer}
                onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gradient-bg-primary text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{medicineToEdit ? 'Save Changes' : 'Add to Inventory'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
