import {generateCalendars} from "./generateCalendars";
import {presetToCalendarEntry} from "./presetToCalendarEntry";
import {loadPreset} from "./loadPreset";
import fs from "fs/promises";

void (async () => {
  const eventsByGroups = presetToCalendarEntry(await loadPreset());
  const fileContent = await generateCalendars(eventsByGroups);
  await fs.writeFile('docs/group-1.ics', fileContent);
})()
