import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HomePage } from "./pages/home-page/HomePage"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./theme"
import "./css/embla.css"
import { importCsvData } from "./helpers/DataHelpers"

function App() {
  const { connectionsData, donutData } = importCsvData()

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                connectionsData={connectionsData}
                donutData={donutData}
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
