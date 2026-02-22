import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stackImages = [
  "https://picsum.photos/seed/specialist1/800/1200",
  "https://picsum.photos/seed/specialist2/800/1200",
  "https://picsum.photos/seed/specialist3/800/1200",
];

export default function Specialists() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background color transition from yellow to white
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["#F4CE14", "#FFFFFF"]
  );

  return (
    <motion.section 
      ref={containerRef}
      className="relative min-h-[150vh] py-32 px-8 md:px-20 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Top Logo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black px-5 py-1.5 rounded-full">
          <span className="text-white text-3xl font-black tracking-tighter">D&L</span>
        </div>
      </div>

      {/* Left Blue Dot */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full" />

      {/* Right Colored Dots */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-full" />
        <div className="w-8 h-8 bg-blue-500 rounded-full" />
        <div className="w-8 h-8 bg-orange-500 rounded-full" />
        <div className="w-8 h-8 bg-orange-400 rounded-full" />
        <div className="w-8 h-8 bg-yellow-500 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center h-full pt-20">
        {/* Stacking Cards */}
        <div className="relative h-[70vh] flex items-center justify-center">
          {stackImages.map((src, i) => (
            <StackCard 
              key={i} 
              src={src} 
              index={i} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>

        {/* Text Content */}
        <div className="max-w-xl">
          <h2 className="text-7xl font-black tracking-tighter leading-[0.9] mb-12">
            we are social media <br /> specialists.
          </h2>
          <div className="space-y-6 text-lg text-black/80 font-medium leading-relaxed">
            <p>
              Dorst & Lesser is a global social media agency based in Amsterdam, 
              driven by a team of over 50 social media enthusiasts. Our mission is 
              to make brands more social by fostering meaningful connections with 
              their communities and enhancing brand loyalty through the power of AI social data.
            </p>
            <p>
              Since our founding in 2011, we have been leaders in the social media space. 
              We all love what we do, which is why we've made our work our playground—a 
              place where friendships begin and grow.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function StackCard({ src, index, scrollYProgress }: { src: string; index: number; scrollYProgress: any }) {
  // Each card has a different rotation and slight offset
  const rotations = [-8, 4, -2];
  const xOffsets = [-20, 10, 0];
  
  // Animation based on scroll
  const rotate = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [rotations[index], rotations[index] * 1.5, rotations[index] * 0.5]
  );
  
  const y = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [index * 20, index * -10, index * 10]
  );

  const scale = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [1 - index * 0.05, 1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    [0, 1]
  );

  return (
    <motion.div
      className="absolute w-[30vw] h-[45vw] lg:w-[22vw] lg:h-[33vw] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10"
      style={{
        rotate,
        y,
        scale,
        opacity,
        x: xOffsets[index],
        zIndex: 30 - index
      }}
    >
      <img 
        src={src} 
        alt={`Specialist ${index}`} 
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
