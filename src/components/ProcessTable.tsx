import React from 'react';
import { Trash2 } from 'lucide-react';
import { Process } from '../types';

interface ProcessTableProps {
  processes: Process[];
  updateProcess: (id: number, field: keyof Process, value: number) => void;
  removeProcess: (id: number) => void;
}

function ProcessTable({ processes, updateProcess, removeProcess }: ProcessTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-2 text-left">Process ID</th>
            <th className="px-4 py-2 text-left">Arrival Time</th>
            <th className="px-4 py-2 text-left">Burst Time</th>
            <th className="px-4 py-2 text-left">Priority</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id} className="border-b border-gray-700">
              <td className="px-4 py-2">P{process.id}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="0"
                  value={process.arrivalTime}
                  onChange={(e) => updateProcess(process.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                  className="w-20 bg-gray-700 rounded px-2 py-1 text-white"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="1"
                  value={process.burstTime}
                  onChange={(e) => updateProcess(process.id, 'burstTime', parseInt(e.target.value) || 1)}
                  className="w-20 bg-gray-700 rounded px-2 py-1 text-white"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="1"
                  value={process.priority}
                  onChange={(e) => updateProcess(process.id, 'priority', parseInt(e.target.value) || 1)}
                  className="w-20 bg-gray-700 rounded px-2 py-1 text-white"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => removeProcess(process.id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProcessTable;