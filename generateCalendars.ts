import { loadPreset } from "./loadPreset";
import { createEvents } from "ics";
import { presetToCalendaEntry } from "./presetToCalendarEntry";
import fs from "fs/promises";

async function generateCalendars() {
  const eventsByGroups = presetToCalendaEntry(await loadPreset());

  const firstGroupCalStr = createEvents(eventsByGroups["Група 1"]);

  if (firstGroupCalStr.error) {
    throw firstGroupCalStr.error;
  }

  await fs.writeFile('docs/group-1.ics', firstGroupCalStr.value ?? '');
}
