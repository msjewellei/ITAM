"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "A bar chart";

interface ChartBarDefaultProps {
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
};

export function ChartBarDefault({
  data = defaultData,
  dataKey = "desktop",
  xKey = "month",
  title = "",
  description = "",
}: ChartBarDefaultProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <CardTitle className="w-full text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="w-full text-center">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="w-full max-w-sm mx-auto">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer width={300} height={200} data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey={dataKey} fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
