import type { IconType } from "react-icons";
import "./StatsCard.css";

type StatsCardProps = {
  Icon: IconType;
  title: string;
  value: number | string;
  cycle: string;
  iconColor?: string;
};

function StatsCard({ Icon, title, value, cycle, iconColor }: StatsCardProps) {
  return (
    <div className="admin-stats-card">
      <div className={`admin-stats-card-icon-wrapper ${iconColor}`}>
        <Icon className="admin-stats-card-icon" />
      </div>
      <div className="admin-stats-card-info">
        <span className="admin-stats-card-value">{value}</span>
        <h2>{title}</h2>
        <p>{cycle}</p>
      </div>
    </div>
  );
}

export default StatsCard;
