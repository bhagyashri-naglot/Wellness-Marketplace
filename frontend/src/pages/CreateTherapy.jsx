import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Image as ImageIcon, Clock, CreditCard, Activity, Layers } from "lucide-react";

export default function CreateTherapy() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const practitioner = JSON.parse(localStorage.getItem("practitioner"));
    if (!practitioner) {
      alert("Practitioner not found");
      return;
    }

    if (!name || !description || !price || !duration || !category || !imageUrl) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await api.post("/therapies", {
        practitionerId: practitioner.id,
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        category: category.toUpperCase(),
        imageUrl,
        available: true,
        rating: 0.0,
      });

      alert("Therapy initialized successfully");
      navigate("/practitioner/therapies");
    } catch (err) {
      console.error("CREATE THERAPY ERROR:", err.response?.data || err.message);
      alert("Failed to initialize therapy node");
    }
  };

  return (
    <div className="relative min-h-screen font-mono overflow-hidden bg-[#EFECE3] text-[#1B3C53] dark:bg-[#0A1118] dark:text-gray-200 transition-colors duration-700">
      
      {/* Background Mesh Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-20">
        <div className="absolute inset-0 bg-repeat animate-mesh-pan" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-dashed border-[#1B3C53]/10 dark:border-gray-700/50 pb-12 mb-16 gap-8">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft size={14} /> Back to Catalog
            </button>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
              INITIALIZE <span className="text-blue-500">NODE</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-white/5 rounded-full border border-[#1B3C53]/10">
            <Activity className="text-[#FF004D] animate-pulse" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">New Entry Mode</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Form Side */}
          <form onSubmit={submit} className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-40">Identity Label</label>
                <input
                  placeholder="THERAPY_NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 text-lg font-bold transition-all placeholder:opacity-20"
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-40">System Description</label>
                <textarea
                  placeholder="Define therapy parameters and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 font-sans leading-relaxed transition-all placeholder:opacity-20"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-40 text-blue-500">Duration (MINS)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                    <input
                      type="number"
                      placeholder="00"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-40 text-[#FF004D]">Pricing (INR)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-40">Category Tag</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                    <input
                      placeholder="E.G. WELLNESS"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-40">Image Protocol (URL)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                    <input
                      placeholder="HTTPS://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-mono text-xs transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="group relative w-full overflow-hidden bg-[#1B3C53] dark:bg-white text-white dark:text-black py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-[#FF004D] dark:hover:bg-[#FF004D] dark:hover:text-white transition-all shadow-2xl active:scale-95">
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Plus size={18} strokeWidth={3} />
                Deploy Therapy Node
              </span>
            </button>
          </form>

          {/* Live Preview Side */}
          <aside className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="flex items-center gap-3 opacity-40">
                <span className="text-[10px] font-black uppercase tracking-widest">Live System Preview</span>
                <span className="flex-grow border-t border-dashed border-current" />
              </div>
              
              <div className="rounded-[3rem] p-4 border-2 border-dashed border-[#1B3C53]/10 dark:border-white/10">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-white/[0.03] shadow-2xl backdrop-blur-3xl border border-white/20">
                  <div className="h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <div className="absolute top-6 right-6">
                        <span className="bg-white/90 dark:bg-black/90 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-black/5">
                            {category || "CATEGORY"}
                        </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <h3 className="text-3xl font-black italic uppercase leading-none truncate">
                      {name || "NODE_NAME"}
                    </h3>
                    <p className="text-xs font-sans opacity-60 line-clamp-2 leading-relaxed h-8">
                      {description || "Awaiting parameter input..."}
                    </p>
                    <div className="flex justify-between items-center pt-6 border-t border-[#1B3C53]/5">
                      <div className="flex gap-4">
                        <span className="text-[9px] font-black opacity-40 uppercase">Duration: {duration || "00"}m</span>
                        <span className="text-[9px] font-black text-[#FF004D] uppercase">Cost: ₹{price || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
      `}</style>
    </div>
  );
}