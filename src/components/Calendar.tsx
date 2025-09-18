import styles from "./Calendar.module.css";

type CalendarProps = {
  key: number;
  month: number;
  year: number;
};

export default function Calendar({ key, month, year }: CalendarProps) {
  const daysInMonth: number = new Date(year, month, 0).getDate();
  const firstWeekDay: number = new Date(
    year + "-" + String(month).padStart(2, "0") + "-01"
  ).getDay();

  const weekdays: string[] = ["M", "T", "W", "T", "F", "S", "S"];
  const days: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={styles["calendar-container"]}>
      <div key={key} className={styles["calendar"]}>
        <div className={styles["month"]}>{months[month - 1]}</div>

        <div className={styles["weekdays"]}>
          {weekdays.map((day) => (
            <div className={styles["weekday"]} key={day}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles["day-grid"]}>
          {days.map((n, index) => (
            <div
              key={n}
              className={styles["day"]}
              style={
                index === 0
                  ? { gridColumnStart: firstWeekDay === 0 ? 7 : firstWeekDay }
                  : {}
              }
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      <div className={styles["consecutive-days-off"]}>
        <div className={styles["days-off-period"]}>
          <span>Apr 4 - Apr 6:</span>
          <span>3 days off</span>
        </div>
      </div>
    </div>
  );
}
