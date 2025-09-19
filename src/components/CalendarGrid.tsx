import type { DayInfo } from "../types";
import styles from "./CalendarGrid.module.css";
import Calendar from "./Calendar";

type CalendarGridProps = {
  daysInfo: DayInfo[];
};

export default function CalendarGrid({ daysInfo }: CalendarGridProps) {
  const months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
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
