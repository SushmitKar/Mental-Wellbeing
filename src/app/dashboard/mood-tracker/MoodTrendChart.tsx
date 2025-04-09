// 'use client'

// import { Line } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from 'chart.js'

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

// interface MoodData {
//   date: string
//   moodScore: number
// }

// export default function MoodTrendChart({ data }: { data: MoodData[] }) {
//   const chartData = {
//     labels: data.map(entry => entry.date),
//     datasets: [
//       {
//         label: 'Mood Over Time',
//         data: data.map(entry => entry.moodScore),
//         fill: false,
//         borderColor: '#6366f1',
//         tension: 0.3,
//       },
//     ],
//   }

//   const options = {
//     scales: {
//       y: {
//         min: 0,
//         max: 10,
//       },
//     },
//   }

//   return <Line data={chartData} options={options} />
// }














"use client"
import { ReactNode } from "react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type MoodEntry = {
  date: string
  mood: number
  journal?: string
}

interface MoodTrendChartProps {
  data: MoodEntry[]
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }): ReactNode => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload
    const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Excellent"]

    return (
      <ChartTooltipContent>
        <div className="space-y-1">
          <ChartTooltipItem label="Date" value={entry.date} />
          <ChartTooltipItem label="Mood" value={moodLabels[entry.mood - 1] || "Unknown"} />
          {entry.journal && <ChartTooltipItem label="Journal" value={entry.journal} />}
        </div>
      </ChartTooltipContent>
    )
  }
  return null
}

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  return (
    <ChartContainer className="h-[250px] w-full">
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
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              stroke="#888888"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              stroke="#888888"
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => {
                const labels = ["Very Low", "Low", "Neutral", "Good", "Excellent"]
                return labels[value - 1] || ""
              }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#4f46e5"
              fill="url(#colorMood)"
              strokeWidth={2}
              activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2, fill: "white" }}
            />
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}