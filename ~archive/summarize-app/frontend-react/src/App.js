import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InputPage from "./pages/InputPage";
import SummaryPage from "./pages/SummaryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/summary/:id" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
