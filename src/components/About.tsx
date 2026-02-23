import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  "https://picsum.photos/seed/agency1/800/1000",
  "https://picsum.photos/seed/agency2/800/1000",
  "https://picsum.photos/seed/agency3/800/1000",
];

function AboutImage({ src, index, scrollYProgress }: { src: string; index: number; scrollYProgress: any }) {
  const opacity = useTransform(
    scrollYProgress,
    [index * 0.33, (index + 1) * 0.33],
    [index === 0 ? 1 : 0, 1]
  );

  return (
    <motion.img
      src={src}
      alt="Agency Culture"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}
    />
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["#2B38F1", "#FFFFFF"]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["#FFFFFF", "#000000"]
  );

  const brandHumanColor = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["#FFFFFF", "#2B38F1"]
  );

  return (
    <motion.section 
      ref={containerRef} 
      className="relative py-20 md:py-32 px-6 md:px-20 min-h-[200vh]"
      style={{ backgroundColor }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20">
        <div className="relative lg:sticky top-auto lg:top-32 h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden order-first lg:order-none mb-10 lg:mb-0">
          {images.map((src, i) => (
            <AboutImage key={i} src={src} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
        
        <motion.div className="flex flex-col justify-center gap-12 md:gap-20 py-10 md:py-20" style={{ color: textColor }}>
          <div className="max-w-md">
            <h2 className="text-4xl md:text-6xl uppercase leading-[0.9] mb-6 md:mb-8">
              We make <br /> <motion.span style={{ color: brandHumanColor }}>brands human</motion.span>
            </h2>
            <p className="text-xl opacity-70 leading-relaxed">
              In a world of algorithms, we focus on the humans behind the screens. 
              Our approach combines data-driven strategy with raw, authentic storytelling.
            </p>
          </div>
          
          <div className="max-w-md">
            <h3 className="text-3xl uppercase mb-6">Strategy first</h3>
            <p className="text-lg opacity-60">
              We don't just post content. We build ecosystems that thrive on engagement 
               and convert followers into advocates.
            </p>
          </div>

          <div className="max-w-md">
            <h3 className="text-3xl uppercase mb-6">Creative always</h3>
            <p className="text-lg opacity-60">
              Our studio is a playground for innovation. From 9:16 cinematic captures 
              to interactive AR experiences, we push the boundaries of what's possible.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
