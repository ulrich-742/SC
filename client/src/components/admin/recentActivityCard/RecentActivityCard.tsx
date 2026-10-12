import {
  FiCalendar,
  FiCheckCircle,
  FiMessageSquare,
  FiUserPlus,
  FiXCircle,
} from "react-icons/fi";
import "./RecentActivityCard.css";

interface RecentActivity {
  id: number;
  type: "approval" | "reservation" | "review" | "register" | "cancellation";
  text: string;
  time: string;
}

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    type: "approval",
    text: 'Le coiffeur "Le Barbier Paris" a été approuvé',
    time: "il y a 10 minutes",
  },
  {
    id: 2,
    type: "reservation",
    text: "Nouvelle réservation par Emma D.",
    time: "il y a 25 minutes",
  },
  {
    id: 3,
    type: "review",
    text: "Un avis a été signalé par Lucas M.",
    time: "il y a 1 heure",
  },
  {
    id: 4,
    type: "register",
    text: "Nouveau coiffeur inscrit : Studio 24",
    time: "il y a 2 heures",
  },
  {
    id: 5,
    type: "cancellation",
    text: "Réservation annulée par Julien R.",
    time: "il y a 3 heures",
  },
];

function RecentActivityCard() {
  const renderIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <FiCheckCircle className="activity-icon icon-success" />;
      case "reservation":
        return <FiCalendar className="activity-icon icon-info" />;
      case "review":
        return <FiMessageSquare className="activity-icon icon-error" />;
      case "register":
        return <FiUserPlus className="activity-icon icon-warning" />;
      case "cancellation":
        return <FiXCircle className="activity-icon icon-gray" />;
      default:
        return null;
    }
  };

  return (
    <div className="recent-activity-card-main">
      <div className="activity-card-header">
        <h3>Activité récente</h3>
      </div>

      <div className="activity-card-list">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-left">
              {renderIcon(activity.type)}
              <span className="activity-text">{activity.text}</span>
            </div>
            <span className="activity-time">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivityCard;
