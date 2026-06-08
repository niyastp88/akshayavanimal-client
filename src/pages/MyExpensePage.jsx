import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchMyExpenses,
  deleteExpense,
  updateExpense,
} from "../redux/slices/expenseSlice";

const MyExpensePage = () => {
  const dispatch = useDispatch();

  const { data, saveLoading } = useSelector((s) => s.expense);

  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  useEffect(() => {
    dispatch(
      fetchMyExpenses({
        from,
        to,
      })
    );
  }, [dispatch, from, to]);

  const isToday = (d) =>
    new Date(d).toISOString().split("T")[0] === today;

  // Start edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditAmount(item.amount);
  };

  // Save edit
  const handleSave = (id) => {
    if (!editAmount) {
      return toast.error("Enter amount");
    }

    dispatch(
      updateExpense({
        id,
        data: {
          amount: Number(editAmount),
        },
      })
    );

    toast.success("Expense updated");
    setEditId(null);
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
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-600 animate-fade-in">
      
      {/* Header and Filters Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 to-orange-400"></div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Expenses
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Track and manage your recorded expenditures
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider px-1">From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 outline-none transition w-full"
            />
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider px-1">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-slate-200 p-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-500 outline-none transition w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      {data?.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Expense</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {data.map((item) => {
                const d = new Date(item.date);
                const formattedDate = `${String(d.getDate()).padStart(2, "0")}-${String(
                  d.getMonth() + 1
                ).padStart(2, "0")}-${d.getFullYear()}`;

                const isEditing = editId === item._id;
                const canModify = isToday(item.date);

                return (
                  <tr
                    key={item._id}
                    className={`transition-colors ${
                      isEditing ? "bg-rose-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Date */}
                    <td className="p-4 text-slate-400 font-semibold whitespace-nowrap text-xs">
                      {formattedDate}
                    </td>

                    {/* Expense Name */}
                    <td className="p-4 font-semibold text-slate-800">
                      {item.expenseName}
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="border border-slate-200 bg-white rounded-lg p-1.5 text-xs w-28 text-right focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-slate-800 font-bold shadow-sm"
                        />
                      ) : (
                        <span className="text-rose-600 font-bold">
                          ₹{item.amount?.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center whitespace-nowrap">
                      {canModify ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(item._id)}
                                disabled={saveLoading}
                                className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                              >
                                {saveLoading ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditId(null);
                                  setEditAmount("");
                                }}
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
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 font-semibold">No expense records found for this period.</p>
        </div>
      )}
    </div>
  );
};

export default MyExpensePage;