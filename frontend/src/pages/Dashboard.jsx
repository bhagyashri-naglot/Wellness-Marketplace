import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const specializationsOptions = ["physiotherapy", "acupuncture", "ayurveda", "chiropractic"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState(specializationsOptions[0]);
  const [practitionerId, setPractitionerId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        const userData = res.data;
        setUser(userData);

        // Initialize fields for patients
        setBio(userData.bio || "");

        // If practitioner, fetch practitioner profile to get practitioner ID and specialization
        if (userData.role === "PRACTITIONER") {
          const practitionerRes = await api.get(`/practitioners/user/${userData.id}`);
          const practitionerData = practitionerRes.data;
          setPractitionerId(practitionerData.id);
          setBio(practitionerData.bio || "");
          setSpecialization(practitionerData.specialization || specializationsOptions[0]);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const { name, email, role, id } = user;

  const showSuccessPopup = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 3000); // disappear after 3 sec
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put(`/users/${id}`, { bio });
      showSuccessPopup("Details updated successfully!");
      setTimeout(() => navigate("/home", { replace: true }), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not save patient profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePractitionerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (!practitionerId) throw new Error("Practitioner profile not found.");
      await api.put(`/practitioners/${practitionerId}`, {
        bio,
        specialization,
      });
      showSuccessPopup("Details updated successfully!");
      setTimeout(() => navigate("/home", { replace: true }), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not save practitioner profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* SUCCESS POPUP */}
      {successMsg && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut">
          {successMsg}
        </div>
      )}

      {/* LEFT FORM */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-cyan-50 to-blue-200">
        <form
          onSubmit={role === "PATIENT" ? handlePatientSubmit : handlePractitionerSubmit}
          className="w-full max-w-lg lg:w-[80%] border-4 border-teal-400/70 shadow-2xl rounded-xl p-6 lg:p-8 bg-white/95 backdrop-blur-sm space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Complete Your Profile 📝</h2>
            <p className="mt-1 text-sm text-slate-500">
              Welcome, <strong>{name}</strong> ({role.charAt(0).toUpperCase() + role.slice(1)})
            </p>
          </div>

          {error && (
            <div className="p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>
          )}

          {/* User info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
              <input type="text" readOnly value={name} className="w-full px-3 py-2 rounded-lg bg-slate-200 border cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Email</label>
              <input type="email" readOnly value={email} className="w-full px-3 py-2 rounded-lg bg-slate-200 border cursor-not-allowed" />
            </div>
          </div>

          <hr className="border-t border-slate-200" />

          {/* Role-specific */}
          {role === "PATIENT" ? (
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Tell Us About Your Goals</label>
              <textarea
                rows="3"
                maxLength="500"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none"
                placeholder="I want to improve my sleep and energy levels..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1 text-right">{bio.length} / 500 characters</p>
            </div>
          ) : (
            <div>
              {/* Practitioner Bio */}
              <div className="mb-3">
                <label className="text-sm font-medium text-slate-700 block mb-1">Tell Us About Yourself</label>
                <textarea
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none"
                  placeholder="Write something about your experience, expertise..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1 text-right">{bio.length} / 500 characters</p>
              </div>

              {/* Specialization */}
              <label className="text-sm font-medium text-slate-700 block mb-1">Select Your Specialization:</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {specializationsOptions.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 capitalize">
                    <input
                      type="radio"
                      name="specialization"
                      value={spec}
                      checked={specialization === spec}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="form-radio text-cyan-600 h-4 w-4"
                    />
                    <span className="text-sm text-slate-600">{spec.charAt(0).toUpperCase() + spec.slice(1)}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Verification Status</label>
                <input
                  type="text"
                  readOnly
                  value="No (Upload documents to verify)"
                  className="w-full px-4 py-3 rounded-lg bg-slate-200 border cursor-not-allowed"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center pt-3">
            <button
              type="submit"
              disabled={saving}
              className={`py-3 px-12 rounded-lg text-white font-bold shadow-md transition duration-200 ${
                saving
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transform hover:-translate-y-0.5"
              }`}
            >
              {saving ? "Saving Profile..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>

      {/* Right image */}
      <div className="hidden lg:block lg:w-3/5 relative bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-600/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1920&auto=format&fit=crop"
          alt="Wellness and Meditation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-2">Wellness Marketplace For Alternate Therapies</h2>
          <p className="text-lg text-teal-50 opacity-90">
            “Well-being is more than care — it’s a mindful lifestyle shaped by the wisdom of your body, the clarity of your mind, and the peace of your spirit.”
          </p>
        </div>
      </div>
    </div>
  );
}
