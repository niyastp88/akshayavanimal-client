import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import API from "../api/api";
import {
  fetchAllBalance,
  deleteBalance,
  updateBalance,
  resetBalanceStatus,
} from "../redux/slices/balanceSlice";

const AdminBalancePage = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.balance);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffs, setStaffs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  // Load staffs
  useEffect(() => {
    API.get("/users")
      .then((res) => setStaffs(res.data))
      .catch(() => {
        toast.error("Failed to load staffs");
      });
  }, []);

  // Load balance records
  useEffect(() => {
    dispatch(
      fetchAllBalance({
        from,
        to,
        staffId,
      })
    );
  }, [dispatch, from, to, staffId]);

  // Error message
  useEffect(() => {
    if (!error) return;

    toast.error(error);
    dispatch(resetBalanceStatus());
  }, [error, dispatch]);

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
    <div className="space-y-6 max-w-7xl mx-auto my-4 p-4 text-slate-600 animate-fade-in">
      
      {/* Header & Advanced Filter Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Ledger Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Admin privilege: Monitor and override staff balance records</p>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 border border-slate-200 rounded-xl shadow-sm w-full lg:w-auto">
          {/* Staff Selection Dropdown */}
          <div className="flex flex-col min-w-[140px] flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-0.5">Staff Scope</span>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer font-medium"
            >
              <option value="">All Staff</option>
              {staffs.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="flex flex-col flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-0.5">From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer font-medium"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-0.5">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Table Interface */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider">Compiling universal balances...</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Staff Identity</th>
                  <th className="p-4 text-left font-semibold">Wallet Type</th>
                  <th className="p-4 text-right font-semibold">Logged Amount</th>
                  <th className="p-4 text-center font-semibold">Administrative overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {data.map((item) => {
                  const date = new Date(item.date);
                  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${date.getFullYear()}`;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors duration-150">
                      
                      {/* Date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Staff Name Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold uppercase">
                            {item.staffName ? item.staffName.charAt(0) : "S"}
                          </div>
                          <span className="text-slate-800 font-semibold">{item.staffName}</span>
                        </div>
                      </td>

                      {/* Wallet Type */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600">
                          {item.type}
                        </span>
                      </td>

                      {/* Target Amount */}
                      <td className="p-4 text-right whitespace-nowrap">
                        {editId === item._id ? (
                          <div className="flex justify-end relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="bg-slate-50 border border-indigo-500 p-1.5 pl-5 rounded-lg w-28 text-right text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <span className="text-indigo-600 font-bold tracking-tight text-base">
                            ₹{(item.amount || 0).toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      {/* Control Panel Actions */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex justify-center items-center gap-1.5">
                          {editId === item._id ? (
                            <>
                              <button
                                onClick={() => handleSave(item._id)}
                                className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-600 hover:text-white px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-amber-50 border border-amber-200 hover:bg-amber-500 text-amber-700 hover:text-white px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-rose-50 border border-rose-200 hover:bg-rose-600 text-rose-600 hover:text-white px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty Global Ledger Alert */}
          {data.length === 0 && (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-semibold text-slate-400">No balance sheets recorded under this scope.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBalancePage;