import {presetToCalendarEntry} from "./presetToCalendarEntry";

jest.useFakeTimers().setSystemTime(new Date(2022, 10, 28));

it("should pass", () => {
  expect(
    presetToCalendarEntry({
      data: {
        "1": {
          "1": [2, 5],
          "2": [3]
        },
        "2": {
          "1": [1]
        },
        "0": {
          "3": [10],
          "7": [11]
        }
      },
      sch_names: {
        "1": "Група 1",
        "2": "Група 2",
        "3": "Група 3",
        "0": "Група 0",
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
        "10": "22:30 - 23:00",
        "11": "23:45 - 01:05",
      },
    })
  ).toEqual<ReturnType<typeof presetToCalendarEntry>>({
    "1": [
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 11, 28, 0],
        duration: {hours: 4},
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 12, 5, 0],
        duration: {hours: 4},
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 11, 28, 9],
        duration: {hours: 4},
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 12, 5, 9],
        duration: {hours: 4},
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 11, 29, 3],
        duration: {hours: 4},
      },
      {
        title: "⚡️ Група 1 - Планове відключення",
        start: [2022, 12, 6, 3],
        duration: {hours: 4},
      },
    ],
    "2": [
      {
        title: "⚡️ Група 2 - Планове відключення",
        start: [2022, 11, 28, 0],
        duration: {hours: 1},
      },
      {
        title: "⚡️ Група 2 - Планове відключення",
        start: [2022, 12, 5, 0],
        duration: {hours: 1},
      },
    ],
    "0": [
      {
        title: expect.any(String),
        start: [2022, 11, 30, 22, 30],
        duration: {
          minutes: 30
        }
      },
      {
        title: expect.any(String),
        start: [2022, 12, 7, 22, 30],
        duration: {
          minutes: 30
        }
      },
      {
        title: expect.any(String),
        start: [2022, 12, 4, 23, 45],
        duration: {
          hours: 1,
          minutes: 20
        }
      },
      {
        title: expect.any(String),
        start: [2022, 12, 11, 23, 45],
        duration: {
          hours: 1,
          minutes: 20
        }
      }
    ]
  });
});
