import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Plus, 
  Search, 
  Building2, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  BookOpen,
  X,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export const SupplierUdhaarManager = () => {
  const { 
    suppliers, 
    addSupplier, 
    recordSupplierPayment, 
    udhaarList, 
    addCustomerUdhaar, 
    payCustomerUdhaar 
  } = useApp();

  const [activeSection, setActiveSection] = useState('suppliers'); // 'suppliers' or 'udhaar'

  // Supplier Modals
  const [supModalOpen, setSupModalOpen] = useState(false);
  const [supForm, setSupForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    dueBalance: '',
    suppliedMedicines: ''
  });

  const [paySupModal, setPaySupModal] = useState({ open: false, supplier: null, amount: '' });

  // Customer Udhaar Modals
  const [udhModalOpen, setUdhModalOpen] = useState(false);
  const [udhForm, setUdhForm] = useState({
    customerName: '',
    phone: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDueAmount: '',
    paidAmount: 0,
    notes: ''
  });

  const [payUdhModal, setPayUdhModal] = useState({ open: false, udhaar: null, amount: '' });

  // Calculations
  const totalSupplierDue = suppliers.reduce((sum, s) => sum + (s.dueBalance > 0 ? s.dueBalance : 0), 0);
  const totalUdhaarReceivable = udhaarList.reduce((sum, u) => sum + u.remainingAmount, 0);

  const handleSupSubmit = (e) => {
    e.preventDefault();
    if (supForm.name) {
      addSupplier(supForm);
      setSupModalOpen(false);
      setSupForm({ name: '', contactPerson: '', phone: '', address: '', dueBalance: '', suppliedMedicines: '' });
    }
  };

  const handlePaySupSubmit = (e) => {
    e.preventDefault();
    if (paySupModal.supplier && paySupModal.amount) {
      recordSupplierPayment(paySupModal.supplier.id, paySupModal.amount);
      setPaySupModal({ open: false, supplier: null, amount: '' });
    }
  };

  const handleUdhSubmit = (e) => {
    e.preventDefault();
    if (udhForm.customerName && udhForm.totalDueAmount) {
      addCustomerUdhaar(udhForm);
      setUdhModalOpen(false);
      setUdhForm({
        customerName: '',
        phone: '',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalDueAmount: '',
        paidAmount: 0,
        notes: ''
      });
    }
  };

  const handlePayUdhSubmit = (e) => {
    e.preventDefault();
    if (payUdhModal.udhaar && payUdhModal.amount) {
      payCustomerUdhaar(payUdhModal.udhaar.id, payUdhModal.amount);
      setPayUdhModal({ open: false, udhaar: null, amount: '' });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 glass-card p-4 border-slate-300">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            Supplier Lenden Ledger & Customer Udhaar Credit Book
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage wholesale supplier accounts, track stock purchase dues (+ owed / - surplus), and customer credit (Udhaar) receivables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-300">
            <button
              onClick={() => setActiveSection('suppliers')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeSection === 'suppliers' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🏭 Supplier Lenden ({suppliers.length})
            </button>

            <button
              onClick={() => setActiveSection('udhaar')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeSection === 'udhaar' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              📖 Customer Udhaar Book ({udhaarList.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Supplier Dues (Owed by Us)</span>
            <div className="text-xl font-extrabold text-rose-700 mt-1">₹{totalSupplierDue.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Outstanding balance payable to suppliers</p>
          </div>
          <button
            onClick={() => setSupModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-sm"
          >
            + Add Supplier
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Udhaar (Receivables)</span>
            <div className="text-xl font-extrabold text-emerald-700 mt-1">₹{totalUdhaarReceivable.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Pending credit amount to collect from customers</p>
          </div>
          <button
            onClick={() => setUdhModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-sm"
          >
            + Add Udhaar Entry
          </button>
        </div>
      </div>

      {/* SECTION 1: Supplier Lenden Ledger */}
      {activeSection === 'suppliers' && (
        <div className="glass-card overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Registered Wholesale Suppliers Ledger</span>
            </h3>

            <button
              onClick={() => setSupModalOpen(true)}
              className="px-3 py-1 rounded bg-amber-600 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              + Add Supplier
            </button>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Supplier Name & Contact</th>
                  <th>Supplied Medicines</th>
                  <th>Address</th>
                  <th>Due Balance (Lenden)</th>
                  <th className="text-right">Payment Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(sup => {
                  const isOwed = sup.dueBalance > 0;
                  const isSurplus = sup.dueBalance < 0;

                  return (
                    <tr key={sup.id} className="hover:bg-slate-50">
                      
                      <td>
                        <div className="font-bold text-slate-900">{sup.name}</div>
                        <div className="text-xs text-slate-500">{sup.contactPerson} | {sup.phone}</div>
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(sup.suppliedMedicines) ? (
                            sup.suppliedMedicines.map((med, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                {med}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">-</span>
                          )}
                        </div>
                      </td>

                      <td className="text-xs text-slate-600 max-w-xs">{sup.address}</td>

                      <td>
                        {isOwed ? (
                          <div>
                            <span className="font-extrabold text-rose-700 text-xs">₹{Math.abs(sup.dueBalance).toLocaleString('en-IN')} (Due Owed)</span>
                            <span className="block text-[10px] text-rose-600 font-semibold">Payment Pending</span>
                          </div>
                        ) : isSurplus ? (
                          <div>
                            <span className="font-extrabold text-emerald-700 text-xs">₹{Math.abs(sup.dueBalance).toLocaleString('en-IN')} (Surplus)</span>
                            <span className="block text-[10px] text-emerald-600 font-semibold">Advance Paid</span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded badge-success text-[10px] font-bold">Clear (₹0)</span>
                        )}
                      </td>

                      <td className="text-right">
                        <button
                          onClick={() => setPaySupModal({ open: true, supplier: sup, amount: Math.max(0, sup.dueBalance) })}
                          className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white font-bold text-xs border border-amber-300 transition cursor-pointer"
                        >
                          Record Payment
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: Customer Udhaar Book */}
      {activeSection === 'udhaar' && (
        <div className="glass-card overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Customer Credit (Udhaar) Accounts</span>
            </h3>

            <button
              onClick={() => setUdhModalOpen(true)}
              className="px-3 py-1 rounded bg-amber-600 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              + Add Udhaar Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Customer Name & Phone</th>
                  <th>Due Promise Date</th>
                  <th>Total Due</th>
                  <th>Paid Amount</th>
                  <th>Remaining Debt</th>
                  <th className="text-right">Receive Payment</th>
                </tr>
              </thead>
              <tbody>
                {udhaarList.map(udh => {
                  const isCleared = udh.remainingAmount <= 0;

                  return (
                    <tr key={udh.id} className="hover:bg-slate-50">
                      
                      <td>
                        <div className="font-bold text-slate-900">{udh.customerName}</div>
                        <div className="text-xs text-slate-500">{udh.phone}</div>
                        {udh.notes && <div className="text-[10px] text-slate-400 mt-0.5">{udh.notes}</div>}
                      </td>

                      <td className="text-xs font-semibold text-slate-700">{udh.dueDate}</td>

                      <td className="font-bold text-slate-900 text-xs">₹{Number(udh.totalDueAmount).toLocaleString('en-IN')}</td>
                      
                      <td className="text-emerald-700 font-bold text-xs">₹{Number(udh.paidAmount).toLocaleString('en-IN')}</td>

                      <td>
                        {isCleared ? (
                          <span className="px-2 py-0.5 rounded badge-success text-[10px] font-bold">🟢 CLEARED (₹0)</span>
                        ) : (
                          <span className="font-extrabold text-rose-700 text-xs">₹{Number(udh.remainingAmount).toLocaleString('en-IN')} Due</span>
                        )}
                      </td>

                      <td className="text-right">
                        {!isCleared && (
                          <button
                            onClick={() => setPayUdhModal({ open: true, udhaar: udh, amount: udh.remainingAmount })}
                            className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-700 text-emerald-900 hover:text-white font-bold text-xs border border-emerald-300 transition cursor-pointer"
                          >
                            Receive Payment
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {supModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Add New Wholesale Supplier
              </h3>
              <button onClick={() => setSupModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Agency Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sun Pharma Agency"
                  value={supForm.name}
                  onChange={(e) => setSupForm({ ...supForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Suresh Kumar"
                    value={supForm.contactPerson}
                    onChange={(e) => setSupForm({ ...supForm, contactPerson: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={supForm.phone}
                    onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Outstanding Due Balance (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000 (Positive = Owed to Supplier)"
                  value={supForm.dueBalance}
                  onChange={(e) => setSupForm({ ...supForm, dueBalance: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplied Medicines (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Dolo 650mg, Combiflam, Pantocid"
                  value={supForm.suppliedMedicines}
                  onChange={(e) => setSupForm({ ...supForm, suppliedMedicines: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Market address..."
                  value={supForm.address}
                  onChange={(e) => setSupForm({ ...supForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSupModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Supplier Modal */}
      {paySupModal.open && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-md">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Supplier Payment</h3>
            <p className="text-xs text-slate-600 mb-3">Supplier: <strong>{paySupModal.supplier?.name}</strong></p>

            <form onSubmit={handlePaySupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Amount Paid (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={paySupModal.amount}
                  onChange={(e) => setPaySupModal({ ...paySupModal, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaySupModal({ open: false, supplier: null, amount: '' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Udhaar Modal */}
      {udhModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Add Customer Udhaar Entry
              </h3>
              <button onClick={() => setUdhModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUdhSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={udhForm.customerName}
                  onChange={(e) => setUdhForm({ ...udhForm, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={udhForm.phone}
                  onChange={(e) => setUdhForm({ ...udhForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Credit Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="850"
                    value={udhForm.totalDueAmount}
                    onChange={(e) => setUdhForm({ ...udhForm, totalDueAmount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Promise Date</label>
                  <input
                    type="date"
                    value={udhForm.dueDate}
                    onChange={(e) => setUdhForm({ ...udhForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Udhaar Reason / Medicine Details</label>
                <input
                  type="text"
                  placeholder="e.g. Bought Dolo & Pantocid on credit"
                  value={udhForm.notes}
                  onChange={(e) => setUdhForm({ ...udhForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setUdhModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Save Udhaar Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Customer Udhaar Modal */}
      {payUdhModal.open && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-md">
            <h3 className="text-base font-bold text-slate-900 mb-1">Receive Udhaar Payment</h3>
            <p className="text-xs text-slate-600 mb-3">Customer: <strong>{payUdhModal.udhaar?.customerName}</strong></p>

            <form onSubmit={handlePayUdhSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Received (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={payUdhModal.udhaar?.remainingAmount || 99999}
                  value={payUdhModal.amount}
                  onChange={(e) => setPayUdhModal({ ...payUdhModal, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayUdhModal({ open: false, udhaar: null, amount: '' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Receive Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
