import { useEffect, useState } from "react";
import { FaCommentAlt, FaCut } from "react-icons/fa";
import { FiCalendar, FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { GrDocumentConfig } from "react-icons/gr";
import { MdFreeCancellation, MdPeopleAlt } from "react-icons/md";
import { NavLink, useNavigate } from "react-router";
import "./BarberNavBar.css";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

type BarberProfile = {
  name: string;
  avatar_url?: string;
};

function BarberNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [barber, setBarber] = useState<BarberProfile | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const loggedUser = userString ? JSON.parse(userString) : null;
    const id = loggedUser?.id;
    if (!id) return;
    fetch(`${API_URL}/api/barbers/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setBarber(data);
      })
      .catch(() => {});
  }, []);

  const avatarUrl = barber?.avatar_url?.startsWith("/")
    ? `${API_URL}${barber.avatar_url}`
    : barber?.avatar_url || null;

  const initials = barber?.name ? barber.name.slice(0, 2).toUpperCase() : "??";

  return (
    <>
      <button
        type="button"
        className="button_Nav"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaCut />
      </button>

      <nav className={`NavBarHair-main ${isOpen ? "open" : ""}`}>
        <div className="NavBarHair-profile">
          <div className="NavBarHair-profile__avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={barber?.name} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          {barber?.name && (
            <p className="NavBarHair-profile__name">{barber.name}</p>
          )}
        </div>

        <NavLink to="/" className="NavBarHair-menu">
          <FiHome /> Accueil
        </NavLink>

        <NavLink to="/barber/dashBoard" className="NavBarHair-menu">
          <FiHome /> Tableau de Bord
        </NavLink>

        <h3>GESTION</h3>

        <NavLink to="/barber/profile" className="NavBarHair-menu">
          <FiUser /> Mon profil
        </NavLink>

        <NavLink to="/barber/prestations" className="NavBarHair-menu">
          <MdPeopleAlt /> Mes services
        </NavLink>

        <NavLink to="/barber/planning" className="NavBarHair-menu">
          <FiCalendar /> Planning
        </NavLink>

        <NavLink to="/barber/disponibilites" className="NavBarHair-menu">
          <FiCalendar /> Disponibilités
        </NavLink>

        <NavLink to="/barber/annulations" className="NavBarHair-menu">
          <MdFreeCancellation /> Gestion RDV
        </NavLink>

        <h3>ANALYTICS</h3>

        {/* <NavLink to="/barber/signalement" className="NavBarHair-menu">
          <FiAlertTriangle /> Signalements
        </NavLink>

        <NavLink to="/barber/statistics" className="NavBarHair-menu">
          <SiSimpleanalytics /> Statistique
        </NavLink> */}

        <NavLink to="/barber/customer" className="NavBarHair-menu">
          <FaCommentAlt /> Avis
        </NavLink>

        <h3>CONFIGURATION</h3>

        <NavLink to="/barber/parametres" className="NavBarHair-menu">
          <GrDocumentConfig />
          Paramètres
        </NavLink>

        <button
          type="button"
          className="NavBarHair-menu NavBarHair-menu--logout"
          onClick={handleLogout}
        >
          <FiLogOut /> Déconnexion
        </button>
      </nav>
    </>
  );
}

export default BarberNavBar;
