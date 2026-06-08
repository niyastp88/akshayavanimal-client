import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStaff, fetchStaffUsers, updateStaffUser, deleteStaffUser, resetStatus } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const CreateStaffPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { staffList, loading, listLoading, error, success } = useSelector((state) => state.users);

  // Form State
  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
  });

  // Edit State Triggers
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // Load staff list on component mount
  useEffect(() => {
    dispatch(fetchStaffUsers());
  }, [dispatch]);

  // Handle Success Messages
  useEffect(() => {
    if (success) {
      alert(isEditing ? "Staff updated successfully" : "Staff created successfully");
      clearForm();
      dispatch(resetStatus());
    }
  }, [success, isEditing, dispatch]);

  const clearForm = () => {
    setForm({ username: "", name: "", password: "" });
    setIsEditing(false);
    setEditUserId(null);
  };

  // Submit Logic for Create & Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // If password field is empty in edit, don't update it, pass everything else
      const updateData = { username: form.username, name: form.name };
      if (form.password.trim() !== "") {
        updateData.password = form.password;
      }
      dispatch(updateStaffUser({ id: editUserId, data: updateData })).then(() => {
        dispatch(fetchStaffUsers()); // Refresh list
      });
    } else {
      dispatch(createStaff(form));
    }
  };

  // Trigger Edit Form Mode
  const handleEditClick = (user) => {
    setIsEditing(true);
    setEditUserId(user._id);
    setForm({
      username: user.username,
      name: user.name,
      password: "", // blank password field unless they want to change it
    });
  };

  // Toggle Block Status
  const handleBlockToggle = (user) => {
    const nextStatus = !user.isBlocked;
    if (confirm(`Are you sure you want to ${nextStatus ? "BLOCK" : "UNBLOCK"} ${user.name}?`)) {
      dispatch(updateStaffUser({ id: user._id, data: { isBlocked: nextStatus } }));
    }
  };

  // Delete Action
  const handleDeleteClick = (id) => {
    if (confirm("Are you sure you want to permanently delete this staff member?")) {
      dispatch(deleteStaffUser(id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 p-6 md:p-10 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Staff Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">Create, update, control and monitor all system handlers.</p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Error Alert Panel */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <p className="text-rose-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Layout Grid split into Form and List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Dynamic Form (Create or Edit) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-slate-900 tracking-wide">
                {isEditing ? "✨ Edit Staff Details" : "➕ Register New Staff"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Name</label>
                  <input
                    required
                    placeholder="E.g., Rahul Sharma"
                    value={form.name}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Username</label>
                  <input
                    required
                    placeholder="Unique username"
                    value={form.username}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Password {isEditing && <span className="text-indigo-600 lowercase text-[11px] font-normal">(Leave blank to keep same)</span>}
                  </label>
                  <input
                    required={!isEditing}
                    type="password"
                    placeholder={isEditing ? "••••••••" : "Secure password"}
                    value={form.password}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm active:scale-[0.99] transition-all duration-200 cursor-pointer">
                    {loading ? "Saving Changes..." : isEditing ? "Save Updates" : "Create Staff"}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={clearForm}
                      className="w-full bg-white border border-slate-200 text-slate-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Section 2: Interactive Staff Members Table */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
                <h3 className="font-bold text-lg text-slate-900">Active Operational Staff</h3>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-bold border border-indigo-100">
                  {staffList.length} Total
                </span>
              </div>

              {listLoading ? (
                <div className="p-20 text-center text-slate-400 text-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  Fetching dynamic staff records...
                </div>
              ) : staffList.length === 0 ? (
                <div className="p-20 text-center text-slate-400 text-sm">
                  No staff members created yet. Use the registration panel.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4 pl-6">Staff Profile</th>
                        <th className="p-4">Username</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                      {staffList.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-slate-800 font-semibold">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-400">@{user.username}</td>
                          <td className="p-4">
                            {user.isBlocked ? (
                              <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-md font-bold">
                                Blocked
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-md font-bold">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit Action Button */}
                              <button
                                onClick={() => handleEditClick(user)}
                                className="p-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 rounded-lg transition shadow-sm cursor-pointer"
                                title="Edit Staff Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11 20H8v-3L19.586 5.414z" />
                                </svg>
                              </button>

                              {/* Block / Unblock Action Button */}
                              <button
                                onClick={() => handleBlockToggle(user)}
                                className={`p-2 bg-white border border-slate-200 rounded-lg transition shadow-sm cursor-pointer ${
                                  user.isBlocked 
                                    ? "hover:bg-emerald-50 hover:border-emerald-200 text-emerald-600" 
                                    : "hover:bg-amber-50 hover:border-amber-200 text-slate-400 hover:text-amber-600"
                                }`}
                                title={user.isBlocked ? "Unblock Staff" : "Block Staff"}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>

                              {/* Delete Action Button */}
                              <button
                                onClick={() => handleDeleteClick(user._id)}
                                className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg transition shadow-sm cursor-pointer"
                                title="Delete Staff Permanently"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateStaffPage;