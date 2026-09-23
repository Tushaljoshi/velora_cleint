import { useState, useEffect } from "react"
import { Gem, Repeat, Tag, Target, Zap } from "lucide-react"
import { useUserData } from "../context/userContext"
import { load } from "@cashfreepayments/cashfree-js";
import { useAuth, useUser } from "@clerk/clerk-react"
import { db } from "../firebase/config"



// const topups = [
//   { credits: 10, price: 49, tag: null },
//   { credits: 30, price: 129, tag: "Popular" },
//   { credits: 60, price: 229, tag: "Best Value" },
//   { credits: 120, price: 399, tag: null },
// ]

const creditCosts = [
  { feature: "Deep AI personality analysis", cost: 5 },
  { feature: "Advanced multi-step consultation", cost: 7 },
  { feature: "Luxury curated bundle", cost: 8 },
  { feature: "Brand discount unlock", cost: 3 },
  { feature: "Seasonal premium suggestions", cost: 4 },
  { feature: "Priority processing", cost: 2 },
]
const formatSource = (source) => {
  const map = {
    signup_bonus: "Signup Bonus",
    chat: "AI Chat",
    suggestion: "Suggestions",
  };
  return map[source] || source;
};
const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "";

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();

  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  const days = Math.floor(diff / 86400);

  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString();
};

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
  </svg>
)
const WalletIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="7" width="20" height="14" rx="3" />
    <path d="M16 14a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" stroke="none" />
    <path d="M2 10h20M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" />
  </svg>
)
const CrownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 19h20v2H2zm18-9l-5 5-3-6-3 6-5-5 1-5h14z" />
  </svg>
)
const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const HistoryIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const InfoIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
)
const GridIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const ArrowUpIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
  </svg>
)

function ProgressRing({ used, total, color, size = 100, strokeWidth = 8 }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min((used / total) * 100, 100)
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0e4e4" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  )
}

function SideNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 font-sans text-[13px] font-semibold ${active
        ? "bg-[#7c1c1c] text-white shadow-md shadow-[#7c1c1c]/20"
        : "text-[#9b7070] hover:bg-[#fdeaea] hover:text-[#7c1c1c]"
        }`}
    >
      <span className={active ? "text-white" : "text-[#c47070]"}>{icon}</span>
      {label}
    </button>
  )
}

export default function WalletPage() {
  const [topups, setTopups] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [Wallet, setWallet] = useState([])
  const [tab, setTab] = useState("overview")
  const [selectedPack, setSelectedPack] = useState(null)
  const [filter, setFilter] = useState("all")
  const { dbUser } = useUserData();
  const { getToken } = useAuth();
  const { user } = useUser();
  const API = import.meta.env.VITE_API_URL;
  const parseDate = (value) => {
    if (!value) return null;

    // ISO string
    if (typeof value === "string") {
      return new Date(value);
    }

    // Firestore raw object
    if (value._seconds) {
      return new Date(value._seconds * 1000);
    }

    // Already Date
    if (value instanceof Date) {
      return value;
    }

    return null;
  };
  useEffect(() => {
    const fetchTopups = async () => {
      try {
        const res = await fetch(`${API}/api/plans/gettopups`);
        const data = await res.json();
        setTopups(data);
      } catch (err) {
        console.error("Topup fetch error:", err);
      }
    };

    fetchTopups();
  }, []);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        const res = await fetch(`${API}/api/user/transaction`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json();
        setTransactions(data.Transactions);

      }
      catch (err) {
        console.error({ error: err.message });
      }
    }
    fetchTransactions();
  }, []);
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        const res = await fetch(`${API}/api/user/balance`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) {
          throw new Error("Failed to fetch wallet");
        }
        const data = await res.json();
        console.log(data)
        setWallet(data);
      } catch (err) {
        console.error({ error: err.message })
      }
    }
    fetchWallet();
  }, [])
  const handlePayment = async (type, itemId) => {
    try {
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          type,
          itemId,
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

  const usedPct = Math.round((Wallet?.used / dbUser?.earned) * 100)
  const filteredTx = transactions.filter(t =>
    filter === "credits" ? t.type === "credit" :
      filter === "debits" ? t.type === "debit" : true
  )
  const expiry = parseDate(dbUser?.planExpiresAt);
  const formattedExpiry = expiry
    ? expiry.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "No expiry";
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f8] via-[#f5ede8] to-[#fdf5f0] flex flex-col">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="w-full bg-[#7c1c1c] px-6 sm:px-10 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-screen-2xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <WalletIcon className="w-5 h-5 text-white/50" />
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] font-sans">My Wallet</p>
            </div>
            <h1 className="text-[clamp(26px,4vw,42px)] font-semibold text-white leading-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Credit Balance
            </h1>
            <p className="text-white/50 text-[12px] font-sans mt-0.5">Manage credits, top up, and track usage</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* {[
              { label: "Balance", value: Wallet?.balance, color: "text-white", bg: "bg-white/10", border: "border-white/20" },
              { label: "Earned", value: Wallet?.earned, color: "text-white", bg: "bg-white/10", border: "border-white/20" },
              { label: "Used", value: Wallet?.used, color: "text-white", bg: "bg-white/10", border: "border-white/20" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-4 py-2.5 text-center min-w-[80px]`}>
                <p className={`text-[20px] font-bold leading-none ${s.color}`}
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>{s.value}</p>
                <p className="text-white/50 text-[10px] font-sans mt-0.5">{s.label}</p>
              </div>
            ))} */}
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-white/20"
              style={{ background: "linear-gradient(135deg, #7c1c1c, #a02020)", boxShadow: "0 4px 16px rgba(124,28,28,0.35)" }}
            >
              <CrownIcon className="w-3.5 h-3.5 text-white" />
              <div>
                <p className="text-white text-[11px] font-bold uppercase tracking-wide font-sans leading-none">{dbUser?.plan} Plan</p>
                <p className="text-white text-[9px] font-sans mt-0.5">  {expiry ? `Expires on ${formattedExpiry}` : "No active plan"} </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-5">

        <aside className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0">

          <div className="bg-white rounded-3xl border border-[#f0e4e4] shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#c9a227] via-[#d4af60] to-[#b5943a]" />
            <div className="p-5 flex flex-col items-center">
              <div className="relative mb-3">
                <ProgressRing used={Wallet?.used} total={Wallet?.earned || 0} color="#7c1c1c" size={110} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#9b7070] font-sans">Balance</span>
                  <span className="text-[26px] font-bold text-[#1a0a0a] leading-none"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}>{Wallet?.balance}</span>
                  <span className="text-[10px] text-[#9b7070] font-sans">credits</span>
                </div>
              </div>
              <div className="w-full bg-[#f8f0f0] rounded-full h-1.5 mb-1">
                <div className="h-1.5 rounded-full bg-[#7c1c1c]" style={{ width: `${usedPct}%` }} />
              </div>
              {/* <p className="text-[11px] text-white font-sans">{usedPct}% used · {Wallet?.earned - Wallet?.used} remaining</p> */}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#f0e4e4] shadow-sm p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4a0a0] font-sans px-3 mb-2">Navigation</p>
            <div className="flex flex-col gap-1">
              <SideNavItem
                icon={<GridIcon className="w-4 h-4" />}
                label="Overview"
                active={tab === "overview"}
                onClick={() => setTab("overview")}
              />
              <SideNavItem
                icon={<HistoryIcon className="w-4 h-4" />}
                label="Transaction History"
                active={tab === "history"}
                onClick={() => setTab("history")}
              />
              <SideNavItem
                icon={<ArrowUpIcon className="w-4 h-4" />}
                label="Top Up Credits"
                active={tab === "topup"}
                onClick={() => setTab("topup")}
              />
            </div>
          </div>

          <button
            onClick={() => setTab("topup")}
            className="w-full rounded-3xl overflow-hidden relative group"
            style={{ background: "linear-gradient(135deg, #7c1c1c, #a02020)" }}
          >
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
            <div className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <PlusIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white text-[12px] font-bold font-sans">Buy More Credits</p>
                <p className="text-white/55 text-[10px] font-sans">Starting from ₹49</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-white/40 ml-auto" />
            </div>
          </button>

          {/* <div className="bg-white rounded-3xl border border-[#f0e4e4] shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <InfoIcon className="w-3.5 h-3.5 text-[#b08080]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#c4a0a0] font-sans">Credit Costs</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {creditCosts.map(item => (
                <li key={item.feature} className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] text-[#5a2020] font-sans font-medium truncate">{item.feature}</span>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <SparkleIcon className="w-2.5 h-2.5 text-[#b5943a]" />
                    <span className="text-[13px] font-bold text-[#7c1c1c]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}>{item.cost}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div> */}
        </aside>

        <main className="flex-1 min-w-0 flex flex-col gap-5">

          <div className="flex lg:hidden items-center gap-1 p-1 rounded-2xl bg-[#f2e5e5] border border-[#e8cece] self-start">
            {[
              { id: "overview", label: "Overview" },
              { id: "history", label: "History" },
              { id: "topup", label: "Top Up" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-[12px] font-semibold font-sans transition-all duration-200 ${tab === t.id ? "bg-[#7c1c1c] text-white shadow-md" : "text-[#9b7070] hover:text-[#7c1c1c]"
                  }`}
              >{t.label}</button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="flex flex-col gap-5">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Available Credits", value: Wallet.balance, sub: "Ready to use", color: "text-[#7c1c1c]", bg: "from-[#fff8f8] to-white", icon: <SparkleIcon className="w-5 h-5 text-[#7c1c1c]" />, border: "border-[#f0e4e4]" },
                  { label: "Total Earned", value: Wallet?.earned, sub: "All time", color: "text-[#2d7a4a]", bg: "from-[#eafaf0] to-white", icon: <ArrowUpIcon className="w-5 h-5 text-[#2d7a4a]" />, border: "border-[#c0e8d0]" },
                  { label: "Total Used", value: Wallet?.used, sub: "All time", color: "text-[#8b2626]", bg: "from-[#fdeaea] to-white", icon: <HistoryIcon className="w-5 h-5 text-[#8b2626]" />, border: "border-[#f0c0c0]" },
                ].map(s => (
                  <div key={s.label} className={`bg-gradient-to-b ${s.bg} rounded-3xl border ${s.border} p-5 shadow-sm`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[#f0e4e4]">
                        {s.icon}
                      </div>
                    </div>
                    <p className={`text-[32px] font-bold leading-none mb-1 ${s.color}`}
                      style={{ fontFamily: "Cormorant Garamond, serif" }}>{s.value}</p>
                    <p className="text-[12px] font-semibold text-[#1a0a0a] font-sans">{s.label}</p>
                    <p className="text-[11px] text-[#9b7070] font-sans">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                <div className="bg-white rounded-3xl border border-[#f0e4e4] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[17px] font-semibold text-[#1a0a0a]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}>Quick Top-up</h3>
                    <span className="text-[#8b2626]"><SparkleIcon /></span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3 mb-4">
                    {topups
                      .filter(p => p.active && !p.isDeleted)
                      .map(pack => (
                        <button key={pack.id} onClick={() => setSelectedPack(pack)}
                          className={`relative rounded-2xl border-2 p-3 text-center transition-all duration-200 hover:scale-[1.03] ${selectedPack?.id === pack.id
                            ? "border-[#7c1c1c] bg-[#fff8f8] shadow-md shadow-[#7c1c1c]/10"
                            : "border-[#f0e4e4] hover:border-[#d4a0a0]"
                            }`}>
                          {pack.tag && (
                            <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap font-sans ${pack.tag === "Best Value" ? "bg-gradient-to-r from-[#c9a227] to-[#b5943a]" : "bg-[#7c1c1c]"
                              }`}>{pack.tag}</span>
                          )}
                          <p className="text-[20px] font-bold text-[#1a0a0a] leading-none mt-1"
                            style={{ fontFamily: "Cormorant Garamond, serif" }}>{pack.credits}</p>
                          <p className="text-[10px] text-[#9b7070] font-sans">credits</p>
                          <p className="text-[12px] font-bold text-[#7c1c1c] font-sans mt-1">₹{pack.price}</p>
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => selectedPack && handlePayment("topup", selectedPack.name)}

                    disabled={!selectedPack}
                    className={`w-full py-3 rounded-2xl text-[13px] font-bold font-sans tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${selectedPack
                      ? "bg-[#7c1c1c] text-white hover:bg-[#5c1414] hover:scale-[1.01] shadow-lg shadow-[#7c1c1c]/20"
                      : "bg-[#f2e5e5] text-[#b08080] cursor-not-allowed"
                      }`}>
                    <PlusIcon />
                    {selectedPack ? `Pay ₹${selectedPack?.price} ` : "Select a pack to continue"}
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-[#f0e4e4] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[17px] font-semibold text-[#1a0a0a]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}>Recent Activity</h3>
                    <button onClick={() => setTab("history")}
                      className="text-[12px] text-[#7c1c1c] font-semibold font-sans hover:underline flex items-center gap-1">
                      View All <ChevronRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <ul className="divide-y divide-[#f8eded] max-h-[320px] overflow-y-auto pr-1 
[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {transactions.map((tx, index) => (
                      <li
                        key={tx.id}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-[#fff8f8] transition-colors"
                      >

                        <div className="text-[12px] text-[#b08080] font-semibold w-6">
                          #{index + 1}
                        </div>

                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${tx.type === "credit"
                            ? "bg-[#eafaf0] text-[#2d7a4a]"
                            : "bg-[#fdeaea] text-[#8b2626]"
                            }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#1a0a0a] font-sans">
                            {tx.credits} credits{" "}
                            <span className="font-semibold">
                              {tx.type === "credit" ? "credited" : "debited"}
                            </span>{" "}
                            for {formatSource(tx.source)}                          </p>

                          <p className="text-[10px] text-[#b08080] font-sans">
                            {formatDate(tx.createdAt)}
                          </p>
                        </div>

                        <div
                          className={`text-[16px] font-bold ${tx.type === "credit"
                            ? "text-[#2d7a4a]"
                            : "text-[#8b2626]"
                            }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {tx.credits}
                        </div>

                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "history" && (
            <div className="bg-white rounded-3xl border border-[#f0e4e4] shadow-sm overflow-hidden">

              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0e4e4] sticky top-0 bg-white z-10">
                <HistoryIcon className="w-4 h-4 text-[#8b2626]" />
                <span className="text-[14px] font-semibold text-[#1a0a0a] font-sans flex-1">Transaction History</span>
                <div className="flex gap-1">
                  {["all", "credits", "debits"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold font-sans capitalize transition-all ${filter === f ? "bg-[#7c1c1c] text-white" : "text-[#9b7070] hover:bg-[#fdeaea]"
                        }`}>{f}</button>
                  ))}
                </div>
              </div>

              <ul
                className="divide-y divide-[#f8eded] overflow-y-auto max-h-[420px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {filteredTx.map(tx => (
                  <li key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#fff8f8] transition-colors">

                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-[15px] font-bold ${tx.type === "credit" ? "bg-[#eafaf0] text-[#2d7a4a]" : "bg-[#fdeaea] text-[#8b2626]"
                      }`}>
                      {tx.type === "credit" ? "↑" : "↓"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1a0a0a] font-sans">
                        {tx.credits} credits{" "}
                        <span className="font-semibold">
                          {tx.type === "credit" ? "credited" : "debited"}
                        </span>{" "}
                        for {formatSource(tx.source)}                      </p>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#b08080] font-sans">
                          {formatDate(tx.createdAt)}
                        </span>

                        {/* Optional tag */}
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f2e5e5] text-[#8b4040] font-semibold font-sans">
                          {tx.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className={`text-[16px] font-bold ${tx.type === "credit" ? "text-[#2d7a4a]" : "text-[#8b2626]"
                        }`} style={{ fontFamily: "Georgia, serif" }}>
                        {tx.type === "credit" ? "+" : "-"}{tx.credits}
                      </span>
                      <span className="text-[10px] text-[#b08080] font-sans">credits</span>
                    </div>

                  </li>
                ))}
              </ul>

              {filteredTx.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[14px] text-[#b08080] font-sans">No transactions found</p>
                </div>
              )}
            </div>
          )}

          {tab === "topup" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

              <div className="bg-white rounded-3xl border border-[#f0e4e4] p-6 shadow-sm">
                <h3 className="text-[18px] font-semibold text-[#1a0a0a] mb-1"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>Buy Credits</h3>
                <p className="text-[12px] text-[#9b7070] mb-5 font-sans">Top up your wallet instantly </p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {topups.filter(p => p.active && !p.isDeleted).map(pack => (
                    <button key={pack.id} onClick={() => setSelectedPack(pack)}
                      className={`relative rounded-2xl border-2 p-4 text-center transition-all duration-200 hover:scale-[1.02] ${selectedPack?.id === pack.id
                        ? "border-[#7c1c1c] bg-[#fff8f8] shadow-lg shadow-[#7c1c1c]/10"
                        : "border-[#f0e4e4] hover:border-[#d4a0a0]"
                        }`}>
                      {pack.tag && (
                        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap font-sans ${pack.tag === "Best Value" ? "bg-gradient-to-r from-[#c9a227] to-[#b5943a]" : "bg-[#7c1c1c]"
                          }`}>{pack.tag}</span>
                      )}
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <SparkleIcon className="w-3.5 h-3.5 text-[#b5943a]" />
                        <span className="text-[28px] font-bold text-[#1a0a0a] leading-none"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}>{pack.credits}</span>
                      </div>
                      <p className="text-[10px] text-[#9b7070] font-sans mb-2">credits</p>
                      <p className={`text-[14px] font-bold font-sans ${selectedPack?.id === pack.id ? "text-[#7c1c1c]" : "text-[#2a1010]"}`}>
                        ₹{pack.price}
                      </p>
                      <p className="text-[9px] text-[#b08080] font-sans mt-1">₹{(pack.price / pack.credits).toFixed(1)}/credit</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => selectedPack && handlePayment("topup", selectedPack.name)}
                  disabled={!selectedPack}
                  className={`w-full py-3.5 rounded-2xl text-[13px] font-bold font-sans tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${selectedPack
                    ? "bg-[#7c1c1c] text-white hover:bg-[#5c1414] hover:scale-[1.01] shadow-lg shadow-[#7c1c1c]/20"
                    : "bg-[#f2e5e5] text-[#b08080] cursor-not-allowed"
                    }`}>
                  <PlusIcon />
                  {selectedPack ? `Pay ₹${selectedPack?.price} ` : "Select a credit pack"}
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#f0e4e4] p-6 shadow-sm">
                <h3 className="text-[18px] font-semibold text-[#1a0a0a] mb-4"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}>Why Buy Credits?</h3>
                <ul className="flex flex-col gap-3 mb-5">
                  {[
                    { icon: <Target />, text: "Unlock deep AI personality analysis for hyper-personalised gifts" },
                    { icon: <Gem />, text: "Access luxury curated bundles not available on free plan" },
                    { icon: <Zap />, text: "Priority processing — skip the queue, get answers instantly" },
                    { icon: <Tag />, text: "Exclusive brand discounts and affiliate partner deals" },
                    { icon: <Repeat />, text: "Unused credits roll over — they never expire" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#fff8f8] transition-colors">
                      <span className="text-[18px] flex-shrink-0">{item.icon}</span>
                      <p className="text-[12.5px] text-[#4a2020] font-sans leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl bg-[#fdf8ee] border border-[#e8d5a0] p-4 flex items-center gap-3">
                  <SparkleIcon className="w-5 h-5 text-[#b5943a]" />
                  <div>
                    <p className="text-[11px] text-[#7a6020] font-semibold font-sans">Current Balance</p>
                    <p className="text-[22px] font-bold text-[#b5943a] leading-none"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      {dbUser?.balance} <span className="text-[13px] font-sans font-normal text-[#9b7070]">credits</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}