import puppeteer from "puppeteer";

export interface SchedulePreset {
  days: Record<`${number}`, string>;
  sch_names: Record<`${number}`, string>;
  time_zone: Record<`${number}`, string>;
  data: Record<`${number}`, Record<`${number}`, number[]>>;
}

export async function loadPreset(): Promise<SchedulePreset> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.dtek-dnem.com.ua/ua/shutdowns", {
    waitUntil: "networkidle2",
  });

  // @ts-expect-error
  const { preset } = await page.evaluate(() => DisconSchedule);

  await browser.close();

  return preset;
}

