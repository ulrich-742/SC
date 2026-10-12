import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type RevenueDay = {
  day: string;
  revenue: number;
};

type ServiceItem = {
  name: string;
  count: number;
  revenue: number;
};

type StatusItem = {
  status: string;
  count: number;
};

type WeekComparison = {
  current_week: number;
  last_week: number;
};

export type BarberStats = {
  reservations: WeekComparison;
  customers: WeekComparison;
  revenueByDay: RevenueDay[];
  serviceDistribution: ServiceItem[];
  statusDistribution: StatusItem[];
};

function useBarberStatistics(barberId: number) {
  const [stats, setStats] = useState<BarberStats | null>(null);

  useEffect(() => {
    if (!barberId) return;

    fetch(`${API_URL}/api/barber/${barberId}/statistics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [barberId]);

  return stats;
}

export default useBarberStatistics;
