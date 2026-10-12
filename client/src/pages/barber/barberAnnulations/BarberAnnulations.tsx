import { FiCalendar, FiInfo } from "react-icons/fi";
import useBarberAppointments from "../../../hooks/useBarberAppointments";
import "./barberAnnulations.css";

const API_URL = import.meta.env.VITE_API_URL;

const userString = localStorage.getItem("user");
const loggedUser = userString ? JSON.parse(userString) : null;
const BARBER_ID = Number(loggedUser?.id ?? 0);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BarberAnnulations() {
  const { appointments, setAppointments } = useBarberAppointments(
    BARBER_ID,
    "Annulé",
  );

  function handleRelancer(id: number) {
    fetch(`${API_URL}/api/barber/appointments/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: "En attente" }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Erreur lors de la relance");
      }

      setAppointments((prev) => prev.filter((a) => a.id_appointment !== id));
    });
  }

  function handleRelancerTous() {
    Promise.all(
      appointments.map((a) =>
        fetch(`${API_URL}/api/barber/appointments/${a.id_appointment}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "En attente" }),
        }),
      ),
    ).then(() => setAppointments([]));
  }

  return (
    <div className="barber-annulations">
      <div className="barber-annulations__header">
        <h1 className="barber-annulations__title">Gestion des annulations</h1>
        <p className="barber-annulations__subtitle">
          Consultez et gérez les rendez-vous annulés
        </p>
      </div>

      <div className="barber-annulations__tab">
        <span className="barber-annulations__tab-active">
          <FiCalendar size={14} />
          Annulations récentes
        </span>
      </div>

      {appointments.length === 0 ? (
        <p className="barber-annulations__empty">Aucune annulation récente.</p>
      ) : (
        <ul className="barber-annulations__list">
          {appointments.map((appt) => (
            <li key={appt.id_appointment} className="barber-annulations__card">
              <img
                src={appt.customer_avatar || "https://i.pravatar.cc/150"}
                alt={`${appt.customer_firstname} ${appt.customer_lastname}`}
                className="barber-annulations__avatar"
              />
              <div className="barber-annulations__info">
                <p className="barber-annulations__name">
                  {appt.customer_firstname} {appt.customer_lastname}
                </p>
                <p className="barber-annulations__prestation">
                  {appt.prestation_name}
                </p>
                <p className="barber-annulations__date">
                  <FiCalendar size={12} />
                  {formatDate(appt.appointment_date)}
                </p>
              </div>
              <div className="barber-annulations__actions">
                <span className="barber-annulations__badge">Annulé</span>
                <button
                  type="button"
                  className="barber-annulations__btn-relancer"
                  onClick={() => handleRelancer(appt.id_appointment)}
                >
                  Relancer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="barber-annulations__conseil">
        <div className="barber-annulations__conseil-text">
          <FiInfo size={16} className="barber-annulations__conseil-icon" />
          <p>
            <strong>Conseil SECARE</strong>
            <br />
            Relancez vos clients annulés pour remplir vos créneaux et fidéliser
            votre clientèle.
          </p>
        </div>
        <button
          type="button"
          className="barber-annulations__btn-relancer-tous"
          onClick={handleRelancerTous}
          disabled={appointments.length === 0}
        >
          Relancer tous
        </button>
      </div>
    </div>
  );
}

export default BarberAnnulations;
