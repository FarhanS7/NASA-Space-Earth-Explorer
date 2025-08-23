"use client";
import { Globe, Menu, Rocket, Satellite, Telescope, X } from "lucide-react";
import { useEffect, useState } from "react";

const SpaceNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#", icon: Rocket },
    { name: "Earth Climate", href: "#earth", icon: Globe },
    { name: "Space Explorer", href: "#space", icon: Telescope },
    { name: "Mars Rover", href: "#mars", icon: Satellite },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled
            ? "bg-[#030014]/80 backdrop-blur-xl border-b border-purple-500/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 p-0.5 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-[#030014] flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  {/* Orbital ring animation */}
                  <div
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
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold Welcome-text">
                    Earth & Space Explorer
                  </h1>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Hover background effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-600/0 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-cyan-600/20 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 backdrop-blur-sm transition-all duration-300" />

                      {/* Content */}
                      <div className="relative flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 group-hover:text-cyan-400 transition-colors duration-300" />
                        <span className="font-medium">{item.name}</span>
                      </div>

                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-6 h-6 relative">
                  <Menu
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2 bg-[#030014]/95 backdrop-blur-xl border-b border-purple-500/20">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 group-hover:from-purple-600/40 group-hover:to-cyan-600/40 transition-all duration-300">
                    <IconComponent className="w-4 h-4 group-hover:text-cyan-400 transition-colors duration-300" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              );
            })}
          </div>
        </div>
      </nav>

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
