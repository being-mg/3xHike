import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import StrategyCallPage from "./pages/StrategyCallPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strategy-call" element={<StrategyCallPage />} />
      </Routes>
    </Router>
  );
}
