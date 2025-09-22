import type { DayInfo, Holiday } from "./types";
import Holidays from "date-holidays";

export function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function isWeekend(date: Date): boolean {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6;
}

function updateDayInfoWithHolidays(days: DayInfo[], holidays: Holiday[]): void {
  const holidayMap = new Map<string, Holiday>();

  for (const h of holidays) {
    if (h.type === "public") {
      holidayMap.set(h.start.toISOString().split("T")[0], h);
    }
  }

  for (const day of days) {
    const holiday = holidayMap.get(day.date.toISOString().split("T")[0]);
    if (holiday) {
      day.type = "holiday";
      day.label = holiday.name;
    }
  }
}

function assignOptimisedPTO(days: DayInfo[], nbPTO: number): DayInfo[] {
  const result = [...days];

  const canAssign = (i: number): boolean =>
    result[i].type === "regular" && !isWeekend(result[i].date);

  const assignBlock = (i: number, length: number) => {
    for (let j = 0; j < length; j++) {
      result[i + j].type = "pto";
      result[i + j].label = "Suggested PTO";
    }
    nbPTO -= length;
  };

  // Try smaller blocks first (1 → 4)
  for (let block = 1; block <= 4; block++) {
    for (let i = 0; i <= result.length - block; i++) {
      if (
        nbPTO >= block && // enough PTO left
        i > 0 &&
        !canAssign(i - 1) && // left boundary
        i + block < result.length &&
        !canAssign(i + block) && // right boundary
        Array.from({ length: block }, (_, j) => canAssign(i + j)).every(Boolean)
      ) {
        assignBlock(i, block);
      }
    }
  }

  return result;
}

export function generateDaysInfo(
  year: number,
  country: string,
  region: string,
  nbPTO: number
): DayInfo[] {
  // Initialise the daysInfo array
  const days: DayInfo[] = [];
  const current = new Date(year, 0, 1);
  while (current.getFullYear() === year) {
    days.push({
      date: new Date(current),
      isConsecutive: false,
      type: "regular",
      label: "",
    });
    current.setDate(current.getDate() + 1);
  }

  // Add holidays
  const hd = new Holidays(country, region);
  const holidays = hd.getHolidays(year);
  updateDayInfoWithHolidays(days, holidays);

  // Distribute PTO optimally
  return assignOptimisedPTO(days, nbPTO);
}
