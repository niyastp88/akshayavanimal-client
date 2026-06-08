import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage";

import AdminLayout from "./pages/AdminLayout";
import AdminPage from "./pages/AdminPage";
import CreateStaffPage from "./pages/Staff";
import CreateServicePage from "./pages/Service";
import BalancePage from "./pages/OpeingBalancePage";
import StaffLayout from "./pages/StaffLayout";
import MyTransactionsPage from "./pages/MyTransactionsPage";
import StaffReportPage from "./pages/StaffReportPage";
import AddExpensePage from "./pages/AddExpensePage";
import AddBalancePage from "./pages/AddBalancePage";
import CreateExpensePage from "./pages/CreateExpensePage";
import CreateBalanceTypePage from "./pages/CreateBalanceTypePage";
import DashboardPage from "./pages/Dashboard";
import MyExpensePage from "./pages/MyExpensePage";
import MyBalancePage from "./pages/MyBalancePage";
import AdminExpensePage from "./pages/AdminExpensePage";
import AdminBalancePage from "./pages/AdminBalancePage";
import StaffDashboard from "./pages/StaffDashboard";
import ProfitPage from "./pages/ProfitPage";
import { Toaster } from "react-hot-toast";
import AttendanceHistory from "./pages/AttendanceHistory";
import AdminAttendance from "./pages/AdminAttendance";

function App() {
  return (

    
    <BrowserRouter>
    <Toaster position="top-right" />


      <Routes>

        <Route path="/" element={<LoginPage />} />
        
        <Route path="/staff" element={<StaffLayout />}>

        <Route index element={<StaffDashboard />} />

  <Route path="add" element={<FormPage />} />
  <Route path="my-transactions" element={<MyTransactionsPage />} />
  <Route path="add-expense" element={<AddExpensePage />} />
<Route path="add-balance" element={<AddBalancePage />} />
<Route path="my-expense" element={<MyExpensePage />} />
  <Route path="my-balance" element={<MyBalancePage />} />
  <Route path="attendance" element={<AttendanceHistory />} />

</Route>

        {/* 🔥 Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>

        <Route index element={<DashboardPage />} />
        <Route path="/admin/profit" element={<ProfitPage />} />

          <Route path="report" element={<AdminPage />} />
          <Route path="create-staff" element={<CreateStaffPage />} />
          <Route path="staff-report" element={<StaffReportPage />} />
          <Route path="create-service" element={<CreateServicePage />} />
          <Route path="balance" element={<BalancePage />} />
          <Route path="create-expense" element={<CreateExpensePage />} />
          <Route path="attendance" element={<AdminAttendance />} />
<Route path="create-balance-type" element={<CreateBalanceTypePage />} />
<Route path="expense" element={<AdminExpensePage />} />
  <Route path="balance-tx" element={<AdminBalancePage />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;