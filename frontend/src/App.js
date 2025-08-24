import React from "react";
import{Routes,Route,Link, BrowserRouter} from "react-router";
import Home from "./components/Home";
import About from "./components/About";
import SJF from "./algo/SJF";
import SRTF from "./algo/SRTF";
import FCFS from "./algo/FCFS";
import LJF from "./algo/LJF";
import LRTF from "./algo/LRTF";
import RR from "./algo/RR";
import NPPriority from "./algo/NPPriority";   
import PPriority from "./algo/PPriority";   

// we can use only one BrowserRouter at the top level
export default function App(){
    return(
        <BrowserRouter>

            <nav className=" pl-15 py-2 flex gap-10 bg-gray-200 text-2xl font-semibold">
                <Link to="/" className="text-blue-500 hover:text-red-400 p-2">Home</Link>
                <Link to="/about" className="text-blue-500 hover:text-red-400 p-2">About</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home></Home>} />
                <Route path="/about" element={<About></About>} />
                <Route path="/sjf" element={<SJF></SJF>} />
                <Route path="/srtf" element={<SRTF></SRTF>} />
                <Route path="/fcfs" element={<FCFS></FCFS>} />
                <Route path="/ljf" element={<LJF></LJF>} />
                <Route path="/lrtf" element={<LRTF></LRTF>} />
                <Route path="/rr" element={<RR></RR>} />
                <Route path="/nppriority" element={<NPPriority></NPPriority>} />
                <Route path="/ppriority" element={<PPriority></PPriority>} />
            </Routes>

        </BrowserRouter>
    );
}



