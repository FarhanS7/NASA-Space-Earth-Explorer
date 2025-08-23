import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useGsap3DAnimations(refs) {
  useEffect(() => {
    if (!refs) return;

    const { planets, rocket } = refs;

    // Animate planets safely (never scale 0 → avoids NaN)
    planets.forEach((planet, i) => {
      if (!planet.current) return;

      gsap.fromTo(
        planet.current.scale,
        { x: 0.001, y: 0.001, z: 0.001 }, // 👈 small epsilon
        {
          x: 1,
          y: 1,
          z: 1,
          delay: i * 0.2,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".three-canvas",
            start: "top 80%",
          },
        }
      );
    });

    // Animate rocket "take off" on scroll
    if (rocket.current) {
      gsap.to(rocket.current.position, {
        y: 5,
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".three-canvas",
          start: "top center",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, [refs]);
}
