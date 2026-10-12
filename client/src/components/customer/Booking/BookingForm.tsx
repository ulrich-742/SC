import "./BookingForm.css";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiScissors } from "react-icons/fi";
import type { Prestation } from "../../../types/prestation";
import BarberCard from "../BarberCard/BarberCard";
import type { Booking } from "./BookingTypes";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  prestations: Prestation[];
  onNext: () => void;
};

function BookingForm({ booking, setBooking, prestations, onNext }: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    if (!booking.barber?.id_user || !booking.appointmentDate) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetch(
      `${API_URL}/api/barbers/${booking.barber.id_user}/availability?date=${booking.appointmentDate}`,
    )
      .then((res) => (res.ok ? res.json() : []))
      .then(
        (
          data: {
            id_availability: number;
            start_time: string;
            end_time: string;
          }[],
        ) => {
          const times = data.map((slot) => slot.start_time.slice(11, 16));
          setSlots(times);
        },
      )
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [booking.barber?.id_user, booking.appointmentDate]);

  return (
    <div className="booking-form">
      <h2 className="booking-form__title">Réserver </h2>
      {booking.barber && <BarberCard barber={booking.barber} />}

      <section className="booking-form__section">
        <h3 className="booking-form__section-title">1. Choisir un service</h3>

        <div className="booking-form__services">
          {prestations.length === 0 ? (
            <p className="booking-form__empty">
              Aucune prestation disponible pour ce barbier.
            </p>
          ) : (
            prestations.map((prestation) => {
              const prestationId = prestation.id_prestation;
              const selectedId = booking.prestation?.id_prestation;
              const isSelected =
                selectedId !== undefined && selectedId === prestationId;

              return (
                <button
                  type="button"
                  key={prestationId}
                  className={`booking-form__service ${
                    isSelected ? "booking-form__service--selected" : ""
                  }`}
                  onClick={() =>
                    setBooking({
                      ...booking,
                      prestation,
                    })
                  }
                >
                  <div className="booking-form__service-left">
                    <div className="booking-form__service-icon">
                      <FiScissors />
                    </div>

                    <div>
                      <h4 className="booking-form__service-title">
                        {prestation.name}
                      </h4>

                      <p className="booking-form__service-duration">
                        {prestation.duration_minutes} min
                      </p>
                    </div>
                  </div>

                  <div className="booking-form__service-right">
                    <span className="booking-form__service-price">
                      {prestation.price} €
                    </span>

                    {isSelected ? (
                      <FiCheckCircle />
                    ) : (
                      <span className="booking-form__service-radio" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="booking-form__section">
        <h3 className="booking-form__section-title">2. Choisir une date</h3>

        <div className="booking-form__dates">
          {dates.map((date) => {
            const dateStr = date.toISOString().split("T")[0];
            const dayNum = date.getDate();
            const month = date.toLocaleDateString("fr-FR", { month: "short" });
            const weekday = date.toLocaleDateString("fr-FR", {
              weekday: "short",
            });

            return (
              <button
                type="button"
                key={dateStr}
                className={`booking-form__date ${
                  booking.appointmentDate === dateStr
                    ? "booking-form__date--selected"
                    : ""
                }`}
                onClick={() => {
                  setBooking({ ...booking, appointmentDate: dateStr });
                }}
              >
                <span>{weekday}</span>
                <strong>{dayNum}</strong>
                <span>{month}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="booking-form__section">
        <h3 className="booking-form__section-title">3. Choisir une heure</h3>

        {!booking.appointmentDate ? (
          <p className="booking-form__empty">Sélectionnez d'abord une date.</p>
        ) : loadingSlots ? (
          <p className="booking-form__empty">Chargement des créneaux…</p>
        ) : slots.length === 0 ? (
          <p className="booking-form__empty">
            Aucun créneau disponible pour cette date.
          </p>
        ) : (
          <div className="booking-form__slots">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot}
                className={`booking-form__slot ${
                  booking.appointmentTime === slot
                    ? "booking-form__slot--selected"
                    : ""
                }`}
                onClick={() => {
                  setBooking({ ...booking, appointmentTime: slot });
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        className="booking-form__button"
        onClick={onNext}
        disabled={!booking.prestation || !booking.appointmentDate}
      >
        Continuer
      </button>
    </div>
  );
}

export default BookingForm;
