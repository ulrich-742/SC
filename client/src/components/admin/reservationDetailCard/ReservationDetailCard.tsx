import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { AiFillEuroCircle } from "react-icons/ai";
import {
  FiCalendar,
  FiClock,
  FiFlag,
  FiMail,
  FiNavigation,
  FiPhone,
  FiScissors,
} from "react-icons/fi";

import type { Appointment } from "../../../types/appointment";
import "./ReservationDetailCard.css";

interface ReservationDetailCardProps {
  selectedReservation: Appointment;
}
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
function ReservationDetailCard({
  selectedReservation,
}: ReservationDetailCardProps) {
  return (
    <div className="reservationdetailcard-main">
      <div className="reservationdetailcard-title">
        <h2>Détail de la réservation</h2>
        <div
          className={`reservationdetailcard-status status-${selectedReservation.status?.toLowerCase()} `}
        >
          {selectedReservation.status}
        </div>
      </div>
      <div className="reservationdetailcard-header">
        <h3>Information du coiffeur</h3>
        <div className="reservationdetailcard-user-info">
          <img
            className="reservationdetailcard-avatar"
            src={getImageUrl(selectedReservation.barber_avatar)}
            alt={selectedReservation.barber_name}
          />

          <div className="reservationdetailcard-user-info-text">
            <p>{selectedReservation.barber_name}</p>
            <p>
              <FiPhone />
              {selectedReservation.barber_phone}
            </p>
            <p>
              <FiMail />
              {selectedReservation.barber_email}
            </p>
          </div>
        </div>
        <h3>Information du client</h3>
        <div className="reservationdetailcard-user-info">
          <img
            className="reservationdetailcard-avatar"
            src={getImageUrl(selectedReservation.customer_avatar)}
            alt={selectedReservation.customer_firstname}
          />
          <div className="reservationdetailcard-user-info-text">
            <p>
              {selectedReservation.customer_lastname}{" "}
              {selectedReservation.customer_firstname}
            </p>
            <p>
              <FiPhone />
              {selectedReservation.customer_phone}
            </p>
            <p>
              <FiMail />
              {selectedReservation.customer_email}
            </p>
          </div>
        </div>
      </div>
      <div className="reservationdetailcard-prestation-contener">
        <div className="reservationdetailcard-prestation-info full-width">
          <FiCalendar className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span className="reservationdetailcard-prestation-info-span">
              Date de création
            </span>
            <p>
              {format(
                new Date(selectedReservation.create_time),
                "dd MMM yyyy HH:mm",
                {
                  locale: fr,
                },
              )}
            </p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info">
          <FiCalendar className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span className="reservationdetailcard-prestation-info-span">
              Date
            </span>
            <p>
              {format(
                new Date(selectedReservation.appointment_date),
                "dd MMM yy",
                {
                  locale: fr,
                },
              )}
            </p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info">
          <FiClock className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span className="reservationdetailcard-prestation-info-span">
              Heure
            </span>
            <p>
              {format(new Date(selectedReservation.appointment_date), "HH:mm", {
                locale: fr,
              })}
            </p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info">
          <AiFillEuroCircle className="reservationdetailcard-prestation-info-icon" />

          <div className="reservationdetailcard-prestation-info-text">
            <span>Prix</span>
            <p>{selectedReservation.price} €</p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info">
          <FiClock className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span>Durée</span>
            <p>{selectedReservation.duration_minutes} minutes</p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info">
          <FiScissors className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span>Service</span>
            <p>{selectedReservation.prestation_name}</p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info">
          <FiFlag className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span>Lieu</span>
            <p>{selectedReservation.location_type}</p>
          </div>
        </div>
        <div className="reservationdetailcard-prestation-info full-width">
          <FiNavigation className="reservationdetailcard-prestation-info-icon" />
          <div className="reservationdetailcard-prestation-info-text">
            <span>Adresse</span>
            {selectedReservation.location_type?.toLowerCase() ===
              "domicile" && (
              <>
                <p>{selectedReservation.customer_adress}</p>
                <p>{selectedReservation.customer_city}</p>
                <p>{selectedReservation.customer_postal_code}</p>
              </>
            )}

            {selectedReservation.location_type?.toLowerCase() === "salon" && (
              <>
                <p>{selectedReservation.barber_adress}</p>
                <p>{selectedReservation.barber_city}</p>
                <p>{selectedReservation.barber_postal_code}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetailCard;
