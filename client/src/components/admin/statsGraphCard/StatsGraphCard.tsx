import type { IconType } from "react-icons";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import "./StatsGraphCard.css";

type StatsGraphCardProps = {
  Icon: IconType;
  title: string;
  value: number | string;
  evolution: string;
  graphData?: number[];
};

function StatsGraphCard({
  Icon,
  title,
  value,
  evolution,
  graphData = [],
}: StatsGraphCardProps) {
  const formattedData = graphData.map((val) => ({ value: val }));

  return (
    <div className="StatsGraphCard-main">
      <div className="StatsGraphCard-upper">
        <div className="StatsGraphCard-wrapper">
          <Icon className="StatsGraphCard-icon" />
        </div>
        <div className="StatsGraphCard-info">
          <h2>{title}</h2>
          <span className="StatsGraphCard-value">{value}</span>
          <span
            className={`StatsGraphCard-evolution ${evolution.startsWith("↑") ? "up" : evolution.startsWith("↓") ? "down" : ""}`}
          >
            {evolution}
          </span>{" "}
          <p>VS semaine précédente</p>
        </div>
      </div>

      <div className="StatsGraphCard-graph">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--gold)"
              strokeWidth={1.5}
              fill="transparent"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatsGraphCard;
