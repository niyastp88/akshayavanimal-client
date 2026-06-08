import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchOpeningBalance,
  saveOpeningBalance,
  resetBalanceStatus,
} from "../redux/slices/balanceSlice";

const OpeningBalancePage = () => {
  const dispatch = useDispatch();

  const { openingBalance, loading, saveLoading, error, success } = useSelector(
    (state) => state.balance,
  );

  const [form, setForm] = useState({
    openingCash: "",
    openingSbiCurrentBank: "",
    openingSbiSavingsBank: "",
    openingEdistrict: "",
    openingPSA: "",
  });

  // Load opening balance
  useEffect(() => {
    dispatch(fetchOpeningBalance());
  }, [dispatch]);

  // Fill form data
  useEffect(() => {
    if (!openingBalance) return;

    setForm({
      openingCash: openingBalance.openingCash || "",
      openingSbiCurrentBank: openingBalance.openingSbiCurrentBank || "",
      openingSbiSavingsBank: openingBalance.openingSbiSavingsBank || "",
      openingEdistrict: openingBalance.openingEdistrict || "",
      openingPSA: openingBalance.openingPSA || "",
    });
  }, [openingBalance]);

  // Success message
  useEffect(() => {
    if (!success) return;

    toast.success("Opening balance saved successfully");
    dispatch(resetBalanceStatus());
  }, [success, dispatch]);

  // Error message
  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to save opening balance?",
    );

    if (!confirmed) return;

    dispatch(
      saveOpeningBalance({
        ...form,
        openingCash: Number(form.openingCash),
        openingSbiCurrentBank: Number(form.openingSbiCurrentBank),
        openingSbiSavingsBank: Number(form.openingSbiSavingsBank),
        openingEdistrict: Number(form.openingEdistrict),
        openingPSA: Number(form.openingPSA),
      }),
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-6 p-4 animate-fade-in">
      
      {/* Main Card Container */}
      <div className="relative p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        {/* Header Section */}
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/xl" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Opening Balance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Set initial capital balances for accounting</p>
          </div>
        </div>

        {/* Input Form Structure */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Cash Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">Cash</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={form.openingCash}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-7 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200 placeholder-slate-300"
                onChange={(e) => setForm({ ...form, openingCash: e.target.value })}
              />
            </div>
          </div>

          {/* SBI Current Bank Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">SBI Current Bank</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={form.openingSbiCurrentBank}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-7 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200 placeholder-slate-300"
                onChange={(e) => setForm({ ...form, openingSbiCurrentBank: e.target.value })}
              />
            </div>
          </div>

          {/* SBI Savings Bank Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">SBI Savings Bank</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={form.openingSbiSavingsBank}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-7 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200 placeholder-slate-300"
                onChange={(e) => setForm({ ...form, openingSbiSavingsBank: e.target.value })}
              />
            </div>
          </div>

          {/* Edistrict Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">eDistrict Wallet</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={form.openingEdistrict}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-7 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200 placeholder-slate-300"
                onChange={(e) => setForm({ ...form, openingEdistrict: e.target.value })}
              />
            </div>
          </div>

          {/* PSA Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">PSA Wallet</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-semibold">₹</div>
              <input
                type="number"
                placeholder="0.00"
                value={form.openingPSA}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-7 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200 placeholder-slate-300"
                onChange={(e) => setForm({ ...form, openingPSA: e.target.value })}
              />
            </div>
          </div>

          {/* Save Button Action Trigger */}
          <div className="pt-3">
            <button
              disabled={saveLoading}
              className={`w-full font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition duration-200 flex justify-center items-center gap-2 border cursor-pointer ${
                saveLoading
                  ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 border-indigo-700 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 active:scale-[0.99]"
              }`}
            >
              {saveLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Vault...
                </>
              ) : (
                "Save Balance Structure"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default OpeningBalancePage;