"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartLineDefaultProps {
  data?: any[];
  dataKey?: string;
  xKey?: string;
  title?: string;
  description?: string;
}
const defaultData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineDefault({
  data = defaultData,
  dataKey = "desktop",
  xKey = "month",
  title = "Line Chart",
  description = "",
}: ChartLineDefaultProps) {
  return (
    <Card className="h-full">
      <CardHeader className="items-center text-center">
        <CardTitle className="w-full text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="w-full text-center">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="h-[100px] md:h-[120px]">
        <ChartContainer
          config={chartConfig}
          className="h-[100px] md:h-[120px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
  data={data}
  margin={{ top: 0, bottom: 0, left: 24, right: 24 }} // Increase left/right
>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tickMargin={12} // increase this if labels look cramped
                tickFormatter={(value) => value} // or remove .slice(0, 3)
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey={dataKey}
                type="natural"
                stroke="#000"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {description && (
          <div className="text-muted-foreground leading-none">
            {description}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
