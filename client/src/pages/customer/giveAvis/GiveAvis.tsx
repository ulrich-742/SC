import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import "./giveAvis.css";

const API_URL = import.meta.env.VITE_API_URL;

const RATING_LABELS: Record<number, string> = {
  1: "Mauvais",
  2: "Passable",
  3: "Bien",
  4: "Très bien",
  5: "Excellent",
};

function GiveAvis() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [publishWithName, setPublishWithName] = useState(true);

  async function handleSubmit() {
    if (!rating || !appointmentId) return;
    await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        rating,
        comment,
        id_appointment: Number(appointmentId),
      }),
    });
    navigate(-1);
  }

  const activeRating = hovered || rating;

  return (
    <div className="give-avis">
      {/* Header */}
      <div className="give-avis__header">
        <h1 className="give-avis__title">Donnez votre avis</h1>
      </div>

      <p className="give-avis__subtitle">
        Votre opinion compte ! Partagez votre expérience avec les autres
        clients.
      </p>

      {/* Barber card */}
      <div className="give-avis__barber-card">
        <img
          src="/default-avatar.png"
          alt="Barbier"
          className="give-avis__barber-avatar"
        />
        <div className="give-avis__barber-info">
          <p className="give-avis__barber-name">Rendez-vous #{appointmentId}</p>
          <p className="give-avis__barber-prestation">Coupe homme</p>
          <p className="give-avis__barber-date">
            <FiCalendar size={13} />
            12 mai 2025 à 14:00
          </p>
        </div>
      </div>

      {/* Star rating */}
      <div className="give-avis__rating-section">
        <p className="give-avis__rating-label">Votre note</p>
        <div className="give-avis__stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className="give-avis__star-btn"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i)}
            >
              <FaStar
                size={36}
                className={
                  i <= activeRating
                    ? "give-avis__star--active"
                    : "give-avis__star--empty"
                }
              />
            </button>
          ))}
        </div>
        {activeRating > 0 && (
          <p className="give-avis__rating-value">
            {activeRating}.0 — {RATING_LABELS[activeRating]}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="give-avis__comment-section">
        <label htmlFor="comment" className="give-avis__label">
          Votre avis
        </label>
        <textarea
          id="comment"
          className="give-avis__textarea"
          placeholder="Décrivez votre expérience..."
          maxLength={500}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <span className="give-avis__counter">{comment.length}/500</span>
      </div>

      {/* Toggle */}
      <div className="give-avis__toggle-row">
        <div className="give-avis__toggle-info">
          <p className="give-avis__toggle-label">
            Publier mon avis avec mon prénom
          </p>
          <p className="give-avis__toggle-name">Thomas L.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={publishWithName}
          className={`give-avis__toggle ${publishWithName ? "give-avis__toggle--on" : ""}`}
          aria-label="Publier mon avis avec mon prénom"
          onClick={() => setPublishWithName((v) => !v)}
        >
          <span className="give-avis__toggle-thumb" />
        </button>
      </div>

      {/* Info */}
      <p className="give-avis__info">
        Votre avis sera visible publiquement après modération.
      </p>

      {/* Submit */}
      <button
        type="button"
        className="give-avis__submit"
        disabled={rating === 0}
        onClick={handleSubmit}
      >
        Publier mon avis
      </button>
    </div>
  );
}

export default GiveAvis;
