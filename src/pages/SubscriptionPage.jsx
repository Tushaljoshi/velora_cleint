import { Lock, MessageCircleMore, Repeat } from "lucide-react"
import { useState, useEffect } from "react"
import { load } from "@cashfreepayments/cashfree-js";
import { useUser, useAuth } from "@clerk/clerk-react";



const creditCosts = [
  { feature: "Deep AI personality analysis", cost: 5 },
  { feature: "Advanced multi-step consultation", cost: 7 },
  { feature: "Luxury curated bundle", cost: 8 },
  { feature: "Brand discount unlock", cost: 3 },
  { feature: "Seasonal premium suggestions", cost: 4 },
  { feature: "Priority processing", cost: 2 },
]

const trustItems = [
  { icon: <Lock />, title: "Secure Payments", desc: "Powered by Razorpay. Your data is always safe." },
  { icon: <Repeat />, title: "Cancel Anytime", desc: "No lock-ins. Pause or cancel your subscription whenever." },
  { icon: <MessageCircleMore />, title: "Credits Roll Over", desc: "Unused credits carry forward to the next billing cycle." },
]

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
  </svg>
)

const CheckIcon = ({ colorClass }) => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" className={colorClass} fillOpacity="0.12" />
    <polyline points="7 12.5 10.5 16 17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={colorClass} />
  </svg>
)

const CrossIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#e5e7eb" fillOpacity="0.6" />
    <line x1="9" y1="9" x2="15" y2="15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="9" x2="9" y2="15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const FeatureCheck = ({ color, included }) =>
  included ? (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.12" />
      <polyline points="7 12.5 10.5 16 17 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <CrossIcon />
  )

const ctaClasses = {
  "outline-gray":
    "w-full py-3 rounded-2xl text-sm font-bold mb-6 cursor-pointer border-2 border-[#7c6e65] text-[#7c6e65] bg-transparent hover:bg-[#7c6e65] hover:text-white transition-all duration-200 hover:scale-[1.02] font-sans tracking-wide",
  "outline-red":
    "w-full py-3 rounded-2xl text-sm font-bold mb-6 cursor-pointer border-2 border-[#8b2626] text-[#8b2626] bg-transparent hover:bg-[#8b2626] hover:text-white transition-all duration-200 hover:scale-[1.02] font-sans tracking-wide",
  filled:
    "w-full py-3 rounded-2xl text-sm font-bold mb-6 cursor-pointer bg-[#7c1c1c] text-white border-none hover:bg-[#5c1414] transition-all duration-200 hover:scale-[1.02] font-sans tracking-wide",
  gold:
    "w-full py-3 rounded-2xl text-sm font-bold mb-6 cursor-pointer bg-gradient-to-r from-[#c9a227] via-[#b5943a] to-[#d4af60] text-white border-none hover:opacity-90 transition-all duration-200 hover:scale-[1.02] font-sans tracking-wide",
}

export default function SubscriptionPage() {
  const { user } = useUser();
  const [billing, setBilling] = useState("monthly")
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API}/api/plans/getplans`);
        const data = await res.json();

        const formattedPlans = data
          .filter(p => p.active && !p.isDeleted)
          .map((p) => ({
            id: p.id.toLowerCase(),
            name: p.name,
            tagline: p.tagline,
            credits: p.credits,

            price: {
              monthly: p.price,
              yearly: Math.floor(p.price * 0.8),
            },

            features: Object.entries(p.features)
              .map(([text, included]) => ({
                text,
                included,
              }))
              .sort((a, b) => b.included - a.included),

            badge: p.name === "Pro" ? "Most Popular" : p.name === "Elite" ? "Best Value" : null,
            featured: p.name === "Pro",
            elite: p.name === "Elite",

            bandColor:
              p.name === "Free"
                ? "bg-[#7c6e65]"
                : p.name === "Starter"
                  ? "bg-[#8b2626]"
                  : p.name === "Pro"
                    ? "bg-[#7c1c1c]"
                    : "bg-gradient-to-r from-[#c9a227] via-[#d4af60] to-[#b5943a]",

            borderClass:
              p.name === "Free"
                ? "border-[#7c6e65]/20"
                : p.name === "Starter"
                  ? "border-[#8b2626]/20"
                  : p.name === "Pro"
                    ? "border-[#7c1c1c]"
                    : "border-[#b5943a]/30",

            shadowClass:
              p.name === "Pro"
                ? "shadow-2xl shadow-[#7c1c1c]/20"
                : "shadow-md",

            textColor:
              p.name === "Free"
                ? "text-[#7c6e65]"
                : p.name === "Starter"
                  ? "text-[#8b2626]"
                  : p.name === "Pro"
                    ? "text-[#7c1c1c]"
                    : "text-[#b5943a]",

            accentBg:
              p.name === "Free"
                ? "bg-[#f2e5e5]"
                : p.name === "Starter"
                  ? "bg-[#fdf0f0]"
                  : p.name === "Pro"
                    ? "bg-[#fff8f8]"
                    : "bg-[#fdf8ee]",

            accentBorder:
              p.name === "Free"
                ? "border-[#7c6e65]/20"
                : p.name === "Starter"
                  ? "border-[#8b2626]/20"
                  : p.name === "Pro"
                    ? "border-[#7c1c1c]/20"
                    : "border-[#b5943a]/20",

            badgeBg:
              p.name === "Elite"
                ? "bg-gradient-to-r from-[#c9a227] to-[#b5943a]"
                : p.name === "Pro"
                  ? "bg-[#7c1c1c]"
                  : "",

            ctaVariant:
              p.name === "Free"
                ? "outline-gray"
                : p.name === "Starter"
                  ? "outline-red"
                  : p.name === "Pro"
                    ? "filled"
                    : "gold",

            cta:
              p.name === "Free"
                ? "Get Started Free"
                : p.name === "Starter"
                  ? "Start with Starter"
                  : p.name === "Pro"
                    ? "Go Pro"
                    : "Unlock Elite",
          }));
        const order = ["free", "starter", "pro", "elite"];

        formattedPlans.sort(
          (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
        );
        setPlans(formattedPlans);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async (planName) => {
    try {
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          type: "plan",
          itemId: planName,
        }),
      });

      const data = await res.json();

      console.log("Order:", data);

      const cashfree = await load({
        mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `http://localhost:5173/wallet`,

      });

    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken();

      const res = await fetch(`${API}/api/user/login`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUserData(data);
    };

    fetchUser();
  }, []);
  const plansToShow = plans.filter(p => {
    if (userData?.plan !== "free") {
      return p.name !== "free";
    }
    return true;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f8] via-[#f5ede8] to-[#fdf5f0] font-serif">

      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="text-center px-4 pt-16 pb-10 animate-[fadeUp_0.6s_ease_forwards]">



        <h1 className="text-[clamp(36px,6vw,68px)] font-semibold text-[#1a0a0a] leading-[1.1] mb-4 font-[Cormorant_Garamond,serif]">
          Gift Smarter ,
          <em className="text-[#8b2626] italic"> Every Time.</em>
        </h1>

        <p className="text-[clamp(14px,2vw,17px)] text-[#6b4040] max-w-[520px] mx-auto mb-8 leading-[1.7] font-sans">
          Choose your plan. Spend credits on deep AI gifting intelligence.
          The right gift is always one conversation away.
        </p>

        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#f2e5e5] border border-[#e8cece]">
          {["monthly", "yearly"].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-200 font-sans ${billing === b
                ? "bg-[#7c1c1c] text-white"
                : "bg-transparent text-[#7c4a4a]"
                }`}
            >
              {b === "monthly" ? "Monthly" : "Yearly"}
              {b === "yearly" && (
                <span
                  className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full text-white ${billing === "yearly" ? "bg-white/25" : "bg-[#8b2626]"
                    }`}
                >
                  Save 20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-5">
          {plansToShow.map((plan, idx) => {
            const price = billing === "yearly" ? plan.price.yearly : plan.price.monthly
            const yearlySaving = (plan.price.monthly - plan.price.yearly) * 12

            return (
              <div
                key={plan.id}
                className={`
            rounded-3xl overflow-hidden relative bg-white border-2 flex flex-col
            transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]
            hover:-translate-y-2
            ${plan.borderClass}
            ${plan.shadowClass}
            ${idx === 0 ? "animate-[fadeUp_0.6s_0.1s_ease_both]" : ""}
            ${idx === 1 ? "animate-[fadeUp_0.6s_0.2s_ease_both]" : ""}
            ${idx === 2 ? "animate-[fadeUp_0.6s_0.3s_ease_both]" : ""}
            ${idx === 3 ? "animate-[fadeUp_0.6s_0.4s_ease_both]" : ""}
          `}
              >
                <div className={`h-[5px] flex-shrink-0 ${plan.bandColor}`} />

                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white uppercase tracking-[0.08em] font-sans ${plan.badgeBg}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">

                  <div className="mb-5">
                    <p className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-1 font-sans ${plan.textColor}`}>
                      {plan.name}
                    </p>
                    <p className="text-[13px] text-[#9b7070] italic font-[Cormorant_Garamond,serif]">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-end gap-1">
                      <span className={`font-bold text-[#1a0a0a] leading-none font-[Cormorant_Garamond,serif] ${price === 0 ? "text-[42px]" : "text-[38px]"}`}>
                        {price === 0 ? "Free" : `₹${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-[12px] text-[#9b7070] mb-1.5 font-sans">/mo</span>
                      )}
                    </div>

                    <div className="h-5 mt-1">
                      {billing === "yearly" && price > 0 && (
                        <p className="text-[11px] text-[#7c9b5a] font-sans">
                          ₹{price * 12}/year · Save ₹{yearlySaving}
                        </p>
                      )}
                    </div>

                    <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border ${plan.accentBg} ${plan.accentBorder}`}>
                      <span className={plan.textColor}>
                        <SparkleIcon className="w-[14px] h-[14px]" />
                      </span>
                      <span className={`text-[11px] font-bold font-sans ${plan.textColor}`}>
                        {plan.credits} credits/mo
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePayment(plan.name)}
                    className={ctaClasses[plan.ctaVariant]}
                  >
                    {plan.cta}
                  </button>

                  <div className={`h-px mb-5 ${plan.accentBg}`} />

                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2.5">
                        <FeatureCheck color={plan.textColor.replace("text-[", "").replace("]", "")} included={feat.included} />
                        <span className={`text-[12.5px] font-sans ${feat.included ? "text-[#2a1010] font-medium" : "text-[#b0a0a0] font-normal"}`}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="px-4 sm:px-8 lg:px-12 pb-16">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

          <div className="w-full lg:w-1/2">
            <div className="text-center mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8b2626] mb-2 font-sans">
                Credit Usage
              </p>
              <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-[#1a0a0a] font-[Cormorant_Garamond,serif]">
                What Each Credit Unlocks
              </h2>
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#e8d5d5] bg-white shadow-sm">
              {creditCosts.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-[#7c1c1c]/[0.03] transition-colors ${i < creditCosts.length - 1 ? "border-b border-[#f0e4e4]" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#8b2626]" />
                    <span className="text-[13px] text-[#2a1010] font-medium font-sans">
                      {item.feature}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                    <SparkleIcon className="w-3 h-3 text-[#8b2626]" />
                    <span className="text-[17px] font-bold text-[#7c1c1c] font-[Cormorant_Garamond,serif]">
                      {item.cost}
                    </span>
                    <span className="text-[11px] text-[#b07070] font-sans">credits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="text-center mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8b2626] mb-2 font-sans">
                Our Promise
              </p>
              <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-[#1a0a0a] font-[Cormorant_Garamond,serif]">
                Why You Can Trust Us
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {trustItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#f0e4e4] shadow-sm hover:border-[#e8cece] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#fdeaea] flex items-center justify-center text-[#8b2626] flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1a0a0a] mb-1 font-[Cormorant_Garamond,serif]">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-[#9b7070] leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="text-center px-4 pb-20">
        <div className="inline-block bg-[#7c1c1c] px-8 py-10 rounded-3xl max-w-[520px] w-full">
          <h3 className="text-[clamp(24px,4vw,34px)] font-semibold text-white mb-2.5 font-[Cormorant_Garamond,serif]">
            Not sure which plan?
          </h3>
          <p className="text-[13.5px] text-white/70 mb-6 leading-[1.7] font-sans">
            Start free and upgrade anytime. No credit card needed for the Free plan.
          </p>
          <button className="bg-gradient-to-r from-[#c9a227] via-[#b5943a] to-[#d4af60] text-white px-8 py-3.5 rounded-2xl font-bold text-[13px] tracking-[0.06em] cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-[1.02] font-sans">
            ✦ Try Free, Upgrade Later
          </button>
        </div>
      </div>

    </div>
  )
}