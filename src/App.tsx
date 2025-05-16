import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AmocaClimateChallenge from "./pages/AmocaClimateChallenge";

const App = () => {
    return (
        <Router>
            <Sidebar />
            <Routes>
                {/* Other routes */}
                <Route path="/amoca-climate-challenge" element={<AmocaClimateChallenge />} />
            </Routes>
        </Router>
    );
};

export default App;