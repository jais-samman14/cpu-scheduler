import React, { useState } from "react";

export default function PPriority() {
  const [processes, setProcesses] = useState([]);
  const [numProcesses, setNumProcesses] = useState("");
  const [results, setResults] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [priorityType, setPriorityType] = useState("low"); // low number = high priority
  const [contextSwitches, setContextSwitches] = useState(0);

  const handleProcessInput = (e) => {
    e.preventDefault();
    const newProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        id: i + 1,
        arrivalTime: 0,
        burstTime: 0,
        priority: 1, // Default priority
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

  const calculatePreemptivePriority = () => {
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
    let currentProcess = null;
    let lastProcessTime = 0;
    let switches = 0;

    while (completed < n) {
      // Find process with highest priority that has arrived and has remaining time
      let highestPriorityIndex = -1;
      let highestPriority = priorityType === "low" ? Infinity : -Infinity;

      for (let i = 0; i < n; i++) {
        if (
          processesCopy[i].arrivalTime <= currentTime &&
          processesCopy[i].remainingTime > 0
        ) {
          const isHigherPriority = priorityType === "low" 
            ? processesCopy[i].priority < highestPriority
            : processesCopy[i].priority > highestPriority;

          if (isHigherPriority) {
            highestPriority = processesCopy[i].priority;
            highestPriorityIndex = i;
          }
        }
      }

      if (highestPriorityIndex === -1) {
        // No process available, move time forward
        currentTime++;
        continue;
      }

      const process = processesCopy[highestPriorityIndex];

      // Record response time if not started
      if (!process.started) {
        processesCopy[highestPriorityIndex].responseTime = currentTime - process.arrivalTime;
        processesCopy[highestPriorityIndex].started = true;
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
          switches++;
        }
        currentProcess = process.id;
        lastProcessTime = currentTime;
      }

      // Execute process for 1 unit of time
      processesCopy[highestPriorityIndex].remainingTime--;
      currentTime++;

      // Check for new arrivals during this execution
      processesCopy.forEach(p => {
        if (
          p.arrivalTime === currentTime &&
          p.remainingTime > 0 &&
          ((priorityType === "low" && p.priority < highestPriority) ||
           (priorityType === "high" && p.priority > highestPriority))
        ) {
          // A higher priority process arrived, will preempt in next iteration
        }
      });

      // Check if process completed
      if (processesCopy[highestPriorityIndex].remainingTime === 0) {
        processesCopy[highestPriorityIndex].completionTime = currentTime;
        processesCopy[highestPriorityIndex].turnaroundTime = currentTime - process.arrivalTime;
        processesCopy[highestPriorityIndex].waitingTime = processesCopy[highestPriorityIndex].turnaroundTime - process.burstTime;
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
        switches++;
      }
    }

    setResults(processesCopy);
    setGanttChart(gantt);
    setContextSwitches(switches);
  };

  const getPriorityLabel = (priority) => {
    if (priorityType === "low") {
      return priority === 1 ? "Highest" : 
             priority === 2 ? "High" :
             priority === 3 ? "Medium" :
             priority === 4 ? "Low" : "Lowest";
    } else {
      return priority === 5 ? "Highest" : 
             priority === 4 ? "High" :
             priority === 3 ? "Medium" :
             priority === 2 ? "Low" : "Lowest";
    }
  };

  const getPriorityColor = (priority) => {
    if (priorityType === "low") {
      return priority === 1 ? "bg-red-500" : 
             priority === 2 ? "bg-orange-500" :
             priority === 3 ? "bg-yellow-500" :
             priority === 4 ? "bg-green-500" : "bg-blue-500";
    } else {
      return priority === 5 ? "bg-red-500" : 
             priority === 4 ? "bg-orange-500" :
             priority === 3 ? "bg-yellow-500" :
             priority === 2 ? "bg-green-500" : "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Theory Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Preemptive Priority Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            Preemptive Priority Scheduling is an advanced algorithm where each process is assigned a priority, 
            and the process with the highest priority is always executed. If a higher priority process arrives 
            while a lower priority process is running, the current process is preempted and the higher priority 
            process takes over the CPU immediately.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Characteristics:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Preemptive:</strong> Higher priority processes can interrupt running processes</li>
            <li><strong>Dynamic:</strong> Scheduling decisions are made at every time unit</li>
            <li><strong>Responsive:</strong> High priority tasks get immediate attention</li>
            <li><strong>Complex:</strong> Requires careful priority management</li>
            <li><strong>Context Switching:</strong> High overhead due to frequent preemption</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>At every time unit, the scheduler checks for the highest priority ready process</li>
            <li>If a higher priority process arrives, it preempts the current process</li>
            <li>Preempted processes are saved and resumed later</li>
            <li>Processes with equal priority are handled FCFS</li>
            <li>CPU is always allocated to the highest priority available process</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Excellent responsiveness for high priority tasks</li>
            <li>Ideal for real-time and critical systems</li>
            <li>Can handle emergency situations effectively</li>
            <li>Better than non-preemptive for time-sensitive applications</li>
            <li>More flexible than fixed time-slice algorithms</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Very high context switching overhead</li>
            <li>Severe starvation of low priority processes</li>
            <li>Complex implementation and management</li>
            <li>Priority inversion problems</li>
            <li>Unpredictable behavior for low priority tasks</li>
            <li>Can lead to system instability if not managed properly</li>
          </ul>

          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800">⚠️ Critical Considerations:</h4>
            <p className="text-red-700">
              Preemptive priority scheduling can cause severe starvation and high overhead. 
              It requires mechanisms like priority inheritance or aging to prevent system lockups. 
              Proper priority assignment is crucial to avoid priority inversion and ensure system stability.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800">🎯 Ideal Use Cases:</h4>
            <p className="text-blue-700">
              Military systems, aviation control, medical monitoring, real-time embedded systems, 
              and any environment where certain tasks must take absolute precedence over others 
              regardless of current CPU state.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input Process Details</h2>
        
        <div className="mb-6">
          <label className="text-gray-700 font-medium mr-4">Priority System:</label>
          <select
            value={priorityType}
            onChange={(e) => setPriorityType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="low">Low Number = High Priority (1=Highest)</option>
            <option value="high">High Number = High Priority (5=Highest)</option>
          </select>
          <p className="text-sm text-gray-600 mt-2">
            {priorityType === "low" 
              ? "Priority 1 = Highest, Priority 5 = Lowest"
              : "Priority 5 = Highest, Priority 1 = Lowest"}
          </p>
        </div>

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
                    <div>
                      <label className="text-gray-600 text-sm">
                        Priority ({priorityType === "low" ? "1=Highest" : "5=Highest"}):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={process.priority}
                        onChange={(e) => handleInputChange(index, 'priority', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {getPriorityLabel(process.priority)} Priority
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={calculatePreemptivePriority}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate Preemptive Priority
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Preemptive Priority Scheduling Results
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Process</th>
                  <th className="px-4 py-2 text-left">Arrival Time</th>
                  <th className="px-4 py-2 text-left">Burst Time</th>
                  <th className="px-4 py-2 text-left">Priority</th>
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
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(process.priority)} text-white`}>
                        {process.priority} ({getPriorityLabel(process.priority)})
                      </span>
                    </td>
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
                {contextSwitches}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      {ganttChart.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gantt Chart (Showing Preemptions)</h2>
          
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex items-center space-x-0 mb-4 overflow-x-auto">
              {ganttChart.map((block, index) => (
                <div key={index} className="flex flex-col items-center min-w-[50px]">
                  <div className={`text-white px-2 py-2 rounded text-xs font-semibold w-full text-center ${getPriorityColor(processes.find(p => p.id === block.process)?.priority || 3)}`}>
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
              <p><strong>Number of Context Switches:</strong> {contextSwitches}</p>
              <p><strong>Execution Pattern:</strong> {ganttChart.map(b => `P${b.process}(${b.duration})`).join(" → ")}</p>
              <p><strong>Preemptions:</strong> {ganttChart.length - results.length} times</p>
            </div>

            {/* Priority Legend */}
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-semibold text-gray-800 mb-2">Priority Legend:</h4>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(priority => (
                  <div key={priority} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${getPriorityColor(priority)}`}></div>
                    <span className="text-sm">
                      {priority} ({getPriorityLabel(priority)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analysis */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📊 Preemptive Priority Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">✅ Strengths</h4>
              <ul className="text-green-700 space-y-2">
                <li>• Immediate response to high priority tasks</li>
                <li>• Excellent for real-time critical systems</li>
                <li>• Dynamic priority handling</li>
                <li>• Better than non-preemptive for emergencies</li>
                <li>• Can handle priority changes dynamically</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">❌ Challenges</h4>
              <ul className="text-red-700 space-y-2">
                <li>• Very high context switching overhead</li>
                <li>• Severe starvation of low priority processes</li>
                <li>• Complex implementation and debugging</li>
                <li>• Priority inversion risks</li>
                <li>• Unpredictable for non-critical tasks</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-3">⚠️ Critical Observations</h4>
            <p className="text-yellow-700">
              Context switches: {contextSwitches} | 
              Maximum waiting time: {Math.max(...results.map(p => p.waitingTime))} units | 
              Waiting time variance: {(Math.max(...results.map(p => p.waitingTime)) - Math.min(...results.map(p => p.waitingTime)))} units
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              High context switching indicates frequent preemptions. Consider priority aging or hybrid scheduling for better stability.
            </p>
          </div>
        </div>
      )}

      {/* Real-world Implementation Tips */}
      <div className="max-w-4xl mx-auto mt-8 bg-blue-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4">🔧 Implementation Best Practices</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-800 mb-3">Priority Management</h4>
            <ul className="text-blue-700 space-y-2">
              <li>• Use priority aging to prevent starvation</li>
              <li>• Implement priority inheritance for shared resources</li>
              <li>• Set priority ceilings for critical sections</li>
              <li>• Use hybrid approaches with time slicing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-3">Performance Optimization</h4>
            <ul className="text-blue-700 space-y-2">
              <li>• Minimize context switching overhead</li>
              <li>• Use efficient ready queue data structures</li>
              <li>• Implement lazy scheduling when possible</li>
              <li>• Monitor and adjust priorities dynamically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}