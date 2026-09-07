import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, Store, CheckCircle2 } from 'lucide-react';

export const InvoiceModal = ({ invoiceData, onClose }) => {
  const { shopInfo } = useApp();

  if (!invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl p-6 shadow-2xl">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 print:hidden">
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Invoice Receipt Ready
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl gradient-bg-yellow text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-yellow-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-invoice" className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-800 text-xs space-y-4">
          
          {/* Header Pharmacy Info */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-amber-600 flex items-center gap-1.5">
                <Store className="w-5 h-5 text-amber-500" />
                {shopInfo.name}
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">{shopInfo.address}</p>
              <p className="text-slate-500 text-[11px]">Phone: {shopInfo.phone} | Lic No: {shopInfo.licenseNo}</p>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[10px] uppercase">
                RETAIL MEDICAL INVOICE
              </span>
              <p className="font-extrabold text-xs text-slate-900 mt-1.5">Invoice #{invoiceData.id}</p>
              <p className="text-slate-500 text-[11px]">Date & Time: {invoiceData.dateTime}</p>
            </div>
          </div>

          {/* Customer / Dispense Details */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase">Customer / Patient Name</p>
              <p className="font-bold text-sm text-slate-900">{invoiceData.customerName || 'Walk-in Customer'}</p>
              {invoiceData.customerPhone && (
                <p className="text-slate-500 text-[11px]">Mobile: {invoiceData.customerPhone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-bold text-[10px] uppercase">Payment Status</p>
              <span className="text-emerald-700 font-extrabold text-xs">PAID (CASH / UPI)</span>
            </div>
          </div>

          {/* Medicines List Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase bg-slate-50">
                <th className="py-2">Medicine Item</th>
                <th className="py-2 text-center">Batch</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 text-xs">
                  <td className="py-2.5 font-bold text-slate-900">
                    {item.name}
                    <span className="block text-[10px] text-slate-500 font-normal">{item.genericName}</span>
                  </td>
                  <td className="py-2.5 text-center text-slate-500 font-mono text-[11px]">{item.batchNo}</td>
                  <td className="py-2.5 text-center font-bold text-amber-700">{item.qty}</td>
                  <td className="py-2.5 text-right text-slate-700">₹{item.price.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-extrabold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Breakdown */}
          <div className="pt-2 flex justify-end">
            <div className="w-48 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{invoiceData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%):</span>
                <span>+₹{invoiceData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Net Total:</span>
                <span className="text-amber-600">₹{invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
            Thank you for visiting {shopInfo.name}! Store medicines below 25°C.
          </div>

        </div>

      </div>
    </div>
  );
};
