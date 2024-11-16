import { Process, SchedulingResult, ScheduleItem, ProcessStats } from './types';

export function calculateFCFS(processes: Process[]): SchedulingResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const schedule: ScheduleItem[] = [];
  const stats: ProcessStats[] = [];
  let currentTime = 0;

  sortedProcesses.forEach(process => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    schedule.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime
    });

    const completionTime = currentTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    stats.push({
      processId: process.id,
      completionTime,
      turnaroundTime,
      waitingTime
    });

    currentTime = completionTime;
  });

  return calculateAverages(schedule, stats);
}

export function calculateSJF(processes: Process[], preemptive: boolean): SchedulingResult {
  const remainingProcesses = processes.map(p => ({ ...p }));
  const schedule: ScheduleItem[] = [];
  const stats: ProcessStats[] = new Array(processes.length);
  let currentTime = 0;
  let currentProcess: Process | null = null;
  let processStartTime = 0;

  while (remainingProcesses.some(p => p.remainingTime > 0)) {
    const availableProcesses = remainingProcesses.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    if (!currentProcess || (preemptive && availableProcesses.some(p => 
      p.remainingTime < currentProcess!.remainingTime
    ))) {
      if (currentProcess) {
        schedule.push({
          processId: currentProcess.id,
          startTime: processStartTime,
          endTime: currentTime
        });
      }

      currentProcess = availableProcesses.reduce((min, p) => 
        p.remainingTime < min.remainingTime ? p : min
      );
      processStartTime = currentTime;
    }

    const processIndex = remainingProcesses.findIndex(p => p.id === currentProcess!.id);
    remainingProcesses[processIndex].remainingTime--;

    if (remainingProcesses[processIndex].remainingTime === 0) {
      schedule.push({
        processId: currentProcess.id,
        startTime: processStartTime,
        endTime: currentTime + 1
      });

      const originalProcess = processes.find(p => p.id === currentProcess!.id)!;
      stats[currentProcess.id - 1] = {
        processId: currentProcess.id,
        completionTime: currentTime + 1,
        turnaroundTime: (currentTime + 1) - originalProcess.arrivalTime,
        waitingTime: (currentTime + 1) - originalProcess.arrivalTime - originalProcess.burstTime
      };

      currentProcess = null;
    }

    currentTime++;
  }

  return calculateAverages(schedule, stats);
}

export function calculatePriority(processes: Process[]): SchedulingResult {
  const remainingProcesses = processes.map(p => ({ ...p }));
  const schedule: ScheduleItem[] = [];
  const stats: ProcessStats[] = new Array(processes.length);
  let currentTime = 0;

  while (remainingProcesses.some(p => p.remainingTime > 0)) {
    const availableProcesses = remainingProcesses.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const selectedProcess = availableProcesses.reduce((highest, p) => 
      p.priority > highest.priority ? p : highest
    );

    const processIndex = remainingProcesses.findIndex(p => p.id === selectedProcess.id);
    const startTime = currentTime;
    currentTime += selectedProcess.remainingTime;
    remainingProcesses[processIndex].remainingTime = 0;

    schedule.push({
      processId: selectedProcess.id,
      startTime,
      endTime: currentTime
    });

    stats[selectedProcess.id - 1] = {
      processId: selectedProcess.id,
      completionTime: currentTime,
      turnaroundTime: currentTime - selectedProcess.arrivalTime,
      waitingTime: currentTime - selectedProcess.arrivalTime - selectedProcess.burstTime
    };
  }

  return calculateAverages(schedule, stats);
}

export function calculateRoundRobin(processes: Process[], quantum: number): SchedulingResult {
  const remainingProcesses = processes.map(p => ({ ...p }));
  const schedule: ScheduleItem[] = [];
  const stats: ProcessStats[] = new Array(processes.length);
  let currentTime = 0;

  while (remainingProcesses.some(p => p.remainingTime > 0)) {
    let processed = false;

    for (let i = 0; i < remainingProcesses.length; i++) {
      if (remainingProcesses[i].arrivalTime <= currentTime && remainingProcesses[i].remainingTime > 0) {
        const executeTime = Math.min(quantum, remainingProcesses[i].remainingTime);
        
        schedule.push({
          processId: remainingProcesses[i].id,
          startTime: currentTime,
          endTime: currentTime + executeTime
        });

        remainingProcesses[i].remainingTime -= executeTime;
        currentTime += executeTime;
        processed = true;

        if (remainingProcesses[i].remainingTime === 0) {
          stats[remainingProcesses[i].id - 1] = {
            processId: remainingProcesses[i].id,
            completionTime: currentTime,
            turnaroundTime: currentTime - remainingProcesses[i].arrivalTime,
            waitingTime: currentTime - remainingProcesses[i].arrivalTime - processes[i].burstTime
          };
        }
      }
    }

    if (!processed) currentTime++;
  }

  return calculateAverages(schedule, stats);
}

function calculateAverages(schedule: ScheduleItem[], stats: ProcessStats[]): SchedulingResult {
  const totalWaitingTime = stats.reduce((sum, stat) => sum + stat.waitingTime, 0);
  const totalTurnaroundTime = stats.reduce((sum, stat) => sum + stat.turnaroundTime, 0);
  
  return {
    schedule,
    stats,
    averageWaitingTime: totalWaitingTime / stats.length,
    averageTurnaroundTime: totalTurnaroundTime / stats.length
  };
}