import {
  // FiAirplay,
  // FiAlertTriangle,
  // FiBarChart2,
  FiCalendar,
  // FiCamera,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiScissors,
  // FiSettings,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import "./AdminNavBar.css";
import icon from "../../../assets/images/icon.png";
import { useAuth } from "../../../context/AuthContext";

function AdminNavBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="adminNavBar-main">
      <img src={icon} alt="Icon" className="adminNavBar-icon" />

      <NavLink to="/admin/dashboard" className="adminNavBar-menu">
        <FiHome /> Tableau de Bord
      </NavLink>
      <h3>GESTION</h3>
      <NavLink to="/admin/users" className="adminNavBar-menu">
        <FiUser /> Utilisateurs
      </NavLink>
      <NavLink to="/admin/barbers" className="adminNavBar-menu">
        <FiScissors /> Coiffeurs
      </NavLink>
      <NavLink to="/admin/reservations" className="adminNavBar-menu">
        <FiCalendar /> Réservations
      </NavLink>
      <NavLink to="/admin/reviews" className="adminNavBar-menu">
        <FiMessageSquare /> Avis & Commentaires
      </NavLink>
      {/* <NavLink to="/admin/reporting" className="adminNavBar-menu">
        <FiAlertTriangle /> Signalements
      </NavLink> */}
      <h3>CONTENU</h3>
      <NavLink to="/admin/events" className="adminNavBar-menu">
        <FiStar /> Événements
      </NavLink>
      {/* <NavLink to="/admin/banniere" className="adminNavBar-menu">
        <FiCamera />
        Bannières
      </NavLink> */}
      {/* <h3>ANALYTICS</h3>
      <NavLink to="/admin/statistics" className="adminNavBar-menu">
        <FiBarChart2 /> Statistiques
      </NavLink>
      <h3>CONFIGURATION</h3>
      <NavLink to="/admin/admin" className="adminNavBar-menu">
        <FiAirplay /> Administrateurs
      </NavLink>
      <NavLink to="/admin/configuration" className="adminNavBar-menu">
        <FiSettings /> Paramètres
      </NavLink> */}
      <button
        type="button"
        className="adminNavBar-logout"
        onClick={handleLogout}
      >
        <FiLogOut /> Déconnexion
      </button>
    </nav>
  );
}

export default AdminNavBar;
