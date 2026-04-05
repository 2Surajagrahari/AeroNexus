import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./components/dashboard/DashboardLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
    </Routes>
  );
}