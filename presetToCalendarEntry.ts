import { EventAttributes } from "ics";
import { SchedulePreset } from "./loadPreset";
import { DateTime } from "luxon";

interface TimeSlot {
  start: number;
  duration: number;
}

export function presetToCalendaEntry(
  preset: SchedulePreset
): Record<string, EventAttributes[]> {
  const weekStart = DateTime.now().setZone("Europe/Kiev").startOf("week").plus({
    week: 1,
  });

  const parsedSlots = parseTimeSlots(preset.time_zone);

  return Object.fromEntries(
    Object.entries(preset.data).map(([groupKey, groupDays]) => {
      const groupName = preset.sch_names[groupKey];

      return [
        groupName,
        Object.entries(groupDays).flatMap(([day, slots]) =>
          slots.map<EventAttributes>((slotKey) =>
            prepareEvent({
              dayIndex: parseInt(day, 10) - 1,
              groupName,
              weekStart,
              slot: parsedSlots[slotKey.toString()],
            })
          )
        ),
      ];
    })
  );
}

function parseTimeSlots(
  zones: SchedulePreset["time_zone"]
): Record<string, TimeSlot> {
  return Object.fromEntries(
    Object.entries(zones).map(([key, periodStr]) => {
      const [{ groups: startGroup }, { groups: endGroup }] = periodStr.matchAll(
        /(?<hour>\d\d):(?<minute>\d\d)/g
      );

      const startHour = Number(startGroup?.hour);
      const endHour = Number(endGroup?.hour);

      return [
        key,
        {
          start: startHour,
          duration: endHour - startHour,
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
  dayIndex: number,
  groupName: string;
  weekStart: DateTime;
  slot: TimeSlot;
}): EventAttributes {
  const day = weekStart.plus({
    days: dayIndex
  })

  return {
    title: `⚡️ ${groupName} - Планове відключення`,
    start: [day.year, day.month, day.day, slot.start],
    duration: {
      hours: slot.duration,
    },
  };
}
