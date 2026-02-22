import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Partner {
  id: number;
  name: string;
  videoUrl: string;
  clientUrl: string;
}

export default function Hero() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    fetch("/api/partners")
      .then(res => res.json())
      .then(data => setPartners(data));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hero Text Animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  // Blocks to Gallery Transition
  // 0.15 to 0.3: Blocks expand and move up
  const blocksY = useTransform(scrollYProgress, [0, 0.15, 0.3], ["10vh", "10vh", "-30%"]);
  const blocksContainerWidth = useTransform(scrollYProgress, [0, 0.15, 0.3], ["25vw", "25vw", "100vw"]);
  const blocksContainerPadding = useTransform(scrollYProgress, [0, 0.15, 0.3], ["0px", "0px", "48px"]);
  
  // Horizontal Scroll
  // 0.3 to 1: Scroll horizontally
  const x = useTransform(scrollYProgress, [0.3, 1], ["0%", `-${(partners.length - 3) * 25}%`]);
  const progressWidth = useTransform(scrollYProgress, [0.3, 1], ["0%", "100%"]);
  const gap = useTransform(scrollYProgress, [0.15, 0.3], ["1px", "24px"]);

  // Header and Navigation visibility
  const galleryHeaderOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

  const lines = [
    "social media agency",
    "for leading brands."
  ];

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-agency-blue cursor-none">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Custom Cursor Dot */}
        <motion.div 
          className="fixed left-0 top-0 w-4 h-4 bg-black rounded-full z-[100] pointer-events-none"
          animate={{ x: mousePos.x - 8, y: mousePos.y - 8 }}
          transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
          style={{ opacity: heroOpacity }}
        />

        {/* Logo */}
        <motion.div 
          className="absolute top-10 left-1/2 -translate-x-1/2 z-50"
          style={{ opacity: heroOpacity }}
        >
          <div className="bg-black px-5 py-1.5 rounded-full">
            <span className="text-white text-3xl font-black tracking-tighter">D&L</span>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="text-center max-w-7xl z-10"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <h1 className="text-white text-[10vw] md:text-[9vw] leading-[0.85] font-black tracking-tighter">
            {lines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </h1>
        </motion.div>

        {/* Gallery Header (Visible after transition) */}
        <motion.div 
          className="absolute top-20 left-12 z-20"
          style={{ opacity: galleryHeaderOpacity }}
        >
          <h2 className="text-white text-5xl font-black tracking-tighter uppercase">
            our social partners
          </h2>
        </motion.div>

        {/* The Transitioning Blocks / Gallery */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end overflow-visible h-[10vh]"
          style={{ 
            y: blocksY,
            width: blocksContainerWidth,
            paddingLeft: blocksContainerPadding,
            paddingRight: blocksContainerPadding
          }}
        >
          <motion.div style={{ x, gap }} className="flex items-end h-full w-full">
            {partners.map((partner, i) => (
              <VideoCard 
                key={partner.id} 
                partner={partner} 
                index={i} 
                scrollYProgress={scrollYProgress}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Gallery Navigation (Visible after transition) */}
        <motion.div 
          className="absolute bottom-12 right-12 flex items-center gap-8 z-20"
          style={{ opacity: galleryHeaderOpacity }}
        >
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-agency-blue transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-agency-blue transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="w-48 h-[2px] bg-white/20 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white"
              style={{ width: progressWidth }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function VideoCard({ partner, index, scrollYProgress }: { partner: Partner; index: number; scrollYProgress: any }) {
  const [isHovered, setIsHovered] = useState(false);

  // Transition from block to card
  // Blocks are at the bottom, different widths and heights
  const blockWidths = ["40%", "20%", "20%", "20%"];
  const blockHeights = ["100%", "80%", "80%", "80%"];
  const blockColors = ["bg-black", "bg-[#ff6b2b]", "bg-[#ffcc00]", "bg-[#a8c69f]"];

  const initialWidth = index < 4 ? blockWidths[index] : "0vw";
  const initialHeight = index < 4 ? blockHeights[index] : "0vh";
  const initialColor = index < 4 ? blockColors[index] : "bg-white/5";

  const width = useTransform(scrollYProgress, [0.15, 0.3], [initialWidth, "22vw"]);
  const height = useTransform(scrollYProgress, [0.15, 0.3], [initialHeight, "39vw"]);
  const borderRadius = useTransform(scrollYProgress, [0.15, 0.3], [index < 4 ? "12px 12px 0 0" : "16px", "16px"]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.25], [index < 4 ? 1 : 0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const labelHeight = useTransform(scrollYProgress, [0.3, 0.4], ["0px", "auto"]);

  return (
    <motion.div className="flex-shrink-0 flex flex-col justify-end" style={{ opacity }}>
      <motion.div
        className={`relative overflow-hidden cursor-none group ${index < 4 ? initialColor : "bg-white/5"}`}
        style={{ width, height, borderRadius }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: useTransform(scrollYProgress, [0.2, 0.35], [0, 1]) }}
        >
          <source src={partner.videoUrl} type="video/mp4" />
        </motion.video>
        
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
        
        {isHovered && (
          <motion.div
            className="fixed pointer-events-none z-50 w-24 h-24 bg-white rounded-full flex items-center justify-center text-black text-[10px] font-black uppercase tracking-tighter text-center p-4 shadow-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              left: "var(--mouse-x)",
              top: "var(--mouse-y)",
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="flex flex-col items-center">
              <span>View</span>
              <span>Client</span>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-2 mt-4 overflow-hidden"
        style={{ opacity: labelOpacity, height: labelHeight }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
        <span className="text-white text-lg font-black lowercase tracking-tight">{partner.name}.</span>
      </motion.div>
    </motion.div>
  );
}
