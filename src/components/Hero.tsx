import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import logoImage from "../assets/images/logo.png";

interface Partner {
  id: number;
  name: string;
  videoUrl: string;
  clientUrl: string;
}

export default function Hero() {
  const [partners, setPartners] = useState<Partner[]>([
    { id: 1, name: "grazia stone", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779217991/interior_design_f0sty1.mov", clientUrl: "#" },
    { id: 2, name: "plan my interior", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218600/Doors_AI_ads_hvxw6r.mp4", clientUrl: "#" },
    { id: 3, name: "vistara infra", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218608/motion_graphics_Real_estate_y7fz8k.mp4", clientUrl: "#" },
    { id: 4, name: "zaira jewellery", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218601/ai_story_bracelet_ad_etgcef.mp4", clientUrl: "#" },
    { id: 5, name: "cinco livings", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218610/ugc_ad_og6llh.mp4", clientUrl: "#" },
    { id: 6, name: "allen town international school", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218608/school_ad_czugtm.mp4", clientUrl: "#" }
  ]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
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
  const blocksY = useTransform(scrollYProgress, [0, 0.15, 0.3], ["0vh", "0vh", "-15vh"]);
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
    "We build brands",
    "people remember."
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
          className="absolute top-6 md:top-8 left-4 md:left-1/2 md:-translate-x-1/2 z-50 flex items-center justify-center"
          style={{ opacity: heroOpacity }}
        >
          <img 
            src={logoImage} 
            alt="3xHike Logo" 
            style={{
              height: "200px",
              width: "220px",
              paddingLeft: "0px",
              marginLeft: "-20px",
              marginRight: "-20px",
              marginTop: "-47px",
              marginBottom: "-60px"
            }}
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="text-center max-w-7xl z-10 pointer-events-none flex flex-col items-center justify-center gap-6"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/60 tracking-[0.2em] text-sm md:text-base font-medium font-sans uppercase mb-[-2rem]"
          >
            PERFORMANCE • CONTENT • GROWTH
          </motion.p>
          
          <h1 className="text-white text-[12vw] md:text-[9vw] leading-[1.3] md:leading-[0.85] font-black tracking-tighter px-4 font-display">
            {lines.map((line, i) => (
              <div key={i} className="overflow-hidden pb-4 md:pb-0">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={
                    i === 0
                      ? { fontFamily: "Times New Roman", fontStyle: "italic", marginBottom: "47px" }
                      : { fontFamily: "Georgia", fontWeight: "normal", fontStyle: "normal", textDecorationLine: "none", lineHeight: "1.2", fontSize: "0.8em" }
                  }
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-2xl mx-auto px-4 pointer-events-auto"
          >
            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed mb-8 font-sans">
              Performance marketing meets cinematic storytelling.<br className="hidden md:block" />
              We help brands scale with scroll-stopping creatives, data-backed ads, and content engineered for attention.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-colors w-full sm:w-auto">
                Book a Strategy Call
              </button>
              <button className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-colors w-full sm:w-auto">
                View Our Work
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Gallery Header (Visible after transition) */}
        <motion.div 
          className="absolute top-32 md:top-20 left-4 md:left-12 z-20 pr-24 md:pr-0"
          style={{ opacity: galleryHeaderOpacity }}
        >
          <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase">
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
            {partners.length > 0 ? partners.map((partner, i) => (
              <VideoCard 
                key={partner.id} 
                partner={partner} 
                index={i} 
                scrollYProgress={scrollYProgress}
              />
            )) : null}
          </motion.div>
        </motion.div>

        {/* Gallery Navigation (Visible after transition) */}
        <motion.div 
          className="absolute bottom-4 md:bottom-12 left-4 md:left-auto md:right-12 flex items-center gap-4 md:gap-8 z-20"
          style={{ opacity: galleryHeaderOpacity }}
        >
          <div className="w-24 md:w-48 h-[2px] bg-white/20 relative">
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
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    setIsOpen(latest >= 0.3);
  });

  const shouldPlay = isHovered && isOpen;

  useEffect(() => {
    if (videoRef.current) {
      if (shouldPlay) {
        console.log("Playing video:", partner.name);
        videoRef.current.play().catch(err => console.log("Video play failed:", err));
      } else {
        console.log("Pausing video:", partner.name);
        videoRef.current.pause();
      }
    }
  }, [shouldPlay]);

  // Transition from block to card
  // Blocks are at the bottom, different widths and heights
  const blockWidths = ["40%", "20%", "20%", "20%"];
  const blockHeights = ["100%", "80%", "80%", "80%"];
  
  // Use website colors for background
  const themeColors = ["bg-[#F4CE14]", "bg-[#FF6B2B]", "bg-[#A0C1A6]", "bg-black", "bg-[#F3EFE9]"];
  const blockColor = themeColors[index % themeColors.length];

  const initialWidth = index < 4 ? blockWidths[index] : "0vw";
  const initialHeight = index < 4 ? blockHeights[index] : "0vh";

  const width = useTransform(scrollYProgress, [0.15, 0.3], [initialWidth, "22vw"]);
  const height = useTransform(scrollYProgress, [0.15, 0.3], [initialHeight, "39vw"]);
  const borderRadius = useTransform(scrollYProgress, [0.15, 0.3], [index < 4 ? "12px 12px 0 0" : "16px", "16px"]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.25], [index < 4 ? 1 : 0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const labelHeight = useTransform(scrollYProgress, [0.3, 0.4], ["0px", "auto"]);

  return (
    <motion.div className="flex-shrink-0 flex flex-col justify-end" style={{ opacity }}>
      <motion.div
        className={`relative overflow-hidden cursor-none group ${blockColor}`}
        style={{ width, height, borderRadius }}
        onMouseEnter={() => {
          if (isOpen) {
            console.log("Hover enter:", partner.name);
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          console.log("Hover leave:", partner.name);
          setIsHovered(false);
        }}
      >
        <motion.video
          ref={videoRef}
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: shouldPlay ? 1 : 0 }}
        >
          <source src={partner.videoUrl} type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4" type="video/mp4" />
        </motion.video>
        
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" style={{ opacity: shouldPlay ? 1 : 0 }} />
        
        {shouldPlay && (
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
