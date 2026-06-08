import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../redux/slices/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const dispatch = useDispatch();
  
  // Extract state values including error from Redux slice
  const { data, loading, error } = useSelector((state) => state.dashboard);

  // Load dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // Construct chart data structure safely using optional chaining
  const chartData = [
    { name: "Cash", amount: data?.today?.cash || 0 },
    { name: "GPay", amount: data?.today?.gpay || 0 },
    { name: "Profit", amount: data?.today?.profit || 0 },
  ];

  // Display error message if the api request fails
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-rose-600 font-bold text-sm">
        <div className="bg-rose-50 border border-rose-200 px-6 py-4 rounded-xl shadow-sm">
          ⚠️ Terminal Failure: {error}
        </div>
      </div>
    );
  }

  return (
    // Clean light background page wrapper
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Executive Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time ledger audit and analytical statistics overview</p>
        </div>
        <div className="text-[10px] text-slate-500 font-semibold mt-2 md:mt-0 bg-white border border-slate-200 px-3 py-1 rounded-lg self-start shadow-sm">
          Status: <span className="text-emerald-600 font-bold">● Active</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Today Cash" value={data?.today?.cash} color="text-emerald-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-emerald-600" />
          <Card title="Today GPay" value={data?.today?.gpay} color="text-blue-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-blue-600" />
          <Card title="Today Profit" value={data?.today?.profit} color="text-amber-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-amber-600" />
          <Card title="Cash Balance" value={data?.balances?.cash} color="text-purple-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-purple-600" />
          <Card title="SBI Savings" value={data?.balances?.sbiCurrent} color="text-indigo-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-indigo-600" />
          <Card title="SBI Current" value={data?.balances?.sbiSavings} color="text-pink-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-pink-600" />
          <Card title="eDistrict Node" value={data?.balances?.edistrict} color="text-orange-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-orange-600" />
          <Card title="PSA Terminal" value={data?.balances?.psa} color="text-teal-600" borderColor="border-slate-200" bgColor="bg-white" hoverBg="group-hover:bg-teal-600" />
        </div>
      )}

      {/* Analytics Chart Box */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <h3 className="font-bold text-xs tracking-wide text-slate-400 uppercase mb-5 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
          Today Collection Overview
        </h3>

        {loading ? (
          <ShimmerChart />
        ) : (
          <div className="w-full" style={{ contentVisibility: "auto" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#1e293b",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponent: Reusable light grid card layout
const Card = ({ title, value, color, borderColor, bgColor, hoverBg }) => (
  <div className={`${bgColor} border ${borderColor} p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative group`}>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
    <h3 className={`text-xl font-bold mt-2 ${color}`}>
      ₹{(value ?? 0).toLocaleString("en-IN")}
    </h3>
    {/* Light interactive dot on hover */}
    <div className={`w-1 h-1 rounded-full absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity ${hoverBg}`}></div>
  </div>
);

// Subcomponent: Light theme placeholder layout for skeleton state
const ShimmerCard = () => (
  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse">
    <div className="h-3 w-16 bg-slate-200 rounded mb-3"></div>
    <div className="h-5 w-24 bg-slate-200/70 rounded"></div>
  </div>
);

// Subcomponent: Light analytics loading placeholder rows
const ShimmerChart = () => (
  <div className="w-full h-[300px] animate-pulse flex items-end gap-6 px-4 pt-4 border-t border-slate-100">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex-1 bg-slate-200/60 rounded-t-lg"
        style={{ height: `${Math.random() * 60 + 30}%`, maxWidth: "50px", margin: "0 auto" }}
      ></div>
    ))}
  </div>
);

export default DashboardPage;