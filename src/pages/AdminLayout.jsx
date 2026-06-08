import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { clearDashboard } from "../redux/slices/dashboardSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  // Clear states and redirect user out on logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to exit the control panel?")) {
      dispatch(logout());
      dispatch(clearDashboard());
      navigate("/");
    }
  };

  // Helper function to check if the path is currently active
  const isActive = (path) => location.pathname === path;

  return (
    // Clean light background view wrapper
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* Clean Premium Light Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 backdrop-blur-md z-50 shadow-sm">
        
        {/* Brand Logo & Operator Tag */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
              Operator: {user?.name || "System Administrator"}
            </p>
          </div>
        </div>

        {/* Action Navigation Controls Grid */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 text-xs font-semibold w-full lg:w-auto">
          
          <NavBtn to="/admin" active={isActive("/admin")}>
            Dashboard
          </NavBtn>

          <NavBtn to="/admin/report" active={isActive("/admin/report")}>
            Report
          </NavBtn>

          <NavBtn to="/admin/profit" active={isActive("/admin/profit")}>
            Profit & Expense
          </NavBtn>

          <NavBtn to="/admin/staff-report" active={isActive("/admin/staff-report")}>
            Staff Report
          </NavBtn>

          <NavBtn to="/admin/attendance" active={isActive("/admin/attendance")}>
            Attendance Report
          </NavBtn>

          <NavBtn to="/admin/create-staff" active={isActive("/admin/create-staff")}>
            Staff Management
          </NavBtn>

          <NavBtn to="/admin/balance-tx" active={isActive("/admin/balance-tx")}>
            Balance Report
          </NavBtn>

          <NavBtn to="/admin/expense" active={isActive("/admin/expense")}>
            Expense Report
          </NavBtn>

          <NavBtn to="/admin/create-service" active={isActive("/admin/create-service")}>
            Service Management
          </NavBtn>

          <NavBtn to="/admin/balance" active={isActive("/admin/balance")}>
            Opening Balance
          </NavBtn>

          {/* Action Trigger Buttons */}
          <button
            onClick={() => navigate("/admin/create-expense")}
            className={`px-3 py-2 rounded-xl border transition-all duration-150 cursor-pointer ${
              isActive("/admin/create-expense")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70 hover:text-slate-800"
            }`}
          >
            Add Expense Type
          </button>

          <button
            onClick={() => navigate("/admin/create-balance-type")}
            className={`px-3 py-2 rounded-xl border transition-all duration-150 cursor-pointer ${
              isActive("/admin/create-balance-type")
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70 hover:text-slate-800"
            }`}
          >
            Add Balance Type
          </button>

          {/* Separator Divider Line */}
          <div className="hidden xl:block h-5 w-[1px] bg-slate-200 mx-1.5"></div>

          {/* Logout Action Trigger */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-xl transition duration-150 flex items-center gap-1.5 ml-auto sm:ml-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l4 4m-4-4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

        </div>
      </nav>

      {/* Dynamic Sub-page Container Content Render view */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

    </div>
  );
};

// Reusable Navigation Link Button Component
const NavBtn = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-xl border transition-all duration-150 text-center ${
      active
        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm font-bold"
        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70 hover:text-slate-800"
    }`}
  >
    {children}
  </Link>
);

export default AdminLayout;