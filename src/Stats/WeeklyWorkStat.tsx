import React from "react";

import useTimerRecordsStore from "../Common/Stores/TimerRecordsStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { timerType } from "../Common/Types/Types";
import { Card, Box, CardContent, Typography, CardHeader } from "@mui/material";

interface weeklyWorkStatType {
  [key: string]: number;
}

interface dataType {
  day: string;
  time: number;
}

const getWeeklyWorkStat = async (timerRecords: timerType[]) => {
  // const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const today = new Date();
  const weeklyWorkStatTemp: weeklyWorkStatType = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const day = date.getDate();
    const month = date.getMonth();
    let dayEntry = `${months[month]} ${day}`;
    if (day === 0) {
      dayEntry = `Today`;
    }
    weeklyWorkStatTemp[dayEntry] = 0;
  }

  const weeklyWorkStat = timerRecords.reduce((acc, cur) => {
    const date = cur.startTime;
    const day = date.getDate();
    const month = date.getMonth();
    let dayEntry = `${months[month]} ${day}`;
    if (day === 0) {
      dayEntry = `Today`;
    }

    if (acc[dayEntry]) {
      acc[dayEntry] += cur.duration;
    } else {
      acc[dayEntry] = cur.duration;
    }

    return acc;
  }, weeklyWorkStatTemp);

  const data = [];
  for (const entry in weeklyWorkStat) {
    data.push({
      day: entry,
      time: Math.floor(weeklyWorkStat[entry] / 60),
    });
  }

  return data;
};

const WeeklyWorkStat = () => {
  const timerRecords = useTimerRecordsStore((state) => state.timerRecords);

  const [data, setData] = React.useState<dataType[]>();

  React.useEffect(() => {
    getWeeklyWorkStat(timerRecords).then((data) => {
      if (data) {
        setData(data);
      }
    });
  }, [timerRecords]);

  // let ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // ticks = ticks.map((tick) => tick * 60);

  const CustomTooltip = ({ active, payload, label }: any) => {
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
            {`${payload[0].value} M`}
          </Typography>
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      sx={{
        ":hover": {
          boxShadow: 20,
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="h5" color="text.primary">
            Weekly Work
          </Typography>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            height: "300px",
            width: "100%",
            backgroundColor: "#ffffffff",
          }}
        >
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis dataKey="day" />
              <YAxis
                axisLine={false}
                width={30}
                orientation="left"
                tickCount={6}
                tickFormatter={(tick) => `${tick}`}
                tickLine={false}
                // ticks={ticks}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              <Bar dataKey="time" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyWorkStat;
