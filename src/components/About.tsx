import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  "https://res.cloudinary.com/dxfgeowvx/image/upload/q_auto/f_auto/v1779220399/Screenshot_2026-05-20_011909_bswmn5.png",
  "https://res.cloudinary.com/dxfgeowvx/image/upload/q_auto/f_auto/v1779220422/Screenshot_2026-05-20_011737_j5rami.png",
  "https://res.cloudinary.com/dxfgeowvx/image/upload/q_auto/f_auto/v1779220437/Screenshot_2026-05-20_012344_js3t5g.png",
];

function AboutImage({ src, index, scrollYProgress }: { src: string; index: number; scrollYProgress: any }) {
  const startFade = (index - 1) * 0.4 + 0.2;
  const endFade = startFade + 0.2;

  const opacity = useTransform(
    scrollYProgress,
    [startFade, endFade],
    [0, 1]
  );

  return (
    <motion.img
      src={src}
      alt="Agency Culture"
      className={index === 0 ? "block w-full h-auto object-cover" : "absolute inset-0 w-full h-full object-cover"}
      style={{ opacity: index === 0 ? 1 : opacity }}
    />
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const event = new CustomEvent("pause-gallery-videos");
          window.dispatchEvent(event);
        }
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Scroll progress for the background and text color changes
  const { scrollYProgress: colorScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // Scroll progress for the image transitions (slower, spans the whole section)
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const backgroundColor = useTransform(
    colorScrollProgress,
    [0, 0.8],
    ["#2B38F1", "#FFFFFF"]
  );

  const textColor = useTransform(
    colorScrollProgress,
    [0, 0.8],
    ["#FFFFFF", "#000000"]
  );

  const brandHumanColor = useTransform(
    colorScrollProgress,
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
        <div className="relative lg:sticky top-auto lg:top-32 rounded-3xl overflow-hidden order-first lg:order-none mb-10 lg:mb-0 h-auto">
          {images.map((src, i) => (
            <AboutImage key={i} src={src} index={i} scrollYProgress={imageScrollProgress} />
          ))}
        </div>
        
        <motion.div className="flex flex-col justify-center gap-12 md:gap-20 py-10 md:py-20" style={{ color: textColor }}>
          <div className="max-w-md">
            <h2 className="text-4xl md:text-6xl uppercase leading-[0.9] mb-6 md:mb-8 font-black tracking-tighter">
              Impossible <br /> <motion.span style={{ color: brandHumanColor }}>to ignore</motion.span>
            </h2>
            <p className="text-xl opacity-70 leading-relaxed font-medium">
              In a world where attention disappears in seconds, we help brands become impossible to ignore. 
              We combine paid media, creative psychology, and high-converting content to turn clicks into customers.
            </p>
          </div>
          
          <div className="max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-tighter mb-6">Performance Marketing</h3>
            <p className="text-lg opacity-80 leading-relaxed font-medium">
              From local businesses to scaling brands, we build marketing systems designed for measurable growth across the most competitive platforms.
            </p>
          </div>

          <div className="max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-tighter mb-6">Audiences Into Communities</h3>
            <p className="text-lg opacity-80 leading-relaxed font-medium">
              We focus on what drives actual results – turning passive scrollers into dedicated brand communities with engaging, platform-native storytelling.
            </p>
          </div>

          <div className="max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-tighter mb-6">Creative That Performs</h3>
            <p className="text-lg opacity-80 leading-relaxed font-medium">
              We create content designed for today’s attention economy — short-form videos, ad creatives, branded visuals, and campaigns that stop the scroll and drive action.
            </p>
            <p className="text-lg opacity-80 leading-relaxed font-medium mt-4">
              Every frame has a purpose.<br />
              Every campaign has a strategy.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
