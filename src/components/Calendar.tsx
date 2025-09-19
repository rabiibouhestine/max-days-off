import styles from "./Calendar.module.css";

type dayInfo = {
  date: Date;
  isConsecutive: boolean;
  type: "regular" | "holiday" | "pto";
  label: string;
};

type CalendarProps = {
  key: number;
  daysInfo: dayInfo[];
};

export default function Calendar({ key }: CalendarProps) {
  const firstWeekDay: number = daysInfo[0].date.getDay();
  const month: string = daysInfo[0].date.toLocaleString("en-US", {
    month: "long",
  });

  const weekdays: string[] = ["M", "T", "W", "T", "F", "S", "S"];

  function getDayClass(dayInfo: dayInfo) {
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
      <div key={key} className={styles["calendar"]}>
        <div className={styles["month"]}>{month}</div>

        <div className={styles["weekdays"]}>
          {weekdays.map((day) => (
            <div className={styles["weekday"]} key={day}>
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

const daysInfo: dayInfo[] = [
  {
    date: new Date("2025-10-01"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
  {
    date: new Date("2025-10-02"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
  {
    date: new Date("2025-10-03"),
    isConsecutive: false,
    type: "holiday",
    label: "",
  },
  {
    date: new Date("2025-10-04"),
    isConsecutive: false,
    type: "pto",
    label: "",
  },
  {
    date: new Date("2025-10-05"),
    isConsecutive: false,
    type: "pto",
    label: "",
  },
  {
    date: new Date("2025-10-06"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
  {
    date: new Date("2025-10-07"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
  {
    date: new Date("2025-10-08"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
  {
    date: new Date("2025-10-09"),
    isConsecutive: false,
    type: "holiday",
    label: "",
  },
  {
    date: new Date("2025-10-10"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
  {
    date: new Date("2025-10-11"),
    isConsecutive: false,
    type: "regular",
    label: "",
  },
];
