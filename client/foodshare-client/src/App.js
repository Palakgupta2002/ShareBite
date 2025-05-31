import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  try {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
           element={<Dashboard/>}
          />
        </Routes>
      </Router>
    );
  } catch (error) {
    console.error("Error rendering App:", error);
    return <div>Error occurred</div>;
  }
}

export default App;