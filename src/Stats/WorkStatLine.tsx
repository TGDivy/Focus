import React, { FC } from "react";

import { LineChart, Line, YAxis, Tooltip, CartesianGrid } from "recharts";
import { timerType } from "../Common/Types/Types";
import { Typography } from "@mui/material";
import GraphCard from "./GraphCard";
import useThemeStore from "../Common/Stores/ThemeStore";

interface weeklyWorkStatType {
  [key: string]: number;
}

interface dataType {
  day: string;
  time: number;
  timePrev: number;
}

const getWeeklyWorkStat = async (
  timerRecords: timerType[],
  previousRecords: timerType[],
  dayDiff: number
) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getPerPeriod = (records: timerType[], diff: number) => {
    const weeklyWorkStatTemp: weeklyWorkStatType = {};

    const weeklyWorkStat = records.reduce((acc, cur) => {
      const date = new Date(
        cur.startTime.getTime() -
          5 * 60 * 60 * 1000 +
          diff * 24 * 60 * 60 * 1000
      );
      const day = date.getDate();
      const month = date.getMonth();
      const dayEntry = `${months[month]} ${day}`;

      if (acc[dayEntry]) {
        acc[dayEntry] += cur.duration;
      } else {
        acc[dayEntry] = cur.duration;
      }

      return acc;
    }, weeklyWorkStatTemp);

    return weeklyWorkStat;
  };

  const currentPeriod = getPerPeriod(timerRecords, 0);
  const previousPeriod = getPerPeriod(previousRecords, dayDiff);

  const data = [];
  for (const entry in currentPeriod) {
    data.push({
      day: entry,
      time: Math.floor(currentPeriod[entry] / 60),
      timePrev: Math.floor(previousPeriod[entry] / 60),
    });
  }

  // sort by date
  data.sort((a, b) => {
    const aDate = new Date(a.day);
    const bDate = new Date(b.day);
    return aDate.getTime() - bDate.getTime();
  });

  return data;
};

interface Props {
  timerRecords: timerType[];
  previousRecords: timerType[];
  dayDiff: number;
}

const WorkStatLine: FC<Props> = ({
  timerRecords,
  previousRecords,
  dayDiff,
}) => {
  const colors = useThemeStore((state) => state.colors);

  const [data, setData] = React.useState<dataType[]>();

  React.useEffect(() => {
    getWeeklyWorkStat(timerRecords, previousRecords, dayDiff).then((data) => {
      if (data) {
        setData(data);
      }
    });
  }, [timerRecords, previousRecords]);

  if (!data) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active) {
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "0px 10px",
            border: "2px solid #bbbbbb",
          }}
        >
          <Typography variant="h6" color="text.primary">
            {`${Math.floor(payload[1].value / 60)}H ${payload[1].value % 60}M`}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {`Previous ${Math.floor(payload[0].value / 60)}H ${
              payload[0].value % 60
            }M`}
          </Typography>
        </div>
      );
    }

    return null;
  };
  const ticks = [0, 120, 240, 360, 480, 600, 720];
  return (
    <GraphCard title="Weekly Work">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />

        {/* <XAxis dataKey="day" angle={-60} interval={0} dy={20} fontSize={14} /> */}
        <YAxis
          axisLine={false}
          width={30}
          orientation="left"
          allowDataOverflow={false}
          tickCount={6}
          ticks={ticks}
          tickFormatter={(tick) => `${(tick / 60).toFixed(0)}H`}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="timePrev"
          name="Previous"
          stroke={colors.primary}
          strokeOpacity={0.3}
          strokeWidth={5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="time"
          name="Current"
          stroke={colors.primary}
          strokeWidth={5}
          dot={false}
        />
      </LineChart>
    </GraphCard>
  );
};

export default WorkStatLine;
