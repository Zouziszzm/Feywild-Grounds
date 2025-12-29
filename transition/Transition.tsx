"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

export interface TransitionHandle {
  cover: (onComplete?: () => void) => void;
  reveal: (onComplete?: () => void) => void;
}

interface TransitionProps {
  /**
   * Color of the transition blocks
   */
  blockColor?: string;
  /**
   * Number of blocks (columns or rows)
   */
  numberOfBlocks?: number;
}

/**
 * Transition Component
 * Renders a layer of blocks that can cover/reveal the screen.
 * Exposes 'cover' and 'reveal' methods via ref.
 */
const Transition = forwardRef<TransitionHandle, TransitionProps>(
  ({ blockColor = "#333", numberOfBlocks = 25 }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const blocksRef = useRef<HTMLDivElement[]>([]);

    // Create blocks on mount
    useEffect(() => {
      if (!overlayRef.current) return;

      // Clear existing
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];

      for (let i = 0; i < numberOfBlocks; i++) {
        const block = document.createElement("div");
        block.style.backgroundColor = blockColor;
        block.style.width = "100%";
        block.style.height = `calc(100% / ${numberOfBlocks} + 2px)`;
        block.style.marginTop = "-1px"; // Slight negative margin to force overlap
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }

      // Initial state: hidden (scaled down)
      gsap.set(blocksRef.current, { scaleY: 0, transformOrigin: "bottom" });
    }, [blockColor, numberOfBlocks]);

    useImperativeHandle(ref, () => ({
      cover: (onComplete) => {
        if (!overlayRef.current) return;
        overlayRef.current.style.pointerEvents = "auto";

        gsap.set(blocksRef.current, { scaleY: 0, transformOrigin: "bottom" });
        gsap.to(blocksRef.current, {
          scaleY: 1,
          duration: 0.5,
          stagger: {
            each: 0.02,
            from: "end",
          },
          ease: "power2.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      },
      reveal: (onComplete) => {
        if (!overlayRef.current) return;

        // Ensure full before shrinking
        gsap.set(blocksRef.current, { scaleY: 1, transformOrigin: "top" });

        gsap.to(blocksRef.current, {
          scaleY: 0,
          duration: 0.5,
          stagger: {
            each: 0.02,
            from: "end",
          },
          ease: "power2.out",
          onComplete: () => {
            if (overlayRef.current)
              overlayRef.current.style.pointerEvents = "none";
            if (onComplete) onComplete();
          },
        });
      },
    }));

    return (
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
        }}
      />
    );
  }
);

Transition.displayName = "Transition";

export default Transition;
