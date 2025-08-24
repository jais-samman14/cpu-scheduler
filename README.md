# CPU Scheduler Visualizer

An interactive web-based visualization tool for understanding and comparing various CPU scheduling algorithms. This project helps students and educators to visually simulate how different algorithms schedule processes, making operating system concepts more accessible and engaging.

## Features
- **Visualize Popular Algorithms:** FCFS, SJF, LJF, LRTF, Round Robin, NP Priority, P Priority.
- **Interactive Process Input:** Add, edit, and remove processes with custom burst times, arrival times, priorities, and quantum.
- **Step-by-Step Simulation:** Play, pause, and step through the scheduling process to observe how the CPU selects processes over time.
- **Gantt Chart Visualization:** See a live Gantt chart representation of process execution.
- **Statistics:** Display average waiting time, turnaround time, and CPU utilization.
- **Responsive UI:** Works on both desktop and mobile devices.

## Project Structure
cpu-scheduler/
│
├── src/
│   ├── algo/                   # Algorithm implementations
│   │   ├── FCFS.js            # First Come First Serve
│   │   ├── SJF.js             # Shortest Job First
│   │   ├── SRTF.js            # Shortest Remaining Time First
│   │   ├── LJF.js             # Longest Job First
│   │   ├── LRTF.js            # Longest Remaining Time First
│   │   ├── RR.js              # Round Robin
│   │   ├── NPPriority.js      # Non-Preemptive Priority
│   │   └── PPriority.js       # Preemptive Priority
│   ├── components/            # React components
│   │   ├── Home.js            # Home page component
│   │   └── About.js           # About page component
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles and animations
|   └── index.html             # Main HTML template
|
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
└── .gitignore                 # Git ignore rules

## Tech Stack
This app is built using Parcel, React, Tailwind CSS, and Framer Motion.

## Development Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/jais-samman14/cpu-scheduler.git
   cd cpu-scheduler
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:1234](http://localhost:1234) to view in your browser.

## Build for Production
```bash
npm run build
```
The optimized build will be in the `dist/` directory.

## Deploy to GitHub Pages
1. Add the homepage field in `package.json`:
   ```json
   "homepage": "https://jais-samman14.github.io/cpu-scheduler"
   ```
2. Install `gh-pages` if not already:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add the following scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```
Note: For Parcel, the `dist/` directory is deployed to GitHub Pages.

## Author
Samman Jaiswal

---
Feel free to contribute or raise an issue if you find a bug or want a new feature!