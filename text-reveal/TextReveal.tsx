"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  /**
   * If true, animation triggers when element enters viewport.
   * If false, it plays immediately on mount (or when key changes).
   */
  animateOnScroll?: boolean;
  /**
   * Delay before animation starts (in seconds)
   */
  delay?: number;
  /**
   * ClassName for the wrapper
   */
  className?: string;
  /**
   * Stagger time between lines (in seconds)
   */
  stagger?: number;
  /**
   * If provided, controls the visibility/trigger manually.
   * true = animate in
   * false = hidden
   */
  trigger?: boolean;
}

/**
 * TextReveal component
 * Splits text into lines and animates them up from a masked container.
 */
export default function TextReveal({
  children,
  animateOnScroll = false,
  delay = 0,
  className = "",
  stagger = 0.1,
  trigger,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // If manual trigger is provided and false, stay hidden
      if (trigger === false) {
        if (containerRef.current) containerRef.current.style.opacity = "0";
        return;
      }

      if (!containerRef.current) return;
      containerRef.current.style.opacity = "1";

      let elements: HTMLElement[] = [];
      // Handle multiple children or generic wrapper
      if (containerRef.current.children.length > 0) {
        elements = Array.from(containerRef.current.children) as HTMLElement[];
      } else {
        elements = [containerRef.current];
      }

      const allLines: HTMLElement[] = [];
      const splits: SplitType[] = [];

      // 1. Split text
      elements.forEach((element) => {
        // Only split if it has text content
        if (!element.textContent?.trim()) return;

        const split = new SplitType(element, {
          types: "lines",
          lineClass: "line",
        });
        splits.push(split);

        // 2. Wrap lines in masks
        if (split.lines) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "line-mask";
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "block";
            wrapper.style.padding = "0.002em 0"; // Slight padding for render clipping prevention

            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
            allLines.push(line);
          });
        }
      });

      // 3. Set initial state (hidden/offset)
      gsap.set(allLines, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1,
        stagger: stagger,
        ease: "power4.out",
        delay: delay,
      };

      // 4. Animate
      if (animateOnScroll) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          onEnter: () => gsap.to(allLines, animationProps),
          once: true, // Play once
        });
      } else {
        gsap.to(allLines, animationProps);
      }

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === containerRef.current) t.kill();
        });
        splits.forEach((s) => s.revert());

        // Remove wrappers to clean DOM
        if (containerRef.current) {
          const masks = containerRef.current.querySelectorAll(".line-mask");
          masks.forEach((mask) => {
            while (mask.firstChild) {
              mask.parentNode?.insertBefore(mask.firstChild, mask);
            }
            mask.remove();
          });
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [trigger, animateOnScroll, delay, children], // Re-run if children change
    }
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ opacity: 0 }} // Start hidden to prevent FOUC
    >
      {children}
    </div>
  );
}
