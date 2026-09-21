"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

interface CinematicScrollProps {
  frameCount: number;
  framePath: (index: number) => string;
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
  bgColor?: string;
}

export default function CinematicScroll({ frameCount, framePath, title, children, reverse = false, bgColor = "#010101" }: CinematicScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  // Use framer-motion to track scroll progress over the section
  // Animation starts when the section enters the viewport, and finishes when it leaves
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Draw frame helper function
  const drawFrame = (frameIndex: number, imgs: HTMLImageElement[] = images) => {
    if (!canvasRef.current || imgs.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const safeIndex = Math.min(Math.max(1, frameIndex), imgs.length);
    const img = imgs[safeIndex - 1];
    
    if (img && img.complete) {
      // Use offsetWidth/offsetHeight for the responsive canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio  = Math.min ( hRatio, vRatio );
      
      const centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      const centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0,0, img.width, img.height,
                        centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
    }
  };

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1 || i === 1) {
          // Temporarily disable the exhaustive-deps rule here as drawFrame is defined above
          // eslint-disable-next-line react-hooks/exhaustive-deps
          drawFrame(1, loadedImages);
        }
      };
      loadedImages.push(img);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImages(loadedImages);
  }, [frameCount, framePath]);

  // Sync scroll with frame draw using framer-motion's onChange
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const frameIndex = Math.ceil(latest * frameCount) || 1;
      requestAnimationFrame(() => {
        drawFrame(frameIndex);
      });
    });
    
    drawFrame(1);
    
    const handleResize = () => {
      const currentScroll = scrollYProgress.get();
      const frameIndex = Math.ceil(currentScroll * frameCount) || 1;
      drawFrame(frameIndex);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollYProgress, frameCount, images]);

  const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <section 
      ref={containerRef} 
      style={{ 
        display: "flex", 
        flexDirection: reverse ? "row-reverse" : "row", 
        backgroundColor: bgColor,
        overflow: "hidden"
      }}
      className="cinematic-scroll-section"
    >
      {/* Animation Half */}
      <div style={{ flex: "0 0 50%", position: "relative", minHeight: "60vh" }}>
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: "100%", 
            height: "100%", 
            display: "block",
            position: "absolute",
            inset: 0
          }} 
        />
      </div>

      {/* Text Half */}
      <div style={{ 
        flex: "0 0 50%", 
        display: "flex", 
        alignItems: "center",
        justifyContent: reverse ? "flex-end" : "flex-start",
        padding: "80px 0",
        backgroundImage: noiseTexture,
        backgroundSize: "200px"
      }}>
        <div style={{ 
          maxWidth: "460px", // Aligning with the 1000px booking-container
          padding: reverse ? "0 60px 0 40px" : "0 40px 0 60px",
          width: "100%"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '24px', color: '#92c230' }}>{title}</h2>
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple responsive rule using styled-jsx to stack on mobile if needed */}
      <style jsx>{`
        @media (max-width: 768px) {
          .cinematic-scroll-section {
            flex-direction: column !important;
          }
          .cinematic-scroll-section > div {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .cinematic-scroll-section > div:nth-child(2) {
            padding: 60px 20px !important;
            justify-content: center !important;
          }
          .cinematic-scroll-section > div:nth-child(2) > div {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
