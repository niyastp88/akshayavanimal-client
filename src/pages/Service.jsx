import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  resetServiceState,
} from "../redux/slices/serviceSlice";

const initialForm = {
  name: "",
  hasCash: false,
  hasBank: false,
  hasEdistrict: false,
  hasPsa: false,
  hasBill: false,
  edistrictCharge: "",
  psaCharge: "",
};

const CreateServicePage = () => {
  const dispatch = useDispatch();

  const {
    data = [],
    loading,
    saveLoading,
    success,
    error,
    page,
    totalPages,
  } = useSelector((state) => state.services || {});

  const [form, setForm] = useState(initialForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);

  // Load services
  useEffect(() => {
    dispatch(fetchServices(currentPage));
  }, [dispatch, currentPage]);

  // Success / Error
  useEffect(() => {
    if (success) {
      toast.success("Service config deployed successfully");
      setForm(initialForm);
      setEditId(null);
      dispatch(resetServiceState());
      dispatch(fetchServices(currentPage));
    }
  }, [success, dispatch, currentPage]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  // Form change
  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  // Create
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error("Enter terminal service name");
    }

    if (!form.hasCash && !form.hasBank) {
      return toast.error("Select Cash or Bank processing node");
    }

    dispatch(
      createService({
        ...form,
        edistrictCharge: Number(form.edistrictCharge) || 0,
        psaCharge: Number(form.psaCharge) || 0,
      }),
    );
  };

  // Start edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      ...item,
    });
  };

  // Save edit
  const handleSave = async (id) => {
    const result = await dispatch(
      updateService({
        id,
        data: {
          ...editForm,
          edistrictCharge: Number(editForm.edistrictCharge) || 0,
          psaCharge: Number(editForm.psaCharge) || 0,
        },
      }),
    );

    if (updateService.fulfilled.match(result)) {
      toast.success("Service config modified");
      setEditId(null);
      setEditForm(initialForm);
      dispatch(fetchServices(currentPage));
    }
  };

  // Delete
  const handleDelete = (id) => {
    const confirmed = window.confirm("Decommission this service permanently?");
    if (!confirmed) return;
    dispatch(deleteService(id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-600 animate-fade-in">
      
      {/* SECTION 1: Create Service Form */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Deploy Core Service Scope
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Register new transaction parameters into global network matrix</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Service Identity Label</label>
            <input
              placeholder="e.g. Passport Application, Utility Bill Submission"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm p-3 rounded-xl transition-all placeholder:text-slate-300 text-slate-700 font-semibold"
            />
          </div>

          {/* Primary Core Gateways */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Primary Core Ledger Route (Select minimum one)</label>
            <div className="flex gap-3 flex-wrap">
              <label className={`flex items-center gap-3 border px-4 py-3 rounded-xl cursor-pointer select-none transition-all duration-150 ${form.hasCash ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold shadow-sm' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={form.hasCash}
                  onChange={(e) => handleChange("hasCash", e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 accent-blue-600"
                />
                <span className="text-xs tracking-wide uppercase font-semibold">Cash Node</span>
              </label>

              <label className={`flex items-center gap-3 border px-4 py-3 rounded-xl cursor-pointer select-none transition-all duration-150 ${form.hasBank ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-bold shadow-sm' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={form.hasBank}
                  onChange={(e) => handleChange("hasBank", e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-white border-slate-300 accent-indigo-600"
                />
                <span className="text-xs tracking-wide uppercase font-semibold">Bank Node</span>
              </label>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100"></div>

          {/* Secondary Sub-Gateways Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            
            {/* eDistrict Block */}
            <div className="space-y-2.5">
              <label className={`flex items-center gap-3 border p-3.5 rounded-xl cursor-pointer select-none transition-all duration-150 ${form.hasEdistrict ? 'border-purple-500 bg-purple-50 text-purple-600 font-bold shadow-sm' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={form.hasEdistrict}
                  onChange={(e) => handleChange("hasEdistrict", e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 bg-white border-slate-300 accent-purple-600"
                />
                <span className="text-xs tracking-wide uppercase font-semibold">eDistrict Module</span>
              </label>
              {form.hasEdistrict && (
                <div className="animate-fade-in">
                  <input
                    type="number"
                    placeholder="Terminal Fee Rate (₹)"
                    value={form.edistrictCharge}
                    onChange={(e) => handleChange("edistrictCharge", e.target.value)}
                    className="w-full bg-slate-50 border border-purple-200 text-purple-700 focus:outline-none focus:border-purple-500 text-xs p-2.5 rounded-xl transition font-bold"
                  />
                </div>
              )}
            </div>

            {/* PSA Block */}
            <div className="space-y-2.5">
              <label className={`flex items-center gap-3 border p-3.5 rounded-xl cursor-pointer select-none transition-all duration-150 ${form.hasPsa ? 'border-amber-500 bg-amber-50 text-amber-600 font-bold shadow-sm' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={form.hasPsa}
                  onChange={(e) => handleChange("hasPsa", e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 bg-white border-slate-300 accent-amber-600"
                />
                <span className="text-xs tracking-wide uppercase font-semibold">PSA Module</span>
              </label>
              {form.hasPsa && (
                <div className="animate-fade-in">
                  <input
                    type="number"
                    placeholder="PSA Overhead Rate (₹)"
                    value={form.psaCharge}
                    onChange={(e) => handleChange("psaCharge", e.target.value)}
                    className="w-full bg-slate-50 border border-amber-200 text-amber-700 focus:outline-none focus:border-amber-500 text-xs p-2.5 rounded-xl transition font-bold"
                  />
                </div>
              )}
            </div>

            {/* Invoicing Control Block */}
            <div>
              <label className={`flex items-center gap-3 border p-3.5 rounded-xl cursor-pointer select-none transition-all duration-150 ${form.hasBill ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-bold shadow-sm' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={form.hasBill}
                  onChange={(e) => handleChange("hasBill", e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-white border-slate-300 accent-emerald-600"
                />
                <span className="text-xs tracking-wide uppercase font-semibold">Mandatory Invoice</span>
              </label>
            </div>
          </div>

          {/* Form Trigger Action */}
          <button
            disabled={saveLoading}
            className={`w-full py-3 px-4 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-150 ${saveLoading ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] border border-indigo-500/40"}`}
          >
            {saveLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing Matrix...
              </span>
            ) : (
              "Deploy Service Stream"
            )}
          </button>
        </form>
      </div>

      {/* SECTION 2: Registered Database Log */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-purple-500 rounded-sm"></span>
            Active Operational Registry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Audit and refine configuration of alive routing terminals</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-r-2 border-indigo-500"></div>
            <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Fetching registry stream...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-semibold text-xs uppercase tracking-wider border border-dashed border-slate-200 rounded-xl bg-slate-50/50">No active matrix channels logged.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {data.map((item) => (
              <div key={item._id} className="border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all bg-slate-50/30 hover:bg-slate-50">
                
                {editId === item._id ? (
                  /* Edit Form Mode Block */
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">Edit System Descriptor</label>
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name: e.target.value,
                          })
                        }
                        className="bg-white border border-slate-300 focus:outline-none focus:border-indigo-500 p-2.5 rounded-xl w-full text-xs font-semibold text-slate-700"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleSave(item._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/40 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        Commit Meta
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-slate-200 border border-slate-300 text-slate-600 hover:bg-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Abort
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal View Mode Block */
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-800 text-base tracking-tight">{item.name}</h3>
                      <div className="flex flex-wrap gap-1.5 font-bold">
                        {item.hasCash && <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] uppercase">Cash</span>}
                        {item.hasBank && <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md text-[10px] uppercase">Bank</span>}
                        {item.hasEdistrict && <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-md text-[10px] uppercase">eDistrict (₹{item.edistrictCharge || 0})</span>}
                        {item.hasPsa && <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] uppercase">PSA (₹{item.psaCharge || 0})</span>}
                        {item.hasBill && <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] uppercase">With Invoice</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-slate-100 sm:border-none pt-3 sm:pt-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-amber-50 border border-amber-200 hover:bg-amber-500 text-amber-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all sm:w-20 text-center"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-rose-50 border border-rose-200 hover:bg-rose-600 text-rose-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all sm:w-20 text-center"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SECTION 3: Micro-pagination Terminal Node */}
        <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-100">
          <button
            disabled={page === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            Prev
          </button>

          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
            NODE {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;