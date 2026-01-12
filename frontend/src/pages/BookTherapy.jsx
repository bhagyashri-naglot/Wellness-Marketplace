import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Filter, Clock, CreditCard, ArrowRight, Sparkles } from "lucide-react";

export default function BookTherapy() {
  const [therapies, setTherapies] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/therapies", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setTherapies(res.data))
    .catch(err => console.error("Failed to load therapies", err));
  }, []);

  const categories = ["All", ...new Set(therapies.map(t => t.category))];

  const filtered = therapies.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#EFECE3] dark:bg-[#0A1118] font-mono transition-colors duration-500">
      
      {/* Aesthetic Background Accents */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#FF004D]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* TOP SECTION: Header & Search */}
        <div className="flex flex-col space-y-12 mb-20">
          <header className="max-w-3xl">
            <div className="flex items-center gap-2 text-[#FF004D] mb-4">
              <Sparkles size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Discovery</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none text-[#1B3C53] dark:text-white">
              SELECT YOUR <br />
              <span className="text-[#FF004D]">THERAPY</span>
            </h1>
          </header>

          <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1B3C53]/50 group-focus-within:text-[#FF004D] transition-colors" size={20} />
            <input
              placeholder="SEARCH_CATALOG_DATA..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/70 dark:bg-white/5 border-2 border-[#1B3C53]/20 focus:border-[#FF004D] outline-none rounded-full py-6 pl-16 pr-8 text-sm font-bold tracking-widest uppercase transition-all shadow-xl backdrop-blur-md dark:text-white"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-4 mb-16 border-b-2 border-[#1B3C53]/10 pb-8">
          <div className="flex items-center gap-2 mr-4">
            <Filter size={14} className="text-[#1B3C53] dark:text-[#FF004D]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1B3C53] dark:text-white">Filter_By</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                activeCategory === cat 
                ? "bg-[#1B3C53] text-white border-[#1B3C53] shadow-lg scale-105" 
                : "bg-white/80 text-[#1B3C53] border-transparent hover:border-[#1B3C53]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RESULTS GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map(therapy => (
              <div
                key={therapy.id}
                onClick={() => navigate(`/book-session/${therapy.id}`)}
                className="group relative cursor-pointer bg-white/60 dark:bg-white/[0.05] border-2 border-white dark:border-white/10 rounded-[2.5rem] p-5 transition-all duration-500 hover:shadow-2xl hover:border-[#FF004D]/20 hover:-translate-y-2 backdrop-blur-xl"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden rounded-[2rem] mb-6 shadow-inner bg-gray-200">
                  <img
                    src={therapy.imageUrl}
                    alt={therapy.name}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C53]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <span className="text-white text-[10px] font-black tracking-[0.3em] flex items-center gap-2">
                        INITIALIZE SESSION <ArrowRight size={14} />
                     </span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-2 pb-2 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[80%]">
                      <h2 className="font-black text-2xl uppercase italic tracking-tight text-[#1B3C53] dark:text-white leading-none mb-2">
                        {therapy.name}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FF004D] bg-[#FF004D]/10 px-2 py-0.5 rounded">
                        {therapy.category}
                      </span>
                    </div>
                    <div className="bg-[#FF004D] text-white p-2 rounded-xl rotate-12 group-hover:rotate-0 transition-transform shadow-lg">
                       <Sparkles size={16} />
                    </div>
                  </div>

                  {/* HIGH VISIBILITY DATA SECTION */}
                  <div className="flex items-center gap-4 pt-4 border-t-2 border-[#1B3C53]/5 dark:border-white/10">
                    
                    {/* Price Tag */}
                    <div className="flex items-center gap-2 bg-[#1B3C53] dark:bg-white px-4 py-2 rounded-2xl shadow-md">
                       <CreditCard size={14} className="text-[#FF004D] dark:text-[#FF004D]" />
                       <span className="text-sm font-black text-white dark:text-[#1B3C53]">
                         ₹{therapy.price}
                       </span>
                    </div>

                    {/* Duration Tag */}
                    <div className="flex items-center gap-2 bg-white dark:bg-white/10 border-2 border-[#1B3C53]/10 px-4 py-2 rounded-2xl shadow-sm">
                       <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                       <span className="text-sm font-black text-[#1B3C53] dark:text-white">
                         {therapy.duration} MIN
                       </span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-4 border-dashed border-[#1B3C53]/10 rounded-[3rem]">
             <p className="text-[12px] font-black uppercase tracking-[0.5em] text-[#1B3C53]/40">Null_Result_Returned</p>
          </div>
        )}
      </div>
    </div>
  );
}