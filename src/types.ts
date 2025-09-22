export type DayInfo = {
  date: Date;
  isConsecutive: boolean;
  type: "regular" | "holiday" | "pto";
  label: string;
};

export type Holiday = {
  date: string;
  start: Date;
  end: Date;
  name: string;
  rule: string;
  type: string;
  substitute?: boolean;
};
