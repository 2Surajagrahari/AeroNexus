import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import { Footer } from "./components/footer-section";
import PageLoader from "./components/ui/PageLoader";

// Ensures the preloader stays visible for at least `ms` milliseconds
const lazyWithMinDelay = (importFn, ms = 2000) =>
  lazy(() =>
    Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, ms)),
    ]).then(([module]) => module)
  );

// Lazy-load all route-level components with a minimum 2s preloader
const Home = lazyWithMinDelay(() => import("./pages/Home"));
const About = lazyWithMinDelay(() => import("./pages/About"));
const NotFound = lazyWithMinDelay(() => import("./pages/NotFound"));
const DashboardLayout = lazyWithMinDelay(() => import("./components/dashboard/DashboardLayout"));

// Layout for public pages (Landing, About, Features)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}