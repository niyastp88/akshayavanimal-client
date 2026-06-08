import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  return (
    <AppContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </AppContext.Provider>
  );
};