import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimations(isVisible) {
  useEffect(() => {
    if (!isVisible) return;

    // Hero Heading animation
    gsap.fromTo(
      ".hero-heading span",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      }
    );

    // Features
    gsap.fromTo(
      ".feature-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feature-card",
          start: "top 85%",
        },
      }
    );

    // Stats
    gsap.fromTo(
      ".stat-item",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".stat-item",
          start: "top 90%",
        },
      }
    );
  }, [isVisible]);
}
