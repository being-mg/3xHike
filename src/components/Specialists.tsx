import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, Grid, Sparkles, Layers } from "lucide-react";

import specialistImage1 from "../assets/images/regenerated_image_1779221318661.png";
import specialistImage2 from "../assets/images/regenerated_image_1779221315273.png";
import specialistImage3 from "../assets/images/regenerated_image_1779221322859.png";
import specialistImage4 from "../assets/images/regenerated_image_1779220081547.png";

const allSpecialistImages = [
  {
    id: 1,
    src: specialistImage1,
    title: "Creative Direction",
    role: "Visual Storytelling & Narrative",
    accent: "#00d2ff"
  },
  {
    id: 2,
    src: specialistImage2,
    role: "Cinematography & Direct Response",
    title: "Live Production",
    accent: "#ff5733"
  },
  {
    id: 3,
    src: specialistImage3,
    role: "Paid Social & Scaling Strategy",
    title: "Growth Engineering",
    accent: "#d4ff00"
  },
  {
    id: 4,
    src: specialistImage4,
    role: "3D Motion & Graphic Alchemy",
    title: "Motion Design",
    accent: "#8b5cf6"
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dxfgeowvx/image/upload/q_auto/f_auto/v1779220399/Screenshot_2026-05-20_011909_bswmn5.png",
    role: "Creator Casting & Hook Testing",
    title: "UGC Strategy",
    accent: "#ec4899"
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dxfgeowvx/image/upload/q_auto/f_auto/v1779220437/Screenshot_2026-05-20_012344_js3t5g.png",
    role: "Creative Analytics & Data Ops",
    title: "Performance Media",
    accent: "#10b981"
  }
];

export default function Specialists() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAllImages, setShowAllImages] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background color subtle transition
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    ["#050505", "#0a0a0a", "#0a0a0a", "#000000"]
  );

  // Zoom in to fill the screen as the section arrives on screen
  // 0 -> 0.16: Zooms in to fill screen
  const mainStageScale = useTransform(scrollYProgress, [0.0, 0.16], [0.82, 1.22]);
  const mainStageY = useTransform(scrollYProgress, [0.0, 0.16], [50, 0]);

  // Header and controls visibility
  const headerOpacity = useTransform(scrollYProgress, [0.08, 0.18, 0.82, 0.95], [0, 1, 1, 0.4]);
  const endBannerOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return (
    <motion.section 
      ref={containerRef}
      className="relative h-[480vh] bg-black text-white select-none"
      style={{ backgroundColor }}
    >
      {/* Sticky Screen Viewport */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 md:px-10 cursor-pointer"
        onClick={() => setShowAllImages((prev) => !prev)}
      >
        {/* Dynamic Section Header & Interactive Prompt */}
        <motion.div 
          className="absolute top-6 md:top-10 left-6 md:left-14 right-6 md:right-14 z-40 flex items-center justify-between pointer-events-none"
          style={{ opacity: headerOpacity }}
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
              <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.25em] text-[#00d2ff] uppercase">
                Attention Architects
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight font-display">
              Creative Specialists
            </h2>
          </div>

          {/* Click trigger CTA badge */}
          <div className="pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllImages(true);
              }}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer text-xs font-bold uppercase tracking-wider text-white"
            >
              <Grid className="w-3.5 h-3.5 text-[#00d2ff] group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">Click to View All 6 Images</span>
              <span className="sm:hidden">All 6</span>
            </button>
          </div>
        </motion.div>

        {/* Zooming Stage & Reveal Cards Container */}
        <motion.div 
          className="relative w-full max-w-4xl h-[65vh] md:h-[72vh] flex items-center justify-center"
          style={{ scale: mainStageScale, y: mainStageY }}
        >
          {allSpecialistImages.map((item, index) => (
            <AnimatedSpecialistCard
              key={item.id}
              item={item}
              index={index}
              total={allSpecialistImages.length}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Center Hint Prompt when hovering or scrolling */}
          <motion.div 
            className="absolute -bottom-8 md:-bottom-12 z-30 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[11px] font-mono tracking-wider text-white/70"
            style={{ opacity: headerOpacity }}
          >
            <Layers className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Click screen to view all 6 • Scroll to swipe reveal</span>
          </motion.div>
        </motion.div>

        {/* End Position Return Banner */}
        <motion.div 
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center"
          style={{ opacity: endBannerOpacity }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-widest text-[#00d2ff] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deck Reset to Original Position</span>
          </div>
        </motion.div>

        {/* "Click to Show All 6 Images" Modal Overlay */}
        <AnimatePresence>
          {showAllImages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl p-4 md:p-10 flex flex-col justify-between overflow-y-auto cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllImages(false);
              }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between max-w-7xl mx-auto w-full pt-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-[#00d2ff] uppercase tracking-widest block">
                    Complete Roster
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight font-display text-white">
                    All 6 Creative Specialists
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllImages(false);
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 6 Images Grid */}
              <div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto w-full my-auto py-8"
                onClick={(e) => e.stopPropagation()}
              >
                {allSpecialistImages.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="relative group rounded-2xl overflow-hidden bg-neutral-900 border border-white/15 aspect-[3/4] shadow-2xl"
                  >
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 md:p-6 flex flex-col justify-end">
                      <span className="text-[10px] md:text-xs font-mono font-black uppercase text-[#00d2ff] tracking-wider mb-1">
                        0{i + 1} • {item.role}
                      </span>
                      <h4 className="text-base md:text-xl font-bold uppercase tracking-tight text-white font-display">
                        {item.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="max-w-7xl mx-auto w-full text-center pb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllImages(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#00d2ff] transition-colors cursor-pointer"
                >
                  Close & Return to Scroll Experience
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/**
 * Individual Specialist Card with left-to-right alternating swipe reveal
 * and graceful reset back to original position at end of scroll.
 */
function AnimatedSpecialistCard({
  item,
  index,
  total,
  scrollYProgress
}: {
  item: typeof allSpecialistImages[0];
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  // Base stacked angles and offsets
  const baseRotations = [-6, 5, -3, 4, -5, 2];
  const baseRotation = baseRotations[index] || 0;
  const baseOffsetX = (index % 2 === 0 ? -1 : 1) * (index * 4);
  const baseOffsetY = (index - 2.5) * 6;

  /**
   * Scroll Reveal Intervals:
   * Card 0: Swipes UP and goes LEFT [0.18 -> 0.30]
   * Card 1: Goes RIGHT [0.32 -> 0.44]
   * Card 2: Swipes UP and goes LEFT [0.46 -> 0.58]
   * Card 3: Goes RIGHT [0.60 -> 0.72]
   * Card 4: Swipes UP and goes LEFT [0.74 -> 0.84]
   * Card 5: Revealed base card
   * 
   * End Reset [0.86 -> 0.98]:
   * All cards return from left/right back to their original stacked position!
   */
  const swipeDirection = index % 2 === 0 ? "left" : "right";

  // Compute scroll phase bounds for each card
  const startPhase = 0.18 + index * 0.135;
  const exitPhase = startPhase + 0.11;
  const resetStart = 0.86;
  const resetEnd = 0.97;

  // Determine horizontal translation
  let xRange: string[] = ["0vw", "0vw", "0vw", "0vw", "0vw"];
  let yRange = [baseOffsetY, baseOffsetY, baseOffsetY, baseOffsetY, baseOffsetY];
  let rotRange = [baseRotation, baseRotation, baseRotation, baseRotation, baseRotation];
  let scaleRange = [1, 1, 1, 1, 1];

  if (index < total - 1) {
    const targetX = swipeDirection === "left" ? "-135vw" : "135vw";
    const targetY = swipeDirection === "left" ? -45 : 35;
    const targetRot = swipeDirection === "left" ? -22 : 22;

    xRange = ["0vw", "0vw", targetX, targetX, "0vw"];
    yRange = [baseOffsetY, baseOffsetY - 25, targetY, targetY, baseOffsetY];
    rotRange = [baseRotation, baseRotation, targetRot, targetRot, baseRotation];
    scaleRange = [1, 1.02, 0.9, 0.9, 1];
  } else {
    // The final base card (index 5) gently scales and elevates as it is unveiled
    scaleRange = [0.94, 0.94, 1.05, 1.05, 0.95];
    xRange = ["0vw", "0vw", "0vw", "0vw", "0vw"];
    yRange = [baseOffsetY, baseOffsetY, 0, 0, baseOffsetY];
    rotRange = [baseRotation, baseRotation, 0, 0, baseRotation];
  }

  const x = useTransform(
    scrollYProgress,
    [0, startPhase, exitPhase, resetStart, resetEnd],
    xRange
  );

  const y = useTransform(
    scrollYProgress,
    [0, startPhase, exitPhase, resetStart, resetEnd],
    yRange
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, startPhase, exitPhase, resetStart, resetEnd],
    rotRange
  );

  const scale = useTransform(
    scrollYProgress,
    [0, startPhase, exitPhase, resetStart, resetEnd],
    scaleRange
  );

  return (
    <motion.div
      className="absolute w-[75vw] h-[50vh] sm:w-[58vw] sm:h-[58vh] md:w-[36vw] md:h-[65vh] lg:w-[26vw] lg:h-[62vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-900 group"
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex: 30 - index
      }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <img 
        src={item.src} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      
      {/* Bottom Info Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-between p-5 md:p-7 pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] md:text-xs font-mono font-black uppercase px-2.5 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[#00d2ff]">
            0{index + 1}
          </span>
          <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/70 uppercase">
            {swipeDirection === "left" ? "Swipe Left" : "Swipe Right"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-white/80 block">
            {item.role}
          </span>
          <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-white font-display">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
