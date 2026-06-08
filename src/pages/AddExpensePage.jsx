import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchExpenseTypes,
  createExpenseTx,
  resetExpenseStatus,
} from "../redux/slices/expenseSlice";

const AddExpensePage = () => {
  const dispatch = useDispatch();

  const {
    types,
    loading,
    saveLoading,
    success,
    error,
  } = useSelector((state) => state.expense);

  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState("");

  // Load expense types
  useEffect(() => {
    dispatch(
      fetchExpenseTypes({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  // Success message
  useEffect(() => {
    if (!success) return;

    toast.success("Expense added ✅", {
      style: {
        background: "#22c55e",
        color: "#fff",
      },
    });

    setSelected("");
    setAmount("");
    dispatch(resetExpenseStatus());
  }, [success, dispatch]);

  // Error message
  useEffect(() => {
    if (!error) return;

    toast.error(error);
    dispatch(resetExpenseStatus());
  }, [error, dispatch]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selected || !amount) {
      return toast.error("Fill all fields");
    }

    const confirmed = window.confirm(
      "Are you sure you want to add this expense?"
    );

    if (!confirmed) return;

    dispatch(
      createExpenseTx({
        expenseName: selected,
        amount: Number(amount),
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 text-slate-600 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition-all relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 to-orange-400"></div>
          
          <div className="border-b border-slate-100 pb-4 mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Expense</h2>
            <p className="text-sm text-slate-400 mt-0.5">Record company or personal expenditures</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              <p className="text-sm text-slate-400 font-medium">Loading expense types...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Expense Type Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Expense</label>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 font-semibold text-slate-700 cursor-pointer shadow-sm"
                >
                  <option value="" className="text-slate-400">
                    Choose an expense type...
                  </option>
                  {types.map((item) => (
                    <option key={item._id} value={item.name} className="bg-white text-slate-700">
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="₹ 0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 p-3 rounded-xl outline-none transition-all font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={saveLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all duration-150 cursor-pointer mt-2 shadow-sm ${
                  saveLoading 
                    ? "bg-rose-400 text-rose-100 cursor-not-allowed shadow-none" 
                    : "bg-rose-600 hover:bg-rose-500 active:scale-[0.99] hover:shadow-md"
                }`}
              >
                {saveLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Expense...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExpensePage;