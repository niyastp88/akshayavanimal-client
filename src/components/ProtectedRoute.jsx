import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;

  if (role && user?.role !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;