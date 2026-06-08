import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../redux/slices/reportSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminPage = () => {
  const dispatch = useDispatch();
  
  // Destructure application state from Redux store
  const { data, totals, loading, error } = useSelector((state) => state.report);

  // Initialize date filters default to current local date
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  // Sync component filters with global state fetching
  useEffect(() => {
    dispatch(fetchReport({ from, to }));
  }, [dispatch, from, to]);

  // Utility function to make raw dates look clean and readable
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // Safe CSV Generation
  const exportExcel = () => {
    if (!data.length) return;

    const headers = ["Date", "Service", "In", "Out", "Cash Balance", "SBI Current", "SBI Savings", "Edistrict", "PSA"];
    const rows = data.map((r) => [
      formatDate(r.date), r.serviceName, r.in, r.out || 0,
      r.cashBalance, r.sbiCurrent, r.sbiSavings, r.edistrict, r.psa,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Financial_Report_${from}_to_${to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clean PDF layout generation
  const exportPDF = () => {
    if (!data.length) return;

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(16);
    doc.text("Akshaya Financial Statement & Ledger Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Duration: ${formatDate(from)} to ${formatDate(to)}`, 14, 22);

    const tableData = data.map((r) => [
      formatDate(r.date), r.serviceName, `Rs. ${r.in}`, `Rs. ${r.out || 0}`,
      `Rs. ${r.cashBalance}`, `Rs. ${r.sbiCurrent}`, `Rs. ${r.sbiSavings}`, `Rs. ${r.edistrict}`, `Rs. ${r.psa}`,
    ]);

    autoTable(doc, {
      head: [["Date", "Service/Expense", "Inward", "Outward", "Cash Bal", "SBI Current", "SBI Savings", "E-District", "PSA"]],
      body: tableData,
      startY: 28,
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229] }, 
    });

    doc.save(`Financial_Report_${from}_to_${to}.pdf`);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-600">
      
      {/* ACTION BAR AND FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Ledger</h2>
          <p className="text-sm text-slate-400 mt-0.5">Track balance transactions and active node registries</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-slate-700 font-medium cursor-pointer" />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">To</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-slate-700 font-medium cursor-pointer" />
          </div>

          <button onClick={exportExcel} disabled={loading || !data.length}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer">
            Export Excel
          </button>

          <button onClick={exportPDF} disabled={loading || !data.length}
            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer">
            Export PDF
          </button>
        </div>
      </div>

      {/* ERROR HANDLER NOTIFICATION */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* METRICS DASHBOARD CARDS */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Net Cash</span>
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">₹{(totals?.cash || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total GPay Received</span>
            <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">₹{(totals?.gpay || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Calculated Profit Margins</span>
            <span className="text-3xl font-extrabold text-amber-600 tracking-tight">₹{(totals?.profit || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* ADVANCED SKELETON SHIMMER LOADING */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse mb-6"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-slate-200/60 rounded flex-1 animate-pulse"></div>
              <div className="h-4 bg-slate-200/60 rounded flex-1 animate-pulse"></div>
              <div className="h-4 bg-slate-200/60 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER REPORT LEDGER TABLE */}
      {!loading && !error && data?.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-sm border border-slate-200 rounded-2xl">
          <table className="min-w-full text-sm divide-y divide-slate-200">
            <thead className="bg-indigo-50/70 text-indigo-700 font-semibold uppercase tracking-wider text-xs text-left">
              <tr>
                <th className="px-4 py-4 border-b border-slate-200">Date</th>
                <th className="px-4 py-4 border-b border-slate-200">Service / Entry</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">Inward</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">Outward</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">Cash Asset</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">SBI Savings</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">SBI Current</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">E-District</th>
                <th className="px-4 py-4 border-b border-slate-200 text-right">PSA Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs font-semibold text-slate-400">{formatDate(row.date)}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{row.serviceName}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">₹{row.in.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-rose-600">₹{(row.out || 0).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-700">₹{row.cashBalance.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-600">₹{row.sbiCurrent.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-600">₹{row.sbiSavings.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-600">₹{row.edistrict.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-600">₹{row.psa.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY DATA SCREEN */}
      {!loading && !error && data?.length === 0 && (
        <div className="bg-white text-center py-16 rounded-2xl shadow-sm border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">No ledger records logged for selected parameters.</p>
        </div>
      )}

    </div>
  );
};

export default AdminPage;