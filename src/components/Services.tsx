import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const services = [
  "Social Strategy",
  "Content Creation",
  "Community Management",
  "Paid Media",
  "Influencer Marketing",
  "Data & Analytics",
  "Creative Studio"
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["#FFFFFF", "#F4CE14"]
  );

  return (
    <motion.section 
      ref={containerRef}
      className="py-20 md:py-32 px-6 md:px-20"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <p className="uppercase font-bold tracking-widest text-sm mb-12">Our Expertise</p>
        
        <div className="flex flex-col">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="group border-b border-black/10 py-10 flex items-center justify-between cursor-pointer"
              whileHover={{ x: 20 }}
            >
              <h3 className="text-3xl md:text-5xl lg:text-7xl uppercase transition-all duration-500 group-hover:italic group-hover:tracking-tighter">
                {service}
              </h3>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-6 md:h-6">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
