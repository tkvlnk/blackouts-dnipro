import {EventAttributes, DurationObject} from "ics";
import {SchedulePreset} from "./loadPreset";
import {DateTime} from "luxon";
import {UA_TIMEZONE} from "./constants";

interface TimeSlot {
  start: {
    hours: number;
    minutes?: number;
  };
  duration: DurationObject;
}

export function presetToCalendarEntry(
  preset: SchedulePreset
): Record<string, EventAttributes[]> {
  const weekStart = DateTime.now().setZone(UA_TIMEZONE).startOf("week");

  const parsedSlots = parseTimeSlots(preset.time_zone);

  const result = {} as Record<string, EventAttributes[]>;

  for (const [groupKey, groupDays] of Object.entries(preset.data)) {
    result[preset.sch_names[groupKey]] ??= [];
    result[preset.sch_names[groupKey]].push(...Object.entries(groupDays).flatMap(([day, slots]) =>
      Object.entries(slots).flatMap<EventAttributes>(([slotKey, slotValue]) => {
          if (slotValue === 'yes') {
            return []
          }

          const eventBase = {
            dayIndex: parseInt(day, 10) - 1,
            groupName: preset.sch_names[groupKey],
            slot: parsedSlots[slotKey.toString()],
            planned: slotValue === 'no'
          };

          return [
            prepareEvent({
              ...eventBase,
              weekStart,
            }),
            prepareEvent({
              ...eventBase,
              weekStart: weekStart.plus({week: 1}),
            })
          ];
        }
      )
    ))
  }

  return result;
}

function parseTimeSlots(
  zones: SchedulePreset["time_zone"]
): Record<string, TimeSlot> {
  return Object.fromEntries(
    Object.entries(zones).map(([key, periodStr]) => {
      const [startHourRaw, endHourRaw] = periodStr.split('-');

      const startHour = parseNumber(startHourRaw);
      const endHour = parseNumber(endHourRaw);


      const startDateTime = DateTime.now().startOf('day').plus({
        hour: startHour,
        minutes: 0
      });

      const endDateTime = DateTime.now().startOf('day').plus({
        days: (startHour ?? 0) > (endHour ?? 0) ? 1 : 0,
        hour: endHour,
        minutes: 0
      })

      const {
        hours,
        minutes
      } = endDateTime.diff(startDateTime, ['hours', 'minutes']);

      return [
        key,
        {
          start: {
            hours: startHour ?? 0,
            minutes: 0,
          },
          duration: {
            hours,
            minutes,
          },
        },
      ];
    })
  );
}

function prepareEvent({
  dayIndex,
  weekStart,
  groupName,
  slot,
  planned,
}: {
  dayIndex: number;
  groupName: string;
  weekStart: DateTime;
  slot: TimeSlot;
  planned: boolean;
}): EventAttributes {
  const day = weekStart.plus({
    days: dayIndex,
  });

  const duration: DurationObject = {};

  if (slot.duration.hours) {
    duration.hours = slot.duration.hours;
  }

  if (slot.duration.minutes) {
    duration.minutes = slot.duration.minutes;
  }

  const start = [
    day.year,
    day.month,
    day.day,
    slot.start.hours,
  ] as EventAttributes["start"];

  if (slot.start.minutes) {
    start.push(slot.start.minutes);
  }

  return {
    title: `⚡️ ${groupName} - ${planned ? 'Планове' : 'Можливе'} відключення`,
    start,
    duration,
  };
}

function calcDuration(
  start: number | undefined,
  end: number | undefined,
  measure: "hours" | "minutes"
) {
  if (
    typeof start === "undefined" ||
    typeof end === "undefined" ||
    start === end
  ) {
    return undefined;
  }

  const cycle = measure === "hours" ? 23 : 60;

  const adjustedEnd = end > start ? end : end + cycle;

  return adjustedEnd - start;
}

function parseNumber(num: string | undefined) {
  if (typeof num === "undefined") {
    return undefined;
  }

  const result = Number(num);

  return Number.isNaN(result) ? undefined : result;
}
