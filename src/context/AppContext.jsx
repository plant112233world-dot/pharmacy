import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_SHOP_INFO, 
  INITIAL_MEDICINES, 
  INITIAL_EXPENSES,
  INITIAL_SUPPLIERS,
  INITIAL_UDHAAR,
  INITIAL_STOCK_LOGS, 
  MEDICINE_CATEGORIES 
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('yp_auth') === 'true';
  });

  const [shopInfo, setShopInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_shop_info');
      return saved ? JSON.parse(saved) : INITIAL_SHOP_INFO;
    } catch (e) {
      return INITIAL_SHOP_INFO;
    }
  });

  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_medicines');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [suppliers, setSuppliers] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_suppliers');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [udhaarList, setUdhaarList] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_udhaar');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [stockLogs, setStockLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_stock_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [healthRecords, setHealthRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('yp_health_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const login = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanUser === 'boss' && cleanPass === 'BOSS55') {
      sessionStorage.setItem('yp_auth', 'true');
      setIsAuthenticated(true);
      showToast('Login Successful! Welcome back, Boss.', 'success');
      return { success: true };
    } else {
      return { success: false, message: 'Invalid Username or Password! (Hint: username is "boss" and password is "BOSS55")' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('yp_auth');
    setIsAuthenticated(false);
    showToast('Logged out of Pharmacy Admin successfully.', 'info');
  };

  // Fetch database from project db.json on initial load
  useEffect(() => {
    fetch('/api/get-db')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No disk DB server endpoint');
      })
      .then(data => {
        if (data && typeof data === 'object') {
          if (data.shopInfo) setShopInfo(data.shopInfo);
          if (Array.isArray(data.medicines) && data.medicines.length > 0) setMedicines(data.medicines);
          if (Array.isArray(data.expenses) && data.expenses.length > 0) setExpenses(data.expenses);
          if (Array.isArray(data.suppliers) && data.suppliers.length > 0) setSuppliers(data.suppliers);
          if (Array.isArray(data.udhaarList) && data.udhaarList.length > 0) setUdhaarList(data.udhaarList);
          if (Array.isArray(data.stockLogs) && data.stockLogs.length > 0) setStockLogs(data.stockLogs);
          if (Array.isArray(data.healthRecords) && data.healthRecords.length > 0) setHealthRecords(data.healthRecords);
        }
      })
      .catch(err => console.log('Disk DB load status:', err))
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Auto-sync every change to both localStorage and disk db.json
  useEffect(() => {
    if (!isLoaded) return;

    const fullDbData = {
      shopInfo,
      medicines,
      expenses,
      suppliers,
      udhaarList,
      stockLogs,
      healthRecords
    };

    // 1. Sync to local browser storage
    try {
      localStorage.setItem('yp_shop_info', JSON.stringify(shopInfo));
      localStorage.setItem('yp_medicines', JSON.stringify(medicines));
      localStorage.setItem('yp_expenses', JSON.stringify(expenses));
      localStorage.setItem('yp_suppliers', JSON.stringify(suppliers));
      localStorage.setItem('yp_udhaar', JSON.stringify(udhaarList));
      localStorage.setItem('yp_stock_logs', JSON.stringify(stockLogs));
      localStorage.setItem('yp_health_records', JSON.stringify(healthRecords));
    } catch (e) {
      console.error('LocalStorage sync error:', e);
    }

    // 2. Sync to project disk file (data/db.json)
    fetch('/api/save-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullDbData)
    }).catch(err => {
      console.log('Project disk save info:', err);
    });
  }, [isLoaded, shopInfo, medicines, expenses, suppliers, udhaarList, stockLogs, healthRecords]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Stock Actions
  const handleStockIn = (id, qty, note = 'Stock Received') => {
    const qtyNum = Number(qty);
    if (qtyNum <= 0) return;

    let targetMed = null;
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        targetMed = m;
        return { ...m, stock: m.stock + qtyNum };
      }
      return m;
    }));

    if (targetMed) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();
      setStockLogs(prev => [{ id: `LOG-${Date.now()}`, medicineName: targetMed.name, type: 'IN', qty: qtyNum, date: nowStr, note }, ...prev]);
      showToast(`Added +${qtyNum} stock to ${targetMed.name}`, 'success');
    }
  };

  const handleStockOut = (id, qty, note = 'Counter Sale') => {
    const qtyNum = Number(qty);
    if (qtyNum <= 0) return;

    let targetMed = null;
    let isSuccess = false;

    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        targetMed = m;
        if (m.stock < qtyNum) {
          showToast(`Error: Only ${m.stock} units available for ${m.name}!`, 'danger');
          return m;
        }
        isSuccess = true;
        return { ...m, stock: m.stock - qtyNum };
      }
      return m;
    }));

    if (isSuccess && targetMed) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();
      setStockLogs(prev => [{ id: `LOG-${Date.now()}`, medicineName: targetMed.name, type: 'OUT', qty: qtyNum, date: nowStr, note }, ...prev]);
      showToast(`Stock Out: -${qtyNum} units from ${targetMed.name}`, 'info');
    }
  };

  const addMedicine = (newMed) => {
    const medId = `MED-${Math.floor(100 + Math.random() * 900)}`;
    const fullMed = { ...newMed, id: medId };
    setMedicines(prev => [fullMed, ...prev]);
    showToast(`Added ${fullMed.name} to inventory!`, 'success');
  };

  const updateMedicine = (id, fields) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...fields } : m));
    showToast(`Updated medicine details!`, 'info');
  };

  const deleteMedicine = (id) => {
    const target = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    showToast(`Deleted ${target?.name || 'item'}.`, 'warning');
  };

  // Expenses Actions
  const addExpense = (expData) => {
    const expId = `EXP-${Date.now()}`;
    const newExp = { id: expId, ...expData, amount: Number(expData.amount) };
    setExpenses(prev => [newExp, ...prev]);
    showToast(`Expense ₹${newExp.amount} added!`, 'success');
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast(`Removed expense record.`, 'warning');
  };

  // Supplier Lenden Actions
  const addSupplier = (supData) => {
    const supId = `SUP-${Math.floor(100 + Math.random() * 900)}`;
    const newSup = { 
      id: supId, 
      ...supData, 
      dueBalance: Number(supData.dueBalance || 0),
      suppliedMedicines: typeof supData.suppliedMedicines === 'string' ? supData.suppliedMedicines.split(',').map(s => s.trim()) : (supData.suppliedMedicines || [])
    };
    setSuppliers(prev => [newSup, ...prev]);
    showToast(`Supplier ${newSup.name} added!`, 'success');
  };

  const recordSupplierPayment = (supplierId, paymentAmount) => {
    const amt = Number(paymentAmount);
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const newBalance = s.dueBalance - amt;
        return { ...s, dueBalance: newBalance };
      }
      return s;
    }));
    showToast(`Payment ₹${amt} recorded for supplier!`, 'success');
  };

  // Customer Udhaar Credit Actions
  const addCustomerUdhaar = (udhaarData) => {
    const udhId = `UDH-${Date.now()}`;
    const total = Number(udhaarData.totalDueAmount);
    const paid = Number(udhaarData.paidAmount || 0);
    const newEntry = {
      id: udhId,
      ...udhaarData,
      totalDueAmount: total,
      paidAmount: paid,
      remainingAmount: Math.max(0, total - paid)
    };
    setUdhaarList(prev => [newEntry, ...prev]);
    showToast(`Recorded Udhaar entry for ${newEntry.customerName}!`, 'success');
  };

  const payCustomerUdhaar = (udhaarId, amountPaid) => {
    const amt = Number(amountPaid);
    setUdhaarList(prev => prev.map(u => {
      if (u.id === udhaarId) {
        const newPaid = u.paidAmount + amt;
        const newRemaining = Math.max(0, u.totalDueAmount - newPaid);
        return { ...u, paidAmount: newPaid, remainingAmount: newRemaining };
      }
      return u;
    }));
    showToast(`Received ₹${amt} payment from customer!`, 'success');
  };

  // Date Check Helpers
  const isMedicineExpired = (dateStr) => {
    if (!dateStr) return false;
    const exp = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return exp < today;
  };

  const isMedicineExpiringSoon = (dateStr, days = 30) => {
    if (!dateStr) return false;
    const exp = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (exp < today) return false;
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  };

  // Data Backup Export (JSON Download)
  const exportBackupJSON = () => {
    try {
      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        shopInfo,
        medicines,
        expenses,
        suppliers,
        udhaarList,
        stockLogs
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yellow_pharmacy_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Shop data exported to JSON backup file successfully!', 'success');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'danger');
    }
  };

  // Data Backup Import (JSON Upload)
  const importBackupJSON = (backupObj) => {
    try {
      if (!backupObj || typeof backupObj !== 'object') {
        throw new Error('Invalid JSON file format');
      }

      if (backupObj.shopInfo) setShopInfo(backupObj.shopInfo);
      if (Array.isArray(backupObj.medicines)) setMedicines(backupObj.medicines);
      if (Array.isArray(backupObj.expenses)) setExpenses(backupObj.expenses);
      if (Array.isArray(backupObj.suppliers)) setSuppliers(backupObj.suppliers);
      if (Array.isArray(backupObj.udhaarList)) setUdhaarList(backupObj.udhaarList);
      if (Array.isArray(backupObj.stockLogs)) setStockLogs(backupObj.stockLogs);

      showToast('Shop database restored successfully from JSON backup file!', 'success');
    } catch (err) {
      showToast('Import error: ' + err.message, 'danger');
    }
  };

  const totalItemsCount = medicines.length;
  const lowStockCount = medicines.filter(m => m.stock <= m.minStock).length;
  const expiredCount = medicines.filter(m => isMedicineExpired(m.expiryDate)).length;
  const expiringSoonCount = medicines.filter(m => isMedicineExpiringSoon(m.expiryDate)).length;

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      login,
      logout,
      shopInfo,
      setShopInfo,
      medicines,
      expenses,
      suppliers,
      udhaarList,
      stockLogs,
      healthRecords,
      setHealthRecords,
      selectedCategory,
      setSelectedCategory,
      stockFilter,
      setStockFilter,
      searchQuery,
      setSearchQuery,
      toast,
      showToast,
      handleStockIn,
      handleStockOut,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      addExpense,
      deleteExpense,
      addSupplier,
      recordSupplierPayment,
      addCustomerUdhaar,
      payCustomerUdhaar,
      exportBackupJSON,
      importBackupJSON,
      isMedicineExpired,
      isMedicineExpiringSoon,
      totalItemsCount,
      lowStockCount,
      expiredCount,
      expiringSoonCount,
      categories: MEDICINE_CATEGORIES
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
