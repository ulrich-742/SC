import type { IconType } from "react-icons";
import "./StatsGraphCardBarber.css";

type StatsGraphCardBarberProps = {
  Icon?: IconType;
  title?: string;
  value?: number | string;
  cycle?: string;
};

function StatsGraphCardBarber({
  Icon,
  title = "Rendez-vous",
  value = 12,
  cycle = "Aujourd'hui",
}: StatsGraphCardBarberProps) {
  return (
    <div className="graph-stats-card">
      {Icon && (
        <div className="graph-stats-card-icon-wrapper">
          <Icon className="graph-stats-card-icon" />
        </div>
      )}

      <div className="graph-stats-card-info">
        <span className="graph-stats-card-value">{value}</span>
        <div className="graph-stats-card-text">
          <h2>{title}</h2>
          <p>{cycle}</p>
        </div>
      </div>
    </div>
  );
}

export default StatsGraphCardBarber;
