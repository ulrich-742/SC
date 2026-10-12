import "./ModalReservation.css";

type ReservationStatus = "en attente" | "confirmé" | "terminé" | "annulé";

type Reservation = {
  id_appointment: number;
  appointment_date: string;
  status: ReservationStatus;
  customer_firstname: string;
  customer_lastname: string;
  customer_avatar: string;
  customer_phone?: string;
  customer_city?: string;
  prestation_name: string;
  duration_minutes: number;
  customer_adress: string;
  price?: number;
};

type Props = {
  reservation: Reservation;
  onClose: () => void;
};

function ModalReservation({ reservation, onClose }: Props) {
  const date = new Date(reservation.appointment_date);
  const API_URL = import.meta.env.VITE_API_URL;
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="modal-reservation-overlay">
      <section className="modal-reservation" role="dialog" aria-modal="true">
        <h2>Détail du rendez-vous</h2>

        <div className="modal-reservation-user">
          <img
            src={`${API_URL}${reservation.customer_avatar}`}
            alt={`${reservation.customer_firstname} ${reservation.customer_lastname}`}
          />

          <div>
            <h3>
              {reservation.customer_firstname} {reservation.customer_lastname}
            </h3>

            <span className={`modal-reservation-status ${reservation.status}`}>
              {reservation.status}
            </span>

            <p>{reservation.customer_adress || "Adresse non renseignée"}</p>
            <p>{reservation.customer_city || "Ville non renseignée"}</p>
            <p>{reservation.customer_phone || "Téléphone non renseigné"}</p>
          </div>
        </div>

        <div className="modal-reservation-divider" />

        <div className="modal-reservation-list">
          <div>
            <span>Date</span>
            <strong>{formattedDate}</strong>
          </div>

          <div>
            <span>Heure</span>
            <strong>{formattedTime}</strong>
          </div>

          <div>
            <span>Prestation</span>
            <strong>{reservation.prestation_name}</strong>
          </div>

          <div>
            <span>Durée</span>
            <strong>{reservation.duration_minutes} min</strong>
          </div>

          <div>
            <span>Prix</span>
            <strong>
              {reservation.price ? `${reservation.price} €` : "Non renseigné"}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="modal-reservation-button"
          onClick={onClose}
        >
          Fermer
        </button>
      </section>
    </div>
  );
}

export default ModalReservation;
