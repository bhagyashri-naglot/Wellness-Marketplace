import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SectionHome from "../components/SectionHome";
import api from "../api/axios";

import wellnessImg from "../assets/images/wellness.jpeg";
import therapyImg from "../assets/images/therapy.jpeg";
import productsImg from "../assets/images/products.jpeg";
import communityImg from "../assets/images/community.jpeg";
import aiImg from "../assets/images/ai-recommendation.jpeg";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ No token found → redirecting to login");
      navigate("/login", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        console.log("✅ User fetched:", res.data);

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        localStorage.clear();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-mono">
        Loading system...
      </div>
    );
  }

  const handleLogout = () => {
    console.warn("🚪 Logging out");
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleEnterSystem = () => {
    console.log("➡️ Navigating to My Sessions");
    navigate("/my-sessions");
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] dark:bg-[#0A1118] relative">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />

      <div className="pt-16 relative z-10">
        {/* ENTER SYSTEM */}
        <SectionHome
          isFirst
          title={`Welcome ${user?.name || user?.email} 🌿`}
          description="A holistic neural network connecting you with practitioners, products, and community."
          buttonText="Enter System"
          onClick={handleEnterSystem}
          image={wellnessImg}
          bgColor="bg-white/40 dark:bg-white/[0.02]"
        />

        {/* BEGIN SESSION */}
        <SectionHome
          title="Neural Therapy 🩺"
          description="Sync with verified practitioners."
          buttonText="Begin Session"
          redirectTo="/book-therapy"   // ✅ FIXED ROUTE
          image={therapyImg}
          reverse
        />

        <SectionHome
          title="Bio Products 🛍"
          description="Curated wellness products."
          buttonText="Access Shop"
          redirectTo="/products"
          image={productsImg}
          bgColor="bg-[#1B3C53]/5 dark:bg-black/20"
        />

        <SectionHome
          title="The Collective 👥"
          description="Evolve within a wellness community."
          buttonText="Join Node"
          redirectTo="/community"
          image={communityImg}
          reverse
        />

        <SectionHome
          title="AI Diagnostics 🤖"
          description="Personalized wellness pathways."
          buttonText="Run Diagnostic"
          redirectTo="/ai-recommendation"
          image={aiImg}
          bgColor="bg-[#FF004D]/5 dark:bg-[#FF004D]/5"
        />
      </div>
    </div>
  );
}
