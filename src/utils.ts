import type { DayInfo } from "./types";
import Holidays from "date-holidays";

export function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function generateDaysInfo(
  year: number,
  country: string,
  nbPTO: number
): DayInfo[] {
  const days: DayInfo[] = [];

  const types: DayInfo["type"][] = ["regular", "holiday", "pto"];

  // Start on Jan 1st
  const current = new Date(year, 0, 1);

  while (current.getFullYear() === year) {
    // Create a new object for the current day
    days.push({
      date: new Date(current), // clone
      isConsecutive: Math.random() > 0.7, // ~30% chance true
      type: types[Math.floor(Math.random() * types.length)],
      label: `Label ${Math.floor(Math.random() * 1000)}`, // arbitrary
    });

    // Increment to the next day
    current.setDate(current.getDate() + 1);
  }

  return days;
}
