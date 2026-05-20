import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import specialistImage1 from "../assets/images/regenerated_image_1779221318661.png";
import specialistImage2 from "../assets/images/regenerated_image_1779221315273.png";
import specialistImage3 from "../assets/images/regenerated_image_1779221322859.png";

const stackImages = [
  specialistImage1,
  specialistImage2,
  specialistImage3,
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
      className="relative min-h-[150vh] py-20 md:py-32 px-6 md:px-20 overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-center h-full pt-10 md:pt-20">
        {/* Stacking Cards */}
        <div className="relative h-[40vh] md:h-[70vh] flex items-center justify-center">
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
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 md:mb-12 uppercase">
            we don't run ads <br /> we build attention machines.
          </h2>
          <div className="space-y-6 text-base md:text-lg text-black/80 font-medium leading-relaxed mb-16">
            <p>
              Every brand has content. Very few know how to convert attention into revenue.
            </p>
            <p>
              Our team blends creative strategy, performance marketing, and platform-native storytelling to create campaigns that actually move people — and numbers.
            </p>
          </div>

          <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-6 md:mb-8 uppercase">
            a team obsessed with growth.
          </h3>
          <div className="space-y-6 text-base md:text-lg text-black/80 font-medium leading-relaxed">
            <p>
              Designers, editors, strategists, media buyers, and creators working together to build brands that dominate digitally.
            </p>
            <p>
              We move fast, test aggressively, and create content people actually want to watch.
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
      className="absolute w-[40vw] h-[60vw] lg:w-[22vw] lg:h-[33vw] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10"
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
