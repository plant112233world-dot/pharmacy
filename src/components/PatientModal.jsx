import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, X, Save } from 'lucide-react';

export const PatientModal = ({ isOpen, onClose }) => {
  const { addPatient } = useApp();

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    bloodGroup: 'B+',
    address: '',
    allergiesStr: '',
    medicalHistory: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const allergiesList = form.allergiesStr.split(',').map(s => s.trim()).filter(Boolean);
    
    addPatient({
      ...form,
      age: Number(form.age),
      allergies: allergiesList
    });

    setForm({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      bloodGroup: 'B+',
      address: '',
      allergiesStr: '',
      medicalHistory: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl p-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Register New Patient Profile
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Patient Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
              <select
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Known Drug / Food Allergies (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Aspirin, Sulfa drugs"
              value={form.allergiesStr}
              onChange={(e) => setForm({ ...form, allergiesStr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address</label>
            <input
              type="text"
              placeholder="House/Flat No, Area, City"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Medical Background / Chronic History</label>
            <textarea
              rows={2}
              placeholder="e.g. History of asthma, diabetes, seasonal allergies..."
              value={form.medicalHistory}
              onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
            />
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
              <span>Save Patient Record</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
