import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PractitionerNavbar from "../components/PractitionerNavbar";
import wellnessImg from "../assets/images/wellness.jpeg";
import therapyImg from "../assets/images/therapy.jpeg";
import communityImg from "../assets/images/community.jpeg";
import { ArrowUpRight, Activity, Calendar, Stethoscope } from "lucide-react";

export default function PractitionerHome() {
  const [practitioner, setPractitioner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Get practitioner from localStorage
    const storedPractitioner = JSON.parse(localStorage.getItem("practitioner"));
    if (!storedPractitioner) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    setPractitioner(storedPractitioner);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (practitioner) navigate(`/profile/${practitioner.id}`);
  };

  // Helper component for dashboard cards
  const DashboardCard = ({ title, desc, btnText, link, img, icon: Icon, delay }) => (
    <div 
      className="group relative animate-fade-in opacity-0" 
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-white/60 dark:bg-white/[0.03] border border-[#1B3C53]/10 dark:border-white/5 backdrop-blur-3xl p-8 h-full flex flex-col transition-all duration-500 hover:border-[#FF004D]/40 hover:shadow-2xl">
        
        {/* Image Header */}
        <div className="relative h-64 mb-8 overflow-hidden rounded-[2rem]">
          <img src={img} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[#1B3C53]/20 group-hover:bg-transparent transition-all" />
          <div className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg">
            <Icon className="text-[#1B3C53]" size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-4">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-500 transition-colors">
            {title}
          </h3>
          <p className="text-sm font-sans opacity-70 leading-relaxed max-w-[90%]">
            {desc}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate(link)}
          className="mt-8 flex items-center justify-between w-full px-8 py-5 bg-[#1B3C53] text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] group-hover:bg-[#FF004D] transition-all"
        >
          {btnText}
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );

  // ✅ Show nothing until practitioner is loaded
  if (!practitioner) return null;

  return (
    <div className="relative min-h-screen font-mono overflow-hidden bg-[#EFECE3] text-[#1B3C53] dark:bg-[#0A1118] dark:text-gray-200">
      
      {/* Background Mesh Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-20">
        <div className="absolute inset-0 bg-repeat animate-mesh-pan" 
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} 
        />
      </div>

      {/* ✅ Updated Navbar */}
      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-20">
        
        {/* Hero Header */}
        <header className="border-b-2 border-dashed border-[#1B3C53]/10 dark:border-gray-700/50 pb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-1 bg-[#FF004D]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF004D]">Practitioner Node</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">
            WELCOME <br /> 
            <span className="text-blue-500">
              DR. {practitioner.name ? practitioner.name.split(' ')[0] : "User"}
            </span>
          </h1>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard 
            title="Manage Therapies"
            desc="View, update, or delete your existing therapies."
            btnText="Go"
            link="/practitioner/therapies"
            img={wellnessImg}
            icon={Activity}
            delay={100}
          />
          
          <DashboardCard 
            title="Create Therapy"
            desc="Add new therapies for your patients."
            btnText="Create"
            link="/practitioner/therapies/create"
            img={therapyImg}
            icon={Stethoscope}
            delay={200}
          />

          <DashboardCard 
            title="View Sessions"
            desc="Check patient appointments and session history."
            btnText="View"
            link="/practitioner/sessions"
            img={communityImg}
            icon={Calendar}
            delay={300}
          />
        </div>
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
