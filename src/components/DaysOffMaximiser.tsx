import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import styles from "./DaysOffMaximiser.module.css";

const countries = ["Tunisia", "Poland"];

export default function DaysOffMaximiser() {
  const [country, setCountry] = useState<string>(countries[0] || "");
  const [nbPTO, setNbPTO] = useState<number>(20);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleIncrementNbPTO = () => setNbPTO((n) => n + 1);
  const handleDecrementNbPTO = () => setNbPTO((n) => n - 1);
  const handleIncrementYear = () => setYear((y) => y + 1);
  const handleDecrementYear = () => setYear((y) => y - 1);

  return (
    <div className={styles["maximiser-container"]}>
      <div className={styles["inputs-container"]}>
        I live in
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        and have
        <div className={styles["input-controls"]}>
          <button type="button" onClick={handleDecrementNbPTO}>
            −
          </button>
          <span className={styles["input-pto"]}>{nbPTO}</span>
          <button type="button" onClick={handleIncrementNbPTO}>
            +
          </button>
        </div>
        days off in
        <div className={styles["input-controls"]}>
          <button type="button" onClick={handleDecrementYear}>
            −
          </button>
          <span className={styles["input-year"]}>{year}</span>
          <button type="button" onClick={handleIncrementYear}>
            +
          </button>
        </div>
      </div>
      <p>In 🇹🇳 Tunisia, there are 12 public holidays in 2025.</p>
      <p>Let's stretch your time off from 10 days to 37 days</p>
      <div className={styles["legend-container"]}>
        <div className={styles["legend-item"]}>
          <span className={styles["legend-weekend"]}></span>
          Weekend
        </div>
        <div className={styles["legend-item"]}>
          <span className={styles["legend-day-off"]}></span>
          Day Off
        </div>
        <div className={styles["legend-item"]}>
          <span className={styles["legend-public-holiday"]}></span>
          Public Holiday
        </div>
      </div>
      <CalendarGrid country={country} year={year} nbPTO={nbPTO} />
    </div>
  );
}
