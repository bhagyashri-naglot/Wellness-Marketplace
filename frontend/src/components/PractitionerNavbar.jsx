import { useNavigate } from "react-router-dom";
import { ClipboardList, PlusCircle, CalendarCheck, LogOut } from "lucide-react";

export default function PractitionerNavbar() {
  const navigate = useNavigate();
  const practitioner = JSON.parse(localStorage.getItem("practitioner")) || {};

  const handleLogout = () => {
    // Clear all relevant localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("practitioner");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo / Title */}
        <div
          className="text-2xl font-black text-[#1B3C53] dark:text-white cursor-pointer"
          onClick={() => navigate("/practitioner")}
        >
          Wellness<span className="text-[#FF004D]">Pro</span>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <button
            onClick={() => navigate("/practitioner/therapies")}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-[#FF004D] transition"
          >
            <ClipboardList size={18} />
            Manage Therapies
          </button>

          <button
            onClick={() => navigate("/practitioner/therapies/create")}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-[#FF004D] transition"
          >
            <PlusCircle size={18} />
            Create Therapy
          </button>

          <button
            onClick={() => navigate("/practitioner/sessions")}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-[#FF004D] transition"
          >
            <CalendarCheck size={18} />
            View Sessions
          </button>
        </div>

        {/* Right Side: Practitioner Name + Logout */}
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm font-semibold text-[#1B3C53] dark:text-gray-300">
            Dr. {practitioner?.name || practitioner?.email || "User"}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF004D] text-white font-semibold hover:scale-105 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
