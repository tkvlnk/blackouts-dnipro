import { presetToCalendaEntry } from "./presetToCalendarEntry";

jest.useFakeTimers().setSystemTime(new Date(2022, 10, 27));

it('should pass', () => {
  expect(presetToCalendaEntry({
    data: {},
    sch_names: {},
    time_zone: {},
    days: {}
  })).toEqual<ReturnType<typeof presetToCalendaEntry>>({
    ['Група 1']: [{
      title: '⚡️ Група 1 - Планове відключення',
      start: [2022, 11, 28, 0],
      duration: { hours: 1 },
    }]
  });
})
