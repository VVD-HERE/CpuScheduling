export interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
}

export interface ScheduleItem {
  processId: number;
  startTime: number;
  endTime: number;
}

export interface ProcessStats {
  processId: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

export interface SchedulingResult {
  schedule: ScheduleItem[];
  stats: ProcessStats[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}