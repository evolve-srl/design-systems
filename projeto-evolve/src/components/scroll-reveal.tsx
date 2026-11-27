import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./scroll-reveal.css";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  amount?: number;
  blur?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 20,
  amount = 0.18,
  blur = 0,
  duration = 0.72,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setIsReady(true);
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: Math.min(Math.max(amount, 0), 1) },
    );
    setIsReady(true);
    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);

  const style = {
    "--reveal-distance": `${distance}px`,
    "--reveal-blur": `${blur}px`,
    "--reveal-delay": `${delay}s`,
    "--reveal-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div
      ref={elementRef}
      className={className}
      data-scroll-reveal=""
      data-reveal-ready={isReady ? "true" : undefined}
      data-reveal-visible={isVisible ? "true" : undefined}
      style={style}
    >
      {children}
    </div>
  );
}
