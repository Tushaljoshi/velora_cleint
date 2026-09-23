import { useState } from "react"
import { useNavigate } from "react-router-dom"
const PERKS = [
  "25 credits/month",
  "Multi-step AI consult",
  "Personality gifting",
]

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
    <circle cx="10" cy="10" r="9" fill="#c4003a" fillOpacity="0.12" />
    <polyline
      points="6,10.5 8.5,13 14,7.5"
      stroke="#c4003a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-[1px]">
    <circle cx="10" cy="10" r="9" stroke="#9b7070" strokeWidth="1.2" />
    <line x1="10" y1="6" x2="10" y2="11" stroke="#9b7070" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="10" cy="13.5" r="0.8" fill="#9b7070" />
  </svg>
)

export default function TryPremiumCTA() {
  const [yearly, setYearly] = useState(false)
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const [hoverGhost, setHoverGhost] = useState(false)
const navigate =  useNavigate();
  const monthlyPrice = 499
  const yearlyMonthly = 399
  const yearlyTotal = yearlyMonthly * 12

  const displayPrice = yearly ? `₹${yearlyMonthly}` : `₹${monthlyPrice}`
  const wasPrice = yearly ? `₹${yearlyTotal.toLocaleString("en-IN")}/yr` : `₹${monthlyPrice}`
  const thenText = yearly
    ? `Then ₹${yearlyTotal.toLocaleString("en-IN")}/yr`
    : `Then ₹${monthlyPrice}/mo`
  const subtext = yearly
    ? `Billed annually after your 7-day trial. That's ₹${yearlyMonthly}/month — 20% off the monthly price.`
    : "Get full access to AI-powered gifting, personality analysis, and discount unlocks ."

  return (
    <div className="w-full px-4 sm:px-8 py-10 bg-[rgba(255,242,255,0.54)] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div
        className="dm  w-full mx-auto bg-white rounded-2xl overflow-hidden"
        style={{ border: "0.5px solid #ead8d8" }}
      >
        <div className="h-[3px] bg-[#c4003a]" />

        <div className="p-6 sm:p-8">

          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-4"
            style={{ background: "#fff0f3", color: "#c4003a", border: "0.5px solid #f0c0cc" }}>
            <div className="w-[5px] h-[5px] rounded-full bg-[#c4003a]" />
            Basic plan
          </div>

          <div className="flex items-start justify-between gap-5 mb-5 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-[22px] font-semibold text-[#1c1c1c] leading-snug mb-2">
                Try Premium <br />
              </h2>
              <p className="text-[13px] text-[#9b7070] leading-relaxed max-w-[340px]">
                {subtext}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[34px] font-semibold text-[#c4003a] leading-none">₹199</p>
              <p className="text-[11px] text-[#9b7070] mt-1">Basic plan</p>
            
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className={`text-[12px] ${!yearly ? "font-semibold text-[#1c1c1c]" : "text-[#9b7070]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-9 h-5 rounded-full flex-shrink-0 transition-colors duration-200 cursor-pointer"
              style={{
                background: yearly ? "#c4003a" : "#f0e8e8",
                border: `0.5px solid ${yearly ? "#c4003a" : "#e0cccc"}`,
              }}
            >
              <div
                className="absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-transform duration-200"
                style={{ left: 3, transform: yearly ? "translateX(16px)" : "translateX(0)" }}
              />
            </button>
            <span className={`text-[12px] ${yearly ? "font-semibold text-[#1c1c1c]" : "text-[#9b7070]"}`}>
              Yearly
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "#e5f4ee", color: "#0a7a50", border: "0.5px solid #b6dfc8" }}>
              Save 20%
            </span>
          </div>

          <div className="border-t border-[#f5eaea] mb-5" />

          <div className="flex flex-wrap gap-2 mb-6">
            {PERKS.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[12px] text-[#1c1c1c] px-3 py-1.5 rounded-full"
                style={{ background: "#fff0f3", border: "0.5px solid #f0c0cc" }}
              >
                <CheckIcon />
                {p}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
                onClick={() => navigate("/subscription")}
              onMouseEnter={() => setHoverPrimary(true)}
              onMouseLeave={() => setHoverPrimary(false)}
              className="text-[13px] font-semibold text-white px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
              style={{
                background: "#c4003a",
                border: "none",
                opacity: hoverPrimary ? 0.85 : 1,
                transform: hoverPrimary ? "scale(1.02)" : "scale(1)",
              }}
            >
              See all plans
            </button>

           
          </div>


        </div>
      </div>
    </div>
  )
}