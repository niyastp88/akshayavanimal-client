import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyAttendance, checkIn, checkOut } from "../redux/slices/attendanceSlice";

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { history, today, loading, error } = useSelector((state) => state.attendance);

  // Date Filtering State Metrics
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Display-filtered attendance tracking array list
  const [filteredHistory, setFilteredHistory] = useState([]);

  // Summary Metrics State
  const [totalPresentDays, setTotalPresentDays] = useState(0);
  const [totalWorkedHours, setTotalWorkedHours] = useState(0);

  // Initial data loading directly linked to Redux global ecosystem
  useEffect(() => {
    dispatch(getMyAttendance());
  }, [dispatch]);

  // Handle client-side filtering whenever history matrix or date specs change
  useEffect(() => {
    if (Array.isArray(history)) {
      let filtered = [...history];

      // Standard string-based ISO date filtering logic
      if (from && to) {
        filtered = filtered.filter(item => item.date >= from && item.date <= to);
      } else if (from) {
        filtered = filtered.filter(item => item.date >= from);
      } else if (to) {
        filtered = filtered.filter(item => item.date <= to);
      }

      setFilteredHistory(filtered);

      // --- കാൽക്കുലേഷൻ ലോജിക് (ഫിൽട്ടർ ചെയ്ത ഡാറ്റ വെച്ച്) ---
      setTotalPresentDays(filtered.length);

      const totalHours = filtered.reduce((sum, item) => sum + (item.totalHours || 0), 0);
      setTotalWorkedHours(Number(totalHours.toFixed(2)));
    }
  }, [history, from, to]);

  const handleCheckIn = () => dispatch(checkIn());
  const handleCheckOut = () => dispatch(checkOut());

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return new Date(timeStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-600 space-y-6 max-w-6xl mx-auto animate-fade-in">
      
      {/* SHIFT TRIGGER ACTIONS & DATE FILTER BAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Attendance Log</h2>
          <p className="text-sm text-slate-400 mt-0.5">Streamline actions to clock and filter your work hours</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Date Range Selectors for Employee */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full sm:w-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-semibold text-slate-700 cursor-pointer w-full" />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full sm:w-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">To</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-semibold text-slate-700 cursor-pointer w-full" />
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-1"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={handleCheckIn} disabled={loading || !!today}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider">
              Clock-In
            </button>
            
            <button onClick={handleCheckOut} disabled={loading || !today || !!today?.checkOut}
              className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider">
              Clock-Out
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-semibold shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {/* STAFF SUMMARY DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-emerald-500"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Total Present Days</span>
          <div className="flex items-baseline gap-2 mt-2 pl-1">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">{totalPresentDays}</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-indigo-500"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Total Worked Hours</span>
          <div className="flex items-baseline gap-2 mt-2 pl-1">
            <span className="text-3xl font-black text-indigo-600 tracking-tight">{totalWorkedHours}</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Hours</span>
          </div>
        </div>
      </div>

      {/* RENDER TABLE LOG HISTORY */}
      {loading && filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-slate-100 rounded flex-1 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded flex-1 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white text-center py-16 rounded-2xl border border-dashed border-slate-300 shadow-sm">
          <p className="text-slate-400 font-semibold">No system records found for the selected date range.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Punch In Time</th>
                <th className="px-5 py-4 font-semibold">Punch Out Time</th>
                <th className="px-5 py-4 font-semibold text-center">Total Registered Session</th>
                <th className="px-5 py-4 font-semibold">Device Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {filteredHistory.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap text-xs">{formatDate(row.date)}</td>
                  <td className="px-5 py-4 font-bold text-emerald-600 whitespace-nowrap text-xs">{formatTime(row.checkIn)}</td>
                  <td className="px-5 py-4 font-bold text-rose-600 whitespace-nowrap text-xs">{formatTime(row.checkOut)}</td>
                  <td className="px-5 py-4 text-center whitespace-nowrap bg-slate-50/50">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {row.totalHours || "0"} hrs
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    {row.deviceInfo?.device || "Desktop"} <span className="text-slate-300 font-normal">|</span> {row.deviceInfo?.browser || "Browser"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;