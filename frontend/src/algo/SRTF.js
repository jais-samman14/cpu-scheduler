import React, { useState } from "react";

export default function SRTF() {
  const [processes, setProcesses] = useState([]);
  const [numProcesses, setNumProcesses] = useState("");
  const [results, setResults] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);

  const handleProcessInput = (e) => {
    e.preventDefault();
    const newProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        id: i + 1,
        arrivalTime: 0,
        burstTime: 0,
        remainingTime: 0
      });
    }
    setProcesses(newProcesses);
  };

  const handleInputChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index][field] = parseInt(value);
    if (field === 'burstTime') {
      newProcesses[index].remainingTime = parseInt(value);
    }
    setProcesses(newProcesses);
  };

  const calculateSRTF = () => {
    const processesCopy = processes.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completionTime: 0,
      waitingTime: 0,
      responseTime: -1,
      started: false
    }));

    let currentTime = 0;
    let completed = 0;
    const n = processesCopy.length;
    const gantt = [];
    let currentProcess = null;
    let lastProcessTime = 0;

    while (completed < n) {
      // Find process with shortest remaining time that has arrived
      let shortestIndex = -1;
      let shortestTime = Infinity;

      for (let i = 0; i < n; i++) {
        if (
          processesCopy[i].arrivalTime <= currentTime &&
          processesCopy[i].remainingTime > 0 &&
          processesCopy[i].remainingTime < shortestTime
        ) {
          shortestTime = processesCopy[i].remainingTime;
          shortestIndex = i;
        }
      }

      if (shortestIndex === -1) {
        // No process available, move time forward
        currentTime++;
        continue;
      }

      const process = processesCopy[shortestIndex];

      // Record response time if not started
      if (!process.started) {
        processesCopy[shortestIndex].responseTime = currentTime - process.arrivalTime;
        processesCopy[shortestIndex].started = true;
      }

      // Add to gantt chart if process changed
      if (currentProcess !== process.id) {
        if (currentProcess !== null) {
          gantt.push({
            process: currentProcess,
            start: lastProcessTime,
            end: currentTime,
            duration: currentTime - lastProcessTime
          });
        }
        currentProcess = process.id;
        lastProcessTime = currentTime;
      }

      // Execute process for 1 unit of time
      processesCopy[shortestIndex].remainingTime--;
      currentTime++;

      // Check if process completed
      if (processesCopy[shortestIndex].remainingTime === 0) {
        processesCopy[shortestIndex].completionTime = currentTime;
        processesCopy[shortestIndex].turnaroundTime = currentTime - process.arrivalTime;
        processesCopy[shortestIndex].waitingTime = processesCopy[shortestIndex].turnaroundTime - process.burstTime;
        completed++;

        // Add completed process to gantt
        gantt.push({
          process: process.id,
          start: lastProcessTime,
          end: currentTime,
          duration: currentTime - lastProcessTime
        });
        currentProcess = null;
        lastProcessTime = currentTime;
      }
    }

    // Add final gantt entry if needed
    if (currentProcess !== null) {
      gantt.push({
        process: currentProcess,
        start: lastProcessTime,
        end: currentTime,
        duration: currentTime - lastProcessTime
      });
    }

    setResults(processesCopy);
    setGanttChart(gantt);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Theory Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Shortest Remaining Time First (SRTF) Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            Shortest Remaining Time First (SRTF) is the preemptive version of the Shortest Job First (SJF) 
            scheduling algorithm. The processor is allocated to the job closest to completion, but it can 
            be preempted if a newer job arrives that has a shorter completion time.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>When a new process arrives, its burst time is compared with the remaining time of current process</li>
            <li>If new process has shorter burst time, current process is preempted</li>
            <li>The process with shortest remaining burst time is always executed next</li>
            <li>Context switching occurs when a new process arrives with shorter remaining time</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Provides minimum average waiting time for given set of processes</li>
            <li>Better response time than SJF for short processes</li>
            <li>More responsive to new short processes</li>
            <li>Optimal in terms of average waiting time</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>High context switching overhead</li>
            <li>Difficult to implement in real systems</li>
            <li>Requires accurate estimation of burst times</li>
            <li>Can lead to starvation of longer processes</li>
            <li>Complex to understand and implement</li>
          </ul>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input Process Details</h2>
        
        <form onSubmit={handleProcessInput} className="mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Number of Processes:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={numProcesses}
              onChange={(e) => setNumProcesses(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-20"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Processes
            </button>
          </div>
        </form>

        {processes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Enter Process Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processes.map((process, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded">
                  <h4 className="font-semibold text-gray-700 mb-2">Process {process.id}</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-600 text-sm">Arrival Time:</label>
                      <input
                        type="number"
                        min="0"
                        value={process.arrivalTime}
                        onChange={(e) => handleInputChange(index, 'arrivalTime', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm">Burst Time:</label>
                      <input
                        type="number"
                        min="1"
                        value={process.burstTime}
                        onChange={(e) => handleInputChange(index, 'burstTime', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={calculateSRTF}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate SRTF
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">SRTF Scheduling Results</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Process</th>
                  <th className="px-4 py-2 text-left">Arrival Time</th>
                  <th className="px-4 py-2 text-left">Burst Time</th>
                  <th className="px-4 py-2 text-left">Completion Time</th>
                  <th className="px-4 py-2 text-left">Turnaround Time</th>
                  <th className="px-4 py-2 text-left">Waiting Time</th>
                  <th className="px-4 py-2 text-left">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((process) => (
                  <tr key={process.id} className="border-b border-gray-200">
                    <td className="px-4 py-2">P{process.id}</td>
                    <td className="px-4 py-2">{process.arrivalTime}</td>
                    <td className="px-4 py-2">{process.burstTime}</td>
                    <td className="px-4 py-2">{process.completionTime}</td>
                    <td className="px-4 py-2">{process.turnaroundTime}</td>
                    <td className="px-4 py-2">{process.waitingTime}</td>
                    <td className="px-4 py-2">{process.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold text-blue-800">Average Waiting Time</h4>
              <p className="text-2xl font-bold text-blue-600">
                {(results.reduce((sum, p) => sum + p.waitingTime, 0) / results.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-800">Average Turnaround Time</h4>
              <p className="text-2xl font-bold text-green-600">
                {(results.reduce((sum, p) => sum + p.turnaroundTime, 0) / results.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h4 className="font-semibold text-purple-800">Context Switches</h4>
              <p className="text-2xl font-bold text-purple-600">
                {ganttChart.length - 1}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      {ganttChart.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gantt Chart</h2>
          
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex items-center space-x-0 mb-4 overflow-x-auto">
              {ganttChart.map((block, index) => (
                <div key={index} className="flex flex-col items-center min-w-[80px]">
                  <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm font-semibold w-full text-center">
                    P{block.process}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{block.start}</div>
                  {index === ganttChart.length - 1 && (
                    <div className="text-xs text-gray-600 mt-1">{block.end}</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Total Execution Time:</strong> {ganttChart[ganttChart.length - 1].end}</p>
              <p><strong>Number of Context Switches:</strong> {ganttChart.length - 1}</p>
              <p><strong>Process Execution Order:</strong> {ganttChart.map(b => `P${b.process}(${b.duration})`).join(" → ")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}