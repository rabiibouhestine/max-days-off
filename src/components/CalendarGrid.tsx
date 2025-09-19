import type { DayInfo } from "../types";
import { getHolidays, generateDaysInfo } from "../utils";
import styles from "./CalendarGrid.module.css";
import Calendar from "./Calendar";
import { useEffect, useState } from "react";

type CalendarGridProps = {
  country: string;
  year: number;
  nbPTO: number;
};

export default function CalendarGrid({
  country,
  year,
  nbPTO,
}: CalendarGridProps) {
  const [daysInfo, setDaysInfo] = useState<DayInfo[]>(generateDaysInfo(2025));

  useEffect(() => {
    const holidays = getHolidays(country, year);
    const newDaysInfo = generateDaysInfo(2025, holidays, nbPTO);
    setDaysInfo(newDaysInfo);
  }, [country, year, nbPTO]);

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
