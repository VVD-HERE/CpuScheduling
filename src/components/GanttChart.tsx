import React from 'react';
import { ScheduleItem } from '../types';

interface GanttChartProps {
  schedule: ScheduleItem[];
}

function GanttChart({ schedule }: GanttChartProps) {
  const totalTime = schedule[schedule.length - 1]?.endTime || 0;
  
  return (
    <div className="space-y-4">
      <div className="relative h-16 flex">
        {schedule.map((item, index) => {
          const width = ((item.endTime - item.startTime) / totalTime) * 100;
          const left = (item.startTime / totalTime) * 100;
          
          return (
            <div
              key={index}
              className="absolute h-full flex flex-col items-center justify-center border-r border-gray-700 transition-all"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: `hsl(${(item.processId * 137.5) % 360}, 70%, 50%)`
              }}
            >
              <span className="font-medium">P{item.processId}</span>
              <span className="text-xs">{item.endTime - item.startTime}</span>
            </div>
          );
        })}
      </div>
      
      <div className="relative h-6">
        <div className="absolute w-full flex justify-between text-sm">
          {Array.from({ length: totalTime + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${(i / totalTime) * 100}%` }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GanttChart;