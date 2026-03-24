import { addWeeks, endOfWeek, format, isAfter, isBefore, startOfWeek } from 'date-fns';

export interface Period {
  from: Date;
  to: Date;
  fromStr: string;
  toStr: string;
  label: string;
}

export type PeriodMode = 'weekly' | 'sprint';

export function buildPeriods(startDate: Date, mode: PeriodMode): Period[] {
  const now = new Date();
  const periods: Period[] = [];
  const stepWeeks = mode === 'sprint' ? 2 : 1;

  let cursor = startOfWeek(startDate, { weekStartsOn: 1 });

  while (!isAfter(cursor, now)) {
    const periodEnd = endOfWeek(addWeeks(cursor, stepWeeks - 1), { weekStartsOn: 1 });
    const to = isBefore(periodEnd, now) ? periodEnd : now;

    const label =
      mode === 'sprint'
        ? `Sprint ${periods.length + 1} (${format(cursor, 'd MMM')} – ${format(to, 'd MMM')})`
        : `${format(cursor, 'd MMM')} – ${format(to, 'd MMM')}`;

    periods.push({
      from: cursor,
      to,
      label,
      fromStr: format(cursor, 'yyyy-MM-dd'),
      toStr: format(to, 'yyyy-MM-dd'),
    });

    cursor = addWeeks(cursor, stepWeeks);
  }

  return periods;
}
