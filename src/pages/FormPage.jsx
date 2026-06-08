import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../redux/slices/serviceSlice";
import { addTransaction } from "../redux/slices/transactionSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: services, loading: fetchLoading } = useSelector(
    (state) => state.services
  );

  const [selectedService, setSelectedService] = useState(null);
  const [cashAmount, setCashAmount] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [splitCash, setSplitCash] = useState("");
  const [splitGpay, setSplitGpay] = useState("");

  // Search and Dropdown States
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🔥 LOCAL LOADING (IMPORTANT)
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // limit നമ്മൾ വലിയൊരു സംഖ്യയായി കൊടുക്കുന്നു, അപ്പോൾ ബാക്ക്-എൻഡ് എല്ലാ സർവീസുകളും തരും
    dispatch(fetchServices({ page: 1, limit: 1000 })); 
  }, [dispatch]);

  // Dropdown പുറത്ത് ക്ലിക്ക് ചെയ്താൽ ക്ലോസ് ആകാൻ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter services based on search query
  const filteredServices = services?.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService || !paymentType) {
      toast.error("Select service & payment type");
      return;
    }

    const baseCash = Number(cashAmount) || 0;
    const baseBank = Number(bankAmount) || 0;
    const total = baseCash + baseBank;

    if (total === 0) {
      toast.error("Enter amount");
      return;
    }

    let finalCash = 0;
    let finalGpay = 0;

    if (paymentType === "cash") {
      finalCash = total;
    } else if (paymentType === "gpay") {
      finalGpay = total;
    } else {
      const c = Number(splitCash) || 0;
      const g = Number(splitGpay) || 0;

      if (c + g !== total) {
        toast.error("Split must equal total");
        return;
      }

      finalCash = c;
      finalGpay = g; // Syntax error fixed here
    }

    const confirm = window.confirm(
      `Total received amount is ${total}. Continue?`
    );

    if (!confirm) return;

    try {
      setSubmitting(true);

      const startTime = Date.now();

      const res = await dispatch(
        addTransaction({
          serviceId: selectedService._id,
          cashAmount: baseCash,
          bankAmount: baseBank,
          splitCash: finalCash,
          gpayAmount: finalGpay,
          paymentType,
        })
      );

      // 🔥 FORCE MINIMUM LOADING TIME
      const elapsed = Date.now() - startTime;
      const delay = Math.max(700 - elapsed, 0);
      await new Promise((r) => setTimeout(r, delay));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Transaction Added ✅", {
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        });

        // reset
        setSelectedService(null);
        setSearchQuery("");
        setCashAmount("");
        setBankAmount("");
        setPaymentType("");
        setSplitCash("");
        setSplitGpay("");
      } else {
        toast.error("Failed to add transaction");
      }

    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 text-slate-800 animate-fade-in">
      <div className="w-full max-w-xl">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div className="border-b border-slate-100 pb-4 mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Transaction</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Record client service payments efficiently</p>
          </div>

          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-sm text-slate-400 font-medium">Loading services...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Searchable Service Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Service</label>
                <div
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl cursor-pointer flex justify-between items-center transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-500 focus-within:bg-white"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={`font-semibold ${selectedService ? "text-slate-900" : "text-slate-400"}`}>
                    {selectedService ? selectedService.name : "Choose a service..."}
                  </span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden max-h-60 flex flex-col animate-fadeIn">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                      <input
                        type="text"
                        placeholder="Search service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()} 
                        className="w-full border border-slate-200 bg-white px-3 py-2 rounded-lg text-sm outline-none focus:border-indigo-500 font-semibold text-slate-800"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredServices.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center font-medium">No services found</p>
                      ) : (
                        filteredServices.map((s) => (
                          <div
                            key={s._id}
                            className={`px-4 py-3 text-sm cursor-pointer transition-colors font-semibold ${selectedService?._id === s._id ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                            onClick={() => {
                              setSelectedService(s);
                              setIsOpen(false);
                              setSearchQuery("");
                              setCashAmount("");
                              setBankAmount("");
                              setPaymentType("");
                              setSplitCash("");
                              setSplitGpay("");
                            }}
                          >
                            {s.name}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Conditional Amount Fields */}
              {(selectedService?.hasCash || selectedService?.hasBank) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl animate-fadeIn">
                  {/* Cash Amount */}
                  {selectedService?.hasCash && (
                    <div>
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Cash Amount</label>
                      <input
                        type="number"
                        placeholder="₹ 0.00"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="w-full border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 rounded-xl outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
                      />
                    </div>
                  )}

                  {/* Bank Amount */}
                  {selectedService?.hasBank && (
                    <div>
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Bank Amount</label>
                      <input
                        type="number"
                        placeholder="₹ 0.00"
                        value={bankAmount}
                        onChange={(e) => setBankAmount(e.target.value)}
                        className="w-full border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 rounded-xl outline-none transition-all font-bold text-slate-900 placeholder-slate-330"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Payment Type Tabs */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5">Payment Received As</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  {[
                    { id: "cash", label: "Full Cash" },
                    { id: "gpay", label: "Full GPay" },
                    { id: "both", label: "Split Pay" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPaymentType(type.id)}
                      className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-lg transition-all cursor-pointer ${paymentType === type.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Fields Toggle */}
              {paymentType === "both" && (
                <div className="grid grid-cols-2 gap-4 border border-indigo-100 bg-indigo-50/30 p-4 rounded-2xl animate-fadeIn">
                  <div>
                    <label className="block text-xs font-extrabold text-indigo-600 mb-1.5">Split Cash amount</label>
                    <input
                      type="number"
                      placeholder="₹ Cash"
                      value={splitCash}
                      onChange={(e) => setSplitCash(e.target.value)}
                      className="w-full border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-2.5 rounded-xl outline-none transition-all font-bold text-slate-900 text-sm placeholder-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-indigo-600 mb-1.5">Split GPay amount</label>
                    <input
                      type="number"
                      placeholder="₹ GPay"
                      value={splitGpay}
                      onChange={(e) => setSplitGpay(e.target.value)}
                      className="w-full border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-2.5 rounded-xl outline-none transition-all font-bold text-slate-900 text-sm placeholder-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* 🔥 SUBMIT BUTTON */}
              <button
                disabled={submitting}
                className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all duration-150 cursor-pointer ${submitting ? "bg-indigo-600/40 text-indigo-100 cursor-not-allowed shadow-none" : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] shadow-lg shadow-indigo-100"}`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting Transaction...
                  </span>
                ) : (
                  "Submit Transaction"
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;