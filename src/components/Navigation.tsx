import { motion } from "framer-motion";

const navItems = [
  { label: "work" },
  { label: "about" },
  { label: "trends" },
  { label: "careers" },
  { label: "contact" },
];

export default function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden md:flex fixed right-4 md:right-6 top-6 md:top-10 z-50 flex-col gap-2 items-end">
      {navItems.map((item, i) => (
        <motion.div
          key={i}
          onClick={() => scrollToSection(item.label)}
          className="bg-black/85 backdrop-blur-md border border-white/10 hover:border-[#00d2ff]/80 text-white px-4 md:px-5 py-1.5 rounded-full cursor-pointer flex items-center justify-center min-w-[80px] md:min-w-[100px] shadow-lg transition-colors group"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white group-hover:text-[#00d2ff] text-[11px] md:text-[12px] font-black uppercase tracking-wider transition-colors font-display">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
