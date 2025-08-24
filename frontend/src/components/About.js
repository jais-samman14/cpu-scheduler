import React from "react";
import { Link } from "react-router";

export default function About() {
  const algorithms = [
    {
      name: "SJF (Shortest Job First)",
      description: "Non-preemptive scheduling based on shortest burst time",
      icon: "⏱️",
      color: "bg-blue-500"
    },
    {
      name: "SRTF (Shortest Remaining Time First)",
      description: "Preemptive version of SJF with better responsiveness",
      icon: "⚡",
      color: "bg-green-500"
    },
    {
      name: "FCFS (First Come First Served)",
      description: "Simple non-preemptive FIFO scheduling algorithm",
      icon: "📋",
      color: "bg-gray-500"
    },
    {
      name: "LJF (Longest Job First)",
      description: "Non-preemptive scheduling based on longest burst time",
      icon: "🐌",
      color: "bg-red-500"
    },
    {
      name: "LRTF (Longest Remaining Time First)",
      description: "Preemptive version of LJF - mainly theoretical",
      icon: "⚠️",
      color: "bg-orange-500"
    },
    {
      name: "RR (Round Robin)",
      description: "Time-sliced scheduling with fixed time quantum",
      icon: "🔄",
      color: "bg-purple-500"
    },
    {
      name: "Priority Scheduling",
      description: "Both preemptive and non-preemptive priority-based scheduling",
      icon: "🎯",
      color: "bg-pink-500"
    }
  ];

  const features = [
    {
      title: "Interactive Simulations",
      description: "Real-time visualization of algorithm behavior",
      icon: "🎮"
    },
    {
      title: "Detailed Analysis",
      description: "Comprehensive performance metrics and statistics",
      icon: "📊"
    },
    {
      title: "Educational Content",
      description: "Theoretical explanations and practical insights",
      icon: "📚"
    },
    {
      title: "Responsive Design",
      description: "Works seamlessly on all devices",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CPU Scheduling Simulator</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          An interactive educational platform designed to visualize and understand various CPU scheduling algorithms through real-time simulations and detailed analysis.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithms Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">🔄 Supported Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {algorithms.map((algo, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${algo.color}`}>
                  {algo.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{algo.name}</h3>
                  <p className="text-gray-600">{algo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">🛠️ Technology Stack</h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚛️</span>
              </div>
              <h4 className="font-semibold text-gray-800">React</h4>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold text-gray-800">Tailwind CSS</h4>
              <p className="text-sm text-gray-600">Styling Framework</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-semibold text-gray-800">React Router</h4>
              <p className="text-sm text-gray-600">Navigation</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-800">Algorithms</h4>
              <p className="text-sm text-gray-600">CPU Scheduling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">🎯 Project Purpose</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            This simulator is designed to help students, educators, and developers understand the intricacies of CPU scheduling algorithms through interactive visualizations, detailed performance metrics, and comprehensive theoretical explanations.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto text-center">
        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <span>🚀 Start Exploring Algorithms</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-1/4 right-10 w-64 h-64 bg-blue-200 rounded-full opacity-10 blur-3xl -z-10 animate-float"></div>
      <div className="fixed bottom-1/3 left-8 w-80 h-80 bg-purple-200 rounded-full opacity-10 blur-3xl -z-10 animate-float-reverse"></div>
    </div>
  );
}