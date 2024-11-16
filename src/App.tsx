import React, { useState } from 'react';
import { Clock, Play, Plus, Trash2 } from 'lucide-react';
import { Process, SchedulingResult } from './types';
import { calculateFCFS, calculateSJF, calculatePriority, calculateRoundRobin } from './algorithms';
import GanttChart from './components/GanttChart';
import ProcessTable from './components/ProcessTable';
import AlgorithmSelector from './components/AlgorithmSelector';
import ResultsTable from './components/ResultsTable';

function App() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<string>('fcfs');
  const [quantum, setQuantum] = useState<number>(2);
  const [results, setResults] = useState<SchedulingResult | null>(null);

  const addProcess = () => {
    const newProcess: Process = {
      id: processes.length + 1,
      arrivalTime: 0,
      burstTime: 1,
      priority: 1,
      remainingTime: 1,
    };
    setProcesses([...processes, newProcess]);
  };

  const removeProcess = (id: number) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const updateProcess = (id: number, field: keyof Process, value: number) => {
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, [field]: value, remainingTime: field === 'burstTime' ? value : p.remainingTime } : p
    ));
  };

  const simulate = () => {
    let result: SchedulingResult | null = null;
    const processesWithRemaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    switch (algorithm) {
      case 'fcfs':
        result = calculateFCFS(processesWithRemaining);
        break;
      case 'sjf':
        result = calculateSJF(processesWithRemaining, false);
        break;
      case 'srtf':
        result = calculateSJF(processesWithRemaining, true);
        break;
      case 'priority':
        result = calculatePriority(processesWithRemaining);
        break;
      case 'rr':
        result = calculateRoundRobin(processesWithRemaining, quantum);
        break;
    }

    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Clock className="w-10 h-10" />
            CPU Scheduling Simulator
          </h1>
          <p className="text-gray-400">
            Visualize and compare different CPU scheduling algorithms
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Process List</h2>
              <button
                onClick={addProcess}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Process
              </button>
            </div>
            
            <ProcessTable
              processes={processes}
              updateProcess={updateProcess}
              removeProcess={removeProcess}
            />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-6">Algorithm Settings</h2>
            <AlgorithmSelector
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              quantum={quantum}
              setQuantum={setQuantum}
            />
            
            <button
              onClick={simulate}
              disabled={processes.length === 0}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-md transition-colors"
            >
              <Play className="w-4 h-4" />
              Simulate
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-6">Gantt Chart</h2>
              <GanttChart schedule={results.schedule} />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-6">Results</h2>
              <ResultsTable results={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;