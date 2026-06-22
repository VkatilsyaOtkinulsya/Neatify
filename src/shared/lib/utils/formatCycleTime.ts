export function formatCycleTime(hours: number | null): string {
  if (hours == null || isNaN(hours) || hours < 0) return '—'

  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60

  if (h === 0 && m === 0) return '—'
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}

export function formatRate(rate: number | null): string {
  if (rate == null || isNaN(rate)) return '—'
  return `${Math.round(rate)}%`
}
