import React from 'react';

interface AlgorithmSelectorProps {
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
  quantum: number;
  setQuantum: (quantum: number) => void;
}

function AlgorithmSelector({ algorithm, setAlgorithm, quantum, setQuantum }: AlgorithmSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Scheduling Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full bg-gray-700 rounded px-3 py-2 text-white"
        >
          <option value="fcfs">First Come First Serve (FCFS)</option>
          <option value="sjf">Shortest Job First (Non-preemptive)</option>
          <option value="srtf">Shortest Remaining Time First (Preemptive)</option>
          <option value="priority">Priority Scheduling</option>
          <option value="rr">Round Robin</option>
        </select>
      </div>

      {algorithm === 'rr' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Time Quantum
          </label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
            className="w-full bg-gray-700 rounded px-3 py-2 text-white"
          />
        </div>
      )}
    </div>
  );
}

export default AlgorithmSelector;