import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HomePage, AdminPage, LoginPage } from "./pages";

function App() {
  const [user, setUser] = useState({});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        {/* <Route
          path="/admin"
          element={user?.username ? <AdminPage /> : <Navigate to="/login" />}
          exact
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} exact /> */}
      </Routes>
    </Router>
  );
}

export default App;
