import { useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiLock,
  FiMoreHorizontal,
  FiScissors,
  FiSend,
  FiStar,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import "./barberSignalement.css";

const REPORT_TYPES = [
  {
    id: "comportement",
    label: "Comportement inapproprié",
    description: "Insultes, harcèlement, menace...",
    Icon: FiAlertCircle,
  },
  {
    id: "non-presentation",
    label: "Non-présentation",
    description: "Client ne s'est pas présenté sans prévenir",
    Icon: FiCalendar,
  },
  {
    id: "avis",
    label: "Avis abusif",
    description: "Avis injustifié ou malveillant",
    Icon: FiStar,
  },
  {
    id: "autre",
    label: "Autre",
    description: "Autre raison",
    Icon: FiMoreHorizontal,
  },
];

function BarberSignalement() {
  const [target, setTarget] = useState<"client" | "salon">("client");
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="barber-signalement">
      <p className="barber-signalement__subtitle">
        Signalez un problème ou un comportement inapproprié.
        <br />
        Votre signalement est confidentiel.
      </p>

      <section className="barber-signalement__section">
        <h2 className="barber-signalement__section-title">
          Qui souhaitez-vous signaler ?
        </h2>
        <div className="barber-signalement__target-grid">
          <button
            type="button"
            className={`barber-signalement__target-card ${target === "client" ? "barber-signalement__target-card--selected" : ""}`}
            onClick={() => setTarget("client")}
          >
            <span className="barber-signalement__target-icon">
              <FiUser size={20} />
            </span>
            <div>
              <p className="barber-signalement__target-label">Un client</p>
              <p className="barber-signalement__target-desc">
                Signalement concernant un client
              </p>
            </div>
            <span className="barber-signalement__radio" />
          </button>
          <button
            type="button"
            className={`barber-signalement__target-card ${target === "salon" ? "barber-signalement__target-card--selected" : ""}`}
            onClick={() => setTarget("salon")}
          >
            <span className="barber-signalement__target-icon">
              <FiScissors size={20} />
            </span>
            <div>
              <p className="barber-signalement__target-label">Un coiffeur</p>
              <p className="barber-signalement__target-desc">
                Signalement concernant un coiffeur
              </p>
            </div>
            <span className="barber-signalement__radio" />
          </button>
        </div>
      </section>

      <section className="barber-signalement__section">
        <h2 className="barber-signalement__section-title">
          Type de signalement
        </h2>
        <div className="barber-signalement__type-grid">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`barber-signalement__type-card ${reportType === type.id ? "barber-signalement__type-card--selected" : ""}`}
              onClick={() => setReportType(type.id)}
            >
              <span className="barber-signalement__type-icon">
                <type.Icon size={16} />
              </span>
              <div className="barber-signalement__type-content">
                <p className="barber-signalement__type-label">{type.label}</p>
                <p className="barber-signalement__type-desc">
                  {type.description}
                </p>
              </div>
              <span className="barber-signalement__radio" />
            </button>
          ))}
        </div>
      </section>

      <form className="barber-signalement__form" onSubmit={handleSubmit}>
        <section className="barber-signalement__section">
          <h2 className="barber-signalement__section-title">Description</h2>
          <div className="barber-signalement__textarea-wrapper">
            <textarea
              className="barber-signalement__textarea"
              placeholder="Décrivez le problème en détail..."
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="barber-signalement__char-count">
              {description.length}/500
            </span>
          </div>
        </section>

        <section className="barber-signalement__section">
          <h2 className="barber-signalement__section-title">
            Preuves (optionnel)
          </h2>
          <p className="barber-signalement__proof-subtitle">
            Ajoutez des captures d'écran, photos ou documents utiles.
          </p>
          <label className="barber-signalement__file-upload">
            <FiUpload size={22} className="barber-signalement__file-icon" />
            <div>
              <p className="barber-signalement__file-label">
                Ajouter des fichiers
              </p>
              <p className="barber-signalement__file-desc">
                Formats : JPG, PNG, PDF (Max. 5 Mo)
              </p>
            </div>
            <span className="barber-signalement__file-arrow">›</span>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" hidden />
          </label>
        </section>

        <button type="submit" className="barber-signalement__submit-btn">
          <FiSend size={18} />
          Envoyer le signalement
        </button>
        <p className="barber-signalement__footer">
          <FiLock size={13} />
          Vos informations sont sécurisées et confidentielles.
        </p>
      </form>
    </div>
  );
}

export default BarberSignalement;
