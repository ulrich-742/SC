import "./BookingSummary.css";
import type { Booking } from "./BookingTypes";

type Props = {
  booking: Booking;
  onBack: () => void;
  onNext: () => void;
};

function BookingSummary({ booking, onBack, onNext }: Props) {
  return (
    <div className="booking-summary">
      <h2 className="booking-summary__title">Récapitulatif</h2>
      <div className="booking-summary__card">
        <p className="booking-summary__item">
          <strong>Barber</strong> :{booking.barber?.name}
        </p>

        <p className="booking-summary__item">
          <strong>Service</strong> :{booking.prestation?.name}
        </p>

        <p className="booking-summary__item">
          <strong>Prix</strong> : {booking.prestation?.price} €
        </p>

        <p className="booking-summary__item">
          <strong>Durée</strong> : {booking.prestation?.duration_minutes}
          min
        </p>

        <p className="booking-summary__item">
          <strong>Date</strong> : {booking.appointmentDate}
        </p>
        <p className="booking-summary__item">
          <strong>Heure</strong> : {booking.appointmentTime}
        </p>
      </div>

      <div className="booking-summary__actions">
        <button
          type="button"
          className="booking-summary__button booking-summary__button--confirm"
          onClick={onNext}
        >
          Confirmer
        </button>

        <button
          type="button"
          className="booking-summary__button booking-summary__button--back"
          onClick={onBack}
        >
          Retour
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;
