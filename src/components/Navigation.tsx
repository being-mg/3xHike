import { motion } from "framer-motion";

const navItems = [
  { color: "bg-black", label: "work" },
  { color: "bg-black", label: "about" },
  { color: "bg-[#ff6b2b]", label: "trends" },
  { color: "bg-[#ff4500]", label: "careers" },
  { color: "bg-[#ffcc00]", label: "contact" },
];

export default function Navigation() {
  return (
    <div className="fixed right-6 top-10 z-50 flex flex-col gap-2 items-end">
      {navItems.map((item, i) => (
        <motion.div
          key={i}
          className={`${item.color} px-6 py-1.5 rounded-full cursor-pointer flex items-center justify-center min-w-[100px] shadow-lg`}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white text-[13px] font-black lowercase tracking-tight">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
