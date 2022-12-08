import {presetToCalendarEntry} from "./src/presetToCalendarEntry";
import {loadPreset} from "./src/loadPreset";
import fs from "fs/promises";
import {createEvents, EventAttributes} from "ics";
import {mergeFreshEventsWithCache} from "./src/mergeFreshEventsWithCache";

void (async () => {
  const eventsByGroups = presetToCalendarEntry(await loadPreset());

  await Promise.all(
    Object.entries(eventsByGroups).map(async ([groupKey, freshEvents]) => {
      const cachedEvents = await getCachedEvents(groupKey);
      const events = mergeFreshEventsWithCache(cachedEvents, freshEvents);
      const fileContent = enrichWithCalendarMetaInfo(await generateCalendars(events), groupKey)
      await Promise.all([
        saveCalendarFile(groupKey, fileContent),
        saveEventsCache(groupKey, events),
      ])
    })
  )
})()

export async function generateCalendars(events: EventAttributes[]) {
  const firstGroupCalStr = createEvents(events);

  if (firstGroupCalStr.error || !firstGroupCalStr.value) {
    throw firstGroupCalStr.error;
  }

  return firstGroupCalStr.value;
}

function cacheEventsFilename(groupKey: string) {
  return `cache/events-${groupKey}.json`;
}

function calendarFileName(groupKey: string) {
  return `docs/group-${groupKey}.ics`
}

async function getCachedEvents(groupKey: string): Promise<EventAttributes[]> {
  try {
    return JSON.parse(
      await fs.readFile(cacheEventsFilename(groupKey), 'utf-8')
    )
  } catch {
    return []
  }
}

async function saveEventsCache(groupKey: string, events: EventAttributes[]): Promise<void> {
  await fs.writeFile(cacheEventsFilename(groupKey), JSON.stringify(events, null, 2));
}

async function saveCalendarFile(groupKey: string, fileContent: string): Promise<void> {
  await fs.writeFile(calendarFileName(groupKey), fileContent);
}

function enrichWithCalendarMetaInfo(iCalStr: string, groupKey: string): string {
  const separator = '\r\n'

  const calendarHead = [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`
  ].join(separator)

  return iCalStr.replace(calendarHead,
    [
      calendarHead,
      `X-WR-CALNAME:Відключення Дніпро - Група ${groupKey}`,
      'X-WR-TIMEZONE;VALUE=TEXT:Europe/Kiev'
    ].join('\r\n')
  )
}
