import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const services = [
  {
    title: "Meta Ads",
    desc: "High-converting campaigns designed to generate leads, sales, and scalable growth."
  },
  {
    title: "Creative Production",
    desc: "Cinematic reels, UGC ads, branded visuals, and thumb-stopping creatives built for modern platforms."
  },
  {
    title: "Performance Marketing",
    desc: "Data-driven scaling strategies focused on ROI, CAC reduction, and revenue growth."
  },
  {
    title: "Social Media Growth",
    desc: "Build authority, trust, and audience loyalty through platform-native content systems."
  },
  {
    title: "Video Editing",
    desc: "Fast-paced premium edits optimized for retention, engagement, and conversions."
  },
  {
    title: "Branding & Positioning",
    desc: "Craft a visual identity and messaging system people instantly recognize."
  },
  {
    title: "Lead Generation",
    desc: "Funnels and campaigns engineered to bring qualified leads consistently."
  },
  {
    title: "Analytics & Optimization",
    desc: "Real-time insights, testing, and campaign optimization focused on performance."
  }
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
              className="group border-b border-black/10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer gap-4 md:gap-12"
              whileHover={{ x: 20 }}
            >
              <h3 className="text-3xl md:text-5xl lg:text-6xl uppercase transition-all duration-500 group-hover:italic group-hover:tracking-tighter font-bold whitespace-nowrap">
                {service.title}
              </h3>
              <p className="text-sm md:text-base font-medium opacity-70 max-w-sm transition-opacity duration-500">
                {service.desc}
              </p>
              <div className="hidden md:flex w-8 h-8 md:w-12 md:h-12 rounded-full border border-black items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
