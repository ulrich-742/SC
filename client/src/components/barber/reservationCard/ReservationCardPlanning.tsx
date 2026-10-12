import "./ReservationCardPlanning.css";

type ReservationStatus = "en attente" | "confirmé" | "terminé" | "annulé";

type Props = {
  avatar: string;
  time: string;
  customerName: string;
  service: string;
  duration: number;
  status: ReservationStatus;
  onShowDetails?: () => void;
};

const API_URL = import.meta.env.VITE_API_URL;

function ReservationCardPlanning({
  avatar,
  time,
  customerName,
  service,
  duration,
  status,
  onShowDetails,
}: Props) {
  return (
    <button
      type="button"
      className={`planning-reservation-card ${status}`}
      onClick={onShowDetails}
    >
      <div className="planning-reservation-card-left">
        <img
          src={`${API_URL}${avatar}`}
          alt={customerName}
          className="planning-reservation-card-avatar"
        />

        <span className="planning-reservation-card-time">{time}</span>
      </div>

      <div className="planning-reservation-card-content">
        <h4>{customerName}</h4>
        <p>{service}</p>
      </div>

      <div className="planning-reservation-card-right">
        <span className={`planning-reservation-card-status ${status}`}>
          {status}
        </span>

        <span className="planning-reservation-card-duration">
          {duration} min
        </span>
      </div>
    </button>
  );
}

export default ReservationCardPlanning;
