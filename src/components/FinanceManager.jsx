import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  PieChart, 
  FileSpreadsheet, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet,
  X,
  CreditCard
} from 'lucide-react';

export const FinanceManager = () => {
  const { medicines, expenses, addExpense, deleteExpense, suppliers, udhaarList } = useApp();

  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expForm, setExpForm] = useState({
    title: '',
    category: 'Utilities',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  // Calculate Financial Metrics
  const totalStockValue = medicines.reduce((sum, m) => sum + (m.stock * (m.costPrice || m.price * 0.75)), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Total Supplier Dues Owed (positive balance = we owe supplier)
  const totalSupplierDues = suppliers.reduce((sum, s) => sum + (s.dueBalance > 0 ? s.dueBalance : 0), 0);

  // Total Customer Udhaar Owed to us (receivables)
  const totalUdhaarReceivables = udhaarList.reduce((sum, u) => sum + Number(u.remainingAmount), 0);

  // Estimated Monthly Sales Income
  const estimatedMonthlySales = medicines.reduce((sum, m) => sum + (m.stock * m.price * 0.3), 0) + 35000;

  // Net Profit & Balance Sheet Net Position
  const netProfit = estimatedMonthlySales - totalExpenses;
  const netBalanceSheetWorth = totalStockValue + totalUdhaarReceivables - totalSupplierDues;

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (expForm.title && expForm.amount) {
      addExpense(expForm);
      setExpModalOpen(false);
      setExpForm({ title: '', category: 'Utilities', amount: '', date: new Date().toISOString().split('T')[0], note: '' });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 glass-card p-4 border-slate-300">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Income, Expenses & Pharmacy Balance Sheet
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Track shop income, daily/monthly expenses, profit-loss margin, and maintain your pharmacy balance sheet.
          </p>
        </div>

        <button
          onClick={() => setExpModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shop Expense</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Estimated Income */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Est. Monthly Income</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-emerald-700">₹{estimatedMonthlySales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Total retail sales & checks</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-rose-700">₹{totalExpenses.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Rent, power bill, wages, packing</p>
          </div>
        </div>

        {/* Net Monthly Profit */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Monthly Profit</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-amber-800">₹{netProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Income minus Expenses</p>
          </div>
        </div>

        {/* Total Inventory Stock Value */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inventory Asset Value</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-blue-900">₹{totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Total stock value in hand</p>
          </div>
        </div>

      </div>

      {/* Balance Sheet Summary Card */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
          <FileSpreadsheet className="w-4 h-4 text-amber-600" />
          <span>Pharmacy Balance Sheet Summary</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          {/* Assets */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1.5">
            <p className="font-bold text-emerald-800 uppercase text-[10px]">🟢 Total Assets (+)</p>
            <div className="flex justify-between text-slate-700">
              <span>Inventory Stock Value:</span>
              <span className="font-bold">₹{totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Customer Udhaar Receivables:</span>
              <span className="font-bold">₹{totalUdhaarReceivables.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Current Assets:</span>
              <span className="text-emerald-700">₹{(totalStockValue + totalUdhaarReceivables).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Liabilities */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1.5">
            <p className="font-bold text-rose-800 uppercase text-[10px]">🔴 Total Liabilities / Dues (-)</p>
            <div className="flex justify-between text-slate-700">
              <span>Supplier Outstanding Dues:</span>
              <span className="font-bold text-rose-700">₹{totalSupplierDues.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Shop Expenses Paid:</span>
              <span className="font-bold">₹{totalExpenses.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Current Liabilities:</span>
              <span className="text-rose-700">₹{(totalSupplierDues + totalExpenses).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Net Store Position */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 flex flex-col justify-between">
            <div>
              <p className="font-bold text-amber-900 uppercase text-[10px]">⚖️ Net Balance Sheet Position</p>
              <p className="text-[11px] text-slate-600 mt-1">Assets (Stock + Udhaar) minus Supplier Liabilities</p>
            </div>
            <div className="pt-2 border-t border-amber-200">
              <span className="block text-[10px] font-bold text-amber-800">Net Business Position:</span>
              <span className="text-xl font-extrabold text-amber-900">₹{netBalanceSheetWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Shop Expenses Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Recorded Shop Expenses</span>
          </h3>

          <button
            onClick={() => setExpModalOpen(true)}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            + Add Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Expense Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
                <th>Amount</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No shop expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="font-bold text-slate-900">{exp.title}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-300">
                        {exp.category}
                      </span>
                    </td>
                    <td className="text-slate-600 text-xs">{exp.date}</td>
                    <td className="text-slate-500 text-xs">{exp.note || '-'}</td>
                    <td className="font-extrabold text-rose-700">₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 rounded bg-slate-100 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                        title="Delete expense entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {expModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-5 max-w-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Add New Shop Expense
              </h3>
              <button onClick={() => setExpModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Shop Electricity Bill, Staff Wages"
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={expForm.category}
                    onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Utilities">Utilities (Power/Water)</option>
                    <option value="Rent">Shop Rent</option>
                    <option value="Salary">Staff Wages / Salary</option>
                    <option value="Supplies">Packing & Bags</option>
                    <option value="Transport">Transport / Freight</option>
                    <option value="Other">Other Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2500"
                    value={expForm.amount}
                    onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={expForm.date}
                  onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Additional details..."
                  value={expForm.note}
                  onChange={(e) => setExpForm({ ...expForm, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
