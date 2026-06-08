import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchBalanceTypes,
  createBalanceTx,
  resetBalanceStatus,
} from "../redux/slices/balanceSlice";

const AddBalancePage = () => {
  const dispatch = useDispatch();

  const { types, saveLoading, error, success } = useSelector(
    (state) => state.balance
  );

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  // Load balance types
  useEffect(() => {
    dispatch(fetchBalanceTypes());
  }, [dispatch]);

  // Success message
  useEffect(() => {
    if (!success) return;

    toast.success("Balance updated successfully");

    setType("");
    setAmount("");

    dispatch(resetBalanceStatus());
  }, [success, dispatch]);

  // Error message
  useEffect(() => {
    if (!error) return;

    toast.error(error);

    dispatch(resetBalanceStatus());
  }, [error, dispatch]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!type || !amount) {
      return toast.error("Fill all fields");
    }

    const confirmed = window.confirm(
      "Are you sure you want to update balance?"
    );

    if (!confirmed) return;

    dispatch(
      createBalanceTx({
        type,
        amount: Number(amount),
      })
    );
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 md:p-0 animate-fade-in">
      {/* Main Card Container */}
      <div className="relative p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-slate-600">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        {/* Header Section */}
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Add Balance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Update financial balances across accounts</p>
          </div>
        </div>

        {/* Input Form Structure */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Dropdown Select Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Account Type</label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200 appearance-none cursor-pointer shadow-sm"
              >
                <option value="" className="text-slate-400">
                  Select Type
                </option>
                {types.map((t) => (
                  <option key={t._id} value={t.name} className="bg-white text-slate-700">
                    {t.name}
                  </option>
                ))}
              </select>
              {/* Custom Down Arrow Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Amount Number Input Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Amount (₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 font-bold text-sm">
                ₹
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                className="w-full bg-slate-50 border border-slate-200 p-3 pl-8 rounded-xl text-slate-800 text-sm font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200 placeholder-slate-400 shadow-sm"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action Action Trigger */}
          <button
            disabled={saveLoading}
            className={`w-full font-bold text-sm py-3 px-4 rounded-xl transition duration-200 flex justify-center items-center gap-2 shadow-sm ${
              saveLoading
                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white active:scale-[0.99] hover:shadow-md"
            }`}
          >
            {saveLoading ? (
              <>
                {/* Micro Loading Spinner */}
                <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Transaction...
              </>
            ) : (
              "Submit Balance"
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AddBalancePage;