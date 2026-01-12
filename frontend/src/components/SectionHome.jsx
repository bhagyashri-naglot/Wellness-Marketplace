import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SectionHome({
  title,
  description,
  buttonText,
  redirectTo,
  onClick,
  image,
  bgColor = "",
  reverse = false,
  isFirst = false,
}) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleButtonClick = () => {
    console.log("🔥 BUTTON CLICKED:", redirectTo);

    if (onClick) {
      onClick();
      return;
    }

    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`${bgColor} relative overflow-hidden font-mono ${
        isFirst ? "pt-24 pb-20" : "py-24"
      } transition-all duration-1000`}
    >
      <div className={`absolute top-0 ${reverse ? "right-0" : "left-0"} w-64 h-64 bg-[#FF004D]/5 blur-[120px] pointer-events-none`} />
      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16 ${
          reverse ? "md:flex-row-reverse" : ""
        } ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        } transition-all duration-[1200ms] ease-out`}
      >
        <div className="md:w-2/5 w-full group relative">
          <img
            src={image}
            alt={title}
            className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>

        <div className="md:w-3/5 w-full space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-[#1B3C53] dark:text-white italic tracking-tighter uppercase leading-none">
            {title}
          </h2>
          <p className="text-[#1B3C53]/70 dark:text-gray-400 text-lg leading-relaxed font-sans font-medium">
            {description}
          </p>
          <button
            onClick={handleButtonClick}
            className="px-10 py-5 rounded-full bg-[#1B3C53] dark:bg-white text-white dark:text-[#1B3C53] font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-md active:scale-95"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
