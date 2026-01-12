import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../api/axios";

import { User, ShieldCheck, Award, Briefcase, FileUp, Info, Globe } from "lucide-react";



export default function ViewProfile() {

  const { id: userId } = useParams();

  const navigate = useNavigate();



  const [user, setUser] = useState(null);

  const [practitioner, setPractitioner] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const userRes = await api.get(`/users/${userId}`);

        setUser(userRes.data);



        if (userRes.data.role === "PRACTITIONER") {

          const pracRes = await api.get(`/practitioners/user/${userId}`);

          setPractitioner(pracRes.data);

        }

      } catch (err) {

        if (err.response?.status === 401) {

          localStorage.removeItem("token");

          navigate("/login");

        } else {

          setError("Failed to load profile node");

        }

      } finally {

        setLoading(false);

      }

    };



    fetchProfile();

  }, [userId, navigate]);



  if (loading) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3] font-mono">

        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />

        <span className="tracking-[0.3em] uppercase text-[10px] font-black">Decrypting Identity...</span>

      </div>

    );

  }



  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#EFECE3] text-[#FF004D] font-mono font-black uppercase tracking-widest p-10 text-center">

        {error}

      </div>

    );

  }



  if (!user) return null;



  return (

    <div className="relative min-h-screen font-mono overflow-hidden bg-[#EFECE3] text-[#1B3C53] dark:bg-[#0A1118] dark:text-gray-200">

      

      {/* Background Mesh Pattern */}

      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-20">

        <div className="absolute inset-0 bg-repeat animate-mesh-pan" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} />

      </div>



      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 space-y-12">

        

        {/* HEADER / IDENTITY CARD */}

        <header className="relative group overflow-hidden rounded-[3.5rem] p-12 bg-white/60 dark:bg-white/[0.03] border border-[#1B3C53]/10 dark:border-white/5 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row items-center gap-10 transition-all hover:border-[#FF004D]/30">

          

          {/* Avatar with Ring */}

          <div className="relative">

            <div className="w-32 h-32 rounded-[2.5rem] bg-[#1B3C53] text-white flex items-center justify-center text-5xl font-black shadow-2xl z-10 relative">

              {user.name?.charAt(0)}

            </div>

            <div className="absolute inset-0 rounded-[2.5rem] bg-[#FF004D] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />

          </div>



          <div className="flex-1 text-center md:text-left space-y-4">

            <div className="flex flex-col md:flex-row md:items-center gap-4">

              <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">

                {user.name}

              </h1>

              <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest bg-[#FF004D] text-white self-center md:self-auto">

                {user.role}

              </span>

            </div>

            <p className="text-sm font-bold opacity-60 tracking-wider">NETWORK_ID: {userId?.substring(0, 8)}...</p>

            <div className="flex justify-center md:justify-start gap-6 pt-2">

                <div className="flex items-center gap-2 opacity-50">

                    <Globe size={14} />

                    <span className="text-[10px] font-black uppercase tracking-widest">Active Node</span>

                </div>

            </div>

          </div>

        </header>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          

          {/* ACCOUNT DATA CARD */}

          <section className="rounded-[2.5rem] p-10 bg-white/40 dark:bg-white/[0.02] border border-[#1B3C53]/5 backdrop-blur-md space-y-8">

            <div className="flex items-center gap-3 border-b border-dashed border-[#1B3C53]/20 pb-6">

                <Info size={18} className="text-blue-500" />

                <h2 className="text-sm font-black uppercase tracking-[0.3em]">Core Credentials</h2>

            </div>



            <div className="grid grid-cols-1 gap-6">

                {[

                    { label: "Registered Email", val: user.email, icon: User },

                    { label: "Account Status", val: user.status || "VERIFIED_ACTIVE", icon: ShieldCheck }

                ].map((item, i) => (

                    <div key={i} className="space-y-1">

                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block">{item.label}</span>

                        <div className="flex items-center gap-3 font-bold italic uppercase">

                            <item.icon size={14} className="opacity-30" />

                            {item.val}

                        </div>

                    </div>

                ))}

            </div>

          </section>



          {/* PRACTITIONER DETAILS (If applicable) */}

          {user.role === "PRACTITIONER" && practitioner && (

            <section className="rounded-[2.5rem] p-10 bg-[#1B3C53] dark:bg-[#1B3C53]/20 text-white border border-white/5 shadow-2xl space-y-8">

              <div className="flex items-center gap-3 border-b border-dashed border-white/10 pb-6">

                  <Award size={18} className="text-[#FF004D]" />

                  <h2 className="text-sm font-black uppercase tracking-[0.3em]">Professional Node</h2>

              </div>



              <div className="grid grid-cols-2 gap-8">

                <div className="space-y-1">

                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block">Specialty</span>

                    <p className="font-bold italic uppercase text-lg leading-tight">{practitioner.specialization}</p>

                </div>

                <div className="space-y-1">

                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block">Experience</span>

                    <p className="font-bold italic uppercase text-lg">{practitioner.experience} Units</p>

                </div>

                <div className="space-y-1 col-span-2">

                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block">Qualifications</span>

                    <p className="font-bold italic uppercase opacity-80">{practitioner.qualification}</p>

                </div>

              </div>



              {/* Verification Section */}

              <div className="pt-6 border-t border-white/10">

                {practitioner.verified ? (

                  <div className="flex items-center gap-2 text-green-400 font-black text-[10px] uppercase tracking-widest">

                    <ShieldCheck size={16} /> Verified Practitioner

                  </div>

                ) : (

                  <label className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#FF004D] transition-all cursor-pointer">

                    <div className="flex items-center gap-3">

                        <FileUp size={18} />

                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Certification</span>

                    </div>

                    <input

                      type="file"

                      hidden

                      onChange={async (e) => {

                        const file = e.target.files[0];

                        if (!file) return;

                        const formData = new FormData();

                        formData.append("certificate", file);

                        try {

                          await api.post(`/practitioners/${practitioner.id}/upload-certificate`, formData, {

                            headers: { "Content-Type": "multipart/form-data" }

                          });

                          alert("Data stream received. Await admin verification.");

                        } catch(err) { alert("Upload error."); }

                      }}

                    />

                  </label>

                )}

              </div>

            </section>

          )}

        </div>

      </div>



      <style jsx>{`

        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }

        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }

      `}</style>

    </div>

  );

}