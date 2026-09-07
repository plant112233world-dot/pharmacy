import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  Plus, 
  Search, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCcw, 
  User, 
  FileText,
  X,
  Zap
} from 'lucide-react';

export const CustomerHealthManager = () => {
  const { healthRecords, setHealthRecords, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [newCheckupModalOpen, setNewCheckupModalOpen] = useState(false);
  const [checkupForm, setCheckupForm] = useState({
    customerName: '',
    phone: '',
    age: '',
    gender: 'Male',
    testType: 'Both (BP & Sugar)',
    bpSystolic: 120,
    bpDiastolic: 80,
    sugarLevel: 110,
    fee: 30,
    notes: ''
  });

  const [compareModalCustomer, setCompareModalCustomer] = useState(null);
  const [compareForm, setCompareForm] = useState({
    bpSystolic: 120,
    bpDiastolic: 80,
    sugarLevel: 110,
    fee: 30,
    notes: ''
  });

  const [viewHistoryCustomer, setViewHistoryCustomer] = useState(null);

  const evaluateHealthStatus = (sys, dia, sugar) => {
    const isBpHigh = sys >= 140 || dia >= 90;
    const isBpLow = sys < 90 || dia < 60;
    const isSugarHigh = sugar > 140;
    const isSugarLow = sugar < 70;

    if (isBpHigh || isSugarHigh) {
      return { status: 'HIGH_RISK', label: '🚨 High Level Alert', badgeColor: 'badge-expired font-bold' };
    }
    if (isBpLow || isSugarLow) {
      return { status: 'LOW_RISK', label: '⚠️ Low Level Alert', badgeColor: 'badge-warning font-bold' };
    }
    return { status: 'HEALTHY', label: '🟢 Safe & Normal Level', badgeColor: 'badge-success font-bold' };
  };

  const handleNewCheckupSubmit = (e) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const newTest = {
      id: `TST-${Date.now()}`,
      date: todayStr,
      bpSystolic: Number(checkupForm.bpSystolic),
      bpDiastolic: Number(checkupForm.bpDiastolic),
      sugarLevel: Number(checkupForm.sugarLevel),
      testType: checkupForm.testType,
      fee: Number(checkupForm.fee),
      notes: checkupForm.notes
    };

    const existingIndex = healthRecords.findIndex(
      r => r.customerName.toLowerCase() === checkupForm.customerName.toLowerCase()
    );

    if (existingIndex >= 0) {
      const updated = [...healthRecords];
      updated[existingIndex].testsHistory.unshift(newTest);
      setHealthRecords(updated);
    } else {
      const newCustomer = {
        id: `HLT-${Math.floor(100 + Math.random() * 900)}`,
        customerName: checkupForm.customerName,
        phone: checkupForm.phone,
        age: Number(checkupForm.age) || 35,
        gender: checkupForm.gender,
        testsHistory: [newTest]
      };
      setHealthRecords([newCustomer, ...healthRecords]);
    }

    showToast(`Health Checkup recorded for ${checkupForm.customerName}!`, 'success');
    setNewCheckupModalOpen(false);
    setCheckupForm({
      customerName: '',
      phone: '',
      age: '',
      gender: 'Male',
      testType: 'Both (BP & Sugar)',
      bpSystolic: 120,
      bpDiastolic: 80,
      sugarLevel: 110,
      fee: 30,
      notes: ''
    });
  };

  const handleOpenCompare = (customer) => {
    setCompareModalCustomer(customer);
    const latest = customer.testsHistory[0] || {};
    setCompareForm({
      bpSystolic: latest.bpSystolic || 120,
      bpDiastolic: latest.bpDiastolic || 80,
      sugarLevel: latest.sugarLevel || 110,
      fee: 30,
      notes: 'Monthly Follow-up Test'
    });
  };

  const handleCompareSubmit = (e) => {
    e.preventDefault();
    if (!compareModalCustomer) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newTest = {
      id: `TST-${Date.now()}`,
      date: todayStr,
      bpSystolic: Number(compareForm.bpSystolic),
      bpDiastolic: Number(compareForm.bpDiastolic),
      sugarLevel: Number(compareForm.sugarLevel),
      testType: 'Both (BP & Sugar)',
      fee: Number(compareForm.fee),
      notes: compareForm.notes
    };

    setHealthRecords(prev => prev.map(c => {
      if (c.id === compareModalCustomer.id) {
        return {
          ...c,
          testsHistory: [newTest, ...c.testsHistory]
        };
      }
      return c;
    }));

    showToast(`Saved new visit readings & comparison for ${compareModalCustomer.customerName}!`, 'success');
    setCompareModalCustomer(null);
  };

  const filteredRecords = healthRecords.filter(r => {
    const q = searchQuery.toLowerCase();
    return !q || r.customerName.toLowerCase().includes(q) || r.phone.includes(q);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 glass-card p-4 border-slate-300">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            Customer Health Checkups (BP & Sugar Test Compare)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Track customer BP (Free) & Sugar Test (₹30-40) history, compare monthly health progress, and view health status indicators.
          </p>
        </div>

        <button
          onClick={() => setNewCheckupModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Health Checkup (+)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name or phone number (e.g. Ankit Sharma)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredRecords.map(customer => {
          const latestTest = customer.testsHistory[0];
          const evalRes = latestTest ? evaluateHealthStatus(latestTest.bpSystolic, latestTest.bpDiastolic, latestTest.sugarLevel) : null;

          return (
            <div key={customer.id} className="glass-card p-4 flex flex-col justify-between hover:border-amber-500 transition">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-amber-600" />
                      {customer.customerName}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{customer.phone} | Age: {customer.age}y ({customer.gender})</p>
                  </div>
                  {evalRes && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${evalRes.badgeColor}`}>
                      {evalRes.status === 'HEALTHY' ? '🟢 Safe' : evalRes.status === 'HIGH_RISK' ? '🔴 High Risk' : '🟡 Low Risk'}
                    </span>
                  )}
                </div>

                {latestTest ? (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-slate-700 font-semibold">BP Checkup:</span>
                      </div>
                      <span className={`font-extrabold text-xs ${
                        latestTest.bpSystolic >= 140 ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        {latestTest.bpSystolic}/{latestTest.bpDiastolic} mmHg
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-slate-700 font-semibold">Sugar Test:</span>
                      </div>
                      <span className={`font-extrabold text-xs ${
                        latestTest.sugarLevel > 140 ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        {latestTest.sugarLevel} mg/dL
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                      <span>Last Checked: {latestTest.date}</span>
                      <span className="text-amber-800 font-bold">Fee Charged: ₹{latestTest.fee}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">No checkup recorded yet.</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewHistoryCustomer(customer)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 border border-slate-300 transition flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-slate-600" />
                  <span>History ({customer.testsHistory.length})</span>
                </button>

                <button
                  onClick={() => handleOpenCompare(customer)}
                  className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Compare / New Visit</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Compare Modal */}
      {compareModalCustomer && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl p-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-amber-600" />
                Compare Monthly Health Readings ({compareModalCustomer.customerName})
              </h3>
              <button onClick={() => setCompareModalCustomer(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-md bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mb-3 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
                <span>⏮️ Previous Test Reading ({compareModalCustomer.testsHistory[0]?.date})</span>
                <span className="text-amber-700 font-bold">Previous Record</span>
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-white border border-amber-200">
                  <span className="text-slate-500 block text-[10px]">Previous BP</span>
                  <span className={`font-extrabold text-xs ${
                    compareModalCustomer.testsHistory[0]?.bpSystolic >= 140 ? 'text-rose-700' : 'text-emerald-700'
                  }`}>
                    {compareModalCustomer.testsHistory[0]?.bpSystolic || 120}/{compareModalCustomer.testsHistory[0]?.bpDiastolic || 80} mmHg
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-amber-200">
                  <span className="text-slate-500 block text-[10px]">Previous Sugar</span>
                  <span className={`font-extrabold text-xs ${
                    compareModalCustomer.testsHistory[0]?.sugarLevel > 140 ? 'text-rose-700' : 'text-emerald-700'
                  }`}>
                    {compareModalCustomer.testsHistory[0]?.sugarLevel || 110} mg/dL
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCompareSubmit} className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                🆕 Enter Today's New Visit Readings
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New BP (Systolic / Diastolic)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="120"
                      value={compareForm.bpSystolic}
                      onChange={(e) => setCompareForm({ ...compareForm, bpSystolic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                      required
                    />
                    <span className="text-slate-400 font-bold">/</span>
                    <input
                      type="number"
                      placeholder="80"
                      value={compareForm.bpDiastolic}
                      onChange={(e) => setCompareForm({ ...compareForm, bpDiastolic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Sugar Level (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="110"
                    value={compareForm.sugarLevel}
                    onChange={(e) => setCompareForm({ ...compareForm, sugarLevel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Test Fee Charged (₹)</label>
                  <input
                    type="number"
                    value={compareForm.fee}
                    onChange={(e) => setCompareForm({ ...compareForm, fee: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Checkup Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly follow-up"
                    value={compareForm.notes}
                    onChange={(e) => setCompareForm({ ...compareForm, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Health Progress Comparison</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    BP: {compareModalCustomer.testsHistory[0]?.bpSystolic || 120} ➔ {compareForm.bpSystolic} | Sugar: {compareModalCustomer.testsHistory[0]?.sugarLevel || 110} ➔ {compareForm.sugarLevel}
                  </p>
                </div>

                {evaluateHealthStatus(Number(compareForm.bpSystolic), Number(compareForm.bpDiastolic), Number(compareForm.sugarLevel)).status === 'HEALTHY' ? (
                  <span className="px-2.5 py-0.5 rounded-full badge-success font-extrabold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 🟢 Safe & Normal
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full badge-expired font-extrabold text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> 🔴 High Risk Alert
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCompareModalCustomer(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Save New Visit & Compare
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* New Health Checkup Modal */}
      {newCheckupModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl p-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Record New Customer Health Checkup
              </h3>
              <button onClick={() => setNewCheckupModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-md bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleNewCheckupSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ankit Sharma"
                    value={checkupForm.customerName}
                    onChange={(e) => setCheckupForm({ ...checkupForm, customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={checkupForm.phone}
                    onChange={(e) => setCheckupForm({ ...checkupForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="40"
                    value={checkupForm.age}
                    onChange={(e) => setCheckupForm({ ...checkupForm, age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={checkupForm.gender}
                    onChange={(e) => setCheckupForm({ ...checkupForm, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Test Service</label>
                  <select
                    value={checkupForm.testType}
                    onChange={(e) => {
                      const val = e.target.value;
                      const fee = val.includes('Sugar') || val.includes('Both') ? 30 : 0;
                      setCheckupForm({ ...checkupForm, testType: val, fee });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Both (BP & Sugar)">Both BP (Free) & Sugar (₹30)</option>
                    <option value="BP Free Checkup">BP Checkup Only (Free)</option>
                    <option value="Sugar Test">Sugar Test Only (₹30)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">BP (Systolic / Diastolic)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="120"
                      value={checkupForm.bpSystolic}
                      onChange={(e) => setCheckupForm({ ...checkupForm, bpSystolic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-slate-400 font-bold">/</span>
                    <input
                      type="number"
                      placeholder="80"
                      value={checkupForm.bpDiastolic}
                      onChange={(e) => setCheckupForm({ ...checkupForm, bpDiastolic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sugar Level (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="110"
                    value={checkupForm.sugarLevel}
                    onChange={(e) => setCheckupForm({ ...checkupForm, sugarLevel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Test Fee Charged (₹)</label>
                <input
                  type="number"
                  value={checkupForm.fee}
                  onChange={(e) => setCheckupForm({ ...checkupForm, fee: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setNewCheckupModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Save Health Checkup
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* History Drawer Modal */}
      {viewHistoryCustomer && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Checkup History: {viewHistoryCustomer.customerName}
              </h3>
              <button onClick={() => setViewHistoryCustomer(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-md bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {viewHistoryCustomer.testsHistory.map((test, idx) => {
                const evalRes = evaluateHealthStatus(test.bpSystolic, test.bpDiastolic, test.sugarLevel);
                return (
                  <div key={test.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>Visit #{viewHistoryCustomer.testsHistory.length - idx} - {test.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${evalRes.badgeColor}`}>
                        {evalRes.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 pt-0.5">
                      <p>BP: <strong>{test.bpSystolic}/{test.bpDiastolic} mmHg</strong></p>
                      <p>Sugar: <strong>{test.sugarLevel} mg/dL</strong></p>
                    </div>
                    {test.notes && <p className="text-slate-500 text-[10px] pt-0.5">Note: {test.notes}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
