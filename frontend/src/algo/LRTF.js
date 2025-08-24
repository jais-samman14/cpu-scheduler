import React, { useState } from "react";

export default function LRTF() {
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

  const calculateLRTF = () => {
    const processesCopy = processes.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completionTime: 0,
      waitingTime: 0,
      responseTime: -1,
      started: false,
      firstTime: -1
    }));

    let currentTime = 0;
    let completed = 0;
    const n = processesCopy.length;
    const gantt = [];
    let currentProcess = null;
    let lastProcessTime = 0;
    let contextSwitches = 0;

    while (completed < n) {
      // Find process with longest remaining time that has arrived
      let longestIndex = -1;
      let longestTime = -1;

      for (let i = 0; i < n; i++) {
        if (
          processesCopy[i].arrivalTime <= currentTime &&
          processesCopy[i].remainingTime > 0 &&
          processesCopy[i].remainingTime > longestTime
        ) {
          longestTime = processesCopy[i].remainingTime;
          longestIndex = i;
        }
      }

      if (longestIndex === -1) {
        // No process available, move time forward
        currentTime++;
        continue;
      }

      const process = processesCopy[longestIndex];

      // Record response time if not started
      if (!process.started) {
        processesCopy[longestIndex].responseTime = currentTime - process.arrivalTime;
        processesCopy[longestIndex].started = true;
        processesCopy[longestIndex].firstTime = currentTime;
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
          contextSwitches++;
        }
        currentProcess = process.id;
        lastProcessTime = currentTime;
      }

      // Execute process for 1 unit of time
      processesCopy[longestIndex].remainingTime--;
      currentTime++;

      // Check if process completed
      if (processesCopy[longestIndex].remainingTime === 0) {
        processesCopy[longestIndex].completionTime = currentTime;
        processesCopy[longestIndex].turnaroundTime = currentTime - process.arrivalTime;
        processesCopy[longestIndex].waitingTime = processesCopy[longestIndex].turnaroundTime - process.burstTime;
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

    setResults(processesCopy);
    setGanttChart(gantt);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Theory Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Longest Remaining Time First (LRTF) Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            Longest Remaining Time First (LRTF) is the preemptive version of the Longest Job First (LJF) 
            scheduling algorithm. It is the opposite of Shortest Remaining Time First (SRTF). The processor 
            is allocated to the job with the longest remaining execution time, but it can be preempted 
            if a newer job arrives that has a longer remaining execution time.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Processes are scheduled based on their remaining execution time</li>
            <li>The process with the longest remaining time gets the CPU</li>
            <li>Preemptive - running process can be interrupted if a process with longer remaining time arrives</li>
            <li>High context switching overhead due to frequent preemption</li>
            <li>CPU is allocated to the process with maximum remaining burst time</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Characteristics:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Preemptive version of LJF scheduling</li>
            <li>Maximizes waiting time and turnaround time</li>
            <li>Leads to frequent context switching</li>
            <li>Can cause starvation of shorter processes</li>
            <li>Extremely inefficient for most practical purposes</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Useful for specific theoretical studies and comparisons</li>
            <li>Demonstrates the worst-case scenario for scheduling algorithms</li>
            <li>Helps understand the importance of choosing appropriate scheduling criteria</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Extremely poor performance in terms of average waiting time</li>
            <li>Very high context switching overhead</li>
            <li>Starvation of shorter processes is guaranteed</li>
            <li>Not suitable for any real-world system</li>
            <li>Maximizes response time for interactive processes</li>
            <li>Worst possible choice for time-sharing systems</li>
          </ul>

          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800">⚠️ Critical Warning:</h4>
            <p className="text-red-700">
              LRTF is one of the worst scheduling algorithms possible. It maximizes waiting time, 
              turnaround time, and response time while causing excessive context switching. It is 
              only implemented for educational purposes to demonstrate what NOT to do in CPU scheduling.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800">Comparison with SRTF:</h4>
            <p className="text-blue-700">
              While SRTF is optimal for minimizing waiting time, LRTF is optimal for maximizing it. 
              SRTF represents the best-case scenario for waiting time optimization, while LRTF 
              represents the absolute worst-case scenario.
            </p>
          </div>
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
              max="8"
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
              onClick={calculateLRTF}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate LRTF
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">LRTF Scheduling Results</h2>
          
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <h4 className="font-semibold text-purple-800">Average Response Time</h4>
              <p className="text-2xl font-bold text-purple-600">
                {(results.reduce((sum, p) => sum + p.responseTime, 0) / results.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-800">Context Switches</h4>
              <p className="text-2xl font-bold text-red-600">
                {ganttChart.length - 1}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      {ganttChart.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gantt Chart (Showing Frequent Context Switches)</h2>
          
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex items-center space-x-0 mb-4 overflow-x-auto">
              {ganttChart.map((block, index) => (
                <div key={index} className="flex flex-col items-center min-w-[60px]">
                  <div className="bg-blue-500 text-white px-2 py-2 rounded text-xs font-semibold w-full text-center">
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
              <p><strong>Process Execution Pattern:</strong> {ganttChart.map(b => `P${b.process}(${b.duration})`).join(" → ")}</p>
              <p><strong>Efficiency Warning:</strong> Excessive context switching observed</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analysis */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📊 LRTF Performance Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">❌ Worst Performance Indicators</h4>
              <ul className="text-red-700 space-y-2">
                <li>• Extremely high waiting times</li>
                <li>• Maximum possible turnaround times</li>
                <li>• Excessive context switching overhead</li>
                <li>• Guaranteed starvation of short processes</li>
                <li>• Poor resource utilization</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">⚠️ Educational Value</h4>
              <ul className="text-yellow-700 space-y-2">
                <li>• Demonstrates worst-case scheduling</li>
                <li>• Shows importance of proper scheduling criteria</li>
                <li>• Highlights context switching costs</li>
                <li>• Provides contrast to efficient algorithms</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Real-world Implications */}
      <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-red-800 mb-4">🌍 Real-world Implications</h3>
        <p className="text-red-700 mb-3">
          LRTF scheduling would be catastrophic in any real operating system. It would cause:
        </p>
        <ul className="text-red-700 list-disc list-inside space-y-2 mb-4">
          <li>System responsiveness to approach zero</li>
          <li>Extreme user frustration due to long waiting times</li>
          <li>Massive overhead from constant context switching</li>
          <li>Complete starvation of interactive applications</li>
          <li>Overall system throughput to plummet</li>
        </ul>
        <p className="text-red-700 font-semibold">
          This algorithm serves as a perfect example of what to avoid when designing scheduling systems.
        </p>
      </div>
    </div>
  );
}