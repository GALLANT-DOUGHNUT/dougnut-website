import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home-page/HomePage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  // const [user, setUser] = useState({});

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route
          path="/admin"
          element={user?.username ? <AdminPage /> : <Navigate to="/login" />}
          exact
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} exact /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
