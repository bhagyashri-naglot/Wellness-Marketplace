import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, ArrowLeft, ShieldCheck, Zap, Info } from "lucide-react";

const TIME_SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

export default function BookSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [therapy, setTherapy] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    axios.get(`http://localhost:8080/api/therapies`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      const found = res.data.find(t => String(t.id) === String(id));
      setTherapy(found);
    });
  }, [id]);

  if (!therapy) return (
    <div className="h-screen flex items-center justify-center font-mono bg-[#EFECE3]">
      <div className="animate-pulse font-black tracking-[0.5em] text-[#1B3C53]">LOADING_DATA...</div>
    </div>
  );

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;
    const dateTime = `${selectedDate}T${selectedSlot}:00`;

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/sessions/book",
        {
          therapyId: therapy.id,
          practitionerId: therapy.practitionerId,
          userId,
          dateTime,
          notes: therapy.name
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      navigate("/my-sessions");
    } catch (err) {
      alert("Booking failed. System timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] dark:bg-[#0A1118] font-mono p-4 md:p-10 lg:p-20 flex items-center justify-center">
      
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#1B3C53 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-white/[0.02] border-4 border-[#1B3C53] dark:border-white shadow-[15px_15px_0px_#1B3C53] dark:shadow-[15px_15px_0px_rgba(255,255,255,0.1)] overflow-hidden rounded-[2.5rem]">
        
        {/* LEFT PANE: Session Summary */}
        <div className="bg-[#1B3C53] p-8 md:p-12 text-white flex flex-col justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black tracking-widest opacity-70 hover:opacity-100 transition-all uppercase"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>

          <div className="space-y-6 py-10">
            <span className="inline-block px-3 py-1 bg-[#FF004D] text-[10px] font-black tracking-widest uppercase">
              {therapy.category}
            </span>
            <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
              {therapy.name}
            </h1>
            
            <div className="flex flex-col gap-5 pt-8">
               <div className="flex items-center gap-4 border-l-4 border-[#FF004D] pl-5">
                  <Clock size={24} className="text-[#FF004D]" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Session Duration</p>
                    <p className="text-xl font-black">{therapy.duration} MINUTES</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 border-l-4 border-blue-400 pl-5">
                  <Zap size={24} className="text-blue-400" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Mode</p>
                    <p className="text-xl font-black italic uppercase">Digital Stream</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm">
             <div className="flex gap-4 items-center">
                <ShieldCheck className="text-green-400 shrink-0" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                  End-to-end encrypted connection. <br/>Your privacy is our priority.
                </p>
             </div>
          </div>
        </div>

        {/* RIGHT PANE: Selector (High Visibility Version) */}
        <div className="p-8 md:p-12 space-y-10 bg-white dark:bg-transparent">
          
          {/* Date Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#1B3C53] dark:text-[#FF004D]">
              <Calendar size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">01. Select Date</h2>
            </div>
            <input
              type="date"
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#EFECE3]/50 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-[#1B3C53] p-5 rounded-2xl font-black text-[#1B3C53] dark:text-white outline-none transition-all shadow-inner"
            />
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#1B3C53] dark:text-[#FF004D]">
              <Clock size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">02. Select Slot</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-4 rounded-2xl text-xs font-black transition-all border-2 ${
                    selectedSlot === slot 
                    ? "bg-[#1B3C53] text-white border-[#1B3C53] shadow-lg scale-105" 
                    : "bg-[#EFECE3]/40 dark:bg-white/5 border-transparent text-[#1B3C53] dark:text-gray-300 hover:border-[#1B3C53]/30"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Summary & Call to Action */}
          <div className="pt-8 border-t-4 border-dotted border-[#1B3C53]/10">
            <div className="flex justify-between items-center mb-8 p-6 bg-[#1B3C53] rounded-2xl text-white shadow-xl">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Total Fee</span>
                  <span className="text-sm font-bold opacity-80 italic">Verified Payment</span>
               </div>
               <span className="text-4xl font-black italic tracking-tighter">₹{therapy.price}</span>
            </div>
            
            <button
              disabled={loading || !selectedDate || !selectedSlot}
              onClick={handleConfirm}
              className={`group relative w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-sm overflow-hidden transition-all active:scale-95 shadow-[0px_10px_20px_rgba(255,0,77,0.3)] ${
                loading || !selectedDate || !selectedSlot
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#FF004D] text-white hover:bg-[#D0003F]"
              }`}
            >
              <span className="relative z-10">{loading ? "PROCESSING..." : "CONFIRM_APPOINTMENT"}</span>
              {!loading && selectedDate && selectedSlot && (
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
              )}
            </button>
            
            <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
               <Info size={16} className="text-blue-600 shrink-0" />
               <p className="text-[9px] font-black leading-tight uppercase text-blue-800 dark:text-blue-300">
                 System Note: Confirmation is instant. check your dashboard immediately after clicking confirm.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}