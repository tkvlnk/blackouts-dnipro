import {mergeFreshEventsWithCache} from "./mergeFreshEventsWithCache";
import {EventAttributes} from "ics";

jest.useFakeTimers().setSystemTime(new Date(2022, 10, 27));

it('should pass dummy test', () => {
  expect(
    mergeFreshEventsWithCache([], [])
  ).toEqual([])
})

it('should preserve existing cache and add new', () => {
  const cachedEvent: EventAttributes = {
    start: [2022, 11, 25, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  const freshEvent: EventAttributes = {
    start: [2022, 11, 30, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  expect(
    mergeFreshEventsWithCache([cachedEvent], [freshEvent])
  ).toEqual([cachedEvent, freshEvent])
})

it('should keep only cached events coming before the current time', () => {
  const cachedEventBeforeNow: EventAttributes = {
    start: [2022, 11, 25, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  const cachedEventAfterNow: EventAttributes = {
    start: [2022, 11, 29, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  const freshEvent: EventAttributes = {
    start: [2022, 11, 30, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  expect(
    mergeFreshEventsWithCache([cachedEventBeforeNow, cachedEventAfterNow], [freshEvent])
  ).toEqual([cachedEventBeforeNow, freshEvent])
})

it('should keep only fresh events events coming after the current time', () => {
  const cachedEventBeforeNow: EventAttributes = {
    start: [2022, 11, 25, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  const cachedEventAfterNow: EventAttributes = {
    start: [2022, 11, 29, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  const freshEventBeforeNow: EventAttributes = {
    start: [2022, 11, 25, 9, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  const freshEventAfterNow: EventAttributes = {
    start: [2022, 11, 30, 11, 20],
    title: 'Some name',
    duration: {
      hours: 1
    }
  };

  expect(
    mergeFreshEventsWithCache([cachedEventBeforeNow, cachedEventAfterNow], [freshEventBeforeNow, freshEventAfterNow])
  ).toEqual([cachedEventBeforeNow, freshEventAfterNow])
})
