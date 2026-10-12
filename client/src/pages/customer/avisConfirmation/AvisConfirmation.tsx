import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import "./avisConfirmation.css";

function AvisConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="avis-confirmation">
      <div className="avis-confirmation__confetti" aria-hidden="true">
        {["red", "blue", "yellow", "green", "orange"].map((color) => (
          <span
            key={color}
            className={`avis-confirmation__dot avis-confirmation__dot--${color}`}
          />
        ))}
      </div>

      <FaCheckCircle className="avis-confirmation__icon" />

      <h1 className="avis-confirmation__title">Merci pour votre avis !</h1>
      <p className="avis-confirmation__subtitle">
        Votre avis a bien été envoyé et sera visible après modération.
      </p>

      <div className="avis-confirmation__actions">
        <button
          type="button"
          className="avis-confirmation__btn avis-confirmation__btn--primary"
          onClick={() => navigate("/avis")}
        >
          Voir mes avis
        </button>
        <button
          type="button"
          className="avis-confirmation__btn avis-confirmation__btn--secondary"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default AvisConfirmation;
