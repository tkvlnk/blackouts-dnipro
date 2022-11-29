import puppeteer from "puppeteer";

export interface SchedulePreset {
  sch_names: Record<string, string>;
  time_zone: Record<string, string>;
  data: Record<string, Record<string, number[]>>;
}

export async function loadPreset(): Promise<SchedulePreset> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.dtek-dnem.com.ua/ua/shutdowns", {
    waitUntil: "networkidle2",
  });

  // @ts-expect-error
  const schedule = await page.evaluate(() => DisconSchedule)

  await browser.close();

  return schedule.preset;
}

