import type { DayInfo } from "../types";
import styles from "./Calendar.module.css";

type CalendarProps = {
  daysInfo: DayInfo[];
};

export default function Calendar({ daysInfo }: CalendarProps) {
  const firstWeekDay: number = daysInfo[0].date.getDay();
  const month: string = daysInfo[0].date.toLocaleString("en-US", {
    month: "long",
  });

  const weekdays: string[] = ["M", "T", "W", "T", "F", "S", "S"];

  function getDayClass(dayInfo: DayInfo) {
    const dayClasses = [styles["day"]];
    const day = dayInfo.date.getDay();
    if (day === 0 || day === 6) {
      dayClasses.push(styles["day-weekend"]);
    }
    switch (dayInfo.type) {
      case "holiday":
        dayClasses.push(styles["day-holiday"]);
        break;
      case "pto":
        dayClasses.push(styles["day-pto"]);
        break;
      default:
        break;
    }
    if (dayInfo.isConsecutive) {
      dayClasses.push(styles["day-consecutive"]);
    }
    return dayClasses.join(" ");
  }

  function getDayColStart(index: number, firstWeekDay: number) {
    if (index != 0) return;
    if (firstWeekDay == 0) {
      return { gridColumnStart: 7 };
    } else {
      return { gridColumnStart: firstWeekDay };
    }
  }

  return (
    <div className={styles["calendar-container"]}>
      <div className={styles["calendar"]}>
        <div className={styles["month"]}>{month}</div>

        <div className={styles["weekdays"]}>
          {weekdays.map((day, index) => (
            <div className={styles["weekday"]} key={day + index}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles["day-grid"]}>
          {daysInfo.map((dayInfo, index) => (
            <div
              key={dayInfo.date.toISOString()}
              className={getDayClass(dayInfo)}
              style={getDayColStart(index, firstWeekDay)}
            >
              {dayInfo.date.getDate()}

              {(dayInfo.type === "holiday" || dayInfo.type === "pto") && (
                <div className={styles["tooltip"]}>{dayInfo.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles["holidays-names"]}>
        {daysInfo
          .filter((d) => d.type === "holiday")
          .map((holiday) => {
            const formattedDate = holiday.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={holiday.date.toISOString()}
                className={styles["holiday-name"]}
              >
                <span>{formattedDate}:</span>
                <span>{holiday.label}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
