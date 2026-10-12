import { useEffect, useState } from "react";
import ModalReservation from "../../../components/barber/planning/modalReservation/ModalReservation";
import PlanningCalendar from "../../../components/barber/planningCalendar/PlanningCalendar";
import ReservationCardPlanning from "../../../components/barber/reservationCard/ReservationCardPlanning";
import type { Appointment } from "../../../types/appointment";
import "./BarberPlanning.css";

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const userString = localStorage.getItem("user");
const loggedUser = userString ? JSON.parse(userString) : null;
const BARBER_ID = loggedUser?.id ? Number(loggedUser.id) : null;

function BarberPlanning() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState<Appointment[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (!BARBER_ID) return;
    fetch(`${apiUrl}/api/barber/${BARBER_ID}/appointments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
      });
  }, []);

  const selectedDateKey = formatDateKey(selectedDate);

  const reservationsOfSelectedDay = reservations
    .filter((reservation) => {
      const reservationDate = formatDateKey(
        new Date(reservation.appointment_date),
      );

      return reservationDate === selectedDateKey;
    })
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );

  const titleDate = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <main className="barber-planning-page">
        <PlanningCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          reservations={reservations}
        />

        <section className="barber-planning-reservations">
          <div className="planning-handle" />

          <h3>{titleDate}</h3>

          {reservationsOfSelectedDay.length > 0 ? (
            reservationsOfSelectedDay.map((reservation) => (
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
                duration={reservation.duration_minutes}
                status={reservation.status}
                onShowDetails={() => setSelectedReservation(reservation)}
              />
            ))
          ) : (
            <p>Aucun rendez-vous ce jour</p>
          )}
        </section>
      </main>

      {selectedReservation !== null && (
        <ModalReservation
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </>
  );
}

export default BarberPlanning;
