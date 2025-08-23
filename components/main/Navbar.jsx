"use client";
import { ChevronUp, Globe, Rocket, Satellite, Telescope } from "lucide-react";
import { useEffect, useState } from "react";

const SpaceNavbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setShowScrollTop(currentScrollPos > 100);

      const sections = ["home", "earth", "space", "mars"];
      let current = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 3 &&
            rect.bottom >= window.innerHeight / 3
          ) {
            current = section;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);

    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { name: "Home", href: "#home", icon: Rocket },
    { name: "Earth Climate", href: "#earth", icon: Globe },
    { name: "Space Explorer", href: "#space", icon: Telescope },
    { name: "Mars Rover", href: "#mars", icon: Satellite },
  ];

  return (
    <>
      {/* Always visible nav bar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="relative">
          {/* Background blur */}
          <div className="absolute inset-0 rounded-2xl bg-[#030014]/50 backdrop-blur-md border border-purple-500/10 shadow-[0_8px_32px_rgba(139,92,246,0.12)]" />

          {/* Logo - positioned to the left */}

          {/*          
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 group hidden lg:flex">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 p-0.5 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-[#030014] flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                {/* Orbital ring animation */}
          {/* <div
                  className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <div
                  className="absolute inset-1 rounded-full border border-purple-400/20 animate-spin"
                  style={{
                    animationDuration: "4s",
                    animationDirection: "reverse",
                  }}
                />
              </div>
            </div>
          </div> */}

          {/* Navigation */}
          <nav
            className="relative px-3 py-3 rounded-2xl"
            role="navigation"
            aria-label="Main navigation"
          >
            <ul className="flex items-center justify-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.href.slice(1);
                const isHovered = hoveredItem === item.name;

                return (
                  <li key={item.name} className="relative">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl
                        text-sm font-medium transition-all duration-300 hover:scale-105
                        ${
                          isActive
                            ? "text-white"
                            : "text-gray-300 hover:text-white"
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.name}</span>
                      <span
                        className={`
                        absolute left-1/2 -translate-x-1/2 whitespace-nowrap
                        px-2 py-1 text-xs rounded-md transition-all duration-200
                        bg-[#030014] text-gray-300 border border-purple-500/20
                        opacity-0 -translate-y-10 pointer-events-none sm:hidden
                        ${isHovered ? "opacity-100 -translate-y-8" : ""}
                      `}
                      >
                        {item.name}
                      </span>
                    </a>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/80 to-cyan-600/80 transition-all duration-300" />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Scroll-to-top button - only visible when scrolling */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-xl bg-[#030014]/50 backdrop-blur-md border border-purple-500/10 shadow-[0_8px_32px_rgba(139,92,246,0.12)] text-gray-400 hover:text-gray-100 hover:bg-purple-500/20 hover:scale-110 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Logo */}
      <div className="fixed top-2 left-4 z-50 lg:hidden">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 p-0.5">
              <div className="w-full h-full rounded-full bg-[#030014] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>
          <h1 className="text-sm font-bold Welcome-text">
            Earth & Space Explorer
          </h1>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default SpaceNavbar;
