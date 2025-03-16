import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("rounded-md border", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("p-4", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltipItem = React.forwardRef<
  HTMLDivElement,
  { label: string; value: string } & React.HTMLAttributes<HTMLDivElement>
>(({ className, label, value, ...props }, ref) => {
  return (
    <div className={cn("flex items-center justify-between text-sm", className)} ref={ref} {...props}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  )
})
ChartTooltipItem.displayName = "ChartTooltipItem"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("", className)} ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem }

