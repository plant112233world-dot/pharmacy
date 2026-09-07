import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Receipt, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard, 
  IndianRupee, 
  CheckCircle2, 
  AlertTriangle, 
  Pill,
  Printer
} from 'lucide-react';

export const BillingPOS = () => {
  const { 
    medicines, 
    patients, 
    completeTransaction, 
    setActiveInvoiceForPrint 
  } = useApp();

  const [cart, setCart] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('GUEST');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [discountInput, setDiscountInput] = useState(0);
  const [medSearch, setMedSearch] = useState('');

  // Filter medicines for live dropdown search
  const availableMedicines = medicines.filter(m => {
    const q = medSearch.toLowerCase();
    return q && (
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.batchNo.toLowerCase().includes(q)
    );
  }).slice(0, 6);

  const addToCart = (med) => {
    if (med.stock <= 0) {
      alert(`Cannot add ${med.name}. Item is out of stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if (existing.quantity >= med.stock) {
          alert(`Maximum stock available for ${med.name} is ${med.stock} units.`);
          return prev;
        }
        return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...med, quantity: 1 }];
      }
    });
    setMedSearch('');
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const med = medicines.find(m => m.id === id);
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (med && newQty > med.stock) {
          alert(`Only ${med.stock} units available in stock for ${med.name}.`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const netTotal = Math.max(0, subtotal + tax - Number(discountInput));

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const patientObj = patients.find(p => p.id === selectedPatientId) || null;
    const tx = completeTransaction(cart, patientObj, paymentMethod, Number(discountInput));
    
    if (tx) {
      // Trigger Confetti Effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      setCart([]);
      setDiscountInput(0);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-teal-400" />
            POS Counter Billing & Dispense Terminal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fast billing system with automatic real-time stock deduction and GST invoice generation.
          </p>
        </div>
      </div>

      {/* POS Grid: Search/Select Left, Cart/Invoice Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Item Selection & Patient Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Patient Selector */}
          <div className="glass-card p-5 border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Select Patient for Bill</span>
            </label>

            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
            >
              <option value="GUEST">🛍️ Walk-in Guest / Counter Sale</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  👤 {p.name} ({p.phone}) - {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          {/* Medicine Search Box */}
          <div className="glass-card p-5 border-slate-800 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-400" />
              <span>Search Medicine to Add</span>
            </label>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Type Medicine Name, Generic Name, Batch No..."
                value={medSearch}
                onChange={(e) => setMedSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Live Search Suggestions Dropdown */}
            {medSearch && (
              <div className="absolute left-5 right-5 top-20 z-30 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
                {availableMedicines.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 text-center">No medicines match search term</div>
                ) : (
                  availableMedicines.map(med => (
                    <div
                      key={med.id}
                      onClick={() => addToCart(med)}
                      className="p-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition"
                    >
                      <div>
                        <p className="font-bold text-sm text-white">{med.name}</p>
                        <p className="text-xs text-slate-400">{med.genericName} | Batch: {med.batchNo}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-extrabold text-teal-400 text-sm">₹{med.price.toFixed(2)}</p>
                        <p className={`text-[10px] font-bold ${med.stock <= med.minStock ? 'text-amber-400' : 'text-slate-400'}`}>
                          Stock: {med.stock} units
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Select Popular Medicines Grid */}
          <div className="glass-card p-5 border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              ⚡ Quick Select Medicines
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {medicines.slice(0, 6).map(med => (
                <button
                  key={med.id}
                  onClick={() => addToCart(med)}
                  disabled={med.stock <= 0}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 text-left transition group disabled:opacity-50"
                >
                  <p className="font-bold text-xs text-slate-200 line-clamp-1 group-hover:text-teal-400 transition">{med.name}</p>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-slate-400">₹{med.price}</span>
                    <span className="text-teal-400 font-bold">Qty: {med.stock}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Billing Cart & Checkout (5 cols) */}
        <div className="lg:col-span-5">
          <div className="glass-card p-5 border-teal-500/20 sticky top-24 flex flex-col justify-between h-[calc(100vh-8rem)]">
            
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-teal-400" />
                  Billing Cart ({cart.length} items)
                </h3>
                {cart.length > 0 && (
                  <button 
                    onClick={() => setCart([])}
                    className="text-xs text-rose-400 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Cart Items Table */}
              <div className="space-y-2.5 overflow-y-auto max-h-64 pr-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Cart is empty. Search or click medicines on the left to add items.
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-100 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400">₹{item.price.toFixed(2)} / unit</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[60px]">
                        <p className="font-extrabold text-teal-400 text-xs">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calculations & Payment Checkout */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              
              {/* Payment Method */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="UPI / QR Code">📲 UPI / GPay / PhonePe</option>
                  <option value="Cash">💵 Cash Payment</option>
                  <option value="Credit Card">💳 Credit / Debit Card</option>
                  <option value="Net Banking">🏦 Net Banking</option>
                </select>
              </div>

              {/* Subtotal, Tax, Discount Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>+₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount (₹):</span>
                  <input
                    type="number"
                    min="0"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-right text-xs text-teal-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Net Amount:</span>
                  <span className="text-teal-400">₹{netTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3 rounded-xl gradient-bg-primary text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Sale & Print Invoice</span>
              </button>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
