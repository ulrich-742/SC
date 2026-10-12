import { useState } from "react";
import { CiMobile2 } from "react-icons/ci";
import { FaBirthdayCake, FaCity, FaHome } from "react-icons/fa";
import {
  FiChevronDown,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiScissors,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { emailRegex, passwordRegex } from "../../utils/validation";

import "./Login.css";
import { useAuth } from "../../context/AuthContext";

type Tab = "connexion" | "inscription";
type Role = "client" | "barber" | "admin";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("connexion");
  const [role, setRole] = useState<Role>("client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!emailRegex.test(loginEmail)) {
        setError("Veuillez saisir une adresse email valide.");
        return;
      }
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      if (!res.ok) {
        console.log("ERREUR LOGIN");
        setError("Email ou mot de passe incorrect");
        return;
      }
      const data = await res.json();
      login(data.user, data.token);
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "barber") {
        navigate("/barber/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      setError("Impossible de se connecter");
    }
  };

  const handleRegister = async () => {
    setError("");

    if (!emailRegex.test(email.trim())) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          role,
          phone,
          postalCode,
          city,
          address,
          birthday,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Erreur lors de l'inscription");
        return;
      }
      if (role === "barber") {
        navigate("/barber/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    }
  };

  return (
    <div className="login">
      <div className="login__header">
        <FiScissors className="login__icon" />
        <h1 className="login__brand">SECARE</h1>
        <span className="login__tagline">Votre coiffeur à domicile</span>
      </div>

      <div className="login__tabs">
        <button
          type="button"
          className={`login__tab${activeTab === "connexion" ? " login__tab--active" : ""}`}
          onClick={() => setActiveTab("connexion")}
        >
          Connexion
        </button>
        <button
          type="button"
          className={`login__tab${activeTab === "inscription" ? " login__tab--active" : ""}`}
          onClick={() => setActiveTab("inscription")}
        >
          Inscription
        </button>
      </div>

      {activeTab === "connexion" && (
        <div className="login__form">
          <div className="login__input-wrapper">
            <FiMail className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FiLock className="login__input-icon" />
            <input
              className="login__input"
              type={showPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              type="button"
              className="login__eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button
            type="button"
            className="login__forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Mot de passe oublié?
          </button>

          {error && <span className="login__error">{error}</span>}

          <button className="login__btn" type="button" onClick={handleLogin}>
            Se connecter
          </button>
        </div>
      )}

      {activeTab === "inscription" && (
        <div className="login__form">
          <div className="login__input-wrapper">
            <FiUser className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              placeholder="Prénom"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FiUser className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              placeholder="Nom"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FiMail className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FiMail className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              maxLength={5}
              placeholder="Code postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="login__input-wrapper">
            <FaCity className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              placeholder="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FaBirthdayCake className="login__input-icon" />

            <input
              id="birthday"
              className="login__input"
              type="date"
              placeholder="Date de naissance"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FaHome className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              placeholder="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <CiMobile2 className="login__input-icon" />
            <input
              className="login__input"
              type="text"
              maxLength={10}
              placeholder="Portable"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="login__input-wrapper">
            <FiLock className="login__input-icon" />
            <input
              className="login__input"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="login__eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="login__input-wrapper">
            <FiLock className="login__input-icon" />
            <input
              className="login__input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="login__eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="login__input-wrapper">
            <FiUser className="login__input-icon" />
            <select
              className="login__select"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="client">Je suis un client</option>
              <option value="barber">Je suis un professionnel</option>
            </select>
            <FiChevronDown className="login__select-arrow" />
          </div>

          {error && <span className="login__error">{error}</span>}

          <button className="login__btn" type="button" onClick={handleRegister}>
            S'inscrire
          </button>
        </div>
      )}

      <div className="login__divider">
        <span className="login__divider-text">ou continuer avec</span>
      </div>

      <div className="login__social">
        <button className="login__social-btn" type="button">
          <svg
            className="login__google-icon"
            viewBox="0 0 48 48"
            aria-label="Google"
          >
            <title>Google</title>
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Google
        </button>
      </div>
    </div>
  );
};

export default Login;
