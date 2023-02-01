import puppeteer, {Page, TimeoutError} from "puppeteer";

export interface SchedulePreset {
  days: {
    [dayId: string]: string
  }
  time_type: {
    "yes": "Світло є",
    "maybe": "Можливо відключення",
    "no": "Світла немає"
  },
  sch_names: {
    [schId: string]: string
  };
  time_zone: {
    [timeZoneId: string]: string
  };
  data: {
    [schId: string]: {
      [dayId: string]: {
        [timeZoneId: string]: keyof SchedulePreset['time_type']
      }
    }
  };
}

declare global {
  interface Window {
    DisconSchedule: {
      preset: SchedulePreset
    }
  }
}

export async function loadPreset(): Promise<SchedulePreset> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.dtek-dnem.com.ua/ua/shutdowns", {
    waitUntil: "networkidle2",
  });

  const preset = await waitFor(page, () => extractPreset(page));

  await browser.close();

  return preset;
}

function waitFor<V>(page: Page, tryGetValue: () => Promise<V | null>, {timeout = 60_000} = {}): Promise<V> {
  return new Promise<V>(async (resolve, reject) => {
    const startTs = Date.now();

    let value: V | null;

    do {
      value = await tryGetValue();
      await new Promise(res => setTimeout(res, 5000));
      console.log('>__value:::', value)
    } while (value == null && (Date.now() - startTs < timeout));

    if (value) {
      resolve(value);
    } else {
      reject(new Error(`Timeout of ${timeout} ms was exceeded`));
    }
  })
}

function extractPreset(page: Page) {
  return page.evaluate(
    () => {
      var myScript = document.createElement("script");
      myScript.innerHTML = `
    window.DisconSchedule = DisconSchedule`;
      document.body.appendChild(myScript);

      return window.DisconSchedule.preset
    }
  ).catch(() => null)
}
