import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchExpenseTypes,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
  resetExpenseStatus,
} from "../redux/slices/expenseSlice";

const CreateExpensePage = () => {
  const dispatch = useDispatch();

  const {
    types,
    loading,
    saveLoading,
    page,
    totalPage, // നോട്ട്: നിങ്ങളുടെ റിഡക്സ് സ്റ്റേറ്റിൽ totalPages ആണോ totalPage ആണോ എന്ന് നോക്കുക, ലോജിക് മാറ്റിയിട്ടില്ല
    totalPages,
    error,
    success,
  } = useSelector((state) => state.expense);

  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [actionType, setActionType] = useState("");

  // Load types
  useEffect(() => {
    dispatch(
      fetchExpenseTypes({
        page: currentPage,
        limit: 5,
      })
    );
  }, [dispatch, currentPage]);

  // Success message
  useEffect(() => {
    if (!success) return;

    toast.success(
      actionType === "edit"
        ? "Expense type updated"
        : "Expense type added"
    );

    setName("");
    setEditId(null);
    setEditName("");
    dispatch(resetExpenseStatus());
    dispatch(
      fetchExpenseTypes({
        page: currentPage,
        limit: 5,
      })
    );
  }, [success, actionType, dispatch, currentPage]);

  // Error message
  useEffect(() => {
    if (!error) return;

    toast.error(error);
    dispatch(resetExpenseStatus());
  }, [error, dispatch]);

  // Add expense type
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Enter expense name");
    }

    setActionType("create");
    dispatch(createExpenseType({ name }));
  };

  // Start edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditName(item.name);
  };

  // Save edit
  const handleSave = (id) => {
    if (!editName.trim()) {
      return toast.error("Enter expense name");
    }

    setActionType("edit");
    dispatch(
      updateExpenseType({
        id,
        data: { name: editName },
      })
    );
  };

  // Delete
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense type?"
    );

    if (!confirmed) return;

    dispatch(deleteExpenseType(id));
    toast.success("Expense type deleted");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto my-4 text-slate-600 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-6">
        
        {/* Header Section */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Configure Expense Blueprint
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Define and refine transaction categories for the ledger system</p>
        </div>

        {/* Create Form Control */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., Office Rent, Server Cost, Fuel"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:bg-white transition placeholder-slate-300 font-medium"
          />
          <button
            disabled={saveLoading}
            className="bg-purple-600 border border-purple-700 text-white font-bold text-sm px-5 rounded-xl hover:bg-purple-500 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 transition-all duration-150 shadow-md shadow-purple-600/10 min-w-[85px] cursor-pointer"
          >
            {saveLoading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Global Skeleton / Loading State */}
        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider py-2">
            <div className="w-3.5 h-3.5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <span>Fetching indices...</span>
          </div>
        )}

        {/* Types Dynamic List Container */}
        <div className="space-y-2.5">
          {types && types.map((item) => (
            <div
              key={item._id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center hover:border-slate-300 hover:bg-slate-100/40 transition"
            >
              {editId === item._id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-white border border-purple-500 p-1.5 px-3 rounded-lg flex-1 mr-3 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-100"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-3 pl-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-slate-700 font-semibold text-sm">{item.name}</span>
                </div>
              )}

              {/* Action Operations */}
              <div className="flex gap-1.5">
                {editId === item._id ? (
                  <>
                    <button
                      onClick={() => handleSave(item._id)}
                      disabled={saveLoading}
                      className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-600 hover:text-white px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditName("");
                      }}
                      className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-amber-50 border border-amber-200 hover:bg-amber-500 text-amber-700 hover:text-white px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-rose-50 border border-rose-200 hover:bg-rose-600 text-rose-600 hover:text-white px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer shadow-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Clean Matrix Pagination Panel */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-white text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-40 disabled:hover:text-slate-500 transition cursor-pointer shadow-sm"
            >
              ← Prev
            </button>

            <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
              Page <span className="text-purple-600 font-mono">{page}</span> of <span className="text-slate-500 font-mono">{totalPages}</span>
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev - 1)} // നോട്ട്: നിങ്ങളുടെ ഒറിജിനൽ കോഡിൽ ഇവിടെ (prev) => prev + 1 നു പകരം - 1 ആയിരുന്നു. ലോജിക് മാറ്റരുതെന്ന് പറഞ്ഞതുകൊണ്ട് ഞാൻ തിരുത്തിയിട്ടില്ല.
              className="bg-white text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-40 disabled:hover:text-slate-500 transition cursor-pointer shadow-sm"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateExpensePage;