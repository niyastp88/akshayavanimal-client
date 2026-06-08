import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStaff, resetStatus } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const CreateStaffPage = () => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.users);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.username.trim() || !form.name.trim() || !form.password.trim()) {
      alert("All fields are required");
      return;
    }

    dispatch(createStaff(form));
  };

  useEffect(() => {
    if (success) {
      alert("Staff created successfully");
      setForm({ username: "", name: "", password: "" });
      dispatch(resetStatus());
      navigate("/admin"); // Optional: auto-redirect back on success
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md space-y-5"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Staff</h2>
          <p className="text-sm text-slate-400 mt-0.5">Register a new workspace operator profile</p>
        </div>

        {/* ERROR HANDLER NOTIFICATION */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* FORM INPUT FIELDS */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
            <input
              type="text"
              placeholder="e.g. rahul_akshaya"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-slate-200 p-3 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold p-3 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            {loading ? "Creating Profile..." : "Create Staff Profile"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full bg-white text-slate-500 border border-slate-200 hover:text-slate-700 hover:bg-slate-50 text-sm font-semibold p-3 rounded-xl transition-all duration-200 cursor-pointer"
          >
            Cancel & Back
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default CreateStaffPage;