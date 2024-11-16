import React from 'react';
import { SchedulingResult } from '../types';

interface ResultsTableProps {
  results: SchedulingResult;
}

function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2 text-left">Process ID</th>
              <th className="px-4 py-2 text-left">Completion Time</th>
              <th className="px-4 py-2 text-left">Turnaround Time</th>
              <th className="px-4 py-2 text-left">Waiting Time</th>
            </tr>
          </thead>
          <tbody>
            {results.stats.map((stat) => (
              <tr key={stat.processId} className="border-b border-gray-700">
                <td className="px-4 py-2">P{stat.processId}</td>
                <td className="px-4 py-2">{stat.completionTime}</td>
                <td className="px-4 py-2">{stat.turnaroundTime}</td>
                <td className="px-4 py-2">{stat.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Average Waiting Time</h3>
          <p className="text-2xl font-bold">{results.averageWaitingTime.toFixed(2)} units</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Average Turnaround Time</h3>
          <p className="text-2xl font-bold">{results.averageTurnaroundTime.toFixed(2)} units</p>
        </div>
      </div>
    </div>
  );
}

export default ResultsTable;