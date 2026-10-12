import "./EventBanner.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";

type EventBannerProps = {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  image: string;
};
const API_URL = import.meta.env.VITE_API_URL;
function formatDate(raw: string): string {
  const d = new Date(raw);
  const date = d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

function EventBanner(props: EventBannerProps) {
  return (
    <section className="event_banner">
      <img
        src={`${API_URL}${props.image}`}
        alt={props.title}
        className="event_image"
      />

      <div className="event-banner_control">
        <div className="event_content">
          <h2 className="event_title">
            {props.title}
            {props.subtitle && <span> {props.subtitle}</span>}
          </h2>

          <p className="event_description">{props.description}</p>

          <div className="event-banner__infos">
            <p>
              <FaRegCalendarAlt /> {formatDate(props.date)}
            </p>
            <p>
              <FaMapLocation /> {props.location}
            </p>
          </div>

          <button type="button" className="event-banner__button">
            J'y participe →
          </button>
        </div>
      </div>
    </section>
  );
}

export default EventBanner;
