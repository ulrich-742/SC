import { useEffect, useState } from "react";
import ModalReservation from "../../../components/barber/planning/modalReservation/ModalReservation";
import ReservationCardPlanning from "../../../components/barber/reservationCard/ReservationCardPlanning";
import StatsGraphCardBarber from "../../../components/barber/statsGraphCardBarber/StatsGraphCardBarber";
import type { Appointment } from "../../../types/appointment";
import "./BarberDashBoard.css";

import { FaRegCalendarAlt } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { PiStarThin } from "react-icons/pi";

type Review = {
  id_review: number;
  rating: number;
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function BarberDashBoard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userString = localStorage.getItem("user");
  const loggedUser = userString ? JSON.parse(userString) : null;
  const BARBER_ID = loggedUser?.id ? Number(loggedUser.id) : null;

  const [reservations, setReservations] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [selectedReservation, setSelectedReservation] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (!BARBER_ID) return;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    fetch(`${apiUrl}/api/appointments/barber/${BARBER_ID}`, { headers })
      .then((res) => res.json())
      .then((data) => setReservations(data));

    fetch(`${apiUrl}/api/reviews/barber/${BARBER_ID}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [BARBER_ID]);

  const todayKey = formatDateKey(new Date());
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const reservationsThisMonth = reservations.filter((reservation) => {
    const date = new Date(reservation.appointment_date);

    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const upcomingReservations = reservations.filter((reservation) => {
    const date = new Date(reservation.appointment_date);

    return (
      date >= new Date() &&
      (reservation.status === "confirmé" || reservation.status === "en attente")
    );
  });

  const todayReservations = reservations
    .filter((reservation) => {
      const reservationDate = formatDateKey(
        new Date(reservation.appointment_date),
      );

      return reservationDate === todayKey;
    })
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );

  return (
    <div className="dashboard">
      <div className="stats-cards-container">
        <StatsGraphCardBarber
          Icon={FaRegCalendarAlt}
          value={reservationsThisMonth.length}
          title="RENDEZ-VOUS "
          cycle="Ce mois"
        />

        <StatsGraphCardBarber
          Icon={GoClock}
          value={upcomingReservations.length}
          title="RÉSERVATIONS"
          cycle="En attente"
        />

        <StatsGraphCardBarber
          Icon={PiStarThin}
          value={reviews.length}
          title="AVIS CLIENTS"
          cycle="Au total"
        />
      </div>

      <section className="dashboard-reservations">

        <h2 className="title">
          Réservations du jour
        </h2>

        {todayReservations.length > 0 ? (
          todayReservations.map((reservation) => (
            <ReservationCardPlanning
              key={reservation.id_appointment}
              avatar={reservation.customer_avatar}
              time={new Date(reservation.appointment_date).toLocaleTimeString(
                "fr-FR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
              customerName={`${reservation.customer_firstname} ${reservation.customer_lastname}`}
              service={reservation.prestation_name}
              status={reservation.status}
              duration={reservation.duration_minutes}
              onShowDetails={() => setSelectedReservation(reservation)}
            />
          ))
        ) : (
          <p>Aucune réservation aujourd’hui</p>
        )}
      </section>
      {selectedReservation && (
        <ModalReservation
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}

export default BarberDashBoard;
