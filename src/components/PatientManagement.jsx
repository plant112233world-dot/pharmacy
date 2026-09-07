import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle, 
  Upload, 
  Eye, 
  UserCheck, 
  Stethoscope, 
  Download, 
  X,
  FileCheck,
  Award
} from 'lucide-react';

export const PatientManagement = ({ onOpenAddPatient }) => {
  const { 
    patients, 
    addPatientReport, 
    addPatientPrescription,
    selectedPatientForView,
    setSelectedPatientForView
  } = useApp();

  const [patientSearch, setPatientSearch] = useState('');

  // Report Upload Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    doctor: '',
    labName: 'Apex Diagnostics',
    status: 'Normal',
    notes: '',
    fileName: 'Lab_Report_Scan.pdf',
    fileType: 'pdf'
  });

  // Prescription Modal
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [rxForm, setRxForm] = useState({
    doctor: 'Dr. A. K. Gupta',
    diagnosis: '',
    medicinesStr: '',
    duration: '5 days'
  });

  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return !q || 
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.bloodGroup && p.bloodGroup.toLowerCase().includes(q));
  });

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (selectedPatientForView && reportForm.title) {
      addPatientReport(selectedPatientForView.id, reportForm);
      setReportModalOpen(false);
      setReportForm({
        title: '',
        doctor: '',
        labName: 'Apex Diagnostics',
        status: 'Normal',
        notes: '',
        fileName: 'Lab_Report_Scan.pdf',
        fileType: 'pdf'
      });
    }
  };

  const handleRxSubmit = (e) => {
    e.preventDefault();
    if (selectedPatientForView && rxForm.diagnosis) {
      const medList = rxForm.medicinesStr.split(',').map(s => s.trim()).filter(Boolean);
      addPatientPrescription(selectedPatientForView.id, {
        doctor: rxForm.doctor,
        diagnosis: rxForm.diagnosis,
        medicines: medList.length > 0 ? medList : [rxForm.medicinesStr],
        duration: rxForm.duration
      });
      setRxModalOpen(false);
      setRxForm({ doctor: 'Dr. A. K. Gupta', diagnosis: '', medicinesStr: '', duration: '5 days' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Patient Directory & Diagnostic Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain patient medical records, lab reports, allergies, and historical prescriptions.
          </p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg-primary text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Patient Search */}
      <div className="glass-card p-4 border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient by Name, Phone Number, Patient ID (PAT-1001), Blood Group..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => {
          const reportCount = patient.reports ? patient.reports.length : 0;
          const rxCount = patient.prescriptions ? patient.prescriptions.length : 0;

          return (
            <div 
              key={patient.id}
              className="glass-card p-5 border-slate-800 hover:border-cyan-500/40 glass-card-hover flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                      {patient.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                        {patient.bloodGroup}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{patient.id} | Registered: {patient.registeredDate}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300">
                    {patient.gender}, {patient.age}y
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{patient.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="line-clamp-1">{patient.address}</span>
                  </p>

                  {/* Allergy pill */}
                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[10px] text-amber-400 font-bold">Allergies:</span>
                      {patient.allergies.map((alg, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                          {alg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Footer Status & View Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                    {reportCount} Reports
                  </span>
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                    {rxCount} Rx
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPatientForView(patient)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Detailed Reports Modal / Drawer */}
      {selectedPatientForView && (
        <div className="modal-overlay">
          <div className="modal-content max-w-3xl p-6">
            
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-cyan-400" />
                  {selectedPatientForView.name}
                  <span className="text-xs bg-slate-800 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedPatientForView.bloodGroup}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Patient ID: {selectedPatientForView.id} | Age: {selectedPatientForView.age}y ({selectedPatientForView.gender}) | Phone: {selectedPatientForView.phone}
                </p>
              </div>

              <button
                onClick={() => setSelectedPatientForView(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medical History & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Medical Background</p>
                <p className="text-xs text-slate-200">{selectedPatientForView.medicalHistory || 'No prior chronic history reported.'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Known Drug Allergies</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedPatientForView.allergies && selectedPatientForView.allergies.length > 0 ? (
                    selectedPatientForView.allergies.map((alg, idx) => (
                      <span key={idx} className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No known drug allergies.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Reports Section Header & Action Buttons */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-400" />
                Diagnostic Lab Reports & Prescriptions
              </h4>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRxModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Attach Rx</span>
                </button>

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg gradient-bg-primary text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Lab Report</span>
                </button>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(!selectedPatientForView.reports || selectedPatientForView.reports.length === 0) ? (
                <div className="py-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                  No diagnostic lab reports uploaded yet. Click "Upload Lab Report" to add one.
                </div>
              ) : (
                selectedPatientForView.reports.map(report => (
                  <div key={report.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/30 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          📄 {report.title}
                          <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-bold border border-teal-500/20">
                            {report.status}
                          </span>
                        </h5>
                        <p className="text-xs text-slate-400 mt-1">
                          Date: {report.date} | Lab: {report.labName} | Doctor: {report.doctor}
                        </p>
                        {report.notes && (
                          <p className="text-xs text-slate-300 mt-2 p-2 rounded bg-slate-900 border border-slate-800">
                            <strong>Findings/Notes:</strong> {report.notes}
                          </p>
                        )}
                      </div>

                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Simulated file view/download for report: ${report.fileName}`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold flex items-center gap-1 border border-slate-700 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                ))
              )}

              {/* Prescriptions List */}
              {selectedPatientForView.prescriptions && selectedPatientForView.prescriptions.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Prescription History</h5>
                  <div className="space-y-2">
                    {selectedPatientForView.prescriptions.map(rx => (
                      <div key={rx.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex justify-between font-bold text-slate-200">
                          <span>Diagnosis: {rx.diagnosis}</span>
                          <span className="text-slate-400 font-normal">{rx.date} ({rx.doctor})</span>
                        </div>
                        <p className="text-slate-300 mt-1">
                          <strong>Prescribed:</strong> {Array.isArray(rx.medicines) ? rx.medicines.join(', ') : rx.medicines}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {reportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-400" />
              Upload Medical Report for {selectedPatientForView?.name}
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Report Title / Test Name</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Blood Count (CBC), Gastric Endoscopy"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. A. K. Gupta"
                    value={reportForm.doctor}
                    onChange={(e) => setReportForm({ ...reportForm, doctor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Diagnostic Lab Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Lal PathLabs, Apex Diag"
                    value={reportForm.labName}
                    onChange={(e) => setReportForm({ ...reportForm, labName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Diagnostic Status / Result Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Normal, Borderline Acidity, Hemoglobin 14.5"
                  value={reportForm.status}
                  onChange={(e) => setReportForm({ ...reportForm, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Findings & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Add physician's observations or report conclusions..."
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attach File Document (Simulated PDF/Img)</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setReportForm({ ...reportForm, fileName: e.target.files[0].name });
                    }
                  }}
                  className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gradient-bg-primary text-slate-950 text-xs font-bold"
                >
                  Save Lab Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {rxModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              Attach Digital Prescription
            </h3>

            <form onSubmit={handleRxSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  value={rxForm.doctor}
                  onChange={(e) => setRxForm({ ...rxForm, doctor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Acute Viral Fever, Gastric Hyperacidity"
                  value={rxForm.diagnosis}
                  onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prescribed Medicines (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Dolo 650mg (1-1-1), Pantocid 40mg (1-0-0)"
                  value={rxForm.medicinesStr}
                  onChange={(e) => setRxForm({ ...rxForm, medicinesStr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gradient-bg-primary text-slate-950 text-xs font-bold"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
