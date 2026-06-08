import { useEffect, useState } from "react";
import API from "../api/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StaffReportPage = () => {
  const [staffs, setStaffs] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false); // Tracks if the user has clicked "Load"

  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  // INLINE EDITING STATES FOR ADMIN
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    cashAmount: 0,
    bankAmount: 0,
    splitCash: 0,
    gpayAmount: 0,
    paymentType: "cash",
  });

  // Fetch all staff members on component load
  useEffect(() => {
    API.get("/users").then((res) => {
      setStaffs(res.data);
      setStaffLoading(false);
    });
  }, []);

  // Fetch report data for selected staff and date ranges
  const fetchData = async () => {
    if (!staffId) return alert("Select staff");

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await API.get(
        `/transactions/staff-report?staffId=${staffId}&from=${from}&to=${to}`
      );
      setData(res.data);
    } catch {
      alert("Error fetching data");
    }
    setLoading(false);
  };

  // Calculate values for table footer totals
  const totals = data.reduce(
    (acc, t) => {
      acc.cash += t.cashAmount || 0;
      acc.bank += t.bankAmount || 0;
      acc.splitCash += t.splitCash || 0;
      acc.gpay += t.gpayAmount || 0;
      acc.profit += t.profit || 0;
      return acc;
    },
    { cash: 0, bank: 0, splitCash: 0, gpay: 0, profit: 0 }
  );

  // Calculate number of working days excluding Sundays
  const getWorkingDays = () => {
    const start = new Date(from);
    const end = new Date(to);
    let count = 0;

    while (start <= end) {
      if (start.getDay() !== 0) count++;
      start.setDate(start.getDate() + 1);
    }

    return count || 1;
  };

  const workingDays = getWorkingDays();
  const target = workingDays * 500;

  // Get matching text colors for target goals
  const getColor = () => {
    if (totals.profit < target * 0.5) return "text-rose-600";
    if (totals.profit < target) return "text-amber-600";
    return "text-emerald-600";
  };

  // Get matching badge layouts for target status
  const getBadge = () => {
    if (totals.profit < target * 0.5)
      return <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider">LOW</span>;

    if (totals.profit < target)
      return <span className="bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider">MED</span>;

    return <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider">GOOD</span>;
  };

  // Export data array into standard Excel template
  const exportExcel = () => {
    const sheet = [
      ...data,
      { serviceName: "TOTAL", ...totals },
    ];

    const ws = XLSX.utils.json_to_sheet(sheet);
    const wb = XLSX.utils.book_new();
    XUtils.book_append_sheet(wb, ws, "Report");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "report.xlsx");
  };

  // Export current table records into printable PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["Service", "Cash", "Bank", "Split", "GPay", "Profit"]],
      body: [
        ...data.map((t) => [
          t.serviceName,
          t.cashAmount,
          t.bankAmount,
          t.splitCash,
          t.gpayAmount,
          t.profit,
        ]),
        ["TOTAL", totals.cash, totals.bank, totals.splitCash, totals.gpay, totals.profit],
      ],
    });

    doc.save("report.pdf");
  };

  // Initialize selected row input fields for edit mode
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

  // Reset values and exit current edit state
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Safe parameters updates when active payment toggle changes
  const handlePaymentTypeChange = (newType) => {
    setEditData((prev) => ({
      ...prev,
      paymentType: newType,
      splitCash: newType === "gpay" ? 0 : prev.splitCash,
      gpayAmount: newType === "cash" ? 0 : prev.gpayAmount,
    }));
  };

  // Save modified row parameters back to database endpoints
  const handleSave = async (id) => {
    try {
      await API.put(`/transactions/${id}`, {
        cashAmount: Number(editData.cashAmount),
        bankAmount: Number(editData.bankAmount),
        splitCash: Number(editData.splitCash),
        gpayAmount: Number(editData.gpayAmount),
        paymentType: editData.paymentType,
      });
      setEditingId(null);
      fetchData();
    } catch {
      alert("Update failed");
    }
  };

  // Permanently remove targeted row logs from database indexes
  const handleDelete = async (id) => {
    const confirm = window.confirm("Admin: Are you sure you want to delete this transaction permanently?");
    if (!confirm) return;

    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    // Main clean light interface background wrapper
    <div className="p-6 bg-slate-50 min-h-screen text-slate-700">
      
      {/* Header Bar Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Report</h2>
          <p className="text-sm text-slate-400 mt-0.5">Track, audit, and export staff performance records</p>
        </div>

        {/* Filter Selection Toolbar Controls */}
        {!staffLoading && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Staff</span>
              <select
                value={staffId}
                onChange={(e) => {
                  setStaffId(e.target.value);
                  setHasSearched(false);
                  setData([]);
                }}
                className="border border-slate-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition w-full sm:w-44 cursor-pointer"
              >
                <option value="">Select Staff</option>
                {staffs.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">From</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border border-slate-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition w-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">To</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border border-slate-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition w-full cursor-pointer"
              />
            </div>

            {/* Form Actions Button Triggers */}
            <div className="flex items-end h-full pt-5 gap-2 w-full sm:w-auto">
              <button
                onClick={fetchData}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all w-full sm:w-auto cursor-pointer"
              >
                Load
              </button>

              {data.length > 0 && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={exportExcel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-2.5 rounded-lg text-sm shadow-sm transition-all flex-1 sm:flex-initial cursor-pointer"
                  >
                    Excel
                  </button>
                  <button
                    onClick={exportPDF}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-2.5 rounded-lg text-sm shadow-sm transition-all flex-1 sm:flex-initial cursor-pointer"
                  >
                    PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Table Content Render View Blocks */}
      {staffLoading || loading ? (
        <Loader />
      ) : data.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-indigo-50/70 border-b border-slate-200 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Service</th>
                  <th className="p-4 font-semibold">Time</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold text-right">Cash</th>
                  <th className="p-4 font-semibold text-right">Bank</th>
                  <th className="p-4 font-semibold text-right">Received Cash</th>
                  <th className="p-4 font-semibold text-right">GPay</th>
                  <th className="p-4 font-semibold text-right">Profit</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-600">
                {data.map((t, i) => {
                  const isEditing = editingId === t._id;
                  const isCashDisabled = isEditing && editData.paymentType === "gpay";
                  const isGpayDisabled = isEditing && editData.paymentType === "cash";

                  return (
                    <tr
                      key={t._id}
                      className={`transition-colors ${isEditing ? "bg-indigo-50/50" : i % 2 ? "bg-slate-50/50 hover:bg-slate-100/70" : "hover:bg-slate-50"}`}
                    >
                      <td className="p-4 font-semibold text-slate-800">{t.serviceName}</td>
                      
                      <td className="p-4 text-slate-400 font-medium whitespace-nowrap">
                        {new Date(t.date).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      {/* Payment Type Parameter Cell */}
                      <td className="p-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editData.paymentType}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="border border-slate-200 rounded p-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
                          >
                            <option value="cash">CASH</option>
                            <option value="gpay">GPAY</option>
                            <option value="both">BOTH</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                            t.paymentType === "cash" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            t.paymentType === "gpay" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                            "bg-purple-50 text-purple-600 border border-purple-100"
                          }`}>
                            {t.paymentType || "-"}
                          </span>
                        )}
                      </td>

                      {/* Cash Metrics Cell */}
                      <td className="p-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.cashAmount}
                            onChange={(e) => setEditData({ ...editData, cashAmount: e.target.value })}
                            className="border border-slate-200 rounded p-1.5 text-xs w-20 text-right bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-emerald-600 font-bold">₹{t.cashAmount?.toLocaleString("en-IN")}</span>
                        )}
                      </td>

                      {/* Bank Metrics Cell */}
                      <td className="p-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.bankAmount}
                            onChange={(e) => setEditData({ ...editData, bankAmount: e.target.value })}
                            className="border border-slate-200 rounded p-1.5 text-xs w-20 text-right bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-blue-600 font-bold">₹{(t.bankAmount || 0).toLocaleString("en-IN")}</span>
                        )}
                      </td>

                      {/* Split Cash Entry Cell */}
                      <td className="p-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.splitCash}
                            disabled={isCashDisabled}
                            onChange={(e) => setEditData({ ...editData, splitCash: e.target.value })}
                            className={`border rounded p-1.5 text-xs w-20 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                              isCashDisabled ? "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed" : "border-slate-200 bg-white text-slate-700"
                            }`}
                          />
                        ) : (
                          <span className="text-orange-600 font-bold">₹{(t.splitCash || 0).toLocaleString("en-IN")}</span>
                        )}
                      </td>

                      {/* GPay Entry Cell */}
                      <td className="p-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.gpayAmount}
                            disabled={isGpayDisabled}
                            onChange={(e) => setEditData({ ...editData, gpayAmount: e.target.value })}
                            className={`border rounded p-1.5 text-xs w-20 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                              isGpayDisabled ? "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed" : "border-slate-200 bg-white text-slate-700"
                            }`}
                          />
                        ) : (
                          <span className="text-indigo-600 font-bold">₹{(t.gpayAmount || 0).toLocaleString("en-IN")}</span>
                        )}
                      </td>

                      {/* Static Net Profit Cell */}
                      <td className="p-4 text-right font-bold text-slate-800 whitespace-nowrap">
                        ₹{t.profit?.toLocaleString("en-IN")}
                      </td>

                      {/* Admin Row Event Triggers */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(t._id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-slate-500 hover:bg-slate-600 text-white font-medium px-2.5 py-1.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(t)}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(t._id)}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
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

              {/* Grid Footer Totals Bar */}
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                <tr>
                  <td colSpan="3" className="p-4 text-right font-bold text-slate-400 uppercase tracking-wider text-xs">Total Summary</td>
                  <td className="p-4 text-right whitespace-nowrap text-emerald-600 font-bold">₹{totals.cash.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right whitespace-nowrap text-blue-600 font-bold">₹{totals.bank.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right whitespace-nowrap text-orange-600 font-bold">₹{totals.splitCash.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right whitespace-nowrap text-indigo-600 font-bold">₹{totals.gpay.toLocaleString("en-IN")}</td>
                  <td className={`p-4 text-right whitespace-nowrap font-extrabold ${getColor()}`}>₹{totals.profit.toLocaleString("en-IN")}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Operational Metrics Goals Panel */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-600">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              Target Blueprint: <span className="text-slate-900 font-bold">₹{target.toLocaleString("en-IN")}</span> 
              <span className="text-slate-300 mx-1.5">|</span> 
              Duration: <span className="text-slate-900 font-bold">{workingDays} active days</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              {getBadge()}
              <span className={`font-extrabold ${getColor()}`}>
                ₹{totals.profit.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        /* Rendered display for an explicit empty match outcome */
        <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-400 font-medium">No system metrics recorded for the selected staff and parameters.</p>
        </div>
      ) : (
        /* Pre-load operational parameters landing container views */
        <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-400 font-medium">Please select a staff member and click "Load" to view performance metrics.</p>
        </div>
      )}
    </div>
  );
};

// Reusable animated placeholder tracking skeleton rows
const Loader = () => (
  <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
    <div className="flex gap-2">
      <span className="w-3.5 h-3.5 bg-indigo-600 rounded-full animate-bounce"></span>
      <span className="w-3.5 h-3.5 bg-emerald-600 rounded-full animate-bounce delay-150"></span>
      <span className="w-3.5 h-3.5 bg-purple-600 rounded-full animate-bounce delay-300"></span>
    </div>
  </div>
);

export default StaffReportPage;