import React, { useState } from "react";

export default function RR() {
  const [processes, setProcesses] = useState([]);
  const [numProcesses, setNumProcesses] = useState("");
  const [timeQuantum, setTimeQuantum] = useState(2);
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

  const calculateRR = () => {
    const processesCopy = processes.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completionTime: 0,
      waitingTime: 0,
      responseTime: -1,
      started: false,
      turnaroundTime: 0
    }));

    let currentTime = 0;
    let completed = 0;
    const n = processesCopy.length;
    const gantt = [];
    const readyQueue = [];
    let contextSwitches = 0;

    // Initialize ready queue with processes that have arrived at time 0
    processesCopy.forEach(process => {
      if (process.arrivalTime === 0) {
        readyQueue.push(process);
      }
    });

    while (completed < n) {
      if (readyQueue.length === 0) {
        // No processes ready, move time forward
        currentTime++;
        // Check if any new processes arrived at this time
        processesCopy.forEach(process => {
          if (process.arrivalTime === currentTime && process.remainingTime > 0) {
            readyQueue.push(process);
          }
        });
        continue;
      }

      const currentProcess = readyQueue.shift();
      
      // Record response time if not started
      if (!currentProcess.started) {
        currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
        currentProcess.started = true;
      }

      // Execute for time quantum or remaining time, whichever is smaller
      const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
      
      // Add to Gantt chart
      gantt.push({
        process: currentProcess.id,
        start: currentTime,
        end: currentTime + executionTime,
        duration: executionTime
      });

      // Update current time
      currentTime += executionTime;
      currentProcess.remainingTime -= executionTime;

      // Check for new arrivals during this execution
      processesCopy.forEach(process => {
        if (
          process.arrivalTime > currentTime - executionTime &&
          process.arrivalTime <= currentTime &&
          process.remainingTime > 0 &&
          !readyQueue.includes(process) &&
          process !== currentProcess
        ) {
          readyQueue.push(process);
        }
      });

      // If process is not completed, add it back to ready queue
      if (currentProcess.remainingTime > 0) {
        readyQueue.push(currentProcess);
        contextSwitches++;
      } else {
        // Process completed
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        completed++;
      }
    }

    setResults(processesCopy);
    setGanttChart(gantt);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Theory Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Round Robin (RR) Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            Round Robin (RR) is a preemptive scheduling algorithm designed specifically for time-sharing systems. 
            Each process is assigned a fixed time unit called time quantum or time slice. The CPU scheduler goes 
            around the ready queue, allocating the CPU to each process for a time interval of up to the time quantum.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Each process gets a fixed time slice (quantum) of CPU time</li>
            <li>If process completes within time quantum, it leaves the system</li>
            <li>If process doesn't complete, it's preempted and added to end of ready queue</li>
            <li>The scheduler cycles through all processes in circular fashion</li>
            <li>New processes are added to the end of the ready queue</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Preemptive:</strong> Processes can be interrupted</li>
            <li><strong>Fair:</strong> Every process gets equal CPU time</li>
            <li><strong>Starvation-free:</strong> No process waits indefinitely</li>
            <li><strong>Time-sharing:</strong> Designed for interactive systems</li>
            <li><strong>Circular Queue:</strong> Uses FIFO with preemption</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Fair allocation of CPU time to all processes</li>
            <li>No starvation - every process gets regular CPU access</li>
            <li>Good for time-sharing and interactive systems</li>
            <li>Provides reasonable response time for short processes</li>
            <li>Easy to implement and understand</li>
            <li>Works well when process burst times vary widely</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Performance depends heavily on time quantum size</li>
            <li>Too large quantum → behaves like FCFS</li>
            <li>Too small quantum → high context switching overhead</li>
            <li>Not optimal for minimizing average waiting time</li>
            <li>Throughput decreases with smaller time quantums</li>
            <li>Higher waiting time compared to SJF for some workloads</li>
          </ul>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800">⏰ Time Quantum Importance:</h4>
            <p className="text-blue-700">
              The time quantum is crucial in RR scheduling. Typically, 80% of CPU bursts should be shorter than 
              the time quantum. A good rule of thumb is to set the time quantum slightly longer than the typical 
              interactive command but shorter than typical batch jobs.
            </p>
          </div>

          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800">🎯 Ideal Use Cases:</h4>
            <p className="text-green-700">
              Round Robin excels in interactive systems where response time is important. It's widely used in 
              operating systems for time-sharing, transaction processing, and interactive applications where 
              fairness and regular CPU access are prioritized over absolute efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input Process Details</h2>
        
        <div className="mb-6">
          <label className="text-gray-700 font-medium">Time Quantum:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-20 ml-4"
          />
          <p className="text-sm text-gray-600 mt-2">
            Recommended: 2-4 time units (smaller for more context switching, larger for less)
          </p>
        </div>

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
              onClick={calculateRR}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate Round Robin
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Round Robin Scheduling Results (Time Quantum: {timeQuantum})
          </h2>
          
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
            <div className="bg-orange-50 p-4 rounded">
              <h4 className="font-semibold text-orange-800">Context Switches</h4>
              <p className="text-2xl font-bold text-orange-600">
                {ganttChart.length - results.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      {ganttChart.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gantt Chart</h2>
          
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
              <p><strong>Number of Context Switches:</strong> {ganttChart.length - results.length}</p>
              <p><strong>Execution Pattern:</strong> {ganttChart.map(b => `P${b.process}(${b.duration})`).join(" → ")}</p>
              <p><strong>Time Quantum:</strong> {timeQuantum} units</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analysis */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📊 Round Robin Performance Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">✅ Strengths</h4>
              <ul className="text-green-700 space-y-2">
                <li>• Excellent fairness and starvation prevention</li>
                <li>• Good response time for interactive processes</li>
                <li>• Simple implementation with circular queue</li>
                <li>• Works well with mixed workload types</li>
                <li>• Predictable scheduling behavior</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">⚠️ Considerations</h4>
              <ul className="text-yellow-700 space-y-2">
                <li>• Time quantum selection is critical</li>
                <li>• Context switching overhead can be significant</li>
                <li>• Not optimal for batch processing</li>
                <li>• Waiting time can be higher than SJF</li>
                <li>• Throughput depends on quantum size</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">🎯 Time Quantum Analysis</h4>
            <p className="text-blue-700">
              Current quantum: {timeQuantum} units | 
              Average burst time: {(results.reduce((sum, p) => sum + p.burstTime, 0) / results.length).toFixed(1)} units | 
              Context switches: {ganttChart.length - results.length}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {timeQuantum <= 2 ? "Small quantum: High responsiveness but more context switching" :
               timeQuantum <= 4 ? "Medium quantum: Good balance between responsiveness and overhead" :
               "Large quantum: Less context switching but may behave like FCFS"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}