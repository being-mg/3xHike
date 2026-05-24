import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CustomCursor from "../components/CustomCursor";

export default function StrategyCallPage() {
  const lenisRef = useRef<Lenis | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    requirement: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
         throw new Error("Failed to submit form data");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", budget: "", requirement: "" });
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error saving your strategy call request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative bg-black min-h-screen text-white font-sans overflow-hidden">
      <CustomCursor />
      
      {/* Navigation - simplified for this page */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-6 flex justify-between items-center mix-blend-difference">
        <Link to="/" className="text-white text-2xl font-black tracking-tighter">
          3xHike
        </Link>
        <Link to="/" className="text-white text-sm font-bold uppercase tracking-wider hover:underline">
          Close
        </Link>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-10 pt-32 pb-20 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 lg:sticky top-32 h-fit"
        >
          <p className="text-white/60 tracking-[0.2em] text-sm md:text-base font-medium font-sans uppercase mb-6">
            STRATEGY CALL
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
            build something <br /><span className="text-[#F4CE14]">impossible</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed max-w-xl mb-6">
            Ready to scale? We're looking for ambitious brands ready to turn attention into revenue. Tell us what you're building.
          </p>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full max-w-2xl"
        >
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 p-10 md:p-16 rounded-3xl border border-white/10 text-center"
            >
              <div className="w-20 h-20 bg-[#F4CE14] rounded-full mx-auto mb-8 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">Request Received</h2>
              <p className="text-lg text-white/70 mb-6">
                Our team will review your application and be in touch within 24 hours to schedule your strategy call.
              </p>
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-4 border border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-colors"
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-white/70">Name / Brand</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-transparent border-b-2 border-white/20 pb-4 text-xl focus:outline-none focus:border-[#F4CE14] transition-colors rounded-none px-0"
                    placeholder="Your name or company"
                  />
                </div>
                
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-white/70">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-transparent border-b-2 border-white/20 pb-4 text-xl focus:outline-none focus:border-[#F4CE14] transition-colors rounded-none px-0"
                    placeholder="hello@brand.com"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-2 flex-1 relative">
                   <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-white/70">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-transparent border-b-2 border-white/20 pb-4 text-xl focus:outline-none focus:border-[#F4CE14] transition-colors rounded-none px-0"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="budget" className="text-sm font-bold uppercase tracking-wider text-white/70">Monthly Budget (Optional)</label>
                  <select 
                    id="budget" 
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="bg-black border-b-2 border-white/20 pb-4 text-xl focus:outline-none focus:border-[#F4CE14] transition-colors rounded-none px-0 appearance-none text-white/90"
                  >
                    <option value="" disabled>Select a range</option>
                    <option value="under5k">Under &euro;5,000</option>
                    <option value="5k-10k">&euro;5,000 - &euro;10,000</option>
                    <option value="10k-25k">&euro;10,000 - &euro;25,000</option>
                    <option value="25k+">&euro;25,000+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="requirement" className="text-sm font-bold uppercase tracking-wider text-white/70">Project Requirements</label>
                <textarea 
                  id="requirement" 
                  name="requirement" 
                  required
                  value={formData.requirement}
                  onChange={handleChange}
                  rows={4}
                  className="bg-transparent border-b-2 border-white/20 pb-4 text-xl focus:outline-none focus:border-[#F4CE14] transition-colors resize-none rounded-none px-0 pt-4"
                  placeholder="Tell us about your goals, current challenges, and what you're looking to achieve..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-6 bg-[#F4CE14] text-black hover:bg-white px-10 py-5 rounded-full text-lg font-bold uppercase tracking-wide transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Request Strategy Call'}
              </button>
            </form>
          )}
        </motion.div>
      </div>

       {/* Background ambient elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#F4CE14]/10 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#2B38F1]/10 rounded-full blur-[150px] -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
    </main>
  );
}
