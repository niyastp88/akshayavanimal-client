import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import serviceReducer from "./slices/serviceSlice";
import transactionReducer from "./slices/transactionSlice";
import reportReducer from "./slices/reportSlice";
import userReducer from "./slices/userSlice";
import serviceCreateReducer from "./slices/serviceCreateSlice";
import expenseReducer from "./slices/expenseSlice";
import balanceReducer from "./slices/balanceSlice";
import dashboardReducer from "./slices/dashboardSlice"; 
import attendanceReducer from "./slices/attendanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    transactions: transactionReducer,
    report: reportReducer,
    users: userReducer,
    serviceCreate: serviceCreateReducer,
    expense: expenseReducer,
    balance: balanceReducer,
    dashboard: dashboardReducer,
    attendance: attendanceReducer,
  },
});