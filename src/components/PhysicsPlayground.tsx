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
    const colors = ["#2B38F1", "#F4CE14", "#FF6B2B", "#A0C1A6", "#FFFFFF"];
    const shapes: Matter.Body[] = [];

    // Add some "Scoop" shapes
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width;
      const y = -Math.random() * 2000 - 200; // Start even higher for a delayed fall effect
      const size = 50 + Math.random() * 70;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      let body;
      const type = Math.random();
      
      if (type < 0.3) {
        // Flower shape (approximated with a circle and high friction)
        body = Bodies.circle(x, y, size / 2, {
          restitution: 0.4,
          friction: 0.5,
          render: { 
            fillStyle: color,
            strokeStyle: "#000000",
            lineWidth: 1
          }
        });
      } else if (type < 0.6) {
        // Stack shape (rectangle)
        body = Bodies.rectangle(x, y, size * 1.2, size * 0.8, {
          restitution: 0.4,
          friction: 0.5,
          chamfer: { radius: 15 },
          render: { 
            fillStyle: color,
            strokeStyle: "#000000",
            lineWidth: 1
          }
        });
      } else {
        // Wave shape (capsule-like)
        body = Bodies.rectangle(x, y, size * 1.5, size * 0.5, {
          restitution: 0.4,
          friction: 0.5,
          chamfer: { radius: 25 },
          render: { 
            fillStyle: color,
            strokeStyle: "#000000",
            lineWidth: 1
          }
        });
      }
      shapes.push(body);
    }
    Composite.add(world, shapes);

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

    // Custom event to handle pointer-events toggle
    const handleMouseDown = () => {
      const bodies = Composite.allBodies(world);
      const clickedBodies = Query.point(bodies, mouse.position);
      if (clickedBodies.length > 0) {
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
        document.body.style.cursor = "grab";
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

