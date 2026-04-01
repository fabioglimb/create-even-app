import { ScreenHeader, StatGrid, StatCard, Timeline, Card } from 'even-toolkit/web'
import type { TimelineEvent } from 'even-toolkit/web'

/* ── Stat grid data ────────────────────────────────────────────── */

const kpiStats = [
  { label: 'Revenue', value: '$48.2K', detail: '+12.4% MoM' },
  { label: 'Users', value: '2,847', detail: '+340 this week' },
  { label: 'Growth', value: '18.3%', detail: 'vs 14.1% prior' },
]

/* ── Stat cards with sparklines ────────────────────────────────── */

const revenueSparkline = [32, 35, 33, 38, 42, 40, 44, 47, 45, 50, 48, 52]
const usersSparkline = [180, 210, 195, 240, 260, 255, 290, 310, 305, 340, 350, 380]
const conversionSparkline = [3.2, 3.4, 3.1, 3.6, 3.8, 3.5, 3.9, 4.1, 3.8, 4.2, 4.0, 4.3]

/* ── Timeline events ───────────────────────────────────────────── */

const recentActivity: TimelineEvent[] = [
  {
    id: '1',
    title: 'Revenue milestone reached',
    subtitle: 'Monthly recurring revenue crossed $48K',
    timestamp: '2m ago',
    color: 'var(--color-positive)',
  },
  {
    id: '2',
    title: 'New user cohort onboarded',
    subtitle: '124 users joined from campaign #47',
    timestamp: '18m ago',
    color: 'var(--color-accent)',
  },
  {
    id: '3',
    title: 'Conversion rate improved',
    subtitle: 'A/B test variant B outperformed by 0.8pp',
    timestamp: '1h ago',
    color: 'var(--color-positive)',
  },
  {
    id: '4',
    title: 'API latency spike detected',
    subtitle: 'P95 latency exceeded 400ms for 12 minutes',
    timestamp: '3h ago',
    color: 'var(--color-negative)',
  },
  {
    id: '5',
    title: 'Weekly report generated',
    subtitle: 'Sent to 14 stakeholders via email',
    timestamp: '6h ago',
  },
]

/* ── Component ─────────────────────────────────────────────────── */

export function OverviewScreen() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Overview" />

      {/* KPI summary row */}
      <StatGrid stats={kpiStats} columns={3} />

      {/* Trend cards */}
      <div className="flex flex-col gap-3">
        <div className="text-[13px] tracking-[-0.13px] text-text-dim">Trends</div>
        <StatCard
          label="Monthly Revenue"
          value="$48.2K"
          change="+12.4%"
          trend="up"
          sparklineData={revenueSparkline}
        />
        <StatCard
          label="Active Users"
          value="2,847"
          change="+340"
          trend="up"
          sparklineData={usersSparkline}
        />
        <StatCard
          label="Conversion Rate"
          value="4.3%"
          change="+0.3pp"
          trend="up"
          sparklineData={conversionSparkline}
        />
      </div>

      {/* Recent activity */}
      <div className="flex flex-col gap-3">
        <div className="text-[13px] tracking-[-0.13px] text-text-dim">Recent Activity</div>
        <Card className="p-4">
          <Timeline events={recentActivity} />
        </Card>
      </div>
    </div>
  )
}
