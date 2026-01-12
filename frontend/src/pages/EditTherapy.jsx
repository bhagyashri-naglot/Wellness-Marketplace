import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PractitionerNavbar from "../components/PractitionerNavbar";
import api from "../api/axios";
import { Save, ArrowLeft, Image as ImageIcon, Clock, CreditCard, Activity } from "lucide-react";

export default function EditTherapy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapy();
  }, []);

  const fetchTherapy = async () => {
    try {
      const res = await api.get(`/therapies/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load therapy");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/therapies/${id}`, {
        name: form.name,
        description: form.description,
        price: form.price,
        duration: form.duration,
        imageUrl: form.imageUrl,
      });
      navigate("/practitioner/therapies");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3] font-mono">
        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-[0.3em] uppercase text-[10px] font-black">Fetching Node Data...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-mono overflow-hidden bg-[#EFECE3] text-[#1B3C53] dark:bg-[#0A1118] dark:text-gray-200">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-20">
        <div className="absolute inset-0 bg-repeat animate-mesh-pan" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} />
      </div>

      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-2 border-dashed border-[#1B3C53]/10 pb-12 gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft size={14} /> Back to Inventory
            </button>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
              EDIT <span className="text-blue-500">NODE</span>
            </h1>
          </div>
          <div className="px-6 py-3 bg-white/50 dark:bg-white/5 rounded-full border border-[#1B3C53]/10 flex items-center gap-3">
             <Activity size={16} className="text-[#FF004D] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">System Update Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block opacity-40">Identity Label</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Therapy Name"
                  className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 text-lg font-bold transition-all"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block opacity-40">Instructional Data</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the therapy session..."
                  rows="4"
                  className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 font-sans leading-relaxed transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block opacity-40 text-blue-500">Duration (Min)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      type="number"
                      className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-bold"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest mb-2 block opacity-40 text-[#FF004D]">Pricing (INR)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      type="number"
                      className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block opacity-40">Visual Reference URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full bg-white/40 dark:bg-white/5 border-2 border-[#1B3C53]/10 focus:border-blue-500 outline-none rounded-2xl p-4 pl-12 font-mono text-xs"
                  />
                </div>
              </div>

              <button className="group relative w-full overflow-hidden bg-[#1B3C53] dark:bg-white text-white dark:text-black py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-[#FF004D] dark:hover:bg-[#FF004D] dark:hover:text-white transition-all shadow-xl active:scale-95">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Save size={18} /> Commit Changes
                </span>
              </button>
            </form>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Live Node Preview</label>
                <div className="rounded-[3rem] overflow-hidden border-2 border-dashed border-[#1B3C53]/20 p-4">
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-white dark:bg-white/5 shadow-2xl transition-all duration-500">
                        <div className="h-56 overflow-hidden relative">
                            <img 
                                src={form.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"} 
                                alt="Preview" 
                                className="w-full h-full object-cover grayscale opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-8 space-y-4">
                            <h3 className="text-2xl font-black uppercase italic leading-none">{form.name || "UNNAMED_NODE"}</h3>
                            <p className="text-xs font-sans opacity-60 line-clamp-2 leading-relaxed">{form.description || "Enter details to see preview..."}</p>
                            <div className="flex gap-4 pt-4 border-t border-[#1B3C53]/10">
                                <span className="text-[10px] font-black">{form.duration} MINS</span>
                                <span className="text-[10px] font-black text-[#FF004D]">₹{form.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
      `}</style>
    </div>
  );
}