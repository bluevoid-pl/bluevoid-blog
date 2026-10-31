<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from '@/components/ui/chart'
import { VisGroupedBar, VisLine, VisXYContainer, VisAxis } from '@unovis/vue'
import {
  ChartContainer,
  ChartTooltip,
  ChartCrosshair,
  ChartLegendContent,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'

// Chart 1: Bar chart
const barData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const barConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig

// Chart 2: Line chart
const lineData = [
  { date: new Date('2024-01-01'), desktop: 186, mobile: 80 },
  { date: new Date('2024-02-01'), desktop: 305, mobile: 200 },
  { date: new Date('2024-03-01'), desktop: 237, mobile: 120 },
  { date: new Date('2024-04-01'), desktop: 73, mobile: 190 },
  { date: new Date('2024-05-01'), desktop: 209, mobile: 130 },
  { date: new Date('2024-06-01'), desktop: 214, mobile: 140 },
]

const lineConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-3)' },
  mobile: { label: 'Mobile', color: 'var(--chart-4)' },
} satisfies ChartConfig

// Chart 3: Multi-series bar
const multiData = [
  { name: 'A', series1: 120, series2: 80, series3: 45 },
  { name: 'B', series1: 140, series2: 95, series3: 60 },
  { name: 'C', series1: 110, series2: 70, series3: 55 },
  { name: 'D', series1: 180, series2: 120, series3: 90 },
]

const multiConfig = {
  series1: { label: 'Series 1', color: 'var(--chart-1)' },
  series2: { label: 'Series 2', color: 'var(--chart-2)' },
  series3: { label: 'Series 3', color: 'var(--chart-5)' },
} satisfies ChartConfig
</script>

<template>
  <div class="space-y-6">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Bar Chart - Interactive</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="barConfig" class="min-h-[300px] w-full">
          <VisXYContainer :data="barData">
            <VisGroupedBar
              :x="(d) => d.month"
              :y="[(d) => d.desktop, (d) => d.mobile]"
              :color="[barConfig.desktop.color, barConfig.mobile.color]"
            />
            <VisAxis type="x" :x="(d) => d.month" />
            <VisAxis type="y" />
            <ChartTooltip />
            <ChartCrosshair
              :template="componentToString(barConfig, ChartTooltipContent, {
                labelFormatter: (d) => d,
              })"
            />
            <ChartLegendContent />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
    </Card>

    <Card class="w-full">
      <CardHeader>
        <CardTitle>Line Chart - Time Series</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="lineConfig" class="min-h-[300px] w-full">
          <VisXYContainer :data="lineData">
            <VisLine
              :x="(d) => d.date"
              :y="[(d) => d.desktop, (d) => d.mobile]"
              :color="[lineConfig.desktop.color, lineConfig.mobile.color]"
            />
            <VisAxis
              type="x"
              :x="(d) => d.date"
              :tick-format="(d: number) => new Date(d).toLocaleDateString('en-US', { month: 'short' })"
            />
            <VisAxis type="y" />
            <ChartTooltip />
            <ChartCrosshair
              :template="componentToString(lineConfig, ChartTooltipContent, {
                labelFormatter(d) {
                  return new Date(d).toLocaleDateString('en-US', { month: 'long' });
                },
              })"
            />
            <ChartLegendContent />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
    </Card>

    <Card class="w-full">
      <CardHeader>
        <CardTitle>Grouped Bar - Multiple Series</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="multiConfig" class="min-h-[300px] w-full">
          <VisXYContainer :data="multiData">
            <VisGroupedBar
              :x="(d) => d.name"
              :y="[(d) => d.series1, (d) => d.series2, (d) => d.series3]"
              :color="[multiConfig.series1.color, multiConfig.series2.color, multiConfig.series3.color]"
            />
            <VisAxis type="x" :x="(d) => d.name" />
            <VisAxis type="y" />
            <ChartTooltip />
            <ChartCrosshair :template="componentToString(multiConfig, ChartTooltipContent)" />
            <ChartLegendContent />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  </div>
</template>
