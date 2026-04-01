import { ScreenHeader, LineChart, BarChart, PieChart, Card } from 'even-toolkit/web'
import type { LineChartPoint, BarChartItem, PieChartItem } from 'even-toolkit/web'

/* ── Monthly revenue data (12 months) ─────────────────────────── */

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const revenueData: LineChartPoint[] = [
  { x: 0, y: 28400, label: 'Jan' },
  { x: 1, y: 31200, label: 'Feb' },
  { x: 2, y: 29800, label: 'Mar' },
  { x: 3, y: 34600, label: 'Apr' },
  { x: 4, y: 37100, label: 'May' },
  { x: 5, y: 35800, label: 'Jun' },
  { x: 6, y: 39200, label: 'Jul' },
  { x: 7, y: 41500, label: 'Aug' },
  { x: 8, y: 40100, label: 'Sep' },
  { x: 9, y: 44300, label: 'Oct' },
  { x: 10, y: 46800, label: 'Nov' },
  { x: 11, y: 48200, label: 'Dec' },
]

/* ── Weekly breakdown (7 days) ─────────────────────────────────── */

const weeklyData: BarChartItem[] = [
  { label: 'Mon', value: 8420 },
  { label: 'Tue', value: 9150 },
  { label: 'Wed', value: 8780 },
  { label: 'Thu', value: 9340 },
  { label: 'Fri', value: 7860 },
  { label: 'Sat', value: 4120 },
  { label: 'Sun', value: 3580 },
]

/* ── Traffic sources (pie/donut) ───────────────────────────────── */

const trafficSources: PieChartItem[] = [
  { label: 'Organic Search', value: 4280, color: 'var(--color-accent)' },
  { label: 'Direct', value: 2140, color: 'var(--color-positive)' },
  { label: 'Social Media', value: 1630, color: 'var(--color-text-dim)' },
  { label: 'Referral', value: 890, color: 'var(--color-border)' },
]

/* ── Component ─────────────────────────────────────────────────── */

export function ChartsScreen() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Charts" />

      {/* Revenue trend */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div className="text-[13px] tracking-[-0.13px] text-text-dim">Monthly Revenue</div>
          <div className="text-[11px] tracking-[-0.11px] text-text-dim">Jan - Dec 2025</div>
        </div>
        <Card className="p-4 overflow-hidden">
          <LineChart
            data={revenueData}
            height={220}
            showArea
            showGrid
            showLabels
            color="var(--color-accent)"
          />
        </Card>
      </div>

      {/* Weekly breakdown */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div className="text-[13px] tracking-[-0.13px] text-text-dim">Weekly Revenue</div>
          <div className="text-[11px] tracking-[-0.11px] text-text-dim">This week</div>
        </div>
        <Card className="p-4 overflow-hidden">
          <BarChart
            data={weeklyData}
            height={200}
            showLabels
            color="var(--color-accent)"
          />
        </Card>
      </div>

      {/* Traffic sources donut */}
      <div className="flex flex-col gap-3">
        <div className="text-[13px] tracking-[-0.13px] text-text-dim">Traffic Sources</div>
        <Card className="p-4 flex justify-center">
          <PieChart
            data={trafficSources}
            size={180}
            donut
            centerLabel="8,940"
          />
        </Card>
      </div>
    </div>
  )
}
