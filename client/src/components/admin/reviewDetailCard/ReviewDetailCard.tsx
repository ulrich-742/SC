import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { AiFillEuroCircle } from "react-icons/ai";
import {
  FiAlertTriangle,
  FiCalendar,
  FiFlag,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiScissors,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import type { AdminReview } from "../../../types/review";
import "./ReviewDetailCard.css";

interface ReviewDetailCardProps {
  selectedReview: AdminReview;
  handleDeleteReview: () => void;
}
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
function ReviewDetailCard({
  selectedReview,
  handleDeleteReview,
}: ReviewDetailCardProps) {
  return (
    <div className="reviewdetailcard-main">
      <div className="reviewdetailcard-title">
        <h2>Détail de la réservation</h2>
        <div
          className={`reviewdetailcard-status status-${selectedReview.appointment_status?.toLowerCase()} `}
        >
          {selectedReview.appointment_status}
        </div>
      </div>
      <div className="reviewdetailcard-header">
        <h3>Information du coiffeur</h3>
        <div className="reviewdetailcard-user-info">
          <img
            className="reviewdetailcard-avatar"
            src={getImageUrl(selectedReview.barber_avatar_url)}
            alt={selectedReview.barber_name}
          />

          <div className="reviewdetailcard-user-info-text">
            <p>{selectedReview.barber_name}</p>
            <p>
              <FiPhone />
              {selectedReview.barber_phone}
            </p>
            <p>
              <FiMail />
              {selectedReview.barber_email}
            </p>
          </div>
        </div>
        <h3>Information du client</h3>
        <div className="reviewdetailcard-user-info">
          <img
            className="reviewdetailcard-avatar"
            src={getImageUrl(selectedReview.customer_avatar_url)}
            alt={selectedReview.customer_firstname}
          />
          <div className="reviewdetailcard-user-info-text">
            <p>
              {selectedReview.customer_lastname}{" "}
              {selectedReview.customer_firstname}
            </p>
            <p>
              <FiPhone />
              {selectedReview.customer_phone}
            </p>
            <p>
              <FiMail />
              {selectedReview.customer_email}
            </p>
          </div>
        </div>
      </div>
      <div className="reviewdetailcard-prestation-contener">
        <div
          className={`reviewdetailcard-prestation-info reporting-${selectedReview.reporting}`}
        >
          {selectedReview.reporting === 1 ? (
            <>
              <FiAlertTriangle className="reviewdetailcard-prestation-info-icon" />
              <div className="reviewdetailcard-prestation-info-text">
                <span className="reviewdetailcard-prestation-info-span">
                  Signaler
                </span>
              </div>
            </>
          ) : null}
        </div>
        <div className="reviewdetailcard-prestation-info full-width">
          <FiCalendar className="reviewdetailcard-prestation-info-icon" />
          <div className="reviewdetailcard-prestation-info-text">
            <span className="reviewdetailcard-prestation-info-span">
              Date de l'avis
            </span>
            <p>
              {format(
                new Date(selectedReview.created_at),
                "dd MMM yyyy HH:mm",
                {
                  locale: fr,
                },
              )}
            </p>
          </div>
        </div>
        <div className="reviewdetailcard-prestation-info full-width">
          <FiCalendar className="reviewdetailcard-prestation-info-icon" />
          <div className="reviewdetailcard-prestation-info-text">
            <span className="reviewdetailcard-prestation-info-span">
              Date du rendez-vous
            </span>
            <p>
              {format(
                new Date(selectedReview.appointment_date),
                "dd MMM yyyy HH:mm",
                {
                  locale: fr,
                },
              )}
            </p>
          </div>
        </div>

        <div className="reviewdetailcard-prestation-info">
          <FiStar className="reviewdetailcard-prestation-info-icon" />
          <div className="reviewdetailcard-prestation-info-text">
            <span>Note</span>
            <p>{selectedReview.rating}/5</p>
          </div>
        </div>
        <div className="reviewdetailcard-prestation-info">
          <AiFillEuroCircle className="reviewdetailcard-prestation-info-icon" />

          <div className="reviewdetailcard-prestation-info-text">
            <span>Prix</span>
            <p>{selectedReview.prestation_price} €</p>
          </div>
        </div>
        <div className="reviewdetailcard-prestation-info">
          <FiFlag className="reviewdetailcard-prestation-info-icon" />
          <div className="reviewdetailcard-prestation-info-text">
            <span>Lieu</span>
            <p>{selectedReview.appointment_location_type}</p>
          </div>
        </div>
        <div className="reviewdetailcard-prestation-info">
          <FiScissors className="reviewdetailcard-prestation-info-icon" />
          <div className="reviewdetailcard-prestation-info-text">
            <span>Service</span>
            <p>{selectedReview.prestation_name}</p>
          </div>
        </div>
        <div className="reviewdetailcard-prestation-info full-width">
          <FiMessageSquare className="reviewdetailcard-prestation-info-icon" />
          <div className="reviewdetailcard-prestation-info-text">
            <span className="reviewdetailcard-prestation-info-span">
              Commentaire
            </span>
            <p>{selectedReview.comment}</p>
          </div>
        </div>
      </div>
      <div className="reviewdetailcard-action">
        <h2>Actions rapides</h2>

        <button
          className="reviewdetailcard-action-delete-btn"
          type="button"
          onClick={handleDeleteReview}
        >
          <FiTrash2 /> Supprimer le commentaire
        </button>
      </div>
    </div>
  );
}

export default ReviewDetailCard;
