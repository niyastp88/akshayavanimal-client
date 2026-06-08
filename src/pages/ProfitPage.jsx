import { useEffect, useState } from "react";
import API from "../api/api";

const ProfitPage = () => {
  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState("today");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  // Default state layout matching backend structure
  const [data, setData] = useState({ totalProfit: 0, totalExpense: 0, netProfit: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 🎯 FIXED: Changed endpoint to /profit/summary to match your server.js route configuration
      let url = `/profit/summary?type=${type}`;

      if (type === "custom") {
        url = `/profit/summary?from=${from}&to=${to}`;
      }

      const res = await API.get(url);
      
      // Safely check and assign structured response data
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profit summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, from, to]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-600 space-y-6">
      
      {/* Top Controller & Header Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Profit & Expense Analytics 📊
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time track of your transactions, expenses and net yields
          </p>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterBtn active={type === "today"} onClick={() => setType("today")}>
            Today
          </FilterBtn>

          <FilterBtn active={type === "month"} onClick={() => setType("month")}>
            Monthly
          </FilterBtn>

          <FilterBtn active={type === "custom"} onClick={() => setType("custom")}>
            Date Wise
          </FilterBtn>

          {type === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border border-slate-200 p-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
              <span className="text-xs font-bold text-slate-400">TO</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border border-slate-200 p-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Container Wrapper */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-52 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex gap-2">
            <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-bounce"></span>
            <span className="w-3.5 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
          <span className="text-xs text-slate-400 font-medium mt-3 tracking-wide">Fetching financial logs...</span>
        </div>
      ) : (
        /* Analytics Grid Content */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card 
            title="Total Profit" 
            value={data?.totalProfit} 
            color="bg-white border-slate-200"
            lineColor="bg-emerald-500"
            textColor="text-emerald-600"
          />
          <Card 
            title="Total Expense" 
            value={data?.totalExpense} 
            color="bg-white border-slate-200" 
            lineColor="bg-rose-500"
            textColor="text-rose-600"
          />
          <Card 
            title="Net Profit" 
            value={data?.netProfit} 
            color="bg-white border-slate-200"
            lineColor={data?.netProfit >= 0 ? "bg-indigo-500" : "bg-amber-500"} 
            textColor={data?.netProfit >= 0 ? "text-indigo-600" : "text-amber-600"} 
          />
        </div>
      )}
    </div>
  );
};

// Filter Option Button Subcomponent
const FilterBtn = ({ children, active, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm border
      ${
        active
          ? "bg-indigo-600 text-white border-indigo-500 scale-[1.02]"
          : "bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50"
      }`}
  >
    {children}
  </button>
);

// Summary Display Card Subcomponent
const Card = ({ title, value, color, lineColor, textColor }) => (
  <div className={`${color} p-5 rounded-2xl border shadow-sm flex flex-col relative overflow-hidden group transition-all duration-300 hover:translate-y-[-2px]`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${lineColor}`}></div>
    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</span>
    <h2 className={`text-3xl font-extrabold tracking-tight mt-1 ${textColor}`}>
      ₹{(value || 0).toLocaleString("en-IN")}
    </h2>
  </div>
);

export default ProfitPage;