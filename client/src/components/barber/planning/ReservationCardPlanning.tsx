import "./ReservationCardPlanning.css";

type ReservationStatus = "confirmed" | "pending" | "cancelled";

type Props = {
  avatar: string;
  time: string;
  customerName: string;
  service: string;
  duration: string;
  status: ReservationStatus;
};

function ReservationCardPlanning({
  avatar,
  time,
  customerName,
  service,
  duration,
  status,
}: Props) {
  const statusLabel = {
    confirmed: "Confirmé",
    pending: "En attente",
    cancelled: "Annulé",
  };

  return (
    <article className={`reservation-card ${status}`}>
      <img
        src={avatar}
        alt={customerName}
        className="reservation-card-avatar"
      />

      <span className="reservation-card-time">{time}</span>

      <div className="reservation-card-content">
        <h4>{customerName}</h4>
        <p>{service}</p>
      </div>

      <div className="reservation-card-right">
        <span className={`reservation-card-status ${status}`}>
          {statusLabel[status]}
        </span>

        <span className="reservation-card-duration">{duration}</span>
      </div>
    </article>
  );
}

export default ReservationCardPlanning;
