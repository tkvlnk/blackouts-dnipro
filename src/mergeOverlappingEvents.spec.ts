import {mergeOverlappingEvents} from "./mergeOverlappingEvents";
import {EventAttributes} from "ics";

it('should return events unchanged', () => {
  const events: EventAttributes[] = [
    {
      start: [2023, 1, 2, 10],
      duration: {
        hours: 1,
      }
    },
    {
      start: [2023, 1, 2, 12],
      duration: {
        hours: 1,
      }
    },
    {
      start: [2023, 1, 3, 11],
      duration: {
        hours: 1,
      }
    }
  ];

  expect(
    mergeOverlappingEvents(events)
  ).toEqual(events)
});

it('should merge three consecutive events', () => {
  expect(
    mergeOverlappingEvents([
      {
        start: [2023, 1, 2, 10],
        duration: {
          hours: 1,
        }
      },
      {
        start: [2023, 1, 2, 11],
        duration: {
          hours: 1,
        }
      },
      {
        start: [2023, 1, 2, 12],
        duration: {
          hours: 1,
        }
      }
    ])
  ).toEqual([
    {
      start: [2023, 1, 2, 10],
      duration: {
        hours: 3,
      }
    },
  ])
})

it('should merge two fully overlapping', () => {
  expect(
    mergeOverlappingEvents([
      {
        start: [2023, 1, 2, 10],
        duration: {
          hours: 1,
        }
      },
      {
        start: [2023, 1, 2, 10],
        duration: {
          hours: 1,
        }
      },
    ])
  ).toEqual([
    {
      start: [2023, 1, 2, 10],
      duration: {
        hours: 1,
      }
    },
  ])
})

it('should merge two partially overlapping', () => {
  expect(
    mergeOverlappingEvents([
      {
        start: [2023, 1, 2, 10],
        duration: {
          hours: 2,
        }
      },
      {
        start: [2023, 1, 2, 11],
        duration: {
          hours: 2,
        }
      },
    ])
  ).toEqual([
    {
      start: [2023, 1, 2, 10],
      duration: {
        hours: 3,
      }
    },
  ])
})

it('should merge two on the prev positions', () => {
  expect(
    mergeOverlappingEvents([
      {
        start: [2023, 1, 2, 10],
        duration: {
          hours: 1,
        }
      },
      {
        start: [2023, 1, 2, 12],
        duration: {
          hours: 1,
        }
      },
      {
        start: [2023, 1, 2, 13],
        duration: {
          hours: 1,
        }
      }
    ])
  ).toEqual([
    {
      start: [2023, 1, 2, 10],
      duration: {
        hours: 1,
      }
    },
    {
      start: [2023, 1, 2, 12],
      duration: {
        hours: 2,
      }
    },
  ])
})

it('should merge orders which ordered wrong way', () => {
  expect(
    mergeOverlappingEvents([
      {
        start: [2023, 1, 2, 11],
        duration: {
          hours: 1,
        }
      },
      {
        start: [2023, 1, 2, 10],
        duration: {
          hours: 1,
        }
      },
    ])
  ).toEqual([
    {
      start: [2023, 1, 2, 10],
      duration: {
        hours: 2,
      }
    },
  ])
})
