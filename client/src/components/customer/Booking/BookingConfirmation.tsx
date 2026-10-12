import confetti from "canvas-confetti";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./BookingConfirmation.css";
import type { Booking } from "./BookingTypes";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  booking: Booking;
};
function BookingConfirmation({ booking }: Props) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const confirmBooking = async () => {
    const token = localStorage.getItem("token");

    if (
      !booking.barber ||
      !booking.prestation ||
      !booking.appointmentDate ||
      !booking.appointmentTime ||
      !booking.locationType
    ) {
      setError("Certaines informations sont manquantes.");
      return;
    }
    if (!token) {
      setError("Vous devez être connecté pour réserver.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_date: `${booking.appointmentDate} ${booking.appointmentTime}:00`,
          location_type: booking.locationType,
          id_prestation: booking.prestation.id_prestation,
          id_user_barber: booking.barber.id_user,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Erreur lors de la réservation");
      }

      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.3 },
        colors: ["#C9A84C", "#F5E6C8", "#8B6914"],
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la réservation",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-confirmation">
      <div>
        {error && <p className="error">{error}</p>}
        {!success && (
          <button
            type="button"
            className="booking-confirm__button"
            onClick={confirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Réservation en cours..."
              : "Confirmer la réservation"}
          </button>
        )}
        {success && <p>Votre réservation a été confirmée 🎉 !</p>}
      </div>

      <p className="booking-confirmation__message">
        Votre rendez-vous à été enregistré
      </p>
      <div className="booking-confirmation__card">
        <p className="booking-confirmation__item">
          <strong>Barber:</strong> {booking.barber?.name}
        </p>
        <p className="booking-confirmation__item">
          <strong>Service:</strong> {booking.prestation?.name}
        </p>

        <p className="booking-confirmation__item">
          <strong>Date :</strong>{" "}
          {booking.appointmentDate
            ? new Date(booking.appointmentDate).toLocaleString("fr-FR")
            : "-"}
        </p>
        <p className="booking-confirmation__item">
          <strong>Heure :</strong> {booking.appointmentTime ?? "-"}
        </p>
      </div>
      <button
        type="button"
        className="booking-confirmation__button"
        onClick={() => navigate("/reservations")}
      >
        Voir mes réservations
      </button>
      <button
        type="button"
        className="booking-confirmation-home__button"
        onClick={() => navigate("/")}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
export default BookingConfirmation;
