import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import "./LastestReservationCard.css";

const API_URL = import.meta.env.VITE_API_URL;
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
interface Reservation {
  id: string;
  client: { name: string; avatar: string };
  coiffeur: string;
  service: string;
  formattedDate: string;
  statut: "confirmé" | "en attente" | "terminé" | "annulé";
}

type RawAppointment = {
  id_appointement?: number;
  appointment_date: string;
  status: string;
  barber_name: string;
  customer_firstname: string;
  customer_lastname: string;
  prestation_name: string;
  customer_avatar?: string;
};

function LatestReservationsCard() {
  const [appointments, setAppointments] = useState<Reservation[]>([]);
  const { fetchWithAuth } = useAuth();
  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/admin/appointments`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((rawData: RawAppointment[]) => {
        const formatted = rawData
          .sort((a, b) => b.appointment_date.localeCompare(a.appointment_date))
          .slice(0, 5)
          .map((app) => {
            const dateObj = new Date(app.appointment_date);
            const statusInfo = {
              label: app.status.charAt(0).toUpperCase() + app.status.slice(1),
              className: `status-${app.status.toLowerCase()}`,
            };
            console.log(statusInfo);
            return {
              id: (app.id_appointement ?? Math.random()).toString(),
              client: {
                name: `${app.customer_firstname || "Client"} ${(app.customer_lastname || "").charAt(0)}.`,
                avatar:
                  app.customer_avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              },
              coiffeur: app.barber_name || "Coiffeur inconnu",
              service: app.prestation_name || "Prestation",
              formattedDate: format(dateObj, "dd MMM yyyy, HH:mm", {
                locale: fr,
              }),
              statut: statusInfo.label as Reservation["statut"],
            };
          });
        setAppointments(formatted);
      })
      .catch((err) => console.error("Erreur chargement réservations :", err));
  }, [fetchWithAuth]);

  return (
    <div className="lastestreservations-card">
      <div className="card-header">
        <h3 className="card-title">Dernières réservations</h3>
        <NavLink to="/admin/reservations" className="see-all-link">
          Voir tout
        </NavLink>
      </div>
      <div className="table-responsive">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Coiffeur</th>
              <th>Service</th>
              <th>Date & Heure</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((res) => {
              const config = {
                label: res.statut,
                className: `status-${res.statut.toLowerCase()}`,
              };
              return (
                <tr key={res.id}>
                  <td>
                    <div className="client-info">
                      <img
                        src={getImageUrl(res.client.avatar)}
                        alt={res.client.name}
                        className="client-avatar"
                      />
                      <span className="client-name">{res.client.name}</span>
                    </div>
                  </td>
                  <td>{res.coiffeur}</td>
                  <td>{res.service}</td>
                  <td>
                    <span className="res-date">{res.formattedDate}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${config.className}`}>
                      {res.statut}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "20px",
              color: "var(--gray-300)",
            }}
          >
            Aucune réservation récente.
          </p>
        )}
      </div>
    </div>
  );
}

export default LatestReservationsCard;
