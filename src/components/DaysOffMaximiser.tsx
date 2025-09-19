import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import styles from "./DaysOffMaximiser.module.css";

const countries = ["Tunisia", "Poland"];

export default function DaysOffMaximiser() {
  const [country, setCountry] = useState<string>(countries[0] || "");
  const [nbPTO, setNbPTO] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleIncrementYear = () => setYear((y) => y + 1);
  const handleDecrementYear = () => setYear((y) => y - 1);

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {/* Country select */}
        <div>
          <label>
            Country:{" "}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Numeric input */}
        <div>
          <label>
            Number:{" "}
            <input
              type="number"
              value={nbPTO}
              onChange={(e) => setNbPTO(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Year input with buttons */}
        <div>
          <label>
            Year:{" "}
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
          </label>
        </div>
      </div>
      <CalendarGrid country={country} year={year} nbPTO={nbPTO} />
    </div>
  );
}
