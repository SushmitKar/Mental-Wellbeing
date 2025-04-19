"use client"
import { ReactNode } from "react";
import { Chart, ChartContainer, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Sample mood data
const data = [
  { date: "Mon", mood: 3, journal: "Feeling okay today." },
  { date: "Tue", mood: 4, journal: "Had a great meeting!" },
  { date: "Wed", mood: 2, journal: "Stressed about deadline." },
  { date: "Thu", mood: 3, journal: "Getting better." },
  { date: "Fri", mood: 5, journal: "It's Friday! Feeling great." },
  { date: "Sat", mood: 4, journal: "Relaxing weekend." },
  { date: "Sun", mood: 4, journal: "Ready for the new week." },
]

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }): ReactNode => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const moodLabels = ["", "Very Low", "Low", "Neutral", "Good", "Excellent"]

    return (
      <ChartTooltipContent>
        <div className="space-y-1">
          <ChartTooltipItem label="Date" value={data.date} />
          <ChartTooltipItem label="Mood" value={moodLabels[data.mood]} />
          <ChartTooltipItem label="Journal" value={data.journal} />
        </div>
      </ChartTooltipContent>
    )
  }
  return null
}

export function MoodChart() {
  return (
    <ChartContainer className="h-[200px] w-full">
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} stroke="#888888" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              stroke="#888888"
              tickFormatter={(value) => {
                const labels = ["", "Very Low", "Low", "Neutral", "Good", "Excellent"]
                return labels[value] || ""
              }}
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#8884d8"
              fill="url(#colorMood)"
              strokeWidth={2}
              activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2, fill: "white" }}
            />
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}

