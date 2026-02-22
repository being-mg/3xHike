import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = [
    { text: "instagram", color: "bg-[#F4CE14]" },
    { text: "terms and conditions", color: "bg-[#1A1A1A]" },
    { text: "niels@dorstenlesser.nl", color: "bg-[#2B38F1]" },
    { text: "tiktok", color: "bg-[#F4CE14]" },
    { text: "linkedin", color: "bg-[#F4CE14]" },
    { text: "cookies", color: "bg-[#1A1A1A]" },
  ];

  return (
    <footer className="relative h-screen overflow-hidden bg-[#F3EFE9]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/agency-office/1920/1080" 
          alt="Office" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Top Navigation Overlay */}
      <div className="absolute top-10 left-10 z-20 text-white mix-blend-difference">
        <p className="text-sm font-bold">Overtoom 373i</p>
        <p className="text-sm font-bold">1054 JN Amsterdam</p>
      </div>

      <div className="absolute top-10 right-10 z-20 flex flex-col gap-2">
        {["work", "about", "trends", "careers", "contact"].map((link, i) => (
          <button 
            key={link} 
            className={`px-6 py-1.5 rounded-full text-white text-sm font-bold uppercase ${
              i === 0 ? "bg-[#2B38F1]" : 
              i === 1 ? "bg-[#2B38F1]" : 
              i === 2 ? "bg-[#FF6B2B]" : 
              i === 3 ? "bg-[#FF6B2B]" : "bg-[#F4CE14]"
            }`}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Keep Scrolling Indicator */}
      <div className="absolute top-1/4 left-1/4 z-20 flex items-center gap-4">
        <div className="bg-black text-white text-[10px] w-8 h-8 rounded-full flex items-center justify-center font-bold">
          3/4
        </div>
        <div className="bg-[#2B38F1] text-white px-6 py-2 rounded-full text-sm font-bold">
          keep scrolling
        </div>
      </div>

      {/* Huge Footer Text */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none select-none">
        <h2 className="text-white text-[25vw] font-black tracking-tighter leading-[0.65] whitespace-nowrap">
          DORST & LESSER
        </h2>
      </div>

      {/* Bottom Pills */}
      <div className="absolute bottom-10 left-0 w-full z-[60] flex justify-center gap-4 px-10 flex-wrap">
        {footerLinks.map((link, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${link.color} ${link.color === "bg-[#1A1A1A]" || link.color === "bg-[#2B38F1]" ? "text-white" : "text-black"} px-8 py-3 rounded-full font-bold text-sm shadow-lg`}
          >
            {link.text}
          </motion.button>
        ))}
      </div>
    </footer>
  );
}
