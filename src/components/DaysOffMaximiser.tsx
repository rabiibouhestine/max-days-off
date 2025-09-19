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
        <div>
          <button type="button" onClick={handleDecrementNbPTO}>
            −
          </button>
          <input
            type="number"
            value={nbPTO}
            onChange={(e) => setNbPTO(Number(e.target.value))}
          />
          <button type="button" onClick={handleIncrementNbPTO}>
            +
          </button>
        </div>
        days off in
        <div>
          <button type="button" onClick={handleDecrementYear}>
            −
          </button>
          <input
            type="text"
            value={year}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) setYear(val);
            }}
            style={{ width: "4ch", textAlign: "center" }}
          />
          <button type="button" onClick={handleIncrementYear}>
            +
          </button>
        </div>
      </div>
      <p>In 🇹🇳 Tunisia, there are 12 public holidays in 2025.</p>
      <p>Let's stretch your time off from 10 days to 37 days</p>
      <CalendarGrid country={country} year={year} nbPTO={nbPTO} />
    </div>
  );
}
