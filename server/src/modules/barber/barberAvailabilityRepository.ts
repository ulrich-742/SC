import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type DaySchedule = {
  day: string;
  active: boolean;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
};

class BarberAvailabilityRepository {
  // Retourne les créneaux disponibles (non réservés) pour un barber et une date
  async readAvailable(barberId: number, date: string) {
    const startOfDay = `${date} 00:00:00`;
    const endOfDay = `${date} 23:59:59`;

    const [rows] = await databaseClient.query<Rows>(
      `SELECT id_availability,
              DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s') as start_time,
              DATE_FORMAT(end_time,   '%Y-%m-%d %H:%i:%s') as end_time,
              is_booked
       FROM barber_availability
       WHERE id_user = ?
         AND start_time >= ?
         AND start_time <= ?
         AND is_booked = FALSE
       ORDER BY start_time`,
      [barberId, startOfDay, endOfDay],
    );

    return rows as {
      id_availability: number;
      start_time: string;
      end_time: string;
      is_booked: boolean;
    }[];
  }

  // Supprime les créneaux futurs non réservés et regénère depuis la semaine type
  async generateFromSchedule(barberId: number, schedule: DaySchedule[]) {
    const now = new Date();

    // Supprimer les créneaux futurs non réservés
    await databaseClient.query(
      `DELETE FROM barber_availability
       WHERE id_user = ? AND start_time > ? AND is_booked = FALSE`,
      [barberId, now],
    );

    const DAY_NAMES = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];

    const WEEKS_AHEAD = 4;
    const slots: { start: string; end: string }[] = [];

    for (let w = 0; w < WEEKS_AHEAD; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() + w * 7 + d);
        const dayName = DAY_NAMES[date.getDay()];
        const daySchedule = schedule.find((s) => s.day === dayName);

        if (!daySchedule?.active) continue;

        const dateStr = date.toISOString().split("T")[0];

        // Générer créneaux matin (toutes les 30 min)
        const morningSlots = generateSlots(
          `${dateStr} ${daySchedule.morningStart}`,
          `${dateStr} ${daySchedule.morningEnd}`,
        );

        // Générer créneaux après-midi (toutes les 30 min)
        const afternoonSlots = generateSlots(
          `${dateStr} ${daySchedule.afternoonStart}`,
          `${dateStr} ${daySchedule.afternoonEnd}`,
        );

        slots.push(...morningSlots, ...afternoonSlots);
      }
    }

    if (slots.length === 0) return;

    const values = slots.map((s) => [s.start, s.end, false, barberId]);
    await databaseClient.query(
      "INSERT INTO barber_availability (start_time, end_time, is_booked, id_user) VALUES ?",
      [values],
    );

    return slots.length;
  }
}

function generateSlots(
  startStr: string,
  endStr: string,
): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const start = new Date(startStr.replace(" ", "T"));
  const end = new Date(endStr.replace(" ", "T"));

  const current = new Date(start);
  while (current < end) {
    const next = new Date(current.getTime() + 30 * 60 * 1000);
    if (next > end) break;
    slots.push({
      start: formatDatetime(current),
      end: formatDatetime(next),
    });
    current.setTime(next.getTime());
  }
  return slots;
}

function formatDatetime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:00`;
}

export default new BarberAvailabilityRepository();
