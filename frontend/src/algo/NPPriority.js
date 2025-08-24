import React, { useState } from "react";

export default function NPPriority() {
  const [processes, setProcesses] = useState([]);
  const [numProcesses, setNumProcesses] = useState("");
  const [results, setResults] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [priorityType, setPriorityType] = useState("low"); // low number = high priority

  const handleProcessInput = (e) => {
    e.preventDefault();
    const newProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        id: i + 1,
        arrivalTime: 0,
        burstTime: 0,
        priority: 1 // Default priority
      });
    }
    setProcesses(newProcesses);
  };

  const handleInputChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index][field] = parseInt(value);
    setProcesses(newProcesses);
  };

  const calculatePriority = () => {
    // Create copy and sort by priority (lower number = higher priority)
    let sortedProcesses;
    if (priorityType === "low") {
      sortedProcesses = [...processes].sort((a, b) => 
        a.arrivalTime - b.arrivalTime || a.priority - b.priority
      );
    } else {
      sortedProcesses = [...processes].sort((a, b) => 
        a.arrivalTime - b.arrivalTime || b.priority - a.priority
      );
    }
    
    let currentTime = 0;
    const results = [];
    const gantt = [];

    sortedProcesses.forEach((process) => {
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
        duration: process.burstTime,
        priority: process.priority
      });

      currentTime = completionTime;
    });

    setResults(results);
    setGanttChart(gantt);
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
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Non-Preemptive Priority Scheduling</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Theory</h2>
          <p className="text-gray-700 mb-4">
            Priority Scheduling is a non-preemptive algorithm where each process is assigned a priority. 
            The process with the highest priority is executed first. If two processes have the same priority, 
            they are executed in First-Come-First-Served (FCFS) order. Once a process starts execution, 
            it runs to completion without preemption.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Priority Systems:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Low Number High Priority:</strong> Priority 1 = Highest, Priority 5 = Lowest</li>
            <li><strong>High Number High Priority:</strong> Priority 5 = Highest, Priority 1 = Lowest</li>
            <li>Priorities can be assigned based on process type, importance, or other criteria</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">How it works:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Processes are sorted by priority (highest first)</li>
            <li>Processes with same priority are sorted by arrival time (FCFS)</li>
            <li>Highest priority process is executed to completion</li>
            <li>No preemption - running process cannot be interrupted</li>
            <li>Next highest priority process is selected after completion</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Advantages:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Important processes can be prioritized</li>
            <li>Useful for real-time systems where priority matters</li>
            <li>Simple to implement and understand</li>
            <li>No context switching overhead during execution</li>
            <li>Good for systems with clear priority hierarchies</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Disadvantages:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Starvation of low priority processes</li>
            <li>Indefinite blocking possible if high priority processes keep arriving</li>
            <li>Not suitable for time-sharing systems</li>
            <li>Priority inversion can occur</li>
            <li>Requires careful priority assignment</li>
          </ul>

          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800">⚠️ Starvation Problem:</h4>
            <p className="text-red-700">
              Low priority processes may never get CPU time if high priority processes keep arriving. 
              This is called starvation or indefinite blocking. Aging techniques are often used to 
              gradually increase priority of waiting processes to prevent starvation.
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800">🎯 Ideal Use Cases:</h4>
            <p className="text-blue-700">
              Priority scheduling is excellent for real-time systems, emergency services, military systems, 
              and any environment where certain tasks must take precedence over others. It's commonly used 
              in operating systems for system processes vs user processes.
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
              onClick={calculatePriority}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
            >
              Calculate Priority Scheduling
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Non-Preemptive Priority Scheduling Results
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Process</th>
                  <th className="px-4 py-2 text-left">Arrival Time</th>
                  <th className="px-4 py-2 text-left">Burst Time</th>
                  <th className="px-4 py-2 text-left">Priority</th>
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
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(process.priority)} text-white`}>
                        {process.priority} ({getPriorityLabel(process.priority)})
                      </span>
                    </td>
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
              <h4 className="font-semibold text-orange-800">Priority Range</h4>
              <p className="text-2xl font-bold text-orange-600">
                {Math.min(...results.map(p => p.priority))} - {Math.max(...results.map(p => p.priority))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      {ganttChart.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gantt Chart (Priority Order)</h2>
          
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex items-center space-x-1 mb-4 overflow-x-auto">
              {ganttChart.map((block, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`text-white px-4 py-2 rounded text-sm font-semibold min-w-[80px] text-center ${getPriorityColor(block.priority)}`}>
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
              <p><strong>Execution Order:</strong> {ganttChart.map(b => `P${b.process}`).join(" → ")}</p>
              <p><strong>Priority System:</strong> {priorityType === "low" ? "Low Number = High Priority" : "High Number = High Priority"}</p>
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

      {/* Starvation Analysis */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-yellow-50 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-yellow-800 mb-4">⚠️ Starvation Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">Potential Starvation Issues</h4>
              <ul className="text-red-700 space-y-2">
                <li>• Low priority processes may wait indefinitely</li>
                <li>• No mechanism to prevent starvation</li>
                <li>• High priority processes can monopolize CPU</li>
                <li>• Waiting times can be extremely unbalanced</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">Solutions to Starvation</h4>
              <ul className="text-green-700 space-y-2">
                <li>• Aging: Gradually increase priority of waiting processes</li>
                <li>• Priority ceilings: Set maximum priorities</li>
                <li>• Hybrid scheduling: Combine with other algorithms</li>
                <li>• Time slicing: Add preemption for fairness</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Current System Analysis</h4>
            <p className="text-blue-700">
              Maximum waiting time: {Math.max(...results.map(p => p.waitingTime))} units | 
              Minimum waiting time: {Math.min(...results.map(p => p.waitingTime))} units | 
              Waiting time variance: {(Math.max(...results.map(p => p.waitingTime)) - Math.min(...results.map(p => p.waitingTime)))} units
            </p>
          </div>
        </div>
      )}
    </div>
  );
}