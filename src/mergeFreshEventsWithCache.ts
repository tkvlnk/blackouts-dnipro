import {EventAttributes} from "ics";
import {DateTime} from "luxon";
import {UA_TIMEZONE} from "./constants";

export function mergeFreshEventsWithCache(cachedEvents: EventAttributes[], freshEvents: EventAttributes[]): EventAttributes[] {
  return [
    ...cachedEvents.filter(event => eventStartDiffInMs(event) < 0),
    ...freshEvents.filter(event => eventStartDiffInMs(event) > 0)
  ].sort((leftEvent, rightEvent) => {
    const leftMs = eventToStartDateTime(leftEvent).millisecond;
    const rightMs = eventToStartDateTime(rightEvent).millisecond;

    if (leftMs === rightMs) {
      return 0;
    }

    return leftMs > rightMs ? 1 : -1
  });
}

function eventToStartDateTime({start: [year, month, day, hour, minute]}: EventAttributes): DateTime {
  return DateTime.fromObject({
    year,
    month,
    day,
    hour,
    minute,
  }, {
    zone: UA_TIMEZONE
  })
}

function eventStartDiffInMs(event: EventAttributes) {
  const eventDateTime = eventToStartDateTime(event);

  const {milliseconds} = eventDateTime.diffNow('milliseconds');

  return milliseconds;
}
