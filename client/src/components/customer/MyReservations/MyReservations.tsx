import { useEffect, useState } from "react";
import ReservationCard from "./ReservationCard";
import "./MyReservations.css";
import type { Review } from "../../../types/review";
import type { Reservation } from "./ReservationType";

const userString = localStorage.getItem("user");
const loggedUser = userString ? JSON.parse(userString) : null;
const USER_ID = loggedUser?.id ? Number(loggedUser.id) : null;

function MyReservations() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Reservation[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/api/appointments/user/${USER_ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Appointments :", data);
        setAppointments(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => setReviews(data))
      .catch((err) => console.error("Erreur chargement avis", err));
  }, []);

  const handleCancelled = (appointmentId: number) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id_appointment === appointmentId ? { ...a, status: "cancelled" } : a,
      ),
    );
  };

  const now = new Date();

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);

    if (activeTab === "upcoming") {
      return appointmentDate >= now;
    }

    return appointmentDate < now;
  });

  return (
    <section className="reservations">
      <h1 className="reservations__title">Mes réservations</h1>

      <div className="reservations__tabs">
        <button
          type="button"
          className={`reservations__tab ${
            activeTab === "upcoming" ? "reservations__tab--active" : ""
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          A venir
        </button>
        <button
          type="button"
          className={`reservations__tab ${
            activeTab === "past" ? "reservations__tab--active" : ""
          }`}
          onClick={() => setActiveTab("past")}
        >
          Passées
        </button>
      </div>
      <div className="reservations__list">
        {filteredAppointments.map((appointment) => {
          const review = reviews.find(
            (review) => review.id_appointment === appointment.id_appointment,
          );

          return (
            <ReservationCard
              key={appointment.id_appointment}
              reservation={appointment}
              review={review}
              onCancelled={() => handleCancelled(appointment.id_appointment)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default MyReservations;
