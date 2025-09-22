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

/**
 * Updates an array of DayInfo objects by marking public holidays.
 *
 * @param days - Array of DayInfo objects representing each day.
 * @param holidays - Array of Holiday objects to use for marking holidays.
 */
function updateDayInfoWithHolidays(days: DayInfo[], holidays: Holiday[]): void {
  // Create a map to quickly look up holidays by their date string (YYYY-MM-DD)
  const holidayMap = new Map<string, Holiday>();

  // Iterate over the holidays array
  for (const h of holidays) {
    // Only consider public holidays
    if (h.type === "public") {
      // Convert the holiday's start date to a string in "YYYY-MM-DD" format
      // and store it in the map for quick lookup
      holidayMap.set(h.start.toISOString().split("T")[0], h);
    }
  }

  // Iterate over each day in the days array
  for (const day of days) {
    // Convert the day's date to "YYYY-MM-DD" format and check if it's in the holiday map
    const holiday = holidayMap.get(day.date.toISOString().split("T")[0]);

    // If the day matches a holiday, update its type and label
    if (holiday) {
      day.type = "holiday"; // Mark the day as a holiday
      day.label = holiday.name; // Set the day's label to the holiday's name
    }
  }
}

/**
 * Suggests PTO (Paid Time Off) days within a given period to optimize long weekends
 * and fill gaps between holidays and weekends.
 *
 * @param days - Array of DayInfo objects representing each day.
 * @param nbPTO - Number of PTO days available to assign.
 * @returns A new array of DayInfo objects with suggested PTO assigned.
 */
function assignOptimisedPTO(days: DayInfo[], nbPTO: number): DayInfo[] {
  // Make a shallow copy of the days array to avoid mutating the original
  const result = [...days];

  // Weekdays are Monday (1) through Friday (5)
  const weekdays = [1, 2, 3, 4, 5];

  /**
   * Helper function to determine if a day is eligible for PTO:
   * Must be a regular workday and not a weekend.
   */
  const canAssign = (i: number): boolean =>
    result[i].type === "regular" && !isWeekend(result[i].date);

  /**
   * Helper function to assign a block of consecutive PTO days.
   * @param i - starting index
   * @param length - number of days to assign
   */
  const assignBlock = (i: number, length: number) => {
    for (let j = 0; j < length; j++) {
      result[i + j].type = "pto";
      result[i + j].label = "Suggested PTO";
    }
    nbPTO -= length; // reduce the available PTO count
  };

  // -----------------------------
  // Step 1: Fill gaps between holidays and weekends
  // Try blocks of size 1 to 4 days to fill small gaps
  // -----------------------------
  for (let block = 1; block <= 4; block++) {
    for (let i = 0; i <= result.length - block; i++) {
      if (
        nbPTO >= block && // enough PTO left
        i > 0 &&
        !canAssign(i - 1) && // left boundary must be non-assignable
        i + block < result.length &&
        !canAssign(i + block) && // right boundary must be non-assignable
        Array.from({ length: block }, (_, j) => canAssign(i + j)).every(Boolean) // all days in block are assignable
      ) {
        assignBlock(i, block);
      }
    }
  }

  // -----------------------------
  // Step 2: Distribute remaining PTO by extending existing vacations
  // -----------------------------
  while (nbPTO > 0) {
    let assigned = false;

    for (const dayOfWeek of weekdays) {
      // Start index for Monday is offset to avoid first days; others start from 1
      for (
        let i = dayOfWeek === 1 ? 3 : 1;
        i < result.length && nbPTO > 0;
        i++
      ) {
        if (
          result[i].date.getDay() === dayOfWeek && // match weekday
          !canAssign(i - (dayOfWeek === 1 ? 3 : 1)) && // previous day not assignable
          canAssign(i) // current day assignable
        ) {
          result[i].type = "pto";
          result[i].label = "Suggested PTO";
          nbPTO--;
          assigned = true;
        }
      }
    }

    if (!assigned) break; // stop if no PTO was assigned in this round
  }

  // -----------------------------
  // Step 3: Mark consecutive PTO days
  // For styling and calculation purposes
  // -----------------------------
  for (let i = 0; i < result.length; i++) {
    if (result[i].type === "pto") {
      // Mark the PTO day itself
      result[i].isConsecutive = true;

      // Extend backward until a regular weekday is encountered
      for (let j = i - 1; j >= 0; j--) {
        if (result[j].type === "regular" && !isWeekend(result[j].date)) break;
        result[j].isConsecutive = true;
      }

      // Extend forward until a regular weekday is encountered
      for (let j = i + 1; j < result.length; j++) {
        if (result[j].type === "regular" && !isWeekend(result[j].date)) break;
        result[j].isConsecutive = true;
      }
    }
  }

  return result;
}

/**
 * Generates an array of DayInfo objects for a given year, marking holidays
 * and suggesting PTO days optimally.
 *
 * @param year - The year for which to generate days.
 * @param country - Country code (e.g., "US", "TN") for holiday calculation.
 * @param region - Optional region/state code for more specific holidays.
 * @param nbPTO - Number of PTO days available to assign.
 * @returns An array of DayInfo objects for the entire year with holidays and PTO assigned.
 */
export function generateDaysInfo(
  year: number,
  country: string,
  region: string,
  nbPTO: number
): DayInfo[] {
  // -----------------------------
  // Step 1: Initialise daysInfo array
  // -----------------------------
  const days: DayInfo[] = [];
  const current = new Date(year, 0, 1); // start at January 1st of the given year

  // Loop through each day of the year
  while (current.getFullYear() === year) {
    days.push({
      date: new Date(current), // store a copy of the current date
      isConsecutive: false, // default consecutive PTO flag
      type: "regular", // default type is regular workday
      label: "", // default label is empty
    });

    // Move to the next day
    current.setDate(current.getDate() + 1);
  }

  // -----------------------------
  // Step 2: Add holidays to the days
  // -----------------------------
  const hd = new Holidays(country, region); // initialize holiday library
  const holidays = hd.getHolidays(year); // get holidays for the year
  updateDayInfoWithHolidays(days, holidays); // mark holidays in the days array

  // -----------------------------
  // Step 3: Assign PTO days optimally
  // -----------------------------
  return assignOptimisedPTO(days, nbPTO); // distribute PTO to maximize long weekends
}
