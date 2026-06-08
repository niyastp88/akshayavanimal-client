import { useEffect, useState } from "react";
import API from "../api/api";

const AdminAttendance = () => {
  const [data, setData] = useState([]);
  const [staffList, setStaffList] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // Filtering state metrics
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  // Summary Metrics State
  const [totalPresentDays, setTotalPresentDays] = useState(0);
  const [totalWorkedHours, setTotalWorkedHours] = useState(0);

  useEffect(() => {
    fetchData();
    fetchStaffDropdown();
  }, [from, to, selectedStaff]); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/attendance/all?from=${from}&to=${to}&staffId=${selectedStaff}`);
      const result = Array.isArray(res.data) ? res.data : res.data.data || [];
      setData(result);

      // --- കാൽക്കുലേഷൻ ലോജിക് ---
      // ടേബിളിലുള്ള ഡാറ്റയുടെ എണ്ണമാണ് ആകെ വന്ന ദിവസങ്ങൾ (Total Present Days)
      setTotalPresentDays(result.length);

      // ആകെ ജോലി ചെയ്ത മണിക്കൂറുകൾ കൂട്ടിയെടുക്കുന്നു
      const totalHours = result.reduce((sum, item) => sum + (item.totalHours || 0), 0);
      setTotalWorkedHours(Number(totalHours.toFixed(2)));
      
    } catch (err) {
      console.error("Error fetching administrative logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffDropdown = async () => {
    try {
      const res = await API.get("/users"); 
      if(Array.isArray(res.data)) setStaffList(res.data);
    } catch (err) {
      console.log("Staff listing query bypass dropped.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return new Date(timeStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-600">
      
      {/* FILTER CONTROL AND ACTION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Attendance Control</h2>
          <p className="text-sm text-slate-400 mt-0.5">Track, audit and analyze workspace operational shifts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Staff Dropdown Filter */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Staff</span>
            <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-slate-700 font-medium cursor-pointer max-w-[150px]">
              <option value="" className="bg-white">All Employees</option>
              {staffList.map(u => (
                <option key={u._id} value={u._id} className="bg-white">{u.name}</option>
              ))}
            </select>
          </div>

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
        </div>
      </div>

      {/* SUMMARY DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col relative overflow-hidden shadow-sm group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Present Days (ഹാജരായ ദിവസങ്ങൾ)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">{totalPresentDays}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col relative overflow-hidden shadow-sm group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Worked Hours (ആകെ ജോലി ചെയ്ത സമയം)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">{totalWorkedHours}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hours</span>
          </div>
        </div>
      </div>

      {/* SHIMMER STATE LOADING */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-slate-200/60 rounded flex-1 animate-pulse"></div>
              <div className="h-4 bg-slate-200/60 rounded flex-1 animate-pulse"></div>
              <div className="h-4 bg-slate-200/60 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        /* RENDER ATTENDANCE TABLE */
        <div className="overflow-x-auto bg-white shadow-sm border border-slate-200 rounded-2xl">
          <table className="min-w-full text-sm divide-y divide-slate-200">
            <thead className="bg-indigo-50/70 text-indigo-700 font-semibold uppercase tracking-wider text-xs text-left">
              <tr>
                <th className="px-5 py-4 border-b border-slate-200">Employee Name</th>
                <th className="px-5 py-4 border-b border-slate-200">Shift Date</th>
                <th className="px-5 py-4 border-b border-slate-200">Check In</th>
                <th className="px-5 py-4 border-b border-slate-200">Check Out</th>
                <th className="px-5 py-4 border-b border-slate-200 text-center">Duration</th>
                <th className="px-5 py-4 border-b border-slate-200">Device</th>
                <th className="px-5 py-4 border-b border-slate-200">Browser</th>
                <th className="px-5 py-4 border-b border-slate-200">IP Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-slate-400 font-medium">
                    No matching attendance logs registered.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{row.staffName}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-slate-400">{formatDate(row.date)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-emerald-600">{formatTime(row.checkIn)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-rose-600">{formatTime(row.checkOut)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center font-bold text-indigo-600 bg-indigo-50/40 rounded-lg">{row.totalHours || "0"} hrs</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs">{row.deviceInfo?.device || "-"}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-400">{row.deviceInfo?.browser || "-"}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-slate-400">{row.deviceInfo?.ip || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;