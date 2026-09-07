import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-black/80">
        <img 
          src="https://picsum.photos/seed/agency-office/1920/1080" 
          alt="Office flex" 
          className="w-full h-full object-cover mix-blend-overlay opacity-30"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto -mt-20">
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 md:mb-8 leading-none font-display">
          Ready to scale<br /> <span className="text-[#00d2ff]">your brand?</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
          If your brand deserves more attention, better creatives, and stronger results — 
          let's build something impossible to ignore.
        </p>
        
        <Link to="/strategy-call" className="bg-white text-black hover:bg-black hover:text-white hover:border-[#00d2ff] hover:shadow-[0_0_25px_rgba(0,210,255,0.45)] border border-transparent px-10 py-5 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all inline-block">
          Book Your Free Strategy Call
        </Link>
      </div>

      {/* Huge Footer Text */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none select-none overflow-hidden">
        <h2 
          className="text-[25vw] font-black tracking-tighter leading-[0.65] whitespace-nowrap text-center opacity-25 md:translate-y-4 translate-y-2 font-display"
          style={{
            color: "transparent",
            WebkitTextStroke: "2px rgba(255, 255, 255, 0.4)",
          }}
        >
          3XHIKE
        </h2>
      </div>
    </footer>
  );
}
