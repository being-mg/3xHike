import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const trends = [
  {
    title: "the social scoop – february",
    date: "3 February 2026",
    color: "bg-[#2B38F1]",
    shape: "flower"
  },
  {
    title: "instagram reels on your tv",
    date: "24 December 2025",
    color: "bg-[#F4CE14]",
    shape: "stack"
  },
  {
    title: "the social scoop – week 52",
    date: "22 December 2025",
    color: "bg-[#FF6B2B]",
    shape: "wave"
  },
  {
    title: "the social scoop – week 50",
    date: "8 December 2025",
    color: "bg-[#2B38F1]",
    shape: "wave-alt"
  },
  {
    title: "the trend full of life lessons",
    date: "28 November 2025",
    color: "bg-[#F4CE14]",
    shape: "stack"
  }
];

export default function Trends() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["#FFFFFF", "#A0C1A6"]
  );

  return (
    <motion.section 
      ref={containerRef}
      className="relative py-32 px-8 md:px-20 min-h-screen overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start pt-20 relative z-50">
        {/* Left Content */}
        <div className="sticky top-40">
          <div className="mb-20">
            <p className="text-sm font-bold uppercase mb-2">written for</p>
            <h3 className="text-4xl font-black tracking-tighter mb-12">Adformatie.</h3>
            <h2 className="text-5xl font-black tracking-tighter leading-[0.9] mb-12 max-w-sm">
              you can't stop the waves, but you can learn to surf.
            </h2>
            <button className="bg-[#2B38F1] text-white px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
              all trends
            </button>
          </div>
        </div>

        {/* Right List */}
        <div className="space-y-12">
          {trends.map((trend, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-12 group cursor-pointer"
            >
              <div className="w-32 h-32 flex-shrink-0 relative">
                <Shape type={trend.shape} color={trend.color} />
              </div>
              <div>
                <h4 className="text-3xl font-black tracking-tighter leading-tight group-hover:italic transition-all">
                  {trend.title}
                </h4>
                <p className="text-sm font-medium opacity-60 mt-2">{trend.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Shape({ type, color }: { type: string; color: string }) {
  if (type === "flower") {
    return (
      <div className={`w-full h-full ${color} rounded-full relative overflow-hidden`}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 ${color} rounded-full`} 
            style={{ transform: `rotate(${i * 45}deg) translateY(-20%)` }}
          />
        ))}
      </div>
    );
  }
  
  if (type === "stack") {
    return (
      <div className="w-full h-full flex flex-col gap-1">
        <div className={`h-1/3 w-full ${color} rounded-2xl`} />
        <div className={`h-1/3 w-full ${color} rounded-2xl`} />
        <div className={`h-1/3 w-full ${color} rounded-2xl`} />
      </div>
    );
  }

  if (type === "wave") {
    return (
      <div className="w-full h-full flex gap-1">
        <div className={`w-1/3 h-full ${color} rounded-full`} />
        <div className={`w-1/3 h-full ${color} rounded-full transform translate-y-4`} />
        <div className={`w-1/3 h-full ${color} rounded-full`} />
      </div>
    );
  }

  if (type === "wave-alt") {
    return (
      <div className="w-full h-full flex gap-1 items-center">
        <div className={`w-1/3 h-2/3 ${color} rounded-full`} />
        <div className={`w-1/3 h-full ${color} rounded-full`} />
        <div className={`w-1/3 h-2/3 ${color} rounded-full`} />
      </div>
    );
  }

  return <div className={`w-full h-full ${color} rounded-2xl`} />;
}
