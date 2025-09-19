import DaysOffMaximiser from "./components/DaysOffMaximiser";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles["app"]}>
      <h1>Maximise your time off</h1>
      <p>Make the most of your paid time off with smart scheduling</p>
      <DaysOffMaximiser />
      <p>
        Made with ❤️ by{" "}
        <a href="https://rabiibouhestine.com/" target="_blank">
          Rabii Bouhestine
        </a>
      </p>
    </div>
  );
}

export default App;
