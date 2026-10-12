import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./BigStatsGraphCard.css";

type FormattedChartData = {
  date: string;
  value: number;
};

type BigStatsGraphCardProps = {
  title: string;
  data: FormattedChartData[];
};

function BigStatsGraphCard({ title, data }: BigStatsGraphCardProps) {
  return (
    <div className="BigStatsGraphCard-main">
      <div className="BigStatsGraphCard-upper">
        <h2>{title}</h2>
      </div>

      <div className="BigStatsGraphCard-graph">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--gray-100)" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              dy={10}
              style={{ fontSize: "12px", fill: "var(--gray-300)" }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, "dataMax + 2"]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--gold)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--gold)"
              strokeWidth={2}
              fill="transparent"
              dot={{
                r: 4,
                stroke: "var(--gold)",
                strokeWidth: 2,
                fill: "var(--white)",
              }}
              activeDot={{
                r: 6,
                stroke: "var(--gold)",
                strokeWidth: 2,
                fill: "var(--gold)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string } }>;
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload?.length) {
    return (
      <div className="BigStatsGraphCard-tooltip-box">
        <p className="BigStatsGraphCard-tooltip-date">
          {payload[0].payload.date}
        </p>
        <p className="BigStatsGraphCard-tooltip-value">
          <strong>{payload[0].value}</strong> réservations
        </p>
      </div>
    );
  }
  return null;
}

export default BigStatsGraphCard;
