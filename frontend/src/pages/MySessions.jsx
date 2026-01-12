import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PractitionerCard from "../components/PractitionerCard";
import { Calendar, CheckCircle, XCircle, Clock, Activity } from "lucide-react";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/sessions/user/${userId}`);
        setSessions(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  const cancelSession = async (id) => {
    try {
      await api.put(`/sessions/${id}/cancel`);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s))
      );
    } catch (err) {
      console.error("❌ Error cancelling session:", err);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center font-mono">
        <div className="text-center p-12 bg-white/50 border-2 border-dashed border-[#FF004D]/30 rounded-[3rem]">
          <XCircle className="mx-auto mb-4 text-[#FF004D]" size={48} />
          <p className="text-[#FF004D] font-black uppercase tracking-widest">User Node Not Found</p>
          <button onClick={() => window.location.href = '/login'} className="mt-4 text-xs font-black underline">RE-AUTHENTICATE</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-mono bg-[#EFECE3]">
        <div className="w-16 h-1 w-32 bg-[#1B3C53]/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-[#FF004D] animate-loading-bar" />
        </div>
        <span className="mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Syncing Logs...</span>
      </div>
    );
  }

  const booked = sessions.filter((s) => s.status === "booked");
  const completed = sessions.filter((s) => s.status === "completed");
  const cancelled = sessions.filter((s) => s.status === "cancelled");

  return (
    <div className="relative min-h-screen font-mono bg-[#EFECE3] dark:bg-[#0A1118] text-[#1B3C53] dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* Background Noise & Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '100px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* Header with System Stats */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#1B3C53] dark:border-white pb-10 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FF004D]">
               <Activity size={14} className="animate-pulse" />
               <span className="text-[10px] font-black tracking-[0.3em] uppercase">User Session Dashboard</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none italic uppercase">
              MY <span className="text-[#FF004D]">SESSIONS</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-white dark:bg-white/5 border-2 border-[#1B3C53] rounded-2xl shadow-[4px_4px_0px_#1B3C53]">
                <span className="block text-[8px] font-black uppercase opacity-50">Total Nodes</span>
                <span className="text-xl font-black">{sessions.length}</span>
             </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-32">
          <SessionSection 
            title="Active Bookings" 
            icon={<Calendar size={20} />}
            sessions={booked} 
            onCancel={cancelSession}
            themeColor="text-blue-500"
          />

          <SessionSection 
            title="Archived Sessions" 
            icon={<CheckCircle size={20} />}
            sessions={completed} 
            themeColor="text-emerald-500"
          />

          <SessionSection 
            title="Revoked Nodes" 
            icon={<XCircle size={20} />}
            sessions={cancelled} 
            themeColor="text-[#FF004D]"
            isCancelled
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { left: -100%; width: 30%; }
          50% { width: 60%; }
          100% { left: 100%; width: 30%; }
        }
        .animate-loading-bar { animation: loading-bar 1.5s infinite linear; }
      `}</style>
    </div>
  );
}

function SessionSection({ title, sessions, onCancel, icon, themeColor, isCancelled = false }) {
  return (
    <section className="space-y-10 group">
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-2xl bg-white dark:bg-white/5 border-2 border-current ${themeColor} shadow-[4px_4px_0px_currentColor]`}>
          {icon}
        </div>
        <div className="flex-grow">
          <h2 className="text-3xl font-black uppercase italic tracking-tight flex items-center gap-4">
            {title}
            <span className="text-xs not-italic font-black bg-[#1B3C53] text-white px-3 py-1 rounded-full">
              {String(sessions.length).padStart(2, '0')}
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className={`transition-all duration-300 hover:-rotate-1 ${isCancelled ? 'opacity-60' : 'opacity-100'}`}>
              <PractitionerCard
                practitioner={session}
                isBooked={session.status === "booked"}
                onCancel={onCancel}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 px-8 rounded-[2.5rem] border-2 border-dashed border-[#1B3C53]/10 dark:border-white/10 flex flex-col items-center justify-center space-y-2 opacity-40">
            <Clock size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">No data streams found for this category</span>
          </div>
        )}
      </div>
    </section>
  );
}