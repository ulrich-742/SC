import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export type BarberAppointment = {
  id_appointment: number;
  appointment_date: string;
  status: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_avatar: string;
  prestation_name: string;
  prestation_price: number;
  duration_minutes: number;
};

function useBarberAppointments(barberId: number, status?: string) {
  const [appointments, setAppointments] = useState<BarberAppointment[]>([]);

  useEffect(() => {
    if (!barberId) return;

    const url = status
      ? `${API_URL}/api/barber/${barberId}/appointments?status=${encodeURIComponent(status)}`
      : `${API_URL}/api/barber/${barberId}/appointments`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des rendez-vous");
        }

        return res.json();
      })
      .then((data) => {
        setAppointments(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [barberId, status]);

  return { appointments, setAppointments };
}

export default useBarberAppointments;
