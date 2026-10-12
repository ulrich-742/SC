import { useState } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router";
import "./ReservationCard.css";
import { FaStar } from "react-icons/fa";
import type { Review } from "../../../types/review";
import type { Reservation } from "./ReservationType";

type Props = {
  reservation: Reservation;
  review?: Review;
  onCancelled: () => void;
};
const statusLabels: Record<string, string> = {
  confirmed: "Confirmé",
  pending: "En attente",
  completed: "Terminé",
  cancelled: "Annulé",
};

function ReservationCard({ reservation, review, onCancelled }: Props) {
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const cancelAppointment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const confirmed = window.confirm(
      "Confirmer l'annulation de ce rendez-vous ?",
    );
    if (!confirmed) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/appointments/${reservation.id_appointment}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        },
      );

      if (!res.ok) {
        throw new Error("Impossible d'annuler ce rendez-vous");
      }
      onCancelled();
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Erreur lors de l'annulation",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <article className="reservation-card">
      <div className="reservation-card__header">
        <img
          className="reservation-card__avatar"
          src={`${API_URL}${reservation.barber_avatar}`}
          alt={reservation.barber_name}
        />
        <div className="reservation-card__title-container">
          <h3 className="reservation-card__title">{reservation.barber_name}</h3>

          <p className="reservation-card__service">
            {reservation.prestation_name}
          </p>
        </div>
      </div>
      <div className="reservation-card__infos">
        <span>
          <FiCalendar />{" "}
          {new Date(reservation.appointment_date).toLocaleDateString("fr-FR")}
        </span>

        <span>
          <FiClock />{" "}
          {new Date(reservation.appointment_date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <span
        className={`reservation-card__status reservation-card__status--${reservation.status}`}
      >
        {" "}
        {statusLabels[reservation.status] ?? reservation.status}
      </span>
      {reservation.status !== "annulé" && reservation.status !== "terminé" && (
        <button
          type="button"
          className="reservation-card__cancel-btn"
          onClick={cancelAppointment}
          disabled={isCancelling}
        >
          {isCancelling ? "Annulation..." : "Annuler"}
        </button>
      )}
      {cancelError && <p className="error">{cancelError}</p>}
      {reservation.status === "terminé" &&
        (review ? (
          <div className="reservation-card__review">
            <span>Votre note :</span>

            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={
                  star <= review.rating
                    ? "reservation-card__star--filled"
                    : "reservation-card__star"
                }
              />
            ))}
          </div>
        ) : (
          <button
            type="button"
            className="reservation-card__review-btn"
            onClick={() => navigate(`/give-avis/${reservation.id_appointment}`)}
          >
            Laisser un avis
          </button>
        ))}
    </article>
  );
}

export default ReservationCard;
