export const INITIAL_SHOP_INFO = {
  name: "Yellow Pharmacy",
  logoIcon: "💊",
  licenseNo: "DL-2024-8849X",
  address: "Shop No. 12, Main Market, Delhi",
  phone: "+91 98765 43210",
  owner: "Dr. Rajesh Sharma, B.Pharm",
  gstNo: "07AAAAA0000A1Z5"
};

export const MEDICINE_CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "fever_pain", name: "Fever & Pain Relief" },
  { id: "human_health", name: "Human Health Care" },
  { id: "mens_health", name: "Men's Health Care" },
  { id: "stomach", name: "Stomach & Digestion" },
  { id: "antibiotics", name: "Antibiotics" },
  { id: "vitamins", name: "Vitamins & Fitness" }
];

export const INITIAL_MEDICINES = [
  {
    id: "MED-101",
    name: "Dolo 650mg",
    genericName: "Paracetamol",
    category: "fever_pain",
    supplierId: "SUP-101",
    supplierName: "Sun Pharma Agency",
    batchNo: "DLO-8821",
    rackNo: "Rack A-1",
    price: 32.5,
    costPrice: 24,
    stock: 120,
    minStock: 30,
    expiryDate: "2026-11-15"
  },
  {
    id: "MED-102",
    name: "Calpol 500mg Syrup",
    genericName: "Paracetamol",
    category: "fever_pain",
    supplierId: "SUP-102",
    supplierName: "GSK Wholesale",
    batchNo: "CLP-3310",
    rackNo: "Rack A-2",
    price: 24,
    costPrice: 17.5,
    stock: 8,
    minStock: 25,
    expiryDate: "2026-09-20"
  },
  {
    id: "MED-103",
    name: "Combiflam Tablet",
    genericName: "Ibuprofen + Paracetamol",
    category: "fever_pain",
    supplierId: "SUP-101",
    supplierName: "Sun Pharma Agency",
    batchNo: "CMB-4029",
    rackNo: "Rack A-3",
    price: 45,
    costPrice: 32,
    stock: 140,
    minStock: 40,
    expiryDate: "2026-12-05"
  },
  {
    id: "MED-104",
    name: "Disprin 325mg",
    genericName: "Aspirin",
    category: "fever_pain",
    supplierId: "SUP-103",
    supplierName: "Apollo Med Distributors",
    batchNo: "DSP-1092",
    rackNo: "Rack A-4",
    price: 18,
    costPrice: 12,
    stock: 15,
    minStock: 20,
    expiryDate: "2026-08-25"
  },
  {
    id: "MED-105",
    name: "Zincovit Multi-Vitamin",
    genericName: "Multivitamins + Zinc",
    category: "human_health",
    supplierId: "SUP-101",
    supplierName: "Sun Pharma Agency",
    batchNo: "ZNC-5514",
    rackNo: "Rack B-1",
    price: 115,
    costPrice: 85,
    stock: 85,
    minStock: 25,
    expiryDate: "2027-04-10"
  },
  {
    id: "MED-106",
    name: "Revital H Capsules",
    genericName: "Ginseng + Minerals",
    category: "mens_health",
    supplierId: "SUP-102",
    supplierName: "GSK Wholesale",
    batchNo: "RVT-9012",
    rackNo: "Rack B-2",
    price: 310,
    costPrice: 240,
    stock: 6,
    minStock: 20,
    expiryDate: "2027-01-18"
  },
  {
    id: "MED-107",
    name: "Pantocid 40mg",
    genericName: "Pantoprazole",
    category: "stomach",
    supplierId: "SUP-101",
    supplierName: "Sun Pharma Agency",
    batchNo: "PNT-6623",
    rackNo: "Rack C-1",
    price: 110,
    costPrice: 78,
    stock: 95,
    minStock: 30,
    expiryDate: "2027-06-22"
  },
  {
    id: "MED-108",
    name: "Amoxyclav 625mg",
    genericName: "Amoxicillin + Clavulanate",
    category: "antibiotics",
    supplierId: "SUP-103",
    supplierName: "Apollo Med Distributors",
    batchNo: "AMX-9911",
    rackNo: "Rack D-1",
    price: 198,
    costPrice: 145,
    stock: 50,
    minStock: 20,
    expiryDate: "2026-10-05"
  }
];

export const INITIAL_EXPENSES = [
  { id: "EXP-1", title: "Shop Electricity Bill", category: "Utilities", amount: 2400, date: "2026-09-02", note: "Monthly power bill" },
  { id: "EXP-2", title: "Assistant Helper Wages", category: "Salary", amount: 6500, date: "2026-09-01", note: "Monthly staff salary" },
  { id: "EXP-3", title: "Medicine Packing Bags & Boxes", category: "Supplies", amount: 850, date: "2026-09-03", note: "Counter carry bags" },
  { id: "EXP-4", title: "Shop Monthly Rent", category: "Rent", amount: 15000, date: "2026-09-01", note: "Market shop rent" }
];

export const INITIAL_SUPPLIERS = [
  {
    id: "SUP-101",
    name: "Sun Pharma Agency",
    contactPerson: "Mr. Suresh Kumar",
    phone: "+91 98220 11223",
    address: "B-14, Medicine Market, Chandni Chowk, Delhi",
    dueBalance: 12500,
    suppliedMedicines: ["Dolo 650mg", "Combiflam", "Zincovit", "Pantocid 40mg"]
  },
  {
    id: "SUP-102",
    name: "GSK Wholesale",
    contactPerson: "Mr. Ramesh Sharma",
    phone: "+91 98771 33445",
    address: "Shop 4, Pharma Hub, Noida",
    dueBalance: -1500,
    suppliedMedicines: ["Calpol Syrup", "Revital H Capsules"]
  },
  {
    id: "SUP-103",
    name: "Apollo Med Distributors",
    contactPerson: "Dr. Vikas Verma",
    phone: "+91 99112 55667",
    address: "Plot 88, Industrial Area, Gurgaon",
    dueBalance: 8400,
    suppliedMedicines: ["Disprin 325mg", "Amoxyclav 625mg"]
  }
];

export const INITIAL_UDHAAR = [
  {
    id: "UDH-1",
    customerName: "Rahul Verma",
    phone: "+91 98112 34567",
    dueDate: "2026-09-10",
    totalDueAmount: 850,
    paidAmount: 300,
    remainingAmount: 550,
    notes: "Bought Dolo & Pantocid on credit"
  },
  {
    id: "UDH-2",
    customerName: "Mohan Lal (Tea Shop)",
    phone: "+91 98711 99887",
    dueDate: "2026-09-15",
    totalDueAmount: 1200,
    paidAmount: 0,
    remainingAmount: 1200,
    notes: "Monthly medicine credit account"
  }
];

export const INITIAL_STOCK_LOGS = [
  { id: "LOG-1", medicineName: "Dolo 650mg", type: "IN", qty: 50, date: "2026-09-04 10:15 AM", note: "Supplier Restock" },
  { id: "LOG-2", medicineName: "Calpol 500mg Syrup", type: "OUT", qty: 10, date: "2026-09-04 09:30 AM", note: "Counter Sale" },
  { id: "LOG-3", medicineName: "Combiflam Tablet", type: "IN", qty: 100, date: "2026-09-03 04:20 PM", note: "Batch Arrival" }
];
