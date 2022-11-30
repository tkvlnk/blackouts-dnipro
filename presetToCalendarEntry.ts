import {EventAttributes, DurationObject} from "ics";
import {SchedulePreset} from "./loadPreset";
import {DateTime} from "luxon";

interface TimeSlot {
  start: {
    hours: number;
    minutes?: number;
  };
  duration: DurationObject;
}

export function presetToCalendaEntry(
  preset: SchedulePreset
): Record<string, EventAttributes[]> {
  const weekStart = DateTime.now().setZone("Europe/Kiev").startOf("week").plus({
    week: 1,
  });

  const parsedSlots = parseTimeSlots(preset.time_zone);

  return Object.fromEntries(
    Object.entries(preset.data).map(([groupKey, groupDays]) =>
      [
        groupKey,
        Object.entries(groupDays).flatMap(([day, slots]) =>
          slots.map<EventAttributes>((slotKey) =>
            prepareEvent({
              dayIndex: parseInt(day, 10) - 1,
              groupName: preset.sch_names[groupKey],
              weekStart,
              slot: parsedSlots[slotKey.toString()],
            })
          )
        ),
      ])
  );
}

function parseTimeSlots(
  zones: SchedulePreset["time_zone"]
): Record<string, TimeSlot> {
  return Object.fromEntries(
    Object.entries(zones).map(([key, periodStr]) => {
      const [{groups: startGroup}, {groups: endGroup}] = periodStr.matchAll(
        /(?<hour>\d\d):(?<minute>\d\d)/g
      );

      const startHour = parseNumber(startGroup?.hour);
      const endHour = parseNumber(endGroup?.hour);

      const startMinute = parseNumber(startGroup?.minute);
      const endMinute = parseNumber(endGroup?.minute);

      const startDateTime = DateTime.now().startOf('day').plus({
        hour: startHour,
        minutes: startMinute
      });

      const endDateTime = DateTime.now().startOf('day').plus({
        days: (startHour ?? 0) > (endHour ?? 0) ? 1 : 0,
        hour: endHour,
        minutes: endMinute
      })

      const {hours, minutes} = endDateTime.diff(startDateTime, ['hours', 'minutes']);

      return [
        key,
        {
          start: {
            hours: startHour ?? 0,
            minutes: startMinute,
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
}: {
  dayIndex: number;
  groupName: string;
  weekStart: DateTime;
  slot: TimeSlot;
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
    title: `⚡️ ${groupName} - Планове відключення`,
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
