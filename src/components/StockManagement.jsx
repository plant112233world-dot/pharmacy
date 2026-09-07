import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CheckCircle2,
  Thermometer,
  Zap,
  Activity,
  ShieldAlert,
  Wind,
  Droplets,
  HeartPulse,
  Cross,
  Layers
} from 'lucide-react';

export const StockManagement = ({ onOpenAddMed, onEditMed }) => {
  const { 
    medicines, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    deleteMedicine,
    restockMedicine,
    isMedicineExpired,
    isMedicineExpiringSoon
  } = useApp();

  const [stockFilter, setStockFilter] = useState('all'); // all, low, in_stock, out_stock
  const [expiryFilter, setExpiryFilter] = useState('all'); // all, valid, expiring_soon, expired
  const [sortBy, setSortBy] = useState('name'); // name, price, stock, expiry

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

  // Restock modal state
  const [restockModalItem, setRestockModalItem] = useState(null);
  const [restockQtyInput, setRestockQtyInput] = useState(50);

  // Filtering Logic
  const filteredMedicines = medicines.filter(med => {
    // Search query filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      med.name.toLowerCase().includes(query) ||
      med.genericName.toLowerCase().includes(query) ||
      med.batchNo.toLowerCase().includes(query) ||
      med.rackNo.toLowerCase().includes(query);

    // Category filter
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;

    // Stock level filter
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = med.stock <= med.minStock;
    else if (stockFilter === 'in_stock') matchesStock = med.stock > med.minStock;
    else if (stockFilter === 'out_stock') matchesStock = med.stock === 0;

    // Expiry status filter
    let matchesExpiry = true;
    const isExpired = isMedicineExpired(med.expiryDate);
    const isExpSoon = isMedicineExpiringSoon(med.expiryDate);
    if (expiryFilter === 'expired') matchesExpiry = isExpired;
    else if (expiryFilter === 'expiring_soon') matchesExpiry = isExpSoon;
    else if (expiryFilter === 'valid') matchesExpiry = !isExpired && !isExpSoon;

    return matchesSearch && matchesCategory && matchesStock && matchesExpiry;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'stock') return a.stock - b.stock;
    if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
    return 0;
  });

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (restockModalItem && restockQtyInput > 0) {
      restockMedicine(restockModalItem.id, restockQtyInput);
      setRestockModalItem(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Main Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-400" />
            Stock & Inventory Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage pharmacy stock items, real-time reorder levels, rack locations, and expiry statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddMed}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg-primary text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider Bar (Real Medical Categories) */}
      <div className="glass-card p-4 border-slate-800">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Category Filter</span>
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const IconComp = categoryIcons[cat.id] || Pill;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected 
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/20' 
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Secondary Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Medicine, Generic Name, Batch, Rack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Stock Level Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="low">⚠️ Low Stock Only</option>
              <option value="in_stock">✅ In Stock</option>
              <option value="out_stock">❌ Out of Stock</option>
            </select>
          </div>

          {/* Expiry Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Expiry:</span>
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="valid">Valid Date</option>
              <option value="expiring_soon">⏳ Expiring &lt;30 Days</option>
              <option value="expired">🚨 Expired Items</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="name">Name (A-Z)</option>
              <option value="stock">Stock Count</option>
              <option value="expiry">Expiry Date</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Medicines Table */}
      <div className="glass-card border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Medicine / Generic Name</th>
                <th>Category</th>
                <th>Batch / Rack</th>
                <th>Unit Price</th>
                <th>Stock Qty</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No medicines match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isExpired = isMedicineExpired(med.expiryDate);
                  const isExpSoon = isMedicineExpiringSoon(med.expiryDate);
                  const isLowStock = med.stock <= med.minStock;

                  const categoryObj = categories.find(c => c.id === med.category);

                  return (
                    <tr key={med.id} className="transition hover:bg-slate-800/40">
                      
                      {/* Name & Generic */}
                      <td>
                        <div className="font-bold text-slate-100 text-sm">{med.name}</div>
                        <div className="text-xs text-slate-400">{med.genericName}</div>
                      </td>

                      {/* Category Badge */}
                      <td>
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                          {categoryObj ? categoryObj.name.split(' ')[0] : med.category}
                        </span>
                      </td>

                      {/* Batch & Rack */}
                      <td>
                        <div className="text-xs font-mono text-slate-300">{med.batchNo}</div>
                        <div className="text-[11px] text-teal-400 font-semibold">Rack: {med.rackNo}</div>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="font-extrabold text-white text-sm">₹{med.price.toFixed(2)}</span>
                      </td>

                      {/* Stock Quantity */}
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-sm ${isLowStock ? 'text-amber-400' : 'text-slate-100'}`}>
                            {med.stock} units
                          </span>
                          {isLowStock && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded badge-warning font-bold">Low</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">Min Threshold: {med.minStock}</div>
                      </td>

                      {/* Expiry Date */}
                      <td>
                        <div className="text-xs font-medium text-slate-200">{med.expiryDate}</div>
                      </td>

                      {/* Expiry Status Badge */}
                      <td>
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full badge-expired text-[11px] font-extrabold flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> EXPIRED
                          </span>
                        ) : isExpSoon ? (
                          <span className="px-2.5 py-1 rounded-full badge-warning text-[11px] font-extrabold flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3" /> Expiring Soon
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full badge-success text-[11px] font-extrabold flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Restock Button */}
                          <button
                            onClick={() => setRestockModalItem(med)}
                            className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/30 text-teal-400 transition"
                            title="Restock medicine quantity"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => onEditMed(med)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Edit Medicine Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${med.name}?`)) {
                                deleteMedicine(med.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Quantity Modal */}
      {restockModalItem && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Restock Medicine Inventory
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add new stock for <strong className="text-slate-200">{restockModalItem.name}</strong> (Current Stock: {restockModalItem.stock} units)
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  value={restockQtyInput}
                  onChange={(e) => setRestockQtyInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gradient-bg-primary text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20"
                >
                  Confirm Restock (+{restockQtyInput})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
