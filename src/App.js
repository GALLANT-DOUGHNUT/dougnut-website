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
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated")
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route
          path="/admin"
          element={authenticated ? <AdminPage /> : <Navigate to="/login" />}
          exact
        />
        <Route
          path="/login"
          element={<LoginPage setAuthenticated={setAuthenticated} />}
          exact
        />
      </Routes>
    </Router>
  );
}

export default App;
