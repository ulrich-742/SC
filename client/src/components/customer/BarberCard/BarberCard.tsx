import "./BarberCard.css";
import { FiChevronRight, FiMapPin } from "react-icons/fi";
import fallbackImage from "../../../assets/images/Afro.jpg";
import type { Barber } from "../../../types/barber";

const API_URL = import.meta.env.VITE_API_URL;

type BarberCardProps = {
  barber: Barber;
  onProfileClick?: (barber: Barber) => void;
};

function BarberCard({ barber, onProfileClick }: BarberCardProps) {
  const image = barber.avatar_url?.startsWith("/")
    ? `${API_URL}${barber.avatar_url}`
    : barber.avatar_url?.startsWith("http")
      ? barber.avatar_url
      : fallbackImage;

  return (
    <article
      className="barber-card"
      onClick={() => onProfileClick?.(barber)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onProfileClick?.(barber);
        }
      }}
    >
      <img
        src={image}
        alt={barber.name}
        className="barber-card__image"
        onError={(event) => {
          event.currentTarget.src = fallbackImage;
        }}
      />
      <div className="barber-card__content">
        <div className="barber-card__info">
          <h3 className="barber-card__title">{barber.name}</h3>

          <p className="barber-card__description">{barber.description}</p>

          <div className="barber-card__location">
            <FiMapPin />

            <span>
              {barber.postal_code} {barber.city}
            </span>
          </div>
        </div>
        <div className="barber-card__right">
          {/* <span className="barber-card__distance">
            📍 À {barber.delivery_radius} km
          </span> */}
          <FiChevronRight className="barber-card__arrow" />
        </div>
      </div>
    </article>
  );
}

export default BarberCard;
