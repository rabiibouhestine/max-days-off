import type { DayInfo, Holiday } from "./types";
import Holidays from "date-holidays";

export function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
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

function isWeekend(date: Date): boolean {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6;
}

function assignOptimisedPTO(days: DayInfo[], nbPTO: number): DayInfo[] {
  const result = [...days];

  const canAssign = (i: number): boolean => {
    return (
      result[i].type === "regular" && !isWeekend(result[i].date) && nbPTO > 0
    );
  };

  // Step 1: Look for "bridge" PTO opportunities
  for (let i = 1; i < result.length - 1 && nbPTO > 0; i++) {
    if (
      result[i - 1].type === "holiday" &&
      result[i + 1].type === "holiday" &&
      canAssign(i)
    ) {
      result[i].type = "pto";
      result[i].label = "PTO";
      nbPTO--;
    }
  }

  // Step 2: Look for holiday/weekend -> PTO -> weekend patterns
  for (let i = 0; i < result.length - 1 && nbPTO > 0; i++) {
    if (
      (result[i].type === "holiday" || isWeekend(result[i].date)) &&
      canAssign(i + 1) &&
      isWeekend(result[i + 2]?.date)
    ) {
      result[i + 1].type = "pto";
      result[i + 1].label = "PTO";
      nbPTO--;
    }
  }

  // Step 3: Use leftover PTO to extend weekends (Fri or Mon)
  for (let i = 0; i < result.length && nbPTO > 0; i++) {
    const d = result[i].date.getDay();
    if (d === 5 && canAssign(i)) {
      // Friday
      result[i].type = "pto";
      result[i].label = "PTO";
      nbPTO--;
    } else if (d === 1 && canAssign(i)) {
      // Monday
      result[i].type = "pto";
      result[i].label = "PTO";
      nbPTO--;
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
  const holidays = hd.getHolidays(year, "en");
  updateDayInfoWithHolidays(days, holidays);

  // Distribute PTO optimally
  return assignOptimisedPTO(days, nbPTO);
}
