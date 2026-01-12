import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PractitionerNavbar from "../components/PractitionerNavbar";
import { Plus, Trash2, Edit3, Clock, Tag, CreditCard } from "lucide-react";

export default function ManageTherapies() {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Get practitioner from localStorage
  const practitioner = JSON.parse(localStorage.getItem("practitioner"));
  const practitionerId = practitioner?.id;

  useEffect(() => {
    if (!practitionerId) {
      setError("Practitioner not found. Please login again.");
      setLoading(false);
      return;
    }
    fetchTherapies();
    // eslint-disable-next-line
  }, [practitionerId]);

  const fetchTherapies = async () => {
    try {
      const res = await api.get(`/therapies/practitioner/${practitionerId}`);
      setTherapies(res.data);
    } catch (err) {
      console.error("FETCH THERAPIES ERROR:", err);
      setError("Failed to load therapies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (therapyId) => {
    if (!window.confirm("Are you sure you want to delete this therapy?")) return;

    try {
      await api.delete(`/therapies/${therapyId}`);
      setTherapies((prev) => prev.filter((t) => t.id !== therapyId));
    } catch (err) {
      console.error("DELETE THERAPY ERROR:", err);
      alert("Failed to delete therapy");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3] font-mono">
        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-[0.3em] uppercase text-[10px] font-black">Decrypting Inventory...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFECE3] text-[#FF004D] font-mono font-black uppercase tracking-widest px-8 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-mono overflow-hidden bg-[#EFECE3] text-[#1B3C53] dark:bg-[#0A1118] dark:text-gray-200">
      
      {/* Background Mesh Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-20">
        <div className="absolute inset-0 bg-repeat animate-mesh-pan" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} />
      </div>

      <PractitionerNavbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-16">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-dashed border-[#1B3C53]/10 dark:border-gray-700/50 pb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-10 h-1 bg-[#FF004D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF004D]">Service Ledger</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
              MY THER<span className="text-blue-500">APIES</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/practitioner/therapies/create")}
            className="group flex items-center gap-3 px-10 py-6 bg-[#FF004D] text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            Create New
          </button>
        </header>

        {/* Content Section */}
        {therapies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 opacity-40">
            <div className="w-16 h-16 border-2 border-dashed border-[#1B3C53] rounded-full flex items-center justify-center">
                <Plus size={24} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black">No Active Records Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {therapies.map((therapy, index) => (
              <div
                key={therapy.id}
                className="group relative animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="relative h-full rounded-[3rem] overflow-hidden border backdrop-blur-3xl bg-white/60 border-[#1B3C53]/10 shadow-lg dark:bg-white/[0.03] dark:border-white/5 hover:border-[#FF004D]/30 transition-all">
                  
                  {/* Image with overlay */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={therapy.imageUrl}
                      alt={therapy.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#1B3C53]/20 mix-blend-multiply" />
                    <div className="absolute top-6 right-6">
                         <span className="text-[9px] font-black uppercase tracking-widest bg-white dark:bg-black px-4 py-2 rounded-full border border-black/10">
                            {therapy.category}
                         </span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold italic leading-none uppercase mb-3 group-hover:text-blue-500 transition-colors">
                        {therapy.name}
                      </h2>
                      <p className="text-[11px] font-sans opacity-60 line-clamp-2 leading-relaxed">
                        {therapy.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-[#1B3C53]/10">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black">{therapy.duration} MINS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-[#FF004D]" />
                        <span className="text-[10px] font-black">₹{therapy.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/practitioner/therapies/edit/${therapy.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1B3C53] dark:bg-white dark:text-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(therapy.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-[#FF004D]/20 text-[#FF004D] rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#FF004D] hover:text-white transition-all active:scale-95"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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