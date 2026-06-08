import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffDashboard } from "../redux/slices/dashboardSlice";
import AttendanceButton from "../components/AttendanceButton";

const StaffDashboard = () => {
  const dispatch = useDispatch();

  // Global redux store-ൽ നിന്നുള്ള ഡാറ്റ എടുക്കുന്നു
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStaffDashboard());
  }, [dispatch, user]);

  const todayCash = data?.today?.cash || 0;
  const todayGpay = data?.today?.gpay || 0;

  // എറർ മെസ്സേജ് വന്നാൽ കാണിക്കാൻ (Light Clean Style)
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-rose-800">Dashboard Loading Failed</h3>
          <p className="text-sm text-rose-600 font-medium mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 relative overflow-hidden space-y-8 animate-fade-in">
      {/* Background Glow Effect (Soften for Light Mode) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || "User"} ✨
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">Here is the latest financial tracking status for Akshaya Center.</p>
          </div>
          
          {/* Attendance Action Wrapper */}
          <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-md">
            <AttendanceButton />
          </div>
        </div>

        {/* Loading Skeleton Architecture */}
        {loading ? (
          <div className="space-y-8">
            <div className="flex justify-center py-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Balance Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card title="Today Cash" value={todayCash} icon="cash" glowColor="hover:border-emerald-300 hover:shadow-emerald-500/5" iconBg="bg-emerald-50 border-emerald-100 text-emerald-600" />
              <Card title="Today GPay" value={todayGpay} icon="gpay" glowColor="hover:border-sky-300 hover:shadow-sky-500/5" iconBg="bg-sky-50 border-sky-100 text-sky-600" />
              <Card title="SBI Savings Account" value={data?.balances?.sbiCurrent} icon="bank" glowColor="hover:border-indigo-300 hover:shadow-indigo-500/5" iconBg="bg-indigo-50 border-indigo-100 text-indigo-600" />
              <Card title="SBI Current Account" value={data?.balances?.sbiSavings} icon="bank" glowColor="hover:border-purple-300 hover:shadow-purple-500/5" iconBg="bg-purple-50 border-purple-100 text-purple-600" />
              <Card title="E-District Wallet" value={data?.balances?.edistrict} icon="wallet" glowColor="hover:border-amber-300 hover:shadow-amber-500/5" iconBg="bg-amber-50 border-amber-100 text-amber-600" />
              <Card title="PSA Wallet" value={data?.balances?.psa} icon="wallet" glowColor="hover:border-teal-300 hover:shadow-teal-500/5" iconBg="bg-teal-50 border-teal-100 text-teal-600" />
            </div>

            {/* Warning / Alert Panel Box */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl shadow-md text-xs md:text-sm font-medium flex items-start gap-3 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-amber-500"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                ഇന്ന് അക്ഷയയിൽ <span className="text-slate-900 font-extrabold underline decoration-amber-500 decoration-2">Cash = ₹{todayCash}</span> , <span className="text-slate-900 font-extrabold underline decoration-amber-500 decoration-2">GPay = ₹{todayGpay}</span> ഉണ്ടായിരിക്കേണ്ടതാണ്. എന്തെങ്കിലും വ്യത്യാസമുണ്ടെങ്കിൽ ദയവായി <span className="font-bold text-indigo-600 hover:text-indigo-500 underline cursor-pointer">My Transactions</span>-ൽ പോയി അത് edit ചെയ്യുക.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Subcomponent: Premium Light-Card Engine
const Card = ({ title, value, icon, glowColor, iconBg }) => {
  // Render specific SVGs depending on icon role
  const renderIcon = () => {
    switch (icon) {
      case "cash":
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "gpay":
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      case "bank":
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11m0 0h4m-4 0h5m-4 0h5m-5 3h1m-1 4h1m5-4h1m-1 4h1" /></svg>;
      default:
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
    }
  };

  return (
    <div className={`group bg-white border border-slate-200 p-5 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glowColor}`}>
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">{title}</p>
        <div className={`p-2 rounded-xl border transition-colors ${iconBg}`}>
          {renderIcon()}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-sm font-semibold text-slate-400">₹</span>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {(value || 0).toLocaleString("en-IN")}
        </h3>
      </div>
    </div>
  );
};

// Subcomponent: Light Mode Shimmer Loading Box
const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
    <div className="flex justify-between items-center">
      <div className="h-3 w-20 bg-slate-100 rounded-md animate-pulse"></div>
      <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
    </div>
    <div className="h-6 w-32 bg-slate-100 rounded-md animate-pulse"></div>
  </div>
);

export default StaffDashboard;