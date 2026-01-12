import { useNavigate } from "react-router-dom";

export default function PractitionerSection({
  title,
  description,
  buttonText,
  redirectTo,
  image,
  reverse,
  isFirst,
}) {
  const navigate = useNavigate();

  return (
    <section
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-10 px-8 py-20 ${
        isFirst ? "pt-24" : ""
      }`}
    >
      <div className="lg:w-1/2 space-y-6">
        <h2 className="text-4xl font-black text-[#1B3C53]">{title}</h2>
        <p className="text-gray-700">{description}</p>
        <button
          onClick={() => navigate(redirectTo)}
          className="px-6 py-3 bg-[#1B3C53] text-white rounded-full font-semibold hover:opacity-90"
        >
          {buttonText}
        </button>
      </div>

      <div className="lg:w-1/2">
        <img
          src={image}
          alt="section"
          className="rounded-3xl shadow-lg"
        />
      </div>
    </section>
  );
}
