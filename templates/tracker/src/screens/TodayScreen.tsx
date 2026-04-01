import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Card, Button, Progress, StatusProgress, TimerRing, StatGrid, ScreenHeader, useDrawerHeader } from 'even-toolkit/web'
import { IcPlus } from 'even-toolkit/web/icons/svg-icons'
import { useTracker } from '../contexts/TrackerContext'

function formatPercent(value: number, target: number): string {
  return `${Math.round((value / target) * 100)}%`
}

export function TodayScreen() {
  const navigate = useNavigate()
  const { goals, getTodayTotal } = useTracker()

  const waterTotal = getTodayTotal('Water')
  const stepsTotal = getTodayTotal('Steps')
  const focusTotal = getTodayTotal('Focus')

  // Focus timer state
  const [timerActive, setTimerActive] = useState(false)
  const [timerRemaining, setTimerRemaining] = useState(25 * 60) // 25 min default

  useEffect(() => {
    if (!timerActive || timerRemaining <= 0) return
    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive, timerRemaining])

  const toggleTimer = useCallback(() => {
    if (timerRemaining <= 0) {
      setTimerRemaining(25 * 60)
      setTimerActive(true)
    } else {
      setTimerActive((prev) => !prev)
    }
  }, [timerRemaining])

  // Routine steps
  const hour = new Date().getHours()
  const routineSteps = [
    { label: 'Morning', status: hour >= 9 ? 'complete' as const : hour >= 6 ? 'in-progress' as const : 'waiting' as const },
    { label: 'Work', status: hour >= 17 ? 'complete' as const : hour >= 9 ? 'in-progress' as const : 'waiting' as const },
    { label: 'Exercise', status: stepsTotal >= goals.steps ? 'complete' as const : hour >= 17 ? 'in-progress' as const : 'waiting' as const },
    { label: 'Evening', status: hour >= 21 ? 'complete' as const : hour >= 19 ? 'in-progress' as const : 'waiting' as const },
  ]

  useDrawerHeader({
    right: (
      <Button variant="ghost" size="icon" onClick={() => navigate('/new')}>
        <IcPlus width={20} height={20} />
      </Button>
    ),
  })

  return (
    <main className="px-3 pt-4 pb-8 space-y-3">
      <ScreenHeader
        title="Today"
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      {/* Daily Goals Progress */}
      <Card className="p-4 space-y-3">
        <p className="text-[15px] tracking-[-0.15px] text-text">Daily Goals</p>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] tracking-[-0.13px] text-text">Water</span>
              <span className="text-[13px] tracking-[-0.13px] text-text-dim">
                {waterTotal}/{goals.water} glasses
              </span>
            </div>
            <Progress value={(waterTotal / goals.water) * 100} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] tracking-[-0.13px] text-text">Steps</span>
              <span className="text-[13px] tracking-[-0.13px] text-text-dim">
                {stepsTotal.toLocaleString()}/{goals.steps.toLocaleString()}
              </span>
            </div>
            <Progress value={(stepsTotal / goals.steps) * 100} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] tracking-[-0.13px] text-text">Focus</span>
              <span className="text-[13px] tracking-[-0.13px] text-text-dim">
                {focusTotal}/{goals.focus} min
              </span>
            </div>
            <Progress value={(focusTotal / goals.focus) * 100} />
          </div>
        </div>
      </Card>

      {/* Daily Routine */}
      <Card className="p-4 space-y-3">
        <p className="text-[15px] tracking-[-0.15px] text-text">Daily Routine</p>
        <StatusProgress steps={routineSteps} />
      </Card>

      {/* Focus Timer */}
      <Card className="p-4 space-y-3">
        <p className="text-[15px] tracking-[-0.15px] text-text">Focus Timer</p>
        <div className="flex flex-col items-center gap-3">
          <TimerRing
            remaining={timerRemaining}
            total={25 * 60}
            size={140}
            strokeWidth={6}
          />
          <Button
            size="sm"
            variant={timerActive ? 'secondary' : 'default'}
            onClick={toggleTimer}
          >
            {timerRemaining <= 0 ? 'Restart' : timerActive ? 'Pause' : 'Start Focus'}
          </Button>
        </div>
      </Card>

      {/* Today's Stats */}
      <Card className="p-4 space-y-3">
        <p className="text-[15px] tracking-[-0.15px] text-text">Stats</p>
        <StatGrid
          columns={3}
          stats={[
            { label: 'Water', value: formatPercent(waterTotal, goals.water) },
            { label: 'Steps', value: formatPercent(stepsTotal, goals.steps) },
            { label: 'Focus', value: formatPercent(focusTotal, goals.focus) },
          ]}
        />
      </Card>
    </main>
  )
}
