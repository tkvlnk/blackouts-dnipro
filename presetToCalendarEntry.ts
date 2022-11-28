import { EventAttributes } from "ics";
import { SchedulePreset } from "./loadPreset";
import { DateTime } from "luxon";

export function presetToCalendaEntry(
  preset: SchedulePreset
): Record<string, EventAttributes[]> {
  const weekStart = DateTime.now().setZone("Europe/Kiev").startOf("week").plus({
    week: 1,
  });

  const parsedSlots = {
    '1': {
      start: 0,
      duration: 1
    }
  };

  return {
    "Група 1": [
      {
        title: '⚡️ Група 1 - Планове відключення',
        start: [weekStart.year, weekStart.month, weekStart.day, parsedSlots['1'].start],
        duration: {
          hours: parsedSlots['1'].duration
        }
      },
    ],
  };
}
