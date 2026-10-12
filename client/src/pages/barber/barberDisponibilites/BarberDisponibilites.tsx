import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./barberDisponibilites.css";

const API_URL = import.meta.env.VITE_API_URL;
const userString = localStorage.getItem("user");
const loggedUser = userString ? JSON.parse(userString) : null;
const BARBER_ID = loggedUser?.id ? Number(loggedUser.id) : null;

type DaySchedule = {
  day: string;
  active: boolean;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
};

const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    day: "Lundi",
    active: true,
    morningStart: "08:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
  {
    day: "Mardi",
    active: true,
    morningStart: "08:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
  {
    day: "Mercredi",
    active: false,
    morningStart: "08:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
  {
    day: "Jeudi",
    active: true,
    morningStart: "08:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
  {
    day: "Vendredi",
    active: true,
    morningStart: "08:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
  {
    day: "Samedi",
    active: true,
    morningStart: "10:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "16:00",
  },
  {
    day: "Dimanche",
    active: false,
    morningStart: "08:00",
    morningEnd: "12:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
];

function BarberDisponibilites() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [saved, setSaved] = useState(false);

  function updateDay(
    index: number,
    field: keyof DaySchedule,
    value: string | boolean,
  ) {
    setSchedule((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    );
    setSaved(false);
  }

  async function handleSave() {
    if (!BARBER_ID) return;

    try {
      const res = await fetch(`${API_URL}/api/barber/${BARBER_ID}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ schedule }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="barber-dispo">
      <div className="barber-dispo__header">
        <h1 className="barber-dispo__title">Mes disponibilités</h1>
        <p className="barber-dispo__subtitle">
          Gérez vos horaires de travail et vos jours disponibles
        </p>
      </div>

      <div className="barber-dispo__section">
        <div className="barber-dispo__section-head">
          <h2 className="barber-dispo__section-title">Semaine type</h2>
          <p className="barber-dispo__section-subtitle">
            Définissez vos horaires par jour de la semaine
          </p>
        </div>

        <ul className="barber-dispo__list">
          {schedule.map((day, i) => (
            <li key={day.day} className="barber-dispo__row">
              <div className="barber-dispo__row-header">
                <span
                  className={`barber-dispo__day ${!day.active ? "barber-dispo__day--inactive" : ""}`}
                >
                  {day.day}
                </span>
                <label className="barber-dispo__toggle-label">
                  <input
                    type="checkbox"
                    checked={day.active}
                    onChange={(e) => updateDay(i, "active", e.target.checked)}
                    className="barber-dispo__toggle-input"
                  />
                  <span
                    className={`barber-dispo__toggle ${day.active ? "barber-dispo__toggle--on" : ""}`}
                  >
                    <span className="barber-dispo__toggle-thumb" />
                  </span>
                  <span
                    className={`barber-dispo__status-text ${day.active ? "barber-dispo__status-text--active" : ""}`}
                  >
                    {day.active ? "Actif" : "Inactif"}
                  </span>
                </label>
              </div>

              {day.active ? (
                <div className="barber-dispo__slots">
                  <div className="barber-dispo__slot">
                    <span className="barber-dispo__slot-label">Matin</span>
                    <div className="barber-dispo__time-range">
                      <input
                        type="time"
                        value={day.morningStart}
                        className="barber-dispo__time-input"
                        onChange={(e) =>
                          updateDay(i, "morningStart", e.target.value)
                        }
                      />
                      <span className="barber-dispo__slot-sep">–</span>
                      <input
                        type="time"
                        value={day.morningEnd}
                        className="barber-dispo__time-input"
                        onChange={(e) =>
                          updateDay(i, "morningEnd", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="barber-dispo__slot">
                    <span className="barber-dispo__slot-label">Après-midi</span>
                    <div className="barber-dispo__time-range">
                      <input
                        type="time"
                        value={day.afternoonStart}
                        className="barber-dispo__time-input"
                        onChange={(e) =>
                          updateDay(i, "afternoonStart", e.target.value)
                        }
                      />
                      <span className="barber-dispo__slot-sep">–</span>
                      <input
                        type="time"
                        value={day.afternoonEnd}
                        className="barber-dispo__time-input"
                        onChange={(e) =>
                          updateDay(i, "afternoonEnd", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <span className="barber-dispo__closed">Fermé</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="barber-dispo__conseil">
        <FiInfo size={16} className="barber-dispo__conseil-icon" />
        <div>
          <p className="barber-dispo__conseil-title">Conseil SECARE</p>
          <p className="barber-dispo__conseil-text">
            Des horaires à jour vous permettent de recevoir plus de réservations
            et d'éviter les annulations.
          </p>
        </div>
      </div>

      <button
        type="button"
        className={`barber-dispo__save-btn ${saved ? "barber-dispo__save-btn--saved" : ""}`}
        onClick={handleSave}
      >
        {saved ? "✓ Enregistré" : "Enregistrer mes disponibilités"}
      </button>
    </div>
  );
}

export default BarberDisponibilites;
