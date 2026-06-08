import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchAllExpenses,
  deleteExpense,
  updateExpense,
} from "../redux/slices/expenseSlice";
import API from "../api/api";

const AdminExpensePage = () => {
  const dispatch = useDispatch();

  const { data, saveLoading } = useSelector((s) => s.expense);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffs, setStaffs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // Load staffs
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await API.get("/users");
        setStaffs(res.data);
      } catch (err) {
        toast.error("Failed to load staffs");
      }
    };
    fetchStaff();
  }, []);

  // Load expenses
  useEffect(() => {
    dispatch(
      fetchAllExpenses({
        from,
        to,
        staffId,
      })
    );
  }, [dispatch, from, to, staffId]);

  // Start edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditName(item.expenseName);
    setEditAmount(item.amount);
  };

  // Save edit
  const handleSave = (id) => {
    if (!editName || !editAmount) {
      return toast.error("Fill all fields");
    }

    dispatch(
      updateExpense({
        id,
        data: {
          expenseName: editName,
          amount: Number(editAmount),
        },
      })
    );

    toast.success("Expense updated");
    setEditId(null);
    setEditName("");
    setEditAmount("");
  };

  // Delete
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    dispatch(deleteExpense(id));
    toast.success("Expense deleted");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-4 p-4 text-slate-600 animate-fade-in">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Expense Audit Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Admin privilege: Monitor and modify firm outgoing expenses</p>
        </div>

        {/* Dynamic Filters Layout */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 border border-slate-200 rounded-xl shadow-sm w-full lg:w-auto">
          
          {/* Staff Filter Dropdown */}
          <div className="flex flex-col min-w-[140px] flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-0.5">Filter Staff</span>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 transition cursor-pointer font-medium"
            >
              <option value="">All Staff</option>
              {staffs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
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
              className="bg-slate-50 text-slate-700 text-xs p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 transition cursor-pointer font-medium"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-0.5">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 transition cursor-pointer font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Table Interface */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Staff Member</th>
              <th className="p-4 text-left font-semibold">Expense Description</th>
              <th className="p-4 text-right font-semibold">Amount Spent</th>
              <th className="p-4 text-center font-semibold">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {data && data.map((item) => {
              const d = new Date(item.date);
              const formattedDate = `${String(d.getDate()).padStart(2, "0")}-${String(
                d.getMonth() + 1
              ).padStart(2, "0")}-${d.getFullYear()}`;

              return (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors duration-150">
                  
                  {/* Date Column */}
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Staff Name with Avatar Badge */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold uppercase">
                        {item.staffName ? item.staffName.charAt(0) : "S"}
                      </div>
                      <span className="text-slate-800 font-semibold">{item.staffName}</span>
                    </div>
                  </td>

                  {/* Expense Description */}
                  <td className="p-4 text-slate-700 max-w-xs truncate">
                    {editId === item._id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-50 border border-purple-500 p-1.5 rounded-lg w-full text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-100"
                        autoFocus
                      />
                    ) : (
                      <span className="text-slate-600">{item.expenseName}</span>
                    )}
                  </td>

                  {/* Amount Column */}
                  <td className="p-4 text-right whitespace-nowrap">
                    {editId === item._id ? (
                      <div className="flex justify-end relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="bg-slate-50 border border-purple-500 p-1.5 pl-5 rounded-lg w-24 text-right text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                      </div>
                    ) : (
                      <span className="text-rose-600 font-bold tracking-tight text-base">
                        ₹{(item.amount || 0).toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>

                  {/* Operational Override Buttons */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <div className="flex justify-center items-center gap-1.5">
                      {editId === item._id ? (
                        <>
                          <button
                            onClick={() => handleSave(item._id)}
                            disabled={saveLoading}
                            className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-600 hover:text-white px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {saveLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => {
                              setEditId(null);
                              setEditName("");
                              setEditAmount("");
                            }}
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

      {/* Fallback Screen for Empty State */}
      {(!data || data.length === 0) && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-semibold text-slate-400">No company expense logs found in this scope.</p>
        </div>
      )}

    </div>
  );
};

export default AdminExpensePage;