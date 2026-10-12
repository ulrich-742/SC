import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";

import {
  FiCalendar,
  FiFlag,
  FiScissors,
  FiStar,
  FiUsers,
} from "react-icons/fi";

import ApprovalCard from "../../../components/admin/approvalCard/ApprovalCard";
import BigStatsGraphCard from "../../../components/admin/bigStatsGraphCard/BigStatsGraphCard";
import LatestReservationsCard from "../../../components/admin/lastestReservationsCard/LastestReservationCard";
import RecentActivityCard from "../../../components/admin/recentActivityCard/RecentActivityCard";
import ReservationStatusGraph from "../../../components/admin/reservationsStatusGraph/ReservationsStatusGraph";
import StatsGraphCard from "../../../components/admin/statsGraphCard/StatsGraphCard";
import UpcomingEventCard from "../../../components/admin/upcomingEventCard/UpcomingEventCard";
import { useAuth } from "../../../context/AuthContext";

import type { Barber } from "../../../types/barber";
import type { Review } from "../../../types/review";
import type { User } from "../../../types/user";
import "./Dashboard.css";

type RawAppointment = {
  id_appointment: number;
  appointment_date: string;
  status: string;
};

type FormattedChartData = {
  date: string;
  value: number;
};

const generateDynamicWeeks = () => {
  const options = [];
  const now = new Date();
  const currentMonday = startOfWeek(now, { weekStartsOn: 1 });

  for (let i = -4; i <= 4; i++) {
    const monday = addWeeks(currentMonday, i);
    const sunday = endOfWeek(monday, { weekStartsOn: 1 });
    const startISO = format(monday, "yyyy-MM-dd");
    const endISO = format(sunday, "yyyy-MM-dd");
    const labelStart = format(monday, "dd MMMM yyyy", { locale: fr });
    const labelEnd = format(sunday, "dd MMMM yyyy", { locale: fr });
    const formattedLabel = `${labelStart} - ${labelEnd}`;

    options.push({
      value: `week-${startISO}`,
      label: i === 0 ? `${formattedLabel} (Cette semaine)` : formattedLabel,
      start: startISO,
      end: endISO,
      isCurrent: i === 0,
    });
  }
  return options;
};

const getTrendData = <T extends { create_time: string }>(
  items: T[],
  daysOfWeek: Date[],
): number[] => {
  return daysOfWeek.map((day) => {
    return items.filter((item) => {
      const itemDate = new Date(item.create_time);
      return isSameDay(itemDate, day);
    }).length;
  });
};

const calculateEvolution = (current: number, previous: number): string => {
  if (previous === 0) {
    return current > 0 ? "↑ 100%" : "0%";
  }
  const percentage = ((current - previous) / previous) * 100;
  if (percentage > 0) return `↑ ${percentage.toFixed(1)}%`;
  if (percentage < 0) return `↓ ${Math.abs(percentage).toFixed(1)}%`;
  return "0%";
};

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { fetchWithAuth } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<RawAppointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [prevBarbers, setPrevBarbers] = useState<Barber[]>([]);
  const [prevUsers, setPrevUsers] = useState<User[]>([]);
  const [prevAppointments, setPrevAppointments] = useState<RawAppointment[]>(
    [],
  );
  const [prevReviews, setPrevReviews] = useState<Review[]>([]);

  const weekOptions = useMemo(() => generateDynamicWeeks(), []);
  const defaultWeek = weekOptions.find((w) => w.isCurrent) || weekOptions[4];
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek.value);

  const currentPeriod =
    weekOptions.find((w) => w.value === selectedWeek) || defaultWeek;

  const prevPeriod = useMemo(() => {
    const currentStart = new Date(currentPeriod.start);
    const currentEnd = new Date(currentPeriod.end);
    return {
      start: format(addWeeks(currentStart, -1), "yyyy-MM-dd"),
      end: format(addWeeks(currentEnd, -1), "yyyy-MM-dd"),
    };
  }, [currentPeriod.start, currentPeriod.end]);

  useEffect(() => {
    const params = `?startDate=${currentPeriod.start}&endDate=${currentPeriod.end}`;
    const prevParams = `?startDate=${prevPeriod.start}&endDate=${prevPeriod.end}`;

    fetchWithAuth(`${API_URL}/api/admin/dashboard${params}`)
      .then((res) => res.json())
      .then(({ barbers, users, appointments, reviews }) => {
        setBarbers(barbers);
        setUsers(users);
        setAppointments(appointments);
        setReviews(reviews);
      });
    fetchWithAuth(`${API_URL}/api/admin/dashboard${prevParams}`)
      .then((res) => res.json())
      .then(({ barbers, users, appointments, reviews }) => {
        setPrevBarbers(barbers);
        setPrevUsers(users);
        setPrevAppointments(appointments);
        setPrevReviews(reviews);
      });
  }, [currentPeriod, prevPeriod, fetchWithAuth]);

  const daysOfWeek = useMemo(() => {
    return eachDayOfInterval({
      start: new Date(currentPeriod.start),
      end: new Date(currentPeriod.end),
    });
  }, [currentPeriod.start, currentPeriod.end]);

  const usersTrend = useMemo(
    () => getTrendData(users, daysOfWeek),
    [users, daysOfWeek],
  );
  const barbersTrend = useMemo(
    () => getTrendData(barbers, daysOfWeek),
    [barbers, daysOfWeek],
  );

  const appointmentsTrend = useMemo(() => {
    const normalizedAppointments = appointments.map((app) => ({
      create_time: app.appointment_date,
    }));
    return getTrendData(normalizedAppointments, daysOfWeek);
  }, [appointments, daysOfWeek]);

  const reviewsTrend = useMemo(() => {
    const normalizedReviews = reviews.map((rev) => ({
      create_time: rev.created_at,
    }));
    return getTrendData(normalizedReviews, daysOfWeek);
  }, [reviews, daysOfWeek]);

  const reportedReviewsTrend = useMemo(() => {
    const reportedItems = reviews
      .filter((r) => r.reporting)
      .map((rev) => ({ create_time: rev.created_at }));
    return getTrendData(reportedItems, daysOfWeek);
  }, [reviews, daysOfWeek]);

  const usersEvolution = useMemo(
    () => calculateEvolution(users.length, prevUsers.length),
    [users, prevUsers],
  );
  const barbersEvolution = useMemo(
    () => calculateEvolution(barbers.length, prevBarbers.length),
    [barbers, prevBarbers],
  );
  const appointmentsEvolution = useMemo(
    () => calculateEvolution(appointments.length, prevAppointments.length),
    [appointments, prevAppointments],
  );

  const reviewsEvolution = useMemo(() => {
    const currentAvg =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0;
    const prevAvg =
      prevReviews.reduce((acc, r) => acc + r.rating, 0) / prevReviews.length ||
      0;
    return calculateEvolution(currentAvg, prevAvg);
  }, [reviews, prevReviews]);

  const reportedReviewsEvolution = useMemo(() => {
    const currentReported = reviews.filter((r) => r.reporting).length;
    const prevReported = prevReviews.filter((r) => r.reporting).length;
    return calculateEvolution(currentReported, prevReported);
  }, [reviews, prevReviews]);

  const chartData = useMemo<FormattedChartData[]>(() => {
    const countsByDate = appointments.reduce<{
      [key: string]: { count: number; rawDate: Date };
    }>((acc, app) => {
      const dateObj = new Date(app.appointment_date);
      const formattedDate = dateObj.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });

      if (!acc[formattedDate]) {
        acc[formattedDate] = { count: 0, rawDate: dateObj };
      }
      acc[formattedDate].count += 1;

      return acc;
    }, {});

    return Object.keys(countsByDate)
      .map((date) => ({
        date: date,
        value: countsByDate[date].count,
        rawDate: countsByDate[date].rawDate,
      }))
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  }, [appointments]);

  return (
    <div className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Bonjour, Admin 👋</h1>
          <p>
            Bienvenue sur votre tableau de bord. Voici un aperçu de vos
            statistiques récentes :
          </p>
        </div>

        <div className="week-selector-container">
          <FiCalendar className="icon" />
          <select
            className="week-selector-select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            {weekOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="dashboard-content-graphs">
        <StatsGraphCard
          Icon={FiUsers}
          title="Utilisateurs"
          value={users.length}
          evolution={usersEvolution}
          graphData={usersTrend}
        />
        <StatsGraphCard
          Icon={FiScissors}
          title="Coiffeurs"
          value={barbers.length}
          evolution={barbersEvolution}
          graphData={barbersTrend}
        />
        <StatsGraphCard
          Icon={FiCalendar}
          title="Réservations"
          value={appointments.length}
          evolution={appointmentsEvolution}
          graphData={appointmentsTrend}
        />
        <StatsGraphCard
          Icon={FiStar}
          title="Note moyenne"
          value={`${(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0).toFixed(1)}/5`}
          evolution={reviewsEvolution}
          graphData={reviewsTrend}
        />
        <StatsGraphCard
          Icon={FiFlag}
          title="Avis signalés"
          value={reviews.filter((review) => review.reporting).length}
          evolution={reportedReviewsEvolution}
          graphData={reportedReviewsTrend}
        />
      </div>

      <div className="dashboard-body">
        <div className="dashboard-content-big-graphs">
          <div className="dashboard-content-big-graphs-upper">
            <BigStatsGraphCard
              title="Evolution des réservations"
              data={chartData}
            />
            <ReservationStatusGraph appointments={appointments} />
          </div>
          <LatestReservationsCard />
        </div>
        <div className="dashboard-body-side">
          <ApprovalCard />
          <UpcomingEventCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
