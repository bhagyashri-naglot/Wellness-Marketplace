import { useEffect, useState } from "react";
import api from "../api/axios";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUnverifiedPractitioners();
  }, []);

  const fetchUnverifiedPractitioners = async () => {
    try {
      const res = await api.get("/admin/practitioners/unverified");
      setPractitioners(res.data);
    } catch {
      setError("Failed to load unverified practitioners");
    } finally {
      setLoading(false);
    }
  };

  const verifyPractitioner = async (id) => {
    try {
      await api.put(`/admin/practitioner/${id}/verify`);
      setPractitioners((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Verification failed");
    }
  };

  const rejectPractitioner = async (id) => {
    try {
      await api.post(`/admin/practitioner/${id}/reject`);
      setPractitioners((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Rejection failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3] font-mono">
        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-[0.3em] uppercase text-[10px] font-black">Syncing Ledger...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFECE3] text-[#FF004D] font-mono font-black uppercase tracking-widest">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 md:p-12 transition-colors duration-700 font-mono overflow-hidden bg-[#EFECE3] text-[#1B3C53] dark:bg-[#0A1118] dark:text-gray-200">
      
      {/* Background Mesh Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-20">
        <div className="absolute inset-0 bg-repeat animate-mesh-pan" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-dashed border-[#1B3C53]/10 dark:border-gray-700/50 pb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-10 h-1 bg-[#FF004D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF004D]">Auth Control Center</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
              VERIFI<span className="text-blue-500 dark:opacity-80">CATION</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-white/5 rounded-full border border-[#1B3C53]/10">
            <ShieldCheck className="text-blue-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Admin Node Active</span>
          </div>
        </header>

        {/* Content Section */}
        <div className="min-h-[400px]">
          {practitioners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 opacity-40">
              <CheckCircle size={48} strokeWidth={1} />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Queue Cleared</h2>
              <p className="text-[10px] uppercase tracking-[0.3em]">All practitioners have been processed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {practitioners.map((p, index) => (
                <div
                  key={p.id}
                  className="group relative transition-all duration-700 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative rounded-[3rem] p-10 overflow-hidden border backdrop-blur-3xl bg-white/60 border-[#1B3C53]/10 shadow-lg dark:bg-white/[0.03] dark:border-white/5 hover:border-[#FF004D]/30 transition-all">
                    
                    {/* ID Tag */}
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF004D] bg-[#FF004D]/5 px-4 py-1 rounded-full border border-[#FF004D]/20">
                        {p.specialization || "General"}
                      </span>
                      <span className="text-[9px] font-mono opacity-20 uppercase tracking-widest">ID: {p.id}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-3xl font-bold mb-6 italic leading-tight group-hover:text-blue-500 transition-colors uppercase">
                      {p.name}
                    </h3>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-4 border-b border-[#1B3C53]/5 pb-2">
                            <span className="text-[10px] font-black uppercase opacity-40 w-24">Email</span>
                            <span className="text-sm font-sans font-medium">{p.email}</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-[#1B3C53]/5 pb-2">
                            <span className="text-[10px] font-black uppercase opacity-40 w-24">Credential</span>
                            <span className="text-sm font-sans font-medium">{p.qualification}</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-[#1B3C53]/5 pb-2">
                            <span className="text-[10px] font-black uppercase opacity-40 w-24">Experience</span>
                            <span className="text-sm font-sans font-medium underline decoration-blue-500 decoration-2 underline-offset-4">{p.experience} Years Active</span>
                        </div>
                        {/* Status row added below experience */}
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase opacity-40 w-24">Status</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF004D] animate-pulse">
                              Pending Verification
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => verifyPractitioner(p.id)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1B3C53] dark:bg-white dark:text-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95"
                      >
                        <CheckCircle size={14} />
                        Approve Access
                      </button>

                      <button
                        onClick={() => rejectPractitioner(p.id)}
                        className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#FF004D] text-[#FF004D] rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#FF004D] hover:text-white transition-all active:scale-95"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}