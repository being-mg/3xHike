import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Specialists from "./components/Specialists";
import Trends from "./components/Trends";
import PhysicsPlayground from "./components/PhysicsPlayground";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <main className="relative">
      <CustomCursor />
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Specialists />
      <div className="relative">
        <PhysicsPlayground />
        <Trends />
        <Footer />
      </div>
    </main>
  );
}
