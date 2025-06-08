"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
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

interface PieChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  config: ChartConfig;
  footer?: {
    trend?: string;
    note?: string;
  };
  innerRadius?: number;
}
const colors = ["#283444", "#3a4a5c", "#1f2b3a", "#425269", "#55627b"];

export function PieCharts({
  title,
  description,
  data,
  dataKey,
  nameKey,
  config,
  footer,
  innerRadius = 60,
}: PieChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col gap-2 text-sm">
          {footer.trend && (
            <div className="flex items-center gap-2 leading-none font-medium">
              {footer.trend} <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footer.note && (
            <div className="text-muted-foreground leading-none">
              {footer.note}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
