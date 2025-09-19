import type { DayInfo } from "../types";
import styles from "./CalendarGrid.module.css";
import Calendar from "./Calendar";

function generateDaysOfYear(year: number): DayInfo[] {
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

export default function CalendarGrid() {
  const months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInfo: DayInfo[] = generateDaysOfYear(2025);
  return (
    <div className={styles["calendar-grid"]}>
      {months.map((month) => {
        const daysInMonth = daysInfo.filter(
          (d) => d.date.getMonth() === month - 1
        );
        return <Calendar key={month} daysInfo={daysInMonth} />;
      })}
    </div>
  );
}
