import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../context/AuthContext";

import "./AdminLayout.css";
import AdminNavBar from "../../../components/admin/adminNavBar/AdminNavBar";

function AdminLayout() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="adminLayout-main">
      <AdminNavBar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
