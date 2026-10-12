import { useState } from "react";
import "./ForgotPassword.css";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router";

function ForgotPassword() {
  const [loginEmail, setLoginEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSend = async () => {
    const res = await fetch(`${API_URL}/api/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setIsError(true);
      setMessage(data.message);
      return;
    }
    setIsError(false);
    setMessage(data.message);
  };

  return (
    <div className="forgot__login">
      <h2 className="forgot-login__text">
        Entrez votre adresse e-mail. Si un compte existe, nous vous enverrons un
        lien pour réinitialiser votre mot de passe.
      </h2>
      <div className="forgot-login__input-wrapper">
        <FiMail className="forgot-login__input-icon" />
        <input
          className="forgot-login__input"
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
      </div>
      {message && (
        <p
          className={
            isError
              ? "forgot-login__message forgot-login__message--error"
              : "forgot-login__message forgot-login__message--success"
          }
        >
          {message}
        </p>
      )}
      <button
        type="button"
        className="forgot-login__send-btn"
        onClick={handleSend}
      >
        Envoyer
      </button>
      <button
        type="button"
        className="forgot-login__back-btn"
        onClick={() => navigate(-1)}
      >
        Retour
      </button>
    </div>
  );
}
export default ForgotPassword;
