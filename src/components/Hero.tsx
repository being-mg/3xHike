import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import logoImage from "../assets/images/logo.png";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

import { Link } from "react-router-dom";

interface Partner {
  id: number;
  name: string;
  videoUrl: string;
  clientUrl: string;
}

export default function Hero() {
  const [partners, setPartners] = useState<Partner[]>([
    { id: 1, name: "grazia stone", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779217991/interior_design_f0sty1.mp4", clientUrl: "#" },
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

  const [activePartnerId, setActivePartnerId] = useState<number | null>(null);
  
  // Swipe / Drag left-right gesture handling to drive vertical scroll
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const startScrollY = useRef<number>(0);
  const isMouseDown = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (activePartnerId !== null) return;
    if (scrollYProgress.get() < 0.25) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    startScrollY.current = window.scrollY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const multiplier = isMobile ? 3.0 : 2.5;
      const targetScroll = startScrollY.current - diffX * multiplier;
      window.scrollTo(0, targetScroll);
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activePartnerId !== null) return;
    if (scrollYProgress.get() < 0.25) return;
    isMouseDown.current = true;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    startScrollY.current = window.scrollY;
  };

  const handleMouseDragMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || dragStartX.current === null || dragStartY.current === null) return;
    const diffX = e.clientX - dragStartX.current;
    const diffY = e.clientY - dragStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      const multiplier = isMobile ? 3.0 : 2.5;
      const targetScroll = startScrollY.current - diffX * multiplier;
      window.scrollTo(0, targetScroll);
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    dragStartX.current = null;
    dragStartY.current = null;
  };

  const handleMouseLeave = () => {
    isMouseDown.current = false;
    dragStartX.current = null;
    dragStartY.current = null;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hero Text Animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  // Blocks to Gallery Transition
  // 0.15 to 0.3: Blocks expand and move up
  const blocksY = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.3], 
    ["0vh", "0vh", isMobile ? "-8vh" : "-15vh"]
  );
  
  const blocksContainerWidth = useTransform(
    scrollYProgress, 
    [0.15, 0.3], 
    [isMobile ? "60vw" : "25vw", "100vw"]
  );

  const blocksContainerPadding = useTransform(
    scrollYProgress, 
    [0.15, 0.3], 
    ["0px", isMobile ? "16px" : "48px"]
  );
  
  // Horizontal Scroll
  // 0.3 to 1: Scroll horizontally
  const xStr = isMobile 
    ? `-${(partners.length - 1.25) * 75}%` 
    : `-${(partners.length - 3) * 25}%`;
  const x = useTransform(scrollYProgress, [0.3, 1], ["0%", xStr]);

  const progressWidth = useTransform(scrollYProgress, [0.3, 1], ["0%", "100%"]);

  const gap = useTransform(
    scrollYProgress, 
    [0.15, 0.3], 
    ["1px", isMobile ? "16px" : "24px"]
  );

  // Header and Navigation visibility
  const galleryHeaderOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

  const lines = [
    "We build brands",
    "people remember."
  ];

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-agency-blue">
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseDragMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* Logo */}
        <motion.div 
          className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
          style={{ opacity: heroOpacity }}
        >
          <img 
            src={logoImage} 
            alt="3xHike Logo" 
            style={{
              height: isMobile ? "54px" : "300px",
              width: isMobile ? "60px" : "350px",
              paddingLeft: "0px",
              marginLeft: isMobile ? "-4px" : "-20px",
              marginRight: isMobile ? "-4px" : "-20px",
              marginTop: isMobile ? "-12px" : "-47px",
              marginBottom: isMobile ? "-15px" : "-60px"
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
            className="max-w-2xl mx-auto px-4"
          >
            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed mb-8 font-sans">
              Performance marketing meets cinematic storytelling.<br className="hidden md:block" />
              We help brands scale with scroll-stopping creatives, data-backed ads, and content engineered for attention.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/strategy-call" className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-colors w-full sm:w-auto pointer-events-auto inline-flex items-center justify-center">
                Book a Strategy Call
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Gallery Header (Visible after transition) */}
        <motion.div 
          className="absolute top-10 md:top-20 left-4 md:left-12 z-20 pr-24 md:pr-0"
          style={{ opacity: galleryHeaderOpacity }}
        >
          <h2 className="text-white text-2xl md:text-5xl font-black tracking-tighter uppercase h-auto md:h-[72px]">
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
                key={`${partner.id}-${isMobile}`} 
                partner={partner} 
                index={i} 
                scrollYProgress={scrollYProgress}
                isMobile={isMobile}
                activePartnerId={activePartnerId}
                onCardSelect={() => setActivePartnerId(partner.id)}
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

        {/* Fullscreen Immersive Player */}
        <AnimatePresence>
          {activePartnerId !== null && (
            <FullscreenPlayer
              partner={partners.find((p) => p.id === activePartnerId)!}
              onClose={() => setActivePartnerId(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

function VideoCard({ 
  partner, 
  index, 
  scrollYProgress, 
  isMobile,
  activePartnerId,
  onCardSelect
}: { 
  partner: Partner; 
  index: number; 
  scrollYProgress: any; 
  isMobile: boolean;
  activePartnerId: number | null;
  onCardSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    setIsOpen(latest >= 0.3);
  });

  // Automatically pause/reset when the video expands/collapses out of view
  useEffect(() => {
    if (!isOpen && isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen, isPlaying]);

  // Pause when another card goes fullscreen, or the "Impossible to ignore" section is visible
  useEffect(() => {
    if (activePartnerId !== null && activePartnerId !== partner.id) {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [activePartnerId, partner.id, isPlaying]);

  useEffect(() => {
    const handleGlobalPause = () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("pause-gallery-videos", handleGlobalPause);
    return () => {
      window.removeEventListener("pause-gallery-videos", handleGlobalPause);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!isOpen) return;
    onCardSelect();
  };

  // Transition from block to card
  // Blocks are at the bottom, different widths and heights
  const blockWidths = ["40%", "20%", "20%", "20%"];
  const blockHeights = ["100%", "80%", "80%", "80%"];
  
  // Use website colors for background
  const themeColors = ["bg-[#F4CE14]", "bg-[#FF6B2B]", "bg-[#A0C1A6]", "bg-black", "bg-[#F3EFE9]"];
  const blockColor = themeColors[index % themeColors.length];

  const initialWidth = index < 4 ? blockWidths[index] : "0vw";
  const initialHeight = index < 4 ? blockHeights[index] : "0vh";

  const width = useTransform(scrollYProgress, [0.15, 0.3], [initialWidth, isMobile ? "75vw" : "22vw"]);
  const height = useTransform(scrollYProgress, [0.15, 0.3], [initialHeight, isMobile ? "110vw" : "39vw"]);
  const borderRadius = useTransform(scrollYProgress, [0.15, 0.3], [index < 4 ? "12px 12px 0 0" : "16px", "16px"]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.25], [index < 4 ? 1 : 0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const labelHeight = useTransform(scrollYProgress, [0.3, 0.4], ["0px", "auto"]);

  return (
    <motion.div className="flex-shrink-0 flex flex-col justify-end" style={{ opacity }}>
      <motion.div
        layoutId={`card-${partner.id}`}
        className={`relative overflow-hidden group ${blockColor}`}
        style={{ width, height, borderRadius }}
        onClick={togglePlay}
        onMouseEnter={() => {
          if (isOpen) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <motion.video
          ref={videoRef}
          src={partner.videoUrl}
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: isOpen ? 1 : 0 }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          onLoadedData={() => setIsLoading(false)}
        />
        
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" style={{ opacity: isOpen ? 1 : 0 }} />

        {/* Modern Centered Loading Overlay */}
        {isOpen && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all z-20 pointer-events-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
              <div className="w-10 h-10 rounded-full border-2 border-t-[#F4CE14] border-r-transparent border-b-[#F4CE14]/30 border-l-transparent animate-spin" />
            </div>
          </div>
        )}

        {/* Floating/Centered Play Trigger Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: (isOpen) ? 0.95 : 0,
            scale: (isOpen) ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </motion.div>
        
        {isHovered && isOpen && !isMobile && (
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
            <div className="flex flex-col items-center gap-1">
              <Play className="w-4 h-4 text-black fill-black stroke-[3] ml-0.5" />
              <span>Fullscreen</span>
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

function FullscreenPlayer({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Focus and handle escape key to exit immersive player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleFullscreenPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log("Fullscreen play failed:", err));
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      layoutId={`card-${partner.id}`}
      className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-0 md:p-6 cursor-pointer"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Immersive Video Container */}
      <div 
        className="relative w-full h-[100dvh] md:h-[85vh] max-w-lg aspect-[9/16] bg-black md:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={partner.videoUrl}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover cursor-pointer"
          onClick={toggleFullscreenPlay}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onCanPlay={() => setIsLoading(false)}
        />

        {/* Play/Pause indicator overlay */}
        {!isPlaying && !isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={toggleFullscreenPlay}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
            <div className="w-12 h-12 rounded-full border-2 border-t-[#F4CE14] border-r-transparent border-b-[#F4CE14]/30 border-l-transparent animate-spin" />
          </div>
        )}

        {/* Mute/Unmute Toggle in bottom corner */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-colors cursor-pointer z-10"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white animate-pulse" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-colors cursor-pointer md:hidden z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Desktop Close Button outside video card */}
      <button
        onClick={onClose}
        className="hidden md:flex absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white cursor-pointer backdrop-blur-md transition-colors shadow-lg z-50 hover:scale-105"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Now Playing Info overlay */}
      <div className="absolute bottom-6 left-6 md:left-12 flex flex-col gap-1 text-white z-10 max-w-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#F4CE14] rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#F4CE14] font-black">Now Playing</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black lowercase tracking-tighter truncate">{partner.name}.</h3>
      </div>
    </motion.div>
  );
}
