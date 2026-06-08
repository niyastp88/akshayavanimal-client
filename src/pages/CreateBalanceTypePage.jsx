import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchBalanceTypes,
  createBalanceType,
  resetBalanceStatus,
} from "../redux/slices/balanceSlice";

const BALANCE_TYPES = [
  "SBI Current Account",
  "SBI Savings Account",
  "Edistrict",
  "PSA",
];

const CreateBalanceTypePage = () => {
  const dispatch = useDispatch();

  const { types = [], saveLoading, error, success } = useSelector(
    (state) => state.balance || {}
  );

  const [selectedType, setSelectedType] = useState("");

  // Load existing types
  useEffect(() => {
    dispatch(fetchBalanceTypes());
  }, [dispatch]);

  // Success message
  useEffect(() => {
    if (!success) return;

    toast.success("Balance type provisioned successfully");
    setSelectedType("");
    dispatch(resetBalanceStatus());
  }, [success, dispatch]);

  // Error message
  useEffect(() => {
    if (!error) return;

    toast.error(error);
    dispatch(resetBalanceStatus());
  }, [error, dispatch]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedType) {
      return toast.error("Please select a balance type gateway");
    }

    const confirmed = window.confirm(
      `Confirm deployment of "${selectedType}" network node?`
    );

    if (!confirmed) return;

    dispatch(
      createBalanceType({
        name: selectedType,
      })
    );
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 animate-fade-in bg-slate-50">
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500"></div>

        {/* Header Title */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight text-center">
            Initialize Balance Gateway
          </h2>
          <p className="text-xs text-slate-400 text-center mt-1">
            Activate legal ledger parameters for financial accounting
          </p>
        </div>

        {/* Operational Scope Checklist */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
              Available Gateways
            </label>
            
            <div className="space-y-2.5">
              {BALANCE_TYPES.map((type) => {
                const alreadyAdded = types.some((item) => item && item.name === type);
                const isCurrentSelection = selectedType === type;

                return (
                  <label
                    key={type}
                    className={`flex items-center justify-between p-3.5 rounded-xl border select-none transition-all duration-150 relative overflow-hidden text-xs font-mono tracking-wide uppercase ${
                      alreadyAdded
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-700 font-semibold cursor-not-allowed"
                        : isCurrentSelection
                        ? "bg-indigo-50 border-indigo-400 text-indigo-600 font-bold shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100/50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 z-10">
                      <input
                        type="checkbox"
                        checked={alreadyAdded || isCurrentSelection}
                        disabled={alreadyAdded}
                        onChange={() => setSelectedType(isCurrentSelection ? "" : type)}
                        className={`w-4 h-4 rounded border-slate-300 focus:ring-0 transition ${
                          alreadyAdded 
                            ? "text-emerald-600 accent-emerald-600 opacity-60" 
                            : "text-indigo-600 accent-indigo-600"
                        }`}
                      />
                      <span>{type}</span>
                    </div>

                    {/* Status Badge Indicator */}
                    <div className="text-[10px] font-bold font-mono z-10 px-2 py-0.5 rounded">
                      {alreadyAdded ? (
                        <span className="text-emerald-600 bg-emerald-100/50 border border-emerald-200 px-1.5 py-0.5 rounded text-[9px]">ACTIVE</span>
                      ) : isCurrentSelection ? (
                        <span className="text-indigo-500 animate-pulse">✓ READY</span>
                      ) : (
                        <span className="text-slate-300">STANDBY</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-3">
            <button
              disabled={saveLoading}
              className="w-full bg-indigo-600 border border-indigo-700 text-white font-bold text-xs uppercase tracking-wider p-3 rounded-xl hover:bg-indigo-500 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {saveLoading ? "Provisioning Node..." : "Deploy Active Network"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateBalanceTypePage;