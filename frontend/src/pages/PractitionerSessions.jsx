import { useEffect, useState } from "react";
import api from "../api/axios";
import { Calendar, Clock, User, FileText, ArrowRight } from "lucide-react";

export default function PractitionerSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line
  }, []);

  const fetchSessions = async () => {
    const practitioner = JSON.parse(localStorage.getItem("practitioner"));

    if (!practitioner || !practitioner.id) {
      setError("Practitioner not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/sessions/practitioner/${practitioner.id}`);
      setSessions(res.data);
    } catch (err) {
      console.error("FETCH SESSIONS ERROR:", err.response || err.message);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3] font-mono">
        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-[0.3em] uppercase text-[10px] font-black">Scanning Schedule...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFECE3] text-[#FF004D] font-mono font-black uppercase tracking-widest text-center px-10">
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-16">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-dashed border-[#1B3C53]/10 dark:border-gray-700/50 pb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-10 h-1 bg-[#FF004D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF004D]">Session Registry</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
              BOOKED <span className="text-blue-500">EVENTS</span>
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Active Queue</span>
            <span className="text-4xl font-black italic">{sessions.length}</span>
          </div>
        </header>

        {/* Content Section */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 opacity-40 grayscale">
            <Calendar size={64} strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-[0.4em] font-black">No confirmed bookings found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sessions.map((s, index) => {
              const sessionDate = new Date(s.dateTime);
              return (
                <div
                  key={s.id}
                  className="group relative animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="relative rounded-[2rem] md:rounded-full p-6 md:px-12 md:py-8 border backdrop-blur-3xl bg-white/60 border-[#1B3C53]/10 shadow-lg dark:bg-white/[0.03] dark:border-white/5 hover:border-[#FF004D]/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Time Column */}
                    <div className="flex items-center gap-6 min-w-[200px]">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black opacity-40 uppercase">Time Node</p>
                        <p className="text-lg font-bold italic uppercase">{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    {/* Date Column */}
                    <div className="flex items-center gap-6 min-w-[200px]">
                      <div className="w-12 h-12 rounded-full bg-[#FF004D]/10 flex items-center justify-center text-[#FF004D]">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black opacity-40 uppercase">Calendar Ref</p>
                        <p className="text-lg font-bold italic uppercase">{sessionDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>

                    {/* Patient Column */}
                    <div className="flex items-center gap-6 flex-grow">
                      <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div className="max-w-md">
                        <p className="text-[10px] font-black opacity-40 uppercase">User Identity</p>
                        <p className="text-sm font-sans font-bold truncate">UID: {s.userId}</p>
                        {s.notes && (
                            <div className="flex items-center gap-2 mt-1 opacity-60">
                                <FileText size={12} />
                                <p className="text-[10px] italic line-clamp-1">{s.notes}</p>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Action Arrow (Visual Only) */}
                    <div className="hidden lg:block">
                        <div className="w-14 h-14 rounded-full border border-[#1B3C53]/10 flex items-center justify-center group-hover:bg-[#1B3C53] group-hover:text-white transition-all cursor-pointer">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateX(-20px); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}