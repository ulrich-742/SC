import { FiArrowLeft, FiSliders, FiTrendingUp } from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useBarberStatistics from "../../../hooks/useBarberStatistics";
import "./barberStatistics.css";

const SERVICE_COLORS = ["#c8963e", "#d4a85a", "#deba80", "#e8d0aa"];
const STATUS_COLORS = ["#c8963e", "#d4a85a", "#e0e0e0"];

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmées",
  pending: "En attente",
  cancelled: "Annulées",
};

function calcTrend(current: number, last: number) {
  if (last === 0) return null;
  return Math.round(((current - last) / last) * 100);
}

const userString = localStorage.getItem("user");
const loggedUser = userString ? JSON.parse(userString) : null;
const BARBER_ID = Number(loggedUser?.id ?? 0);

function BarberStatistics() {
  const stats = useBarberStatistics(BARBER_ID);

  const totalReservations = stats?.reservations.current_week ?? 0;
  const totalCustomers = stats?.customers.current_week ?? 0;
  const reservationsTrend = stats
    ? calcTrend(stats.reservations.current_week, stats.reservations.last_week)
    : null;
  const customersTrend = stats
    ? calcTrend(stats.customers.current_week, stats.customers.last_week)
    : null;

  const totalRevenue =
    stats?.serviceDistribution.reduce((sum, s) => sum + Number(s.revenue), 0) ??
    0;

  const totalStatusCount =
    stats?.statusDistribution.reduce((sum, s) => sum + Number(s.count), 0) ?? 0;

  return (
    <div className="barber-stats">
      {/* Header */}
      <div className="barber-stats__header">
        <button
          type="button"
          className="barber-stats__back"
          aria-label="Retour"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="barber-stats__title">Mes statistiques</h1>
        <button
          type="button"
          className="barber-stats__filter"
          aria-label="Filtrer"
        >
          <FiSliders size={20} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="barber-stats__cards">
        <div className="barber-stats__card">
          <p className="barber-stats__card-label">Réservations</p>
          <p className="barber-stats__card-value">{totalReservations}</p>
          {reservationsTrend !== null && (
            <p
              className={`barber-stats__card-trend barber-stats__card-trend--${reservationsTrend >= 0 ? "up" : "down"}`}
            >
              {reservationsTrend >= 0 ? "+" : ""}
              {reservationsTrend}% vs sem. dernière
            </p>
          )}
        </div>
        <div className="barber-stats__card">
          <p className="barber-stats__card-label">Nouveaux clients</p>
          <p className="barber-stats__card-value">{totalCustomers}</p>
          {customersTrend !== null && (
            <p
              className={`barber-stats__card-trend barber-stats__card-trend--${customersTrend >= 0 ? "up" : "down"}`}
            >
              {customersTrend >= 0 ? "+" : ""}
              {customersTrend}% vs sem. dernière
            </p>
          )}
        </div>
      </div>

      {/* Revenue chart */}
      <div className="barber-stats__section">
        <h2 className="barber-stats__section-title">Chiffre d'affaires</h2>
        <div className="barber-stats__chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={stats?.revenueByDay ?? []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#c8963e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c8963e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#999" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#999" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v} €`}
              />
              <Tooltip
                formatter={(value) => [`${value} €`, "CA"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c8963e"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={{ fill: "#c8963e", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donuts */}
      <div className="barber-stats__donuts">
        {/* Service distribution */}
        <div className="barber-stats__donut-card">
          <h2 className="barber-stats__section-title">
            Répartition par service
          </h2>
          <div className="barber-stats__donut-row">
            <div className="barber-stats__donut-chart">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={(stats?.serviceDistribution ?? []).map((e, i) => ({
                      ...e,
                      fill: SERVICE_COLORS[i % SERVICE_COLORS.length],
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={55}
                    dataKey="revenue"
                    startAngle={90}
                    endAngle={-270}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="barber-stats__donut-center">
                <p className="barber-stats__donut-total">{totalRevenue} €</p>
                <p className="barber-stats__donut-label">Total</p>
              </div>
            </div>
            <ul className="barber-stats__donut-legend">
              {(stats?.serviceDistribution ?? []).map((item, i) => {
                const percent =
                  totalRevenue > 0
                    ? Math.round((Number(item.revenue) / totalRevenue) * 100)
                    : 0;
                return (
                  <li key={item.name} className="barber-stats__legend-item">
                    <span
                      className="barber-stats__legend-dot"
                      style={{
                        backgroundColor:
                          SERVICE_COLORS[i % SERVICE_COLORS.length],
                      }}
                    />
                    <span className="barber-stats__legend-name">
                      {item.name} {percent}% ({item.revenue} €)
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Status distribution */}
        <div className="barber-stats__donut-card">
          <h2 className="barber-stats__section-title">
            Répartition par statut
          </h2>
          <div className="barber-stats__donut-row">
            <div className="barber-stats__donut-chart">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={(stats?.statusDistribution ?? []).map((e, i) => ({
                      ...e,
                      fill: STATUS_COLORS[i % STATUS_COLORS.length],
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={55}
                    dataKey="count"
                    startAngle={90}
                    endAngle={-270}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="barber-stats__donut-center">
                <p className="barber-stats__donut-total">{totalStatusCount}</p>
                <p className="barber-stats__donut-label">Total</p>
              </div>
            </div>
            <ul className="barber-stats__donut-legend">
              {(stats?.statusDistribution ?? []).map((item, i) => {
                const percent =
                  totalStatusCount > 0
                    ? Math.round((Number(item.count) / totalStatusCount) * 100)
                    : 0;
                return (
                  <li key={item.status} className="barber-stats__legend-item">
                    <span
                      className="barber-stats__legend-dot"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[i % STATUS_COLORS.length],
                      }}
                    />
                    <span className="barber-stats__legend-name">
                      {STATUS_LABELS[item.status] ?? item.status} {item.count} (
                      {percent}%)
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom message */}
      {reservationsTrend !== null && reservationsTrend > 0 && (
        <div className="barber-stats__message">
          <FiTrendingUp size={20} className="barber-stats__message-icon" />
          <div>
            <p className="barber-stats__message-title">Excellente semaine !</p>
            <p className="barber-stats__message-text">
              Votre chiffre d'affaires a augmenté de{" "}
              <span className="barber-stats__message-highlight">
                {reservationsTrend}%
              </span>{" "}
              par rapport à la semaine dernière.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarberStatistics;
