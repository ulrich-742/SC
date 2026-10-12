import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiHome,
  FiPlus,
  FiScissors,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { Link, NavLink } from "react-router";
import "./CustomerNavbar.css";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function CustomerNavBar() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const userInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : null;

  useEffect(() => {
    if (!user?.id) return;
    const endpoint =
      user.role === "barber"
        ? `${API_URL}/api/barbers/${user.id}`
        : `${API_URL}/api/customers/${user.id}`;

    const token = localStorage.getItem("token");

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.avatar_url) {
          setAvatarUrl(
            data.avatar_url.startsWith("/")
              ? `${API_URL}${data.avatar_url}`
              : data.avatar_url,
          );
        }
      })
      .catch(() => {});
  }, [user?.id, user?.role]);

  return (
    <>
      {/* ── Navbar desktop (top) ── */}
      <nav className="navbar-desktop">
        <div className="navbar-desktop__inner">
          <Link to="/" className="navbar-desktop__brand">
            <div className="navbar-desktop__logo-icon">
              <FiScissors />
            </div>
            <span className="navbar-desktop__brand-name">Secare</span>
          </Link>

          <div className="navbar-desktop__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "navbar-desktop__link navbar-desktop__link--active"
                  : "navbar-desktop__link"
              }
            >
              Accueil
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive
                  ? "navbar-desktop__link navbar-desktop__link--active"
                  : "navbar-desktop__link"
              }
            >
              Coiffeurs
            </NavLink>
            <NavLink
              to={user ? `/reservations` : "/login"}
              className={({ isActive }) =>
                isActive
                  ? "navbar-desktop__link navbar-desktop__link--active"
                  : "navbar-desktop__link"
              }
            >
              Réservations
            </NavLink>
          </div>

          <div className="navbar-desktop__actions">
            <Link to="/booking" className="navbar-desktop__btn">
              Réserver
            </Link>
            {userInitials ? (
              <Link
                to={
                  user
                    ? user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "barber"
                        ? "/barber/profile"
                        : `/profile/${user.id}`
                    : "/login"
                }
                className="navbar-desktop__avatar"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="navbar-desktop__avatar-img"
                  />
                ) : (
                  userInitials
                )}
              </Link>
            ) : (
              <Link to="/login" className="navbar-desktop__login">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Navbar mobile (bottom) ── */}
      <nav className="navbar">
        <div className="navbar__container">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "navbar__item navbar__item--active" : "navbar__item"
            }
          >
            <FiHome className="navbar__icon" />
            <span>Accueil</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "navbar__item navbar__item--active" : "navbar__item"
            }
          >
            <FiSearch className="navbar__icon" />
            <span>Recherche</span>
          </NavLink>

          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive
                ? "navbar__center navbar__item--active"
                : "navbar__center"
            }
          >
            <div className="navbar__center-button">
              <FiPlus />
            </div>
            <span className="navbar__center-label">Réserver</span>
          </NavLink>

          <NavLink
            to={user ? `/reservations` : "/login"}
            className={({ isActive }) =>
              isActive ? "navbar__item navbar__item--active" : "navbar__item"
            }
          >
            <FiCalendar className="navbar__icon" />
            <span>Reservations</span>
          </NavLink>

          <NavLink
            to={
              user
                ? user.role === "barber"
                  ? "/barber/profile"
                  : `/profile/${user.id}`
                : "/login"
            }
            className={({ isActive }) =>
              isActive ? "navbar__item navbar__item--active" : "navbar__item"
            }
          >
            <FiUser className="navbar__icon" />
            <span>Profil</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}

export default CustomerNavBar;
