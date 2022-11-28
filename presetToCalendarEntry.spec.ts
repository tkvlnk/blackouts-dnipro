import { presetToCalendaEntry } from "./presetToCalendarEntry";

jest.useFakeTimers().setSystemTime(new Date(2022, 10, 27));

it("should pass", () => {
  expect(
    presetToCalendaEntry({
      data: {
        "1": {
          "1": [2, 5],
          "2": [3]
        },
        "2": {
          "1": [1]
        }
      },
      sch_names: {
        "1": "Група 1",
        "2": "Група 2",
        "3": "Група 3",
      },
      time_zone: {
        "1": "00:00 – 01:00",
        "2": "00:00 – 04:00",
        "3": "03:00 – 07:00",
        "4": "06:00 – 10:00",
        "5": "09:00 – 13:00",
        "6": "12:00 – 16:00",
        "7": "15:00 – 19:00",
        "8": "18:00 – 22:00",
        "9": "21:00 – 24:00",
      },
    })
  ).toEqual<ReturnType<typeof presetToCalendaEntry>>({
    "Група 1": [
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 11, 28, 0],
        duration: { hours: 4 },
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 11, 28, 9],
        duration: { hours: 4 },
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 11, 29, 3],
        duration: { hours: 4 },
      },
    ],
    "Група 2": [
      {
        title: "⚡️ Група 2 - Планове відключення",
        start: [2022, 11, 28, 0],
        duration: { hours: 1 },
      },
    ]
  });
});
