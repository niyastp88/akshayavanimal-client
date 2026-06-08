import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { clearDashboard } from "../redux/slices/dashboardSlice";

const StaffLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      dispatch(clearDashboard());
      navigate("/");
    }
  };

  // കറന്റ് പേജ് ഏതാണെന്ന് നോക്കി ലിങ്കുകൾക്ക് Active കളർ കൊടുക്കാൻ
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col animate-fade-in">
      
      {/* Premium Light Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 backdrop-blur-md z-50 shadow-md shadow-slate-100 relative">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        {/* Brand Logo & Operator Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm shadow-indigo-200">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Staff Panel
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
              Operator: {user?.name || "System Staff"}
            </p>
          </div>
        </div>

        {/* Action Navigation Controls */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-semibold">
          
          <Link
            to="/staff"
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              isActive("/staff")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/staff/add"
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              isActive("/staff/add")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Add Transaction
          </Link>

          <Link
            to="/staff/my-transactions"
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              isActive("/staff/my-transactions")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            My Transactions
          </Link>

          <button
            onClick={() => navigate("/staff/add-expense")}
            className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              isActive("/staff/add-expense")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Add Expense
          </button>

          <Link
            to="/staff/my-expense"
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              isActive("/staff/my-expense")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Expense Report
          </Link>

          <button
            onClick={() => navigate("/staff/add-balance")}
            className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              isActive("/staff/add-balance")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Add Balance
          </button>

          <Link
            to="/staff/my-balance"
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              isActive("/staff/my-balance")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Balance Report
          </Link>

          <Link
            to="/staff/attendance"
            className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
              isActive("/staff/attendance")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Attendance Report
          </Link>

          {/* Separator Divider line */}
          <div className="h-5 w-[1px] bg-slate-200 hidden lg:block mx-1"></div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l4 4m-4-4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

        </div>
      </nav>

      {/* Dynamic Sub-Page Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default StaffLayout;