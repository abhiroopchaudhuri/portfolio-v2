import { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import "./App.css";
import Homepage from "./Homepage";
import FrontendProjects from "./FrontendProjects";

import Navbar from "./Navbar";


import CustomCursor from "./CustomCursor";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="App bg-black relative flex flex-col min-h-screen z-0 overflow-hidden">
        <CustomCursor />
        <div className="nav-container w-full flex flex-row justify-center items-center fixed z-50">
          <Navbar />
        </div>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/frontend-projects" element={<FrontendProjects />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
