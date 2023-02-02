import {EventAttributes} from "ics";

const DATE_INDEX = {
  YEAR: 0,
  MONTH: 1,
  DAY: 2,
  HOUR: 3
}

export function mergeOverlappingEvents(input: EventAttributes[]): EventAttributes[] {
  const [firstEvent, ...restEvents] = sortedEvents(input);

  const result = [structuredClone(firstEvent)];

  for (const event of restEvents.map(e => structuredClone(e))) {
    const lastEvent = result.at(-1)!;

    const isSameDay = lastEvent.start.every((value: number, index: number) => {
      if (index > DATE_INDEX.DAY) {
        return true;
      }

      return value === event.start[index]
    })

    const lastEvtStartHour = lastEvent.start[DATE_INDEX.HOUR];
    const lastEvtEndHour = (lastEvent.start[DATE_INDEX.HOUR] + getDurationHours(lastEvent));

    const evtStartHour = event.start[DATE_INDEX.HOUR];
    const evtEndHour = event.start[DATE_INDEX.HOUR] + getDurationHours(event);

    const isOverlappingHours = lastEvtEndHour >= evtStartHour;

    const isOverlapping = isSameDay && isOverlappingHours;

    if (!isOverlapping) {
      result.push(event);
      continue;
    }

    if ('duration' in lastEvent) {
      lastEvent.duration.hours = Math.max(
        Math.max(evtEndHour, lastEvtEndHour) - Math.min(evtStartHour, lastEvtStartHour),
      );
    }
  }

  return result;
}

function sortedEvents(events: EventAttributes[]): EventAttributes[] {
  return [...events].sort(({start: [leftYear, leftMonth, leftDay, leftHour]}, {start: [rightYear, rightMonth, rightDay, rightHour]}) => {
    const diffToVector = (diff: number) => diff > 0 ? 1 : -1;

    const yearDiff = leftYear - rightYear;

    if (yearDiff) {
      return diffToVector(yearDiff);
    }

    const monthDiff = leftMonth - rightMonth;

    if (monthDiff) {
      return diffToVector(monthDiff)
    }

    const dayDiff = leftDay - rightDay;

    if (dayDiff) {
      return diffToVector(dayDiff)
    }

    const hourDiff = (leftHour ?? 0) - (rightHour ?? 0)

    if (hourDiff) {
      return diffToVector(hourDiff)
    }

    return 0;
  })
}

function getDurationHours(event: EventAttributes): number {
  if (!('duration' in event)) {
    throw new Error('Event attrs must have duration');
  }

  return event.duration.hours ?? 0
}
