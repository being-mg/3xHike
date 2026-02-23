import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useInView } from "framer-motion";

export default function PhysicsPlayground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (!sceneRef.current || !isInView) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Query } = Matter;
    const engine = Engine.create();
    const world = engine.world;

    const width = window.innerWidth;
    const height = sceneRef.current.offsetHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio,
      },
    });

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });
    Composite.add(world, [ground, leftWall, rightWall]);

    // Create falling elements
    const labels = ["insta", "phone number", "address", "what's app", "email", "lets talk"];
    const colors = ["#2B38F1", "#F4CE14", "#FF6B2B", "#A0C1A6", "#1A1A1A"];
    const shapes: Matter.Body[] = [];

    // Add specific label shapes
    for (let i = 0; i < 30; i++) {
      const label = labels[i % labels.length];
      const x = Math.random() * width;
      const y = -Math.random() * 3000 - 200;
      const color = colors[i % colors.length];
      
      // Calculate width based on text length
      const textWidth = label.length * 12 + 40;
      const body = Bodies.rectangle(x, y, textWidth, 50, {
        restitution: 0.4,
        friction: 0.5,
        chamfer: { radius: 25 },
        label: label, // Store label in the body
        render: { 
          fillStyle: color,
          strokeStyle: "#000000",
          lineWidth: 1
        }
      });
      
      shapes.push(body);
    }
    Composite.add(world, shapes);

    // Draw text on bodies
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      const bodies = Composite.allBodies(world);

      context.font = "bold 14px Inter, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";

      bodies.forEach((body) => {
        if (body.label && labels.includes(body.label)) {
          const { x, y } = body.position;
          context.save();
          context.translate(x, y);
          context.rotate(body.angle);
          context.fillStyle = (body.render.fillStyle === "#1A1A1A" || body.render.fillStyle === "#2B38F1") ? "#FFFFFF" : "#000000";
          context.fillText(body.label.toUpperCase(), 0, 0);
          context.restore();
        }
      });
    });

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(world, mouseConstraint);

    // Custom event to handle pointer-events toggle and clicks
    const handleMouseDown = () => {
      const bodies = Composite.allBodies(world);
      const clickedBodies = Query.point(bodies, mouse.position);
      
      if (clickedBodies.length > 0) {
        const clickedBody = clickedBodies[0];
        
        // Handle specific label clicks
        if (clickedBody.label === "phone number") {
          window.location.href = "tel:+919140659614";
        } else if (clickedBody.label === "email") {
          window.location.href = "mailto:niels@dorstenlesser.nl";
        } else if (clickedBody.label === "insta") {
          window.open("https://instagram.com", "_blank");
        } else if (clickedBody.label === "what's app") {
          window.open("https://wa.me/919140659614", "_blank");
        }
        
        setIsInteractive(true);
      }
    };

    const handleMouseUp = () => {
      setIsInteractive(false);
    };

    const handleMouseMove = () => {
      const bodies = Composite.allBodies(world);
      const hoveredBodies = Query.point(bodies, mouse.position);
      if (hoveredBodies.length > 0) {
        const body = hoveredBodies[0];
        const clickableLabels = ["phone number", "email", "insta", "what's app"];
        if (body.label && clickableLabels.includes(body.label)) {
          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "grab";
        }
      } else {
        document.body.style.cursor = "default";
      }
    };

    // We need to listen on the window or a parent to catch the initial click
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const handleResize = () => {
      if (!sceneRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = sceneRef.current.offsetHeight;
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "default";
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [isInView]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
      <div 
        ref={sceneRef} 
        className={`w-full h-full transition-opacity duration-1000 ${isInView ? "opacity-100" : "opacity-0"} ${isInteractive ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ pointerEvents: isInteractive ? "auto" : "none" }}
      />
    </div>
  );
}

