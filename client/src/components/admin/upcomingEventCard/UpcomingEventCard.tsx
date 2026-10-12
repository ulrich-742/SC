import { useEffect, useState } from "react";
import type { Event } from "../../../types/event";

import "./UpcomingEventCard.css";

const API_URL = import.meta.env.VITE_API_URL;
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};

function formatEventDates(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const dayOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  const yearOptions: Intl.DateTimeFormatOptions = { year: "numeric" };

  const startDay = start.toLocaleDateString("fr-FR", dayOptions);
  const endDay = end.toLocaleDateString("fr-FR", dayOptions);
  const startYear = start.toLocaleDateString("fr-FR", yearOptions);
  const endYear = end.toLocaleDateString("fr-FR", yearOptions);

  if (start.toDateString() === end.toDateString()) {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return `${startDay} ${startYear} • ${start.toLocaleTimeString("fr-FR", timeOptions)} à ${end.toLocaleTimeString("fr-FR", timeOptions)}`;
  }
  return `Du ${startDay} au ${endDay} ${endYear}`;
}

function UpcomingEventCard() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data: Event[]) => {
        const now = new Date();

        const upcomingEvents = data
          .filter((event) => new Date(event.end_date) >= now)
          .sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime(),
          )
          .slice(0, 2);

        setEvents(upcomingEvents);
      })
      .catch((err) => console.error("Erreur fetch events:", err));
  }, []);

  return (
    <div className="upcoming-event-card-main">
      <div className="event-card-header">
        <h3>Événements à venir</h3>
        <a href="/admin/events" className="see-all-link">
          Voir tout
        </a>
      </div>

      <div className="event-card-list">
        {events.map((event) => (
          <div key={event.id_event} className="event-item">
            {" "}
            <div className="event-info">
              <img
                src={getImageUrl(event.image_url)}
                alt={event.title}
                className="event-image"
              />
              <div className="event-text">
                <span className="event-title">{event.title}</span>
                <span className="event-details">
                  📅 {formatEventDates(event.start_date, event.end_date)}
                </span>
                <span className="event-details">📍 {event.location}</span>
              </div>
            </div>
            <div className={`event-status-badge ${event.status}`}>
              {event.status}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "10px",
              color: "var(--gray-300)",
            }}
          >
            Aucun événement prévu.
          </p>
        )}
      </div>
    </div>
  );
}

export default UpcomingEventCard;
