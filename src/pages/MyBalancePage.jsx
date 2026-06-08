import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchMyBalance,
  deleteBalance,
  updateBalance,
  resetBalanceStatus,
} from "../redux/slices/balanceSlice";

const MyBalancePage = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.balance);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Load records
  useEffect(() => {
    dispatch(
      fetchMyBalance({
        from,
        to,
      })
    );
  }, [dispatch, from, to]);

  // Error message
  useEffect(() => {
    if (!error) return;

    toast.error(error);
    dispatch(resetBalanceStatus());
  }, [error, dispatch]);

  // Check today's record
  const isToday = (date) => {
    return new Date(date).toISOString().split("T")[0] === today;
  };

  // Start edit mode
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditAmount(item.amount);
  };

  // Save update
  const handleSave = (id) => {
    if (!editAmount || Number(editAmount) <= 0) {
      return toast.error("Enter valid amount");
    }

    dispatch(
      updateBalance({
        id,
        data: {
          amount: Number(editAmount),
        },
      })
    );

    toast.success("Balance updated");
    setEditId(null);
    setEditAmount("");
  };

  // Cancel edit
  const handleCancel = () => {
    setEditId(null);
    setEditAmount("");
  };

  // Delete record
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this balance?"
    );

    if (!confirmed) return;

    dispatch(deleteBalance(id));
    toast.success("Balance deleted");
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-600 space-y-6 max-w-6xl mx-auto animate-fade-in">
      
      {/* Header & Date Filters Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Balance Report
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">Track and manage historic balance logs</p>
        </div>

        {/* Custom Date Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider px-1">From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition w-full"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider px-1">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Core Content Renderer */}
      {loading ? (
        /* Loader Spinner matching Light Scheme */
        <div className="flex flex-col justify-center items-center py-20 space-y-3 bg-white rounded-2xl border border-slate-200 shadow-sm---------">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider">Fetching ledger balances...</p>
        </div>
      ) : (
        <>
          {/* Responsive Table Container */}
          {data?.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Account Type</th>
                    <th className="p-4 font-semibold text-right">Logged Amount</th>
                    <th className="p-4 font-semibold text-center">Actions Allowed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {data.map((item) => {
                    const date = new Date(item.date);
                    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${date.getFullYear()}`;

                    const currentIsToday = isToday(item.date);
                    const isEditing = editId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className={`transition-colors ${
                          isEditing ? "bg-indigo-50/70" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Date Column */}
                        <td className="p-4 text-slate-400 font-semibold whitespace-nowrap text-xs">
                          <div className="flex items-center gap-2">
                            {currentIsToday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" title="Today's Log"></span>
                            )}
                            {formattedDate}
                          </div>
                        </td>

                        {/* Type Column */}
                        <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                          <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600">
                            {item.type}
                          </span>
                        </td>

                        {/* Amount Column */}
                        <td className="p-4 text-right whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex justify-end relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                              <input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="border border-slate-200 bg-white rounded-lg p-1.5 pl-5 text-xs w-28 text-right focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-slate-800 font-bold shadow-sm"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <span className="text-emerald-600 font-bold text-base">
                              ₹{(item.amount || 0).toLocaleString("en-IN")}
                            </span>
                          )}
                        </td>

                        {/* Actions Column (Allowed only for Today's logs) */}
                        <td className="p-4 text-center whitespace-nowrap">
                          {currentIsToday ? (
                            <div className="flex items-center justify-center gap-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSave(item._id)}
                                    className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-amber-50 border border-amber-200 hover:bg-amber-500 text-amber-700 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-rose-50 border border-rose-200 hover:bg-rose-600 text-rose-600 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-400 uppercase tracking-wide border border-slate-200">
                              Closed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty Ledger Fallback Message */
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-400 font-semibold">No logs found for the selected time range.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBalancePage;