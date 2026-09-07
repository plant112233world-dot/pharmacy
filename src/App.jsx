import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Toast } from './components/Toast';
import { FinanceManager } from './components/FinanceManager';
import { SupplierUdhaarManager } from './components/SupplierUdhaarManager';
import { CustomerHealthManager } from './components/CustomerHealthManager';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Edit, 
  Trash2, 
  RefreshCcw, 
  Store,
  Thermometer,
  HeartPulse,
  User,
  Activity,
  ShieldAlert,
  Zap,
  LayoutGrid,
  Filter,
  X,
  Stethoscope,
  TrendingUp,
  Building2,
  BookOpen,
  DollarSign,
  Settings,
  LogOut
} from 'lucide-react';

const categoryIcons = {
  all: LayoutGrid,
  fever_pain: Thermometer,
  human_health: HeartPulse,
  mens_health: User,
  stomach: Activity,
  antibiotics: ShieldAlert,
  vitamins: Zap
};

const MainAppContent = () => {
  const { 
    shopInfo, 
    medicines, 
    stockLogs,
    categories, 
    selectedCategory, 
    setSelectedCategory,
    stockFilter,
    setStockFilter,
    searchQuery,
    setSearchQuery,
    handleStockIn,
    handleStockOut,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    isMedicineExpired,
    isMedicineExpiringSoon,
    totalItemsCount,
    lowStockCount,
    expiredCount,
    expiringSoonCount,
    logout
  } = useApp();

  // Active Navigation Tab: 'stock', 'finance', 'suppliers_udhaar', 'health'
  const [activeTab, setActiveTab] = useState('stock');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [movementModal, setMovementModal] = useState({ open: false, item: null, type: 'IN', qty: 10, note: '' });

  // Add / Edit Form State
  const [medForm, setMedForm] = useState({
    name: '',
    genericName: '',
    category: 'fever_pain',
    batchNo: '',
    rackNo: 'Rack A-1',
    price: '',
    stock: '',
    minStock: 20,
    expiryDate: ''
  });

  const handleOpenAdd = () => {
    setEditMed(null);
    setMedForm({
      name: '',
      genericName: '',
      category: 'fever_pain',
      batchNo: `BTC-${Math.floor(1000 + Math.random() * 9000)}`,
      rackNo: 'Rack A-1',
      price: '',
      stock: '',
      minStock: 20,
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (med) => {
    setEditMed(med);
    setMedForm({
      name: med.name || '',
      genericName: med.genericName || '',
      category: med.category || 'fever_pain',
      batchNo: med.batchNo || '',
      rackNo: med.rackNo || 'Rack A-1',
      price: med.price || '',
      stock: med.stock || '',
      minStock: med.minStock || 20,
      expiryDate: med.expiryDate || ''
    });
    setAddModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...medForm,
      price: Number(medForm.price),
      stock: Number(medForm.stock),
      minStock: Number(medForm.minStock)
    };

    if (editMed) {
      updateMedicine(editMed.id, payload);
    } else {
      addMedicine(payload);
    }
    setAddModalOpen(false);
  };

  const handleMovementSubmit = (e) => {
    e.preventDefault();
    if (movementModal.item && movementModal.qty > 0) {
      if (movementModal.type === 'IN') {
        handleStockIn(movementModal.item.id, movementModal.qty, movementModal.note || 'Supplier Restock');
      } else {
        handleStockOut(movementModal.item.id, movementModal.qty, movementModal.note || 'Counter Dispense');
      }
      setMovementModal({ open: false, item: null, type: 'IN', qty: 10, note: '' });
    }
  };

  // Filter Medicines
  const filteredMedicines = medicines.filter(med => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      med.name.toLowerCase().includes(q) ||
      med.genericName.toLowerCase().includes(q) ||
      med.batchNo.toLowerCase().includes(q) ||
      med.rackNo.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;

    let matchesFilter = true;
    const isExp = isMedicineExpired(med.expiryDate);
    const isSoon = isMedicineExpiringSoon(med.expiryDate);
    const isLow = med.stock <= med.minStock;

    if (stockFilter === 'low_stock') matchesFilter = isLow;
    else if (stockFilter === 'expiring_soon') matchesFilter = isSoon;
    else if (stockFilter === 'expired') matchesFilter = isExp;
    else if (stockFilter === 'in_stock') matchesFilter = !isLow && !isExp;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const isCustomLogo = shopInfo.logoIcon && (shopInfo.logoIcon.startsWith('data:image/') || shopInfo.logoIcon.startsWith('http') || shopInfo.logoIcon.startsWith('/'));

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-900 p-4 md:p-6 space-y-4 font-sans">
      
      {/* Compact Clean Header Bar */}
      <header className="glass-card p-3 md:p-4 border-slate-300 space-y-3">
        {/* Top Shop Info & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0 overflow-hidden">
              {isCustomLogo ? (
                <img src={shopInfo.logoIcon} alt="Shop Logo" className="w-full h-full object-cover" />
              ) : (
                <span>{shopInfo.logoIcon || '💊'}</span>
              )}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {shopInfo.name || 'Yellow Pharmacy'}
                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">
                  Management System
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Lic: <strong>{shopInfo.licenseNo}</strong></span>
                <span>•</span>
                <span>Phone: <strong>{shopInfo.phone}</strong></span>
                <span>•</span>
                <span>Pharmacist: <strong>{shopInfo.owner}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {activeTab === 'stock' && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Medicine</span>
              </button>
            )}

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
              title="Edit Shop Settings & Profile"
            >
              <Settings className="w-3.5 h-3.5 text-amber-600" />
              <span>Settings</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Stock Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Income & Expenses (Balance Sheet)</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers_udhaar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'suppliers_udhaar'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Supplier Lenden & Udhaar</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'health'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Customer Health Checkups</span>
          </button>
        </div>
      </header>

      {/* VIEW 1: Stock Inventory Page */}
      {activeTab === 'stock' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Search Bar */}
          <div className="glass-card p-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medicine, generic name, batch, rack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* COMPACT STAT CARDS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            <div
              onClick={() => {
                setStockFilter('all');
                setSelectedCategory('all');
              }}
              className={`p-3.5 rounded-xl bg-white border cursor-pointer transition ${
                stockFilter === 'all' && selectedCategory === 'all' ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20' : 'border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Items</span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Pill className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900">{totalItemsCount}</div>
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Click to view all</p>
              </div>
            </div>

            <div
              onClick={() => setStockFilter('low_stock')}
              className={`p-3.5 rounded-xl bg-white border cursor-pointer transition ${
                stockFilter === 'low_stock' ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20' : 'border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900">{lowStockCount} Items</div>
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Click to view reorder</p>
              </div>
            </div>

            <div
              onClick={() => setStockFilter('expiring_soon')}
              className={`p-3.5 rounded-xl bg-white border cursor-pointer transition ${
                stockFilter === 'expiring_soon' ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20' : 'border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expiring &lt;30 Days</span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900">{expiringSoonCount} Items</div>
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Click to view near expiry</p>
              </div>
            </div>

            <div
              onClick={() => setStockFilter('expired')}
              className={`p-3.5 rounded-xl bg-white border cursor-pointer transition ${
                stockFilter === 'expired' ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500/20' : 'border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expired Stock</span>
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-extrabold text-slate-900">{expiredCount} Items</div>
                <p className="text-[10px] text-rose-700 font-semibold mt-0.5">Click to view expired</p>
              </div>
            </div>

          </div>

          {/* Category Pills Bar */}
          <div className="glass-card p-3 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Medical Categories</span>
            </p>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => {
                const IconComp = categoryIcons[cat.id] || Pill;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 glass-card p-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'low_stock', label: '⚠️ Low Stock' },
                { id: 'expiring_soon', label: '⏳ Expiring Soon' },
                { id: 'expired', label: '🚨 Expired' },
                { id: 'in_stock', label: '✅ Healthy Stock' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStockFilter(f.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    stockFilter === f.id
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Stock Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Medicine / Generic Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Batch / Rack</th>
                    <th>Price</th>
                    <th>Stock Qty</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th className="text-right">Stock Movement Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No medicine items found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map(med => {
                      const isExp = isMedicineExpired(med.expiryDate);
                      const isSoon = isMedicineExpiringSoon(med.expiryDate);
                      const isLow = med.stock <= med.minStock;
                      const categoryObj = categories.find(c => c.id === med.category);

                      return (
                        <tr key={med.id} className="transition hover:bg-slate-50">
                          
                          {/* Name & Generic */}
                          <td>
                            <div className="font-bold text-slate-900 text-xs">{med.name}</div>
                            <div className="text-[11px] text-slate-500">{med.genericName}</div>
                          </td>

                          {/* Category */}
                          <td>
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-300">
                              {categoryObj ? categoryObj.name : med.category}
                            </span>
                          </td>

                          {/* Supplier Name */}
                          <td>
                            <span className="text-xs font-semibold text-slate-700">{med.supplierName || 'Sun Pharma Agency'}</span>
                          </td>

                          {/* Batch & Rack */}
                          <td>
                            <div className="text-[11px] font-mono text-slate-700">{med.batchNo}</div>
                            <div className="text-[10px] text-amber-700 font-semibold">{med.rackNo}</div>
                          </td>

                          {/* Price */}
                          <td>
                            <span className="font-extrabold text-slate-900 text-xs">₹{med.price.toFixed(2)}</span>
                          </td>

                          {/* Stock Level */}
                          <td>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-extrabold text-xs ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                                {med.stock} units
                              </span>
                              {isLow && (
                                <span className="text-[9px] px-1 py-0.2 rounded badge-warning font-bold">Low</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">Min: {med.minStock}</div>
                          </td>

                          {/* Expiry Date */}
                          <td>
                            <div className="text-xs font-medium text-slate-700">{med.expiryDate}</div>
                          </td>

                          {/* Expiry Badge */}
                          <td>
                            {isExp ? (
                              <span className="px-2 py-0.5 rounded-md badge-expired text-[10px] font-extrabold">
                                🚨 EXPIRED
                              </span>
                            ) : isSoon ? (
                              <span className="px-2 py-0.5 rounded-md badge-warning text-[10px] font-extrabold">
                                ⏳ Expiring Soon
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md badge-success text-[10px] font-extrabold">
                                Healthy
                              </span>
                            )}
                          </td>

                          {/* Actions: Stock In (+) / Stock Out (-) */}
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Stock IN (+) */}
                              <button
                                onClick={() => setMovementModal({ open: true, item: med, type: 'IN', qty: 50, note: 'Supplier Restock' })}
                                className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-700 text-emerald-900 hover:text-white font-bold text-[11px] border border-emerald-300 transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                title="Add Stock In (+)"
                              >
                                <ArrowDownLeft className="w-3 h-3" />
                                <span>+ Stock In</span>
                              </button>

                              {/* Stock OUT (-) */}
                              <button
                                onClick={() => setMovementModal({ open: true, item: med, type: 'OUT', qty: 10, note: 'Counter Sale' })}
                                className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-700 text-rose-900 hover:text-white font-bold text-[11px] border border-rose-300 transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                title="Stock Out (-)"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                                <span>- Stock Out</span>
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(med)}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              >
                                <Edit className="w-3 h-3" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete ${med.name} from inventory?`)) {
                                    deleteMedicine(med.id);
                                  }
                                }}
                                className="p-1 rounded bg-slate-100 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
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

          {/* Recent Stock Movement Log */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <RefreshCcw className="w-3.5 h-3.5 text-amber-600" />
              Recent Stock Movement Log (Stock In / Stock Out)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {stockLogs.slice(0, 4).map(log => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{log.medicineName}</p>
                    <p className="text-[10px] text-slate-500">{log.note} | {log.date}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-black text-xs ${
                    log.type === 'IN' 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {log.type === 'IN' ? `+${log.qty}` : `-${log.qty}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: Income & Expenses (Balance Sheet) */}
      {activeTab === 'finance' && (
        <FinanceManager />
      )}

      {/* VIEW 3: Supplier Lenden & Customer Udhaar Book */}
      {activeTab === 'suppliers_udhaar' && (
        <SupplierUdhaarManager />
      )}

      {/* VIEW 4: Customer Health Checkups (BP & Sugar Test Compare) */}
      {activeTab === 'health' && (
        <CustomerHealthManager />
      )}

      {/* Stock In / Out Action Modal */}
      {movementModal.open && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-md">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              {movementModal.type === 'IN' ? (
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
              )}
              {movementModal.type === 'IN' ? 'Stock In (+ Received)' : 'Stock Out (- Dispensed/Sold)'}
            </h3>

            <p className="text-xs text-slate-600 mb-3">
              Medicine: <strong className="text-slate-900">{movementModal.item?.name}</strong> (Current Stock: {movementModal.item?.stock} units)
            </p>

            <form onSubmit={handleMovementSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={movementModal.qty}
                  onChange={(e) => setMovementModal({ ...movementModal, qty: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note / Reason</label>
                <input
                  type="text"
                  placeholder={movementModal.type === 'IN' ? 'e.g. Supplier Shipment' : 'e.g. Counter Sale'}
                  value={movementModal.note}
                  onChange={(e) => setMovementModal({ ...movementModal, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMovementModal({ open: false, item: null, type: 'IN', qty: 10, note: '' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold ${
                    movementModal.type === 'IN' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {movementModal.type === 'IN' ? `Stock In (+${movementModal.qty})` : `Stock Out (-${movementModal.qty})`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Add / Edit Medicine Modal */}
      {addModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-xl">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber-600" />
              {editMed ? 'Edit Medicine Item' : 'Add New Medicine Item'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dolo 650mg"
                    value={medForm.name}
                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Generic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol"
                    value={medForm.genericName}
                    onChange={(e) => setMedForm({ ...medForm, genericName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={medForm.category}
                    onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch No</label>
                  <input
                    type="text"
                    value={medForm.batchNo}
                    onChange={(e) => setMedForm({ ...medForm, batchNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rack Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Rack A-1"
                    value={medForm.rackNo}
                    onChange={(e) => setMedForm({ ...medForm, rackNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={medForm.price}
                    onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={medForm.stock}
                    onChange={(e) => setMedForm({ ...medForm, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="1"
                    value={medForm.minStock}
                    onChange={(e) => setMedForm({ ...medForm, minStock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={medForm.expiryDate}
                  onChange={(e) => setMedForm({ ...medForm, expiryDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  {editMed ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shop Profile Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Toast Notifications */}
      <Toast />

    </div>
  );
};

const MainAppWrapper = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return <MainAppContent />;
};

export default function App() {
  return (
    <AppProvider>
      <MainAppWrapper />
    </AppProvider>
  );
}
