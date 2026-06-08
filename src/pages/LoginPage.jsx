import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // Submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (result.meta.requestStatus === "fulfilled") {
      const role = result.payload?.user?.role;

      navigate(role === "admin" ? "/admin" : "/staff");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden animate-fade-in">
      {/* Background Decorative Ambient Glows (Soften for Light Mode) */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-8 z-10 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Akshaya Login
          </h1>
          
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-5 text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-rose-700 text-xs font-bold tracking-wide">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={form.username}
                placeholder="Enter username"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium focus:bg-white transition-all"
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={form.password}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium focus:bg-white transition-all"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 border flex items-center justify-center gap-2 mt-2 cursor-pointer ${
              loading
                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 border-indigo-700 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;