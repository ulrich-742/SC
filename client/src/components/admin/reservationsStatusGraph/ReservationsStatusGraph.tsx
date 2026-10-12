import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import "./ReservationsStatusGraph.css";
import { NavLink } from "react-router";

interface StatusData {
  id: number;
  name: string;
  value: number;
  percentage: number;
  color: string;
}

type RawAppointment = {
  id_appointment: number;
  status: string;
  appointment_date: string;
};

type ReservationStatusGraphProps = {
  appointments: RawAppointment[];
};

interface RenderPieShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  payload: StatusData;
}

const RenderPieShape = (props: Partial<RenderPieShapeProps>) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } =
    props;
  if (!payload) return null;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={payload.color}
    />
  );
};

function ReservationStatusGraph({ appointments }: ReservationStatusGraphProps) {
  const totalReservations = appointments.length;

  const statusConfig: {
    [key: string]: { id: number; name: string; color: string };
  } = {
    confirmé: { id: 1, name: "Confirmées", color: "var(--success)" },
    "en attente": { id: 2, name: "En attente", color: "var(--warning)" },
    terminé: { id: 3, name: "Terminées", color: "var(--info)" },
    annulé: { id: 4, name: "Annulées", color: "var(--error)" },
  };

  const counts = appointments.reduce<{ [key: string]: number }>(
    (acc, app) => {
      const statusKey = app.status?.toLowerCase();
      if (acc[statusKey] !== undefined) {
        acc[statusKey]++;
      }
      return acc;
    },
    { confirmé: 0, "en attente": 0, terminé: 0, annulé: 0 },
  );

  const chartData: StatusData[] = Object.keys(statusConfig).map((key) => {
    const count = counts[key];
    const percent =
      totalReservations > 0 ? Math.round((count / totalReservations) * 100) : 0;

    return {
      id: statusConfig[key].id,
      name: statusConfig[key].name,
      value: count,
      percentage: percent,
      color: statusConfig[key].color,
    };
  });

  return (
    <div className="ReservationStatusGraph-card">
      <h3 className="ReservationStatusGraph-title">Réservations par statut</h3>

      <div className="ReservationStatusGraph-content">
        <div className="ReservationStatusGraph-wrapper">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                shape={<RenderPieShape />}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="ReservationStatusGraph-center-text">
            <span className="total-number">{totalReservations}</span>{" "}
            <span className="total-label">Total</span>
          </div>
        </div>

        <div className="ReservationStatusGraph-legend">
          {chartData.map((item) => (
            <div key={item.id} className="legend-item">
              <div className="legend-left">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend-name">{item.name}</span>
              </div>
              <span className="legend-stats">
                {item.value}{" "}
                <span className="legend-percent">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <NavLink
        to="/admin/reservations"
        className="ReservationStatusGraph-footer-btn"
      >
        Voir toutes les réservations
      </NavLink>
    </div>
  );
}

export default ReservationStatusGraph;
