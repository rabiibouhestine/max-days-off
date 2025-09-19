import Calendar from "./Calendar";
import styles from "./CalendarGrid.module.css";

export default function CalendarGrid() {
  const months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={styles["calendar-grid"]}>
      {months.map((month) => (
        <Calendar key={month} daysInfo={[]} />
      ))}
    </div>
  );
}
