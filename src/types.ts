export type DayInfo = {
  date: Date;
  isConsecutive: boolean;
  type: "regular" | "holiday" | "pto";
  label: string;
};
