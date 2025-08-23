"use client";
import {
  ArrowUp,
  ExternalLink,
  Github,
  Globe,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Satellite,
  Star,
  Telescope,
  Twitter,
  Youtube,
  Zap,
} from "lucide-react";
import { useState } from "react";

const SpaceFooter = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerLinks = {
    explore: [
      { name: "Earth Climate", href: "#earth", icon: Globe },
      { name: "Space Explorer", href: "#space", icon: Telescope },
      { name: "Mars Rover", href: "#mars", icon: Satellite },
      { name: "Solar System", href: "#solar-system", icon: Star },
    ],
    resources: [
      { name: "NASA Data", href: "#", icon: ExternalLink },
      { name: "API Documentation", href: "#", icon: ExternalLink },
      { name: "Educational Content", href: "#", icon: ExternalLink },
      { name: "Research Papers", href: "#", icon: ExternalLink },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-300" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "#",
      color: "hover:text-blue-500",
    },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-500" },
  ];

  const stats = [
    { label: "Active Users", value: "15,000+", icon: Globe },
    { label: "Data Points", value: "2.5M+", icon: Zap },
    { label: "Countries", value: "120+", icon: MapPin },
    { label: "Updates Daily", value: "500+", icon: Satellite },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#030014] to-[#0A0A2E] border-t border-purple-500/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        {/* Animated Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Stats Section */}
        {/* <div className="border-b border-purple-500/10">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 group-hover:from-purple-600/40 group-hover:to-cyan-600/40 transition-all duration-300 mb-3">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold Welcome-text mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}

        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-[#030014] flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  {/* Orbital rings */}
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
                <div>
                  <h3 className="text-xl font-bold Welcome-text">
                    Earth & Space
                  </h3>
                  <p className="text-sm text-gray-400">Explorer</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Discover the wonders of our planet and the infinite mysteries of
                space through interactive visualizations and real-time data.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>hello@earthspace.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+1 (555) 123-SPACE</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span>Houston, TX</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6 flex items-center">
                <Telescope className="w-4 h-4 mr-2 text-cyan-400" />
                Explore
              </h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 group"
                      >
                        <IconComponent className="w-4 h-4 group-hover:text-cyan-400 transition-colors duration-300" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-6 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-400" />
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 group"
                      >
                        <span>{link.name}</span>
                        <IconComponent className="w-3 h-3 group-hover:text-cyan-400 transition-colors duration-300" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-6 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-400" />
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Newsletter */}
              <div className="mt-8">
                <h5 className="text-white font-medium mb-3">Stay Updated</h5>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500/60 transition-colors duration-300"
                  />
                  <button className="button-primary px-4 py-2 rounded-lg text-white text-sm font-medium hover:scale-105 transition-transform duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <span>© 2025 Earth & Space Explorer. Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                <span>for space enthusiasts.</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                      onMouseEnter={() => setHoveredSocial(social.name)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              {/* Scroll to Top */}
              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/40 hover:to-cyan-600/40 text-cyan-400 hover:scale-110 transition-all duration-300"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-20 left-10 opacity-20">
          <Satellite
            className="w-8 h-8 text-purple-400 animate-bounce"
            style={{ animationDuration: "3s" }}
          />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <Telescope className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
      </div>
    </footer>
  );
};

export default SpaceFooter;
