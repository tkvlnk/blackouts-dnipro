import { loadPreset } from "./loadPreset";
import {createEvents, EventAttributes} from "ics";
import { presetToCalendarEntry } from "./presetToCalendarEntry";
import fs from "fs/promises";

export async function generateCalendars(eventsByGroups: Record<string, EventAttributes[]>) {
  const firstGroupCalStr = createEvents(eventsByGroups["Група 1"]);

  if (firstGroupCalStr.error) {
    throw firstGroupCalStr.error;
  }

  return firstGroupCalStr.value ?? '';
}
