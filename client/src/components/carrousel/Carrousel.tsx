import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router";
import type { Barber } from "../../types/barber";
import "./Carrousel.css";

const API_URL = import.meta.env.VITE_API_URL;

type CarrouselProps = {
  barbers: Barber[];
  selectedBarber?: Barber;
  onSelectBarber?: (barber: Barber) => void;
};

function Carrousel({
  barbers,
  selectedBarber,
  onSelectBarber,
}: CarrouselProps) {
  return (
    <section className="carrousel">
      <div className="carrousel__list">
        {barbers.slice(3, 11).map((barber) => (
          <button
            type="button"
            key={barber.id_user}
            className={`carrousel__card ${
              selectedBarber?.id_user === barber.id_user
                ? "carrousel__card--selected"
                : ""
            }`}
            onClick={() => onSelectBarber?.(barber)}
          >
            {barber.avg_rating != null && (
              <div className="carrousel__rating-badge">
                <FaStar className="carrousel__star" />
                {Number(barber.avg_rating).toFixed(1)}
              </div>
            )}

            <div className="carrousel__image-wrapper">
              <img
                className="carrousel__image"
                src={`${API_URL}${barber.avatar_url}`}
                alt={barber.name}
              />
            </div>

            <div className="carrousel__content">
              <h3 className="carrousel__name">{barber.name}</h3>

              <p className="carrousel__city">
                <FaMapMarkerAlt className="location-icon" />
                {barber.city}
              </p>

              <div className="carrousel__footer">
                {barber.min_price != null && (
                  <span className="carrousel__price">
                    dès {Number(barber.min_price).toFixed(0)} €
                  </span>
                )}

                <Link
                  className="carrousel__btn"
                  to={`/booking?barberId=${barber.id_user}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Réserver
                </Link>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Carrousel;
