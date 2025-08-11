import { DutyType } from "./DutyType";
import { DutyWorker } from "./DutyWorker";

export interface Duty {
  id: string;
  date: string; // YYYY-MM-DD
  type: DutyType;
  dutyWorker: DutyWorker;
}
