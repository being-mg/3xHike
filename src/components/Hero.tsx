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
    { id: 1, name: "grazia stone", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/v1789470128/interior_design__igzbig.mov", clientUrl: "#" },
    { id: 2, name: "plan my interior", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/v1789470115/Doors_AI_ads_wyxe3y.mp4", clientUrl: "#" },
    { id: 3, name: "vistara infra", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/v1789470089/Motion_graphics_Real_estate__a9vjjt.mp4", clientUrl: "#" },
    { id: 4, name: "zairaa jewellery", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/v1789470191/ai_story_bracelet_ad_yyg7v1.mp4", clientUrl: "#" },
    { id: 5, name: "cinco living", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/v1789470063/ugc_ad__hiaweb.mp4", clientUrl: "#" },
    { id: 6, name: "allen town", videoUrl: "https://res.cloudinary.com/dxfgeowvx/video/upload/v1789470178/school_ad_mbyb6i.mp4", clientUrl: "#" }
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
    ["0vh", "0vh", isMobile ? "-12vh" : "-15vh"]
  );
  
  const blocksContainerWidth = useTransform(
    scrollYProgress, 
    [0.15, 0.3], 
    [isMobile ? "75vw" : "25vw", "100vw"]
  );

  const blocksContainerPadding = useTransform(
    scrollYProgress, 
    [0.15, 0.3], 
    ["0px", isMobile ? "16px" : "48px"]
  );
  
  // Horizontal Scroll
  // 0.3 to 1: Scroll horizontally
  const xStr = isMobile 
    ? `-${(partners.length - 1.3) * 60}%` 
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
    "WE BUILD BRANDS",
    "PEOPLE REMEMBER."
  ];

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-black text-white">
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
        
        {/* Hero Content with Logo in Flow */}
        <motion.div 
          className="text-center max-w-7xl z-10 pointer-events-none flex flex-col items-center justify-center gap-4 md:gap-6 px-4"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Logo placed directly in flow above tagline, scaled elegantly to prevent any overlap */}
          <div className="pointer-events-auto flex justify-center items-center mb-2 md:mb-4">
            <img 
              src={logoImage} 
              alt="3xHike Logo" 
              className="h-14 sm:h-20 md:h-28 lg:h-36 xl:h-44 w-auto object-contain transition-all duration-300"
            />
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/60 tracking-[0.2em] text-sm md:text-base font-medium font-sans uppercase mb-[-0.5rem] md:mb-[-1rem]"
          >
            PERFORMANCE • CONTENT • GROWTH
          </motion.p>
          
          <h1 className="text-white text-[10vw] md:text-[7.5vw] uppercase leading-[0.95] font-black tracking-tight px-4 font-display">
            <div>
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                WE BUILD BRANDS
              </motion.div>
            </div>
            <div className="overflow-hidden pb-4 md:pb-0">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#00d2ff]"
              >
                PEOPLE REMEMBER.
              </motion.div>
            </div>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-2xl mx-auto px-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/strategy-call" className="bg-white text-black hover:bg-black hover:text-white hover:border-[#00d2ff] hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] border border-transparent px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-all w-full sm:w-auto pointer-events-auto inline-flex items-center justify-center">
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
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end overflow-visible h-[18vh] md:h-[15vh]"
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

    // In the hero section: keep videos strictly paused
    if (latest < 0.2) {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  });

  // Only play video when mouse is hovering over the card, otherwise keep paused
  useEffect(() => {
    if (!videoRef.current) return;

    if (isOpen && isHovered && activePartnerId === null) {
      videoRef.current.play().catch(() => {});
    } else {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [isOpen, isHovered, activePartnerId]);

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
  
  // Distinct, vibrant color themes for each hero panel
  const panelThemes = [
    {
      card: "bg-[#d4ff00] border-t-2 border-[#eaff66] shadow-[0_0_30px_rgba(212,255,0,0.35)] text-black",
      badge: "bg-black/20 text-black border border-black/20",
      accent: "text-black"
    },
    {
      card: "bg-[#ff5733] border-t-2 border-orange-200 shadow-[0_0_30px_rgba(255,87,51,0.35)] text-white",
      badge: "bg-black/25 text-white border border-white/20",
      accent: "text-white"
    },
    {
      card: "bg-[#8b5cf6] border-t-2 border-purple-200 shadow-[0_0_30px_rgba(139,92,246,0.35)] text-white",
      badge: "bg-black/25 text-white border border-white/20",
      accent: "text-white"
    },
    {
      card: "bg-[#10b981] border-t-2 border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.35)] text-black",
      badge: "bg-black/20 text-black border border-black/20",
      accent: "text-black"
    },
    {
      card: "bg-[#f59e0b] border-t-2 border-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.35)] text-black",
      badge: "bg-black/20 text-black border border-black/20",
      accent: "text-black"
    },
    {
      card: "bg-[#ec4899] border-t-2 border-pink-200 shadow-[0_0_30px_rgba(236,72,153,0.35)] text-white",
      badge: "bg-black/25 text-white border border-white/20",
      accent: "text-white"
    }
  ];
  const theme = panelThemes[index % panelThemes.length];

  const initialWidth = index < 4 ? blockWidths[index] : "0vw";
  const initialHeight = index < 4 ? blockHeights[index] : "0vh";

  // Match standard 9:16 aspect ratio exactly for mobile (60vw / 106.6vw = 0.562) and desktop (22vw / 39vw = 0.564)
  const width = useTransform(scrollYProgress, [0.15, 0.3], [initialWidth, isMobile ? "60vw" : "22vw"]);
  const height = useTransform(scrollYProgress, [0.15, 0.3], [initialHeight, isMobile ? "106.6vw" : "39vw"]);
  const borderRadius = useTransform(scrollYProgress, [0.15, 0.3], [index < 4 ? "12px 12px 0 0" : "16px", "16px"]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.25], [index < 4 ? 1 : 0, 1]);
  
  // Smoothly animate the label height, opacity, and margin to prevent vertical jumps or overlap issues
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const labelHeight = useTransform(scrollYProgress, [0.3, 0.4], [0, 24]);
  const labelMarginTop = useTransform(scrollYProgress, [0.3, 0.4], [0, 12]);

  // In the hero section (before scroll), videoOpacity is 0 so the vibrant panel color is 100% visible
  // Only as user scrolls into the gallery (0.18 -> 0.3), the video fades in
  const videoOpacity = useTransform(scrollYProgress, [0.18, 0.3], [0, 1.0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.18, 0.3], [0, 0.1]);
  
  // Hero panel information overlay (fades out as user scrolls into gallery)
  const heroPanelContentOpacity = useTransform(scrollYProgress, [0.12, 0.22], [1, 0]);

  // Float classes only apply in Hero (peeking) mode, then smoothly disabled as the gallery opens
  const floatClass = !isOpen 
    ? (index % 2 === 0 ? "animate-float" : "animate-float-delayed") 
    : "";

  // Cloudinary instant poster frame
  const posterUrl = partner.videoUrl.replace(/\.(mp4|mov)$/i, ".jpg");

  return (
    <motion.div className={`flex-shrink-0 flex flex-col justify-end ${floatClass}`} style={{ opacity }}>
      <motion.div
        className={`relative overflow-hidden group transition-colors duration-500 ${theme.card}`}
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
        {/* Hero Section: Colorful Panel Identity (Visible before scroll) */}
        <motion.div 
          className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between pointer-events-none z-[5]"
          style={{ opacity: heroPanelContentOpacity }}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[9px] md:text-xs font-mono font-black uppercase px-2 py-0.5 rounded-full ${theme.badge}`}>
              0{index + 1}
            </span>
            <div className="w-2 h-2 rounded-full bg-current opacity-80 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-mono opacity-75 block">Brand Case</span>
            <h3 className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-tight font-display leading-tight truncate ${theme.accent}`}>
              {partner.name}
            </h3>
          </div>
        </motion.div>

        {/* Video Preview: Paused and hidden in hero section, plays ONLY when hovered in gallery */}
        <motion.video
          ref={videoRef}
          src={partner.videoUrl}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0"
          style={{ opacity: videoOpacity }}
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
          onError={(e) => {
            const target = e.currentTarget;
            if (partner.videoUrl.endsWith('.mov') && !target.src.endsWith('.mp4')) {
              target.src = partner.videoUrl.replace(/\.mov$/, '.mp4');
              target.load();
              target.play().catch(() => {});
            }
          }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" 
          style={{ opacity: overlayOpacity }} 
        />

        {/* Modern Centered Loading Overlay */}
        {isOpen && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all z-20 pointer-events-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
              <div className="w-10 h-10 rounded-full border-2 border-t-[#00d2ff] border-r-transparent border-b-[#00d2ff]/30 border-l-transparent animate-spin" />
            </div>
          </div>
        )}

        {/* Floating/Centered Play Trigger Overlay - visible when not playing on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: (isOpen && (!isHovered || !isPlaying)) ? 0.95 : 0,
            scale: (isOpen && (!isHovered || !isPlaying)) ? 1 : 0.85
          }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-2"
        >
          <div className="w-14 h-14 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
            Hover to play
          </span>
        </motion.div>
        
        {isHovered && isOpen && !isMobile && (
          <motion.div
            className="fixed pointer-events-none z-50 w-24 h-24 bg-white rounded-full flex items-center justify-center text-black text-[10px] font-black uppercase tracking-tighter text-center p-4 shadow-xl animate-pulse"
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
        className="flex items-center gap-2 overflow-hidden"
        style={{ opacity: labelOpacity, height: labelHeight, marginTop: labelMarginTop }}
      >
        <div className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-pulse" />
        <span className="text-white text-xs md:text-sm font-bold uppercase tracking-widest font-display truncate max-w-[90%]">{partner.name}</span>
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
      className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-0 md:p-6 cursor-pointer"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Immersive Video Container */}
      <motion.div 
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="relative h-[100dvh] md:h-[85vh] aspect-[9/16] max-w-full bg-black md:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center cursor-default"
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
          onError={(e) => {
            const target = e.currentTarget;
            if (partner.videoUrl.endsWith('.mov') && !target.src.endsWith('.mp4')) {
              target.src = partner.videoUrl.replace(/\.mov$/, '.mp4');
              target.load();
              target.play().catch(() => {});
            }
          }}
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
            <div className="w-12 h-12 rounded-full border-2 border-t-[#00d2ff] border-r-transparent border-b-[#00d2ff]/30 border-l-transparent animate-spin" />
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
      </motion.div>

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
          <div className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-[#00d2ff] font-black">Now Playing</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black lowercase tracking-tighter truncate">{partner.name}.</h3>
      </div>
    </motion.div>
  );
}
