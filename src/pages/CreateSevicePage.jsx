import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createService, resetServiceState } from "../redux/slices/serviceCreateSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateServicePage = () => {
  const [form, setForm] = useState({
    name: "",
    hasBank: false,
    hasCash: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.serviceCreate
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error("Please enter a service name");
    }

    if (!form.hasBank && !form.hasCash) {
      return toast.error("Select at least one payment scope (Bank or Cash)");
    }

    dispatch(createService(form));
  };

  useEffect(() => {
    if (success) {
      toast.success("Service provisioned successfully");
      setForm({ name: "", hasBank: false, hasCash: false });
      dispatch(resetServiceState());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetServiceState());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in bg-gray-950">
      <div className="bg-gray-900 border border-gray-800/80 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 relative overflow-hidden">
        
        {/* Decorative Neon Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
            Deploy New Service
          </h2>
          <p className="text-xs text-gray-500 mt-1">Configure financial channels for the master terminal</p>
        </div>

        {/* Main Operational Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Service Name Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Service Identity</label>
            <input
              type="text"
              placeholder="e.g., Express Delivery, Premium Consulting"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-950 text-gray-200 text-sm p-3 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 transition placeholder-gray-700"
            />
          </div>

          {/* Cyberpunk Custom Checkboxes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Allowed Ledgers</label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Bank Option */}
              <label className={`flex items-center justify-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                form.hasBank 
                  ? "bg-indigo-600/10 border-indigo-500/60 text-indigo-400 font-bold shadow-sm shadow-indigo-500/5" 
                  : "bg-gray-950/60 border-gray-800/80 text-gray-400 hover:border-gray-700"
              }`}>
                <input
                  type="checkbox"
                  checked={form.hasBank}
                  onChange={(e) => setForm({ ...form, hasBank: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-gray-950 border-gray-800 focus:ring-indigo-500 focus:ring-offset-gray-900 accent-indigo-500"
                />
                <span className="text-xs tracking-wide uppercase">Bank Node</span>
              </label>

              {/* Cash Option */}
              <label className={`flex items-center justify-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition ${
                form.hasCash 
                  ? "bg-purple-600/10 border-purple-500/60 text-purple-400 font-bold shadow-sm shadow-purple-500/5" 
                  : "bg-gray-950/60 border-gray-800/80 text-gray-400 hover:border-gray-700"
              }`}>
                <input
                  type="checkbox"
                  checked={form.hasCash}
                  onChange={(e) => setForm({ ...form, hasCash: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 bg-gray-950 border-gray-800 focus:ring-purple-500 focus:ring-offset-gray-900 accent-purple-500"
                />
                <span className="text-xs tracking-wide uppercase">Cash Node</span>
              </label>

            </div>
          </div>

          {/* Action Call Control Buttons */}
          <div className="space-y-2 pt-2">
            <button
              disabled={loading}
              className="w-full bg-indigo-600 border border-indigo-500/40 text-white font-bold text-sm p-3 rounded-xl hover:bg-indigo-500 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500 transition-all shadow-lg shadow-indigo-600/10"
            >
              {loading ? "Provisioning..." : "Create Core Service"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-full bg-gray-950 border border-gray-800 text-gray-400 hover:text-gray-200 font-bold text-sm p-3 rounded-xl transition"
            >
              Return to Control Panel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateServicePage;