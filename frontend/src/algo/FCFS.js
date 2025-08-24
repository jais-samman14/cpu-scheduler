import React, { useState } from "react";

export default function FCFS() {
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
        burstTime: 0
      });
    }
    setProcesses(newProcesses);
  };

  const handleInputChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index][field] = parseInt(value);
    setProcesses(newProcesses);
  };

  const calculateFCFS = () => {
    // Sort processes by arrival time (FCFS)
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    let currentTime = 0;
    const results = [];
    const gantt = [];

    sortedProcesses.forEach((process) => {
      // If no process has arrived yet, wait until arrival
      const startTime = Math.max(currentTime, process.arrivalTime);
      const completionTime = startTime + process.burstTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;
      const responseTime = startTime - process.arrivalTime;

      results.push({
        ...process,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime
      });

      gantt.push({
        process: process.id,
        start: startTime,
        end: completionTime,
        duration: process.burstTime
      });

      currentTime = completionTime;
    });

    setResults(results);
    setGanttChart(gantt);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Theory Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">First Come First Serve (FCFS) Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            First Come First Serve (FCFS) is the simplest CPU scheduling algorithm. Processes are 
            executed in the order of their arrival time. The process that arrives first is executed 
            first, followed by the next arriving process, and so on. It is a non-preemptive algorithm.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Processes are served in the order of their arrival</li>
            <li>Once a process starts execution, it runs to completion</li>
            <li>No preemption - running process cannot be interrupted</li>
            <li>Simple to implement using a FIFO (First-In-First-Out) queue</li>
            <li>CPU is allocated to the process at the head of the ready queue</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Simplest scheduling algorithm to implement</li>
            <li>Easy to understand and conceptualize</li>
            <li>No starvation - every process gets executed eventually</li>
            <li>Fair in terms of process arrival order</li>
            <li>Minimal overhead due to no context switching during execution</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Poor performance in terms of average waiting time</li>
            <li>Not suitable for time-sharing systems</li>
            <li>Convoy effect - short processes wait behind long processes</li>
            <li>Non-preemptive nature can lead to poor response times</li>
            <li>Not optimal for minimizing waiting time</li>
            <li>Throughput can be low if long processes arrive first</li>
          </ul>

          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800">Convoy Effect:</h4>
            <p className="text-yellow-700">
              In FCFS, when a long process arrives first, all subsequent short processes have to wait 
              for the long process to complete. This phenomenon is known as the "Convoy Effect" and 
              is a major drawback of FCFS scheduling.
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
              onClick={calculateFCFS}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate FCFS
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">FCFS Scheduling Results</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Process</th>
                  <th className="px-4 py-2 text-left">Arrival Time</th>
                  <th className="px-4 py-2 text-left">Burst Time</th>
                  <th className="px-4 py-2 text-left">Start Time</th>
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
                    <td className="px-4 py-2">{process.startTime}</td>
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
            <div className="bg-orange-50 p-4 rounded">
              <h4 className="font-semibold text-orange-800">Throughput</h4>
              <p className="text-2xl font-bold text-orange-600">
                {(results.length / Math.max(...results.map(p => p.completionTime))).toFixed(2)} processes/unit time
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
            <div className="flex items-center space-x-1 mb-4 overflow-x-auto">
              {ganttChart.map((block, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold min-w-[80px] text-center">
                    P{block.process}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{block.start}</div>
                </div>
              ))}
              <div className="text-xs text-gray-600 mt-1">
                {ganttChart[ganttChart.length - 1].end}
              </div>
            </div>
            
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Total Execution Time:</strong> {ganttChart[ganttChart.length - 1].end}</p>
              <p><strong>Process Execution Order:</strong> {ganttChart.map(b => `P${b.process}`).join(" → ")}</p>
              <p><strong>Number of Processes:</strong> {ganttChart.length}</p>
              <p><strong>Idle Time:</strong> {Math.max(0, results[0]?.arrivalTime || 0)} units (waiting for first process)</p>
            </div>
          </div>
        </div>
      )}

      {/* FCFS Characteristics */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">FCFS Characteristics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-800">✅ No Starvation</h4>
              <p className="text-green-700">Every process gets executed in arrival order</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-800">❌ Convoy Effect Present</h4>
              <p className="text-red-700">Short processes may wait behind long processes</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold text-blue-800">✅ Simple Implementation</h4>
              <p className="text-blue-700">Easy to implement using FIFO queue</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-semibold text-yellow-800">⚠️ Non-Preemptive</h4>
              <p className="text-yellow-700">Processes run to completion once started</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}