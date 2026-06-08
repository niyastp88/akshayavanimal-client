import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyTransactions,
  deleteTransaction,
  updateTransaction,
} from "../redux/slices/transactionSlice";

const MyTransactionsPage = () => {
  const dispatch = useDispatch();

  const { myTransactions, loading } = useSelector(
    (state) => state.transactions
  );

  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  // INLINE EDITING STATES
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    cashAmount: 0,
    bankAmount: 0,
    splitCash: 0,
    gpayAmount: 0,
    paymentType: "cash",
  });

  useEffect(() => {
    dispatch(fetchMyTransactions({ from, to }));
  }, [dispatch, from, to]);

  // DELETE TRANSACTION
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this transaction?");
    if (!confirm) return;

    await dispatch(deleteTransaction(id));
    dispatch(fetchMyTransactions({ from, to }));
  };

  // START INLINE EDIT
  const startEdit = (t) => {
    setEditingId(t._id);
    setEditData({
      cashAmount: t.cashAmount,
      bankAmount: t.bankAmount || 0,
      splitCash: t.splitCash || 0,
      gpayAmount: t.gpayAmount || 0,
      paymentType: t.paymentType || "cash",
    });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
  };

  // PAYMENT TYPE CHANGE HANDLER
  const handlePaymentTypeChange = (newType) => {
    setEditData((prev) => ({
      ...prev,
      paymentType: newType,
      // If type is cash, reset gpay to 0. If gpay, reset splitCash to 0.
      splitCash: newType === "gpay" ? 0 : prev.splitCash,
      gpayAmount: newType === "cash" ? 0 : prev.gpayAmount,
    }));
  };

  // SAVE INLINE EDIT
  const handleSave = async (id) => {
    await dispatch(
      updateTransaction({
        id,
        data: {
          cashAmount: Number(editData.cashAmount),
          bankAmount: Number(editData.bankAmount),
          splitCash: Number(editData.splitCash),
          gpayAmount: Number(editData.gpayAmount),
          paymentType: editData.paymentType,
        },
      })
    );
    setEditingId(null);
    dispatch(fetchMyTransactions({ from, to }));
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-600 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Transactions
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            View and manage your daily transaction history
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider px-1">From</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-slate-200 p-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition w-full"
            />
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider px-1">To</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-slate-200 p-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-sm font-medium text-slate-400">Loading records...</span>
        </div>
      ) : myTransactions?.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold text-right">Cash</th>
                <th className="p-4 font-semibold text-right">Bank</th>
                <th className="p-4 font-semibold text-right">Received Cash</th>
                <th className="p-4 font-semibold text-right">GPay</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {myTransactions.map((t) => {
                const d = new Date(t.date);
                const txDate = d.toISOString().split("T")[0];
                const isToday = txDate === today;
                const isEditing = editingId === t._id;

                const time = d.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                // CHECK PERMISSIONS FOR INPUTS
                const isCashDisabled = isEditing && editData.paymentType === "gpay";
                const isGpayDisabled = isEditing && editData.paymentType === "cash";

                return (
                  <tr
                    key={t._id}
                    className={`transition-colors ${isEditing ? "bg-indigo-50/70" : "hover:bg-slate-50"}`}
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {t.serviceName}
                    </td>

                    {/* TIME */}
                    <td className="p-4 text-slate-400 font-semibold whitespace-nowrap text-xs">
                      {time}
                    </td>

                    {/* Payment Type */}
                    <td className="p-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editData.paymentType}
                          onChange={(e) => handlePaymentTypeChange(e.target.value)}
                          className="border border-slate-200 bg-white rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 font-semibold text-slate-700 cursor-pointer shadow-sm"
                        >
                          <option value="cash">CASH</option>
                          <option value="gpay">GPAY</option>
                          <option value="both">BOTH</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border ${
                          t.paymentType === "cash" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          t.paymentType === "gpay" ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                          "bg-purple-50 border-purple-100 text-purple-600"
                        }`}>
                          {t.paymentType || "-"}
                        </span>
                      )}
                    </td>

                    {/* Cash Amount */}
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.cashAmount}
                          onChange={(e) => setEditData({ ...editData, cashAmount: e.target.value })}
                          className="border border-slate-200 bg-white rounded-lg p-1.5 text-xs w-20 text-right focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-800 font-bold shadow-sm"
                        />
                      ) : (
                        <span className="text-emerald-600 font-bold">₹{t.cashAmount?.toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    {/* Bank Amount */}
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.bankAmount}
                          onChange={(e) => setEditData({ ...editData, bankAmount: e.target.value })}
                          className="border border-slate-200 bg-white rounded-lg p-1.5 text-xs w-20 text-right focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-800 font-bold shadow-sm"
                        />
                      ) : (
                        <span className="text-sky-600 font-bold">₹{(t.bankAmount || 0).toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    {/* Split Cash (Received Cash) */}
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.splitCash}
                          disabled={isCashDisabled}
                          onChange={(e) => setEditData({ ...editData, splitCash: e.target.value })}
                          className={`border rounded-lg p-1.5 text-xs w-20 text-right focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold shadow-sm ${
                            isCashDisabled ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed" : "border-slate-200 bg-white text-slate-800"
                          }`}
                        />
                      ) : (
                        <span className="text-amber-600 font-bold">₹{(t.splitCash || 0).toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    {/* GPay Amount */}
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.gpayAmount}
                          disabled={isGpayDisabled}
                          onChange={(e) => setEditData({ ...editData, gpayAmount: e.target.value })}
                          className={`border rounded-lg p-1.5 text-xs w-20 text-right focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold shadow-sm ${
                            isGpayDisabled ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed" : "border-slate-200 bg-white text-slate-800"
                          }`}
                        />
                      ) : (
                        <span className="text-indigo-600 font-bold">₹{(t.gpayAmount || 0).toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center whitespace-nowrap">
                      {isToday ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(t._id)}
                                className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-600 hover:text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(t)}
                                className="bg-amber-50 border border-amber-200 hover:bg-amber-500 text-amber-700 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(t._id)}
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
          <p className="text-slate-400 font-semibold">No transaction records found for this period.</p>
        </div>
      )}
    </div>
  );
};

export default MyTransactionsPage;