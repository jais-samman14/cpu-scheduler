import React, { useState } from "react";

export default function LJF() {
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

    const calculateLJF = () => {
    let time = 0;
    const n = processes.length;
    const done = Array(n).fill(false);
    const out = [];
    const gantt = [];
    let completed = 0;

    while (completed < n) {
        // ready queue: arrived and not finished
        const available = processes
        .map((p, i) => ({ ...p, index: i }))
        .filter((p) => !done[p.index] && p.arrivalTime <= time);

        if (available.length === 0) {
        // CPU idle
        time++;
        continue;
        }

        // LJF: pick largest burst time; tie → earlier arrival; then smaller id
        available.sort((a, b) => {
        if (b.burstTime !== a.burstTime) return b.burstTime - a.burstTime;
        if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
        return a.id - b.id;
        });

        const current = available[0];
        const idx = current.index;

        const startTime = time; // since arrivalTime <= time
        const completionTime = startTime + current.burstTime;
        const turnaroundTime = completionTime - current.arrivalTime;
        const waitingTime = turnaroundTime - current.burstTime;
        const responseTime = startTime - current.arrivalTime;

        out.push({
        ...current,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime
        });

        gantt.push({
        process: current.id,
        start: startTime,
        end: completionTime,
        duration: current.burstTime
        });

        time = completionTime;
        done[idx] = true;
        completed++;
    }

    setResults(out);
    setGanttChart(gantt);
    };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Theory Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Longest Job First (LJF) Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            Longest Job First (LJF) is a non-preemptive scheduling algorithm where the process 
            with the largest burst time is selected for execution next. If two processes have the 
            same burst time, FCFS scheduling is used to break the tie. It is the opposite of 
            Shortest Job First (SJF) scheduling.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Processes are sorted by their burst time in descending order</li>
            <li>The process with the longest burst time is executed first</li>
            <li>If multiple processes have same burst time, arrival time is considered</li>
            <li>Non-preemptive - once started, process runs to completion</li>
            <li>CPU is allocated to the process with maximum burst time</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Can be useful in specific scenarios where long processes are prioritized</li>
            <li>Simple to implement and understand</li>
            <li>No preemption overhead</li>
            <li>Deterministic behavior</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Very poor performance in terms of average waiting time</li>
            <li>Can lead to starvation of shorter processes</li>
            <li>Not suitable for interactive systems</li>
            <li>May cause convoy effect where short processes wait indefinitely</li>
            <li>High turnaround time for short processes</li>
            <li>Generally not used in real-world systems due to poor efficiency</li>
          </ul>

          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800">⚠️ Important Note:</h4>
            <p className="text-red-700">
              LJF scheduling is generally avoided in practice because it maximizes waiting time 
              and can lead to starvation of shorter processes. It is mainly studied for 
              theoretical understanding and comparison with other algorithms.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800">Comparison with SJF:</h4>
            <p className="text-blue-700">
              While SJF minimizes average waiting time, LJF maximizes it. SJF is optimal for 
              minimizing waiting time, whereas LJF represents the worst-case scenario for 
              waiting time optimization.
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
              onClick={calculateLJF}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate LJF
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">LJF Scheduling Results</h2>
          
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
              <p><strong>Longest Process:</strong> P{results.reduce((max, p) => p.burstTime > max.burstTime ? p : max, results[0]).id} 
                 ({results.reduce((max, p) => p.burstTime > max.burstTime ? p : max, results[0]).burstTime} units)</p>
            </div>
          </div>
        </div>
      )}

      {/* LJF Characteristics */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">LJF Characteristics Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-800">✅ Non-Preemptive</h4>
              <p className="text-green-700">No context switching overhead during execution</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-800">❌ High Waiting Time</h4>
              <p className="text-red-700">Maximizes average waiting time compared to other algorithms</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-800">❌ Starvation Possible</h4>
              <p className="text-red-700">Short processes may wait indefinitely for long processes</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold text-blue-800">✅ Simple to Implement</h4>
              <p className="text-blue-700">Easy sorting-based implementation</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-semibold text-yellow-800">⚠️ Theoretical Use Only</h4>
              <p className="text-yellow-700">Mainly used for academic purposes, not practical systems</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-800">❌ Poor Efficiency</h4>
              <p className="text-red-700">One of the least efficient scheduling algorithms</p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Insight */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 bg-yellow-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">📚 Educational Insight</h3>
          <p className="text-yellow-700 mb-3">
            LJF scheduling demonstrates why shortest-job-first algorithms are preferred in most scenarios. 
            By examining the high waiting times in LJF, we can better appreciate the efficiency of SJF 
            and other optimized scheduling algorithms.
          </p>
          <p className="text-yellow-700">
            This algorithm serves as an important contrast to study the impact of scheduling decisions 
            on system performance and user experience.
          </p>
        </div>
      )}
    </div>
  );
}