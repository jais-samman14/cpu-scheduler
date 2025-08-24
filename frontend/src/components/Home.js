import React from "react";
import { Link } from "react-router";

export default function Home() {
  const algorithms = [
    { 
      to: "/sjf", 
      label: "SJF", 
      fullName: "Shortest Job First",
      description: "Non-preemptive scheduling based on shortest burst time",
      color: "from-blue-500 to-blue-600",
      icon: "⏱️"
    },
    { 
      to: "/srtf", 
      label: "SRTF", 
      fullName: "Shortest Remaining Time First",
      description: "Preemptive version of SJF with better responsiveness",
      color: "from-green-500 to-green-600",
      icon: "⚡"
    },
    { 
      to: "/fcfs", 
      label: "FCFS", 
      fullName: "First Come First Serve",
      description: "Simple non-preemptive FIFO scheduling",
      color: "from-gray-500 to-gray-600",
      icon: "📋"
    },
    { 
      to: "/ljf", 
      label: "LJF", 
      fullName: "Longest Job First",
      description: "Non-preemptive scheduling based on longest burst time",
      color: "from-red-500 to-red-600",
      icon: "🐌"
    },
    { 
      to: "/lrtf", 
      label: "LRTF", 
      fullName: "Longest Remaining Time First",
      description: "Preemptive version of LJF (theoretical)",
      color: "from-red-400 to-red-500",
      icon: "⚠️"
    },
    { 
      to: "/rr", 
      label: "Round Robin", 
      fullName: "Round Robin",
      description: "Time-sliced scheduling with fixed quantum",
      color: "from-purple-500 to-purple-600",
      icon: "🔄"
    },
    { 
      to: "/nppriority", 
      label: "Non-Preemptive Priority", 
      fullName: "Non-Preemptive Priority",
      description: "Priority-based without interruption",
      color: "from-orange-500 to-orange-600",
      icon: "🎯"
    },
    { 
      to: "/ppriority", 
      label: "Preemptive Priority", 
      fullName: "Preemptive Priority",
      description: "Priority-based with preemption",
      color: "from-pink-500 to-pink-600",
      icon: "🚨"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      {/* Animated Header */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-sans drop-shadow-lg">
            CPU Scheduling
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Algorithms
            </span>
          </h1>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-center mt-8">
          <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 max-w-lg mx-auto border border-gray-700/50 shadow-2xl">
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-mono text-green-300 overflow-hidden whitespace-nowrap animate-typing border-r-4 border-green-400 pr-2">
              Select a Scheduling Algorithm
            </h1>
          </div>
        </div>

        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
          Explore and visualize different CPU scheduling algorithms with interactive simulations and detailed analysis.
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
        {algorithms.map((algo) => (
          <Link
            key={algo.to}
            to={algo.to}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${algo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Card Content */}
            <div className="p-6 relative z-10">
              {/* Icon */}
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {algo.icon}
              </div>
              
              {/* Algorithm Name */}
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                {algo.label}
              </h3>
              
              {/* Full Name */}
              <p className="text-sm text-gray-600 font-medium mt-1">
                {algo.fullName}
              </p>
              
              {/* Description */}
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                {algo.description}
              </p>
              
              {/* Hover Indicator */}
              <div className="absolute bottom-4 right-4 transform translate-x-2 translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Gradient Border Bottom */}
            <div className={`h-1 bg-gradient-to-r ${algo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🚀 Interactive Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Real-time Simulation</h3>
            <p className="text-sm text-gray-600">Visualize algorithm behavior with live Gantt charts</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Performance Metrics</h3>
            <p className="text-sm text-gray-600">Detailed analysis of waiting time, turnaround time, and throughput</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Comparative Analysis</h3>
            <p className="text-sm text-gray-600">Compare different algorithms side by side</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 mb-8">
        <p className="text-gray-500 text-sm">
          Built with React • Tailwind CSS • Modern Web Technologies
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Interactive CPU Scheduling Algorithm Visualizer
        </p>
      </footer>

      {/* Background Decorations */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-10 blur-3xl -z-10 animate-float"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl -z-10 animate-float-reverse"></div>
      <div className="fixed top-1/2 left-1/4 w-48 h-48 bg-green-200 rounded-full opacity-5 blur-2xl -z-10 animate-pulse"></div>
    </div>
  );
}