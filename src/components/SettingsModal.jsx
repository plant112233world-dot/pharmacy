import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Store, 
  User, 
  Phone, 
  FileText, 
  MapPin, 
  X, 
  Check, 
  Award, 
  Upload, 
  Download, 
  HardDrive, 
  Image as ImageIcon 
} from 'lucide-react';

const LOGO_OPTIONS = ['💊', '⚕️', '🏥', '🩺', '💉', '🧪', '🌿', '🪪'];

export const SettingsModal = ({ isOpen, onClose }) => {
  const { shopInfo, setShopInfo, exportBackupJSON, importBackupJSON, showToast } = useApp();

  const [form, setForm] = useState({
    name: shopInfo.name || 'Yellow Pharmacy',
    logoIcon: shopInfo.logoIcon || '💊',
    owner: shopInfo.owner || 'Dr. Rajesh Sharma, B.Pharm',
    phone: shopInfo.phone || '+91 98765 43210',
    licenseNo: shopInfo.licenseNo || 'DL-2024-8849X',
    address: shopInfo.address || 'Shop No. 12, Main Market, Delhi',
    gstNo: shopInfo.gstNo || '07AAAAA0000A1Z5'
  });

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file too large! Please choose an image smaller than 2MB.', 'danger');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setForm(prev => ({ ...prev, logoIcon: uploadEvent.target.result }));
        showToast('Logo image uploaded successfully! Click Save to apply.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJSONFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          importBackupJSON(parsed);
          onClose();
        } catch (err) {
          showToast('Failed to parse backup JSON file: ' + err.message, 'danger');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShopInfo(form);
    showToast('Shop Profile & Settings updated successfully!', 'success');
    onClose();
  };

  const isCustomImage = form.logoIcon && (form.logoIcon.startsWith('data:image/') || form.logoIcon.startsWith('http') || form.logoIcon.startsWith('/'));

  return (
    <div className="modal-overlay">
      <div className="modal-content p-5 max-w-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Shop Profile & Settings</h3>
              <p className="text-[11px] text-slate-500">Update shop details, custom logo image, and manage database backup files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Shop Logo Section */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Shop Icon / Custom Logo Image</label>
              
              {/* Current Preview */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-500">Current Logo:</span>
                <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                  {isCustomImage ? (
                    <img src={form.logoIcon} alt="Shop Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">{form.logoIcon}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Emoji Option Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {LOGO_OPTIONS.map((logo) => (
                <button
                  type="button"
                  key={logo}
                  onClick={() => setForm({ ...form, logoIcon: logo })}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition border cursor-pointer shrink-0 ${
                    form.logoIcon === logo
                      ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500/20 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {logo}
                </button>
              ))}
            </div>

            {/* Upload Custom Media Image File */}
            <div className="pt-1.5 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <label
                htmlFor="logoUploadInput"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-amber-500 text-slate-700 font-bold text-xs shadow-sm cursor-pointer transition"
              >
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>Upload Logo Photo / File</span>
              </label>
              <input
                type="file"
                id="logoUploadInput"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <span className="text-[10px] text-slate-500">Supported: PNG, JPG, WEBP (Max 2MB)</span>
            </div>
          </div>

          {/* Shop Name & Owner Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Pharmacy Shop Name</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Pharmacist / Owner Name</span>
              </label>
              <input
                type="text"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Phone & License */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Mobile Phone Number</span>
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Drug License Number</span>
              </label>
              <input
                type="text"
                value={form.licenseNo}
                onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* GST & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>GSTIN Number (Optional)</span>
              </label>
              <input
                type="text"
                value={form.gstNo}
                onChange={(e) => setForm({ ...form, gstNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Shop Address</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* REAL PROJECT JSON DATABASE PERSISTENCE SECTION */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                <HardDrive className="w-4 h-4 text-amber-600" />
                <span>Project File Database: src/data/db.json</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                🟢 Live Auto-Saved to Disk
              </span>
            </div>

            <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
              All inventory stock items, prices, supplier ledgers, expenses, customer udhaar credit, and shop settings are automatically saved directly into <strong>src/data/db.json</strong> inside this project. When you open or upload this project folder on any PC or server, all your data is permanently preserved without requiring any external database setup!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
