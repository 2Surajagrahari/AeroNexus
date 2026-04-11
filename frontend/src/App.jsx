import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

// Layout for public pages (Landing, About, Features)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <Routes>
      {/* Public Pages with Navbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Dashboard - has its own specific layout */}
      <Route path="/dashboard" element={<DashboardLayout />} />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}