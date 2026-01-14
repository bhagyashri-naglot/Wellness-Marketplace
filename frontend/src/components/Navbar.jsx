import { Link } from "react-router-dom";

<Link to="/notifications" className="ml-4">
  🔔 Notifications
</Link>

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout, onProfileClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("app-theme") || "light");
  const [isScrolled, setIsScrolled] = useState(false);

  // Theme toggle
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));
  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/bookTherapy", label: "Therapy", icon: "🩺" },
    { path: "/products", label: "Market", icon: "🛍" },
    { path: "/community", label: "Collective", icon: "👥" },
    { path: "/ai-recommendation", label: "Diagnostics", icon: "🤖" },
  ];

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick && user) onProfileClick();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-10 transition-all duration-500">
      <nav
        className={`relative mx-auto max-w-7xl font-mono transition-all duration-700
          ${isScrolled ? "rounded-[3rem] py-3 px-8 shadow-lg" : "rounded-[2rem] py-5 px-6"}
          ${theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white/40 border-black/5"}
          backdrop-blur-3xl border`}
      >
        <div className="flex items-center justify-between relative z-10">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1B3C53] dark:bg-white rounded-2xl flex items-center justify-center">
              🌿
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className={`text-xl font-black tracking-tighter uppercase ${theme === 'dark' ? "text-white" : "text-[#1B3C53]"}`}>
                WELLNESS<span className="text-[#FF004D]">HUB</span>
              </h1>
              <span className="text-[8px] font-bold opacity-40 uppercase tracking-[0.4em] dark:text-white">
                Neural_Interface_v2
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-full border border-white/5">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500
                    ${active ? "text-white" : "text-[#1B3C53]/60 dark:text-gray-400 hover:text-[#FF004D]"}`}
                >
                  <span className="relative z-10 flex items-center gap-2 italic">
                    <span className="text-sm">{item.icon}</span> {item.label}
                  </span>
                  {active && <div className="absolute inset-0 bg-gradient-to-br from-[#FF004D] to-blue-600 rounded-full shadow-md" />}
                </Link>
              );
            })}
          </div>

          {/* User / Auth buttons */}
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-11 h-11 rounded-full border flex items-center justify-center">
              {theme === 'dark' ? "🔆" : "🌙"}
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <span
                  onClick={handleProfileClick}
                  className="text-[10px] font-black text-[#FF004D] cursor-pointer hover:underline"
                  title="View Profile"
                >
                  {user.name}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="text-[10px] font-black text-[#FF004D] uppercase hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2 rounded-full bg-[#1B3C53] text-white hover:bg-[#FF004D] transition">
                Login
              </Link>
            )}
          </div>

        </div>
      </nav>
    </div>
  );
}
