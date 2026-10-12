import { Navigate, Outlet } from "react-router";
import BarberNavBar from "../../../components/barber/barberNavBar/BarberNavBar";
import { useAuth } from "../../../context/AuthContext";
import "./BarberLayout.css";

function BarberLayout() {
  const { user } = useAuth();

  if (!user || user.role !== "barber") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="barberLayout-main">
      <BarberNavBar />
      <Outlet />
    </div>
  );
}

export default BarberLayout;
