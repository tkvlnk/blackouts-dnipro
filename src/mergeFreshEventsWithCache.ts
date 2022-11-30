import {EventAttributes} from "ics";
import {DateTime} from "luxon";
import {UA_TIMEZONE} from "./constants";

export function mergeFreshEventsWithCache(cachedEvents: EventAttributes[], freshEvents: EventAttributes[]): EventAttributes[] {
  return [
    ...cachedEvents.filter(event => eventStartDiffInMs(event) < 0),
    ...freshEvents.filter(event => eventStartDiffInMs(event) > 0)
  ];
}

function eventStartDiffInMs({start: [year, month, day, hour, minute]}: EventAttributes) {
  const eventDateTime = DateTime.fromObject({
    year,
    month,
    day,
    hour,
    minute,
  }, {
    zone: UA_TIMEZONE
  });

  const {milliseconds} = eventDateTime.diffNow('milliseconds');

  return milliseconds;
}
