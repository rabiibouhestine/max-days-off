import CalendarGrid from "./components/CalendarGrid";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles["app"]}>
      <CalendarGrid country="Tunisia" year={2025} nbPTO={24} />
    </div>
  );
}

export default App;
