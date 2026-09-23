import { useState, useEffect, useRef } from "react"
import Logo from "../assets/logo.png"
import { useClerk, useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { Mail, RefreshCcw } from "lucide-react"
import MobileNavDrawer from "./MobileNavDrawer"
import { Coins } from "lucide-react"
import { useUserData } from "../context/userContext"
import { MapPin } from "lucide-react"
import { useUserLocation } from "../Hooks/MapPicker"
const USER = {}

const SearchIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const HeartIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
)
const CloseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const TrendingIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
)
const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const MenuIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)
const SparkleIcon = ({ className = "w-3.5 h-3.5" }) => (
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
const CrownIcon = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 19h20v2H2zm18-9l-5 5-3-6-3 6-5-5 1-5h14z" />
    </svg>
)
const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)
const LogoutIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
)

const TRENDING = ["Red Roses", "Birthday Cake", "Orchids", "Anniversary Gifts", "Personalised Gifts", "Plants"]
const RECENT = ["Roses bouquet", "Wedding flowers", "Chocolate cake"]
const SUGGESTIONS = [
    "Roses for anniversary", "Birthday cakes same day",
    "Gift for girlfriend", "Flowers under ₹599", "Wedding gift ideas",
]

function SearchModal({ onClose }) {
    const [query, setQuery] = useState("")
    const inputRef = useRef(null)

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 80)
        return () => clearTimeout(t)
    }, [])
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", fn)
        return () => window.removeEventListener("keydown", fn)
    }, [onClose])
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    const filtered = query.length > 1
        ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
        : []

    return (
        <>
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                style={{ animation: "fadeIn 0.18s ease" }} onClick={onClose} />
            <div className="fixed z-[101] left-0 right-0 top-0 sm:top-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl sm:rounded-3xl overflow-hidden"
                style={{ background: "#fff9f8", boxShadow: "0 24px 80px rgba(100,20,20,0.22)", animation: "slideDown 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <div className="flex items-center gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-[#f0dbd9]">
                    <span className="text-[#8b2626] shrink-0"><SearchIcon /></span>
                    <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                        placeholder="Search flowers, cakes, gifts..."
                        className="flex-1 bg-transparent outline-none text-[#1c0808] placeholder-[#c9908a] text-[14px] sm:text-[15px]" />
                    <button onClick={onClose} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f3e4e3] text-[#a05050] transition-colors">
                        <CloseIcon />
                    </button>
                </div>
                <div className="px-4 sm:px-5 py-4 max-h-[75vh] overflow-y-auto">
                    {filtered.length > 0 && (
                        <div className="mb-4">
                            {filtered.map((s, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#fceeed] text-left transition-colors group" onClick={onClose}>
                                    <span className="text-[#c4706a]"><SearchIcon /></span>
                                    <span className="text-[13px] text-[#2a0f0f] flex-1">
                                        <span className="font-semibold text-[#8b2626]">{query}</span>{s.slice(query.length)}
                                    </span>
                                    <span className="text-[10px] text-[#c4a0a0] opacity-0 group-hover:opacity-100 transition-opacity">↵</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {RECENT.length > 0 && query === "" && (
                        <div className="mb-5">
                            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#b08080] mb-2.5">Recent</p>
                            <div className="flex flex-wrap gap-2">
                                {RECENT.map((r, i) => (
                                    <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8d0ce] text-[12px] text-[#6b3030] hover:bg-[#fceeed] hover:border-[#d4908a] transition-all" onClick={onClose}>
                                        <span className="text-[#c4706a]"><ClockIcon /></span>{r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {query === "" && (
                        <div className="mb-4">
                            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#b08080] mb-2.5">Trending Now</p>
                            <div className="flex flex-wrap gap-2">
                                {TRENDING.map((t, i) => (
                                    <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all hover:scale-[1.03] active:scale-95"
                                        style={{ background: i % 3 === 0 ? "#fdeaea" : i % 3 === 1 ? "#f3eafd" : "#eafaf0", color: i % 3 === 0 ? "#8b2626" : i % 3 === 1 ? "#6b24a0" : "#1a6b3a" }}
                                        onClick={onClose}>
                                        <span><TrendingIcon /></span>{t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {query.length > 1 && filtered.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-[13px] text-[#a07070]">No results for "<span className="font-semibold text-[#8b2626]">{query}</span>"</p>
                            <p className="text-[11px] text-[#c4a0a0] mt-1">Try roses, cakes, or chocolates</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
        </>
    )
}

function ProfilePopup({ onClose, navigate }) {
    const { isSignedIn } = useUser();
    const { signOut, openSignIn } = useClerk();
    const popupRef = useRef(null)
    const { dbUser } = useUserData();
    const fname = dbUser?.name?.trim()?.[0]?.toUpperCase() || ""
    const { setDbUser } = useUserData();

    useEffect(() => {
        const fn = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) onClose()
        }

        const t = setTimeout(() => document.addEventListener("mousedown", fn), 10)

        return () => {
            clearTimeout(t)
            document.removeEventListener("mousedown", fn)
        }
    }, [onClose])

    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", fn)
        return () => window.removeEventListener("keydown", fn)
    }, [onClose])

    useEffect(() => {
        if (!isSignedIn) {
            setDbUser(null);
        }
    }, [isSignedIn])

    return (
        <div
            ref={popupRef}
            className="z-[300] overflow-hidden fixed sm:absolute right-3 sm:right-0 top-[70px] sm:top-[calc(100%+10px)] w-[268px] rounded-xl"
            style={{
                background: "#fdf8f6",
                border: "1px solid #e8d5d0",
                boxShadow: "0 8px 32px rgba(80,20,20,0.12)",
                animation: "popupIn 0.18s ease forwards",
            }}
        >
            <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div className="px-4 py-3.5 border-b border-[#ecddd8]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#c4907a" }}>
                        <span className="text-white text-[13px] font-bold font-sans">{fname || "G"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold truncate font-sans" style={{ color: "#2a1010" }}>
                            {dbUser?.name || "Guest"}
                        </p>
                        <p className="text-[11px] truncate font-sans mt-0.5" style={{ color: "#a07870" }}>
                            {dbUser?.email}
                        </p>
                        <p className="text-[11px] truncate font-sans mt-0.5" style={{ color: "#a07870" }}>
                            {dbUser?.role}
                        </p>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full"
                            style={{ background: "#f0e0da" }}>
                            <CrownIcon className="w-2.5 h-2.5" style={{ color: "#8b4040" }} />
                            <span className="text-[9px] font-bold uppercase tracking-wide font-sans" style={{ color: "#8b4040" }}>
                                {dbUser?.plan} Plan
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-3 py-2">
                <button
                    onClick={() => { navigate("/wallet"); onClose() }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5ece8"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "#f0e0da" }}>
                        <WalletIcon className="w-4 h-4" style={{ color: "#8b4040" }} />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[12.5px] font-semibold font-sans" style={{ color: "#2a1010" }}>My Wallet</p>
                        <p className="text-[11px] font-sans" style={{ color: "#a07870" }}>{dbUser?.balance} credits</p>
                    </div>
                    <ChevronRightIcon className="w-3.5 h-3.5" style={{ color: "#c4a09a" }} />
                </button>
            </div>

            {USER.plan !== "Elite" && (
                <div className="px-3 pb-2">
                    <button
                        onClick={() => { navigate("/subscription"); onClose() }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                        style={{ background: "#f0e0da" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e8d0c8"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f0e0da"}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "#e0c8c0" }}>
                            <CrownIcon className="w-4 h-4" style={{ color: "#7c3030" }} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[12.5px] font-semibold font-sans" style={{ color: "#2a1010" }}>Upgrade Plan</p>
                            <p className="text-[11px] font-sans" style={{ color: "#a07870" }}>More credits & features</p>
                        </div>
                        <ChevronRightIcon className="w-3.5 h-3.5" style={{ color: "#c4a09a" }} />
                    </button>
                </div>
            )}

            <div className="mx-3" style={{ borderTop: "1px solid #ecddd8" }} />

            <div className="px-3 py-2">
                <div className="px-3 py-2">
                    <button
                        onClick={() => {
                            if (isSignedIn) {
                                signOut();
                            } else {
                                openSignIn();
                            }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                        style={{ background: "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5ece8"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <LogoutIcon className="w-3.5 h-3.5" style={{ color: "#b08880" }} />

                        <span className="text-[12px] font-medium font-sans" style={{ color: "#b08880" }}>
                            {isSignedIn ? "Sign Out" : "Sign In"}
                        </span>
                    </button>
                </div>
            </div>

        </div>
    )
}
export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [locationOpen, setLocationOpen] = useState(false);
    // const [location, setLocation] = useState("Jaipur"); const navigate = useNavigate()
    const profileBtnRef = useRef(null)
    const { dbUser } = useUserData();
    const navigate = useNavigate();
    const { location, loading, refetchLocation } = useUserLocation();

    const fname = dbUser?.name?.trim()?.[0]?.toUpperCase() || ""

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", fn)
        return () => window.removeEventListener("scroll", fn)
    }, [])


    return (
        <>
            <div className="w-full bg-[#7c1c1c] text-white text-[11px] sm:text-[12px] tracking-widest uppercase py-2 px-3 overflow-x-auto">
                <div className="flex items-center justify-center gap-3 whitespace-nowrap min-w-max">
                    <span>New York, America</span>
                    <span className="opacity-40">|</span>
                    <span>Contact <span className="font-bold text-[#ffcfcf]">+91 9000458514</span></span>
                    <span className="opacity-40">|</span>
                    <span className="flex items-center gap-2"><Mail size={11} />Info@Mail.com</span>
                </div>
            </div>

            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#e0c6c5]/90 backdrop-blur-lg border-b border-[#b4786e]/40 shadow-md" : "bg-[#eddcd9]"}`}>
                <div className="w-full mx-auto px-3 sm:px-4 md:px-8">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-6 h-[58px] sm:h-[66px] md:h-[76px]">

                        <a href="/" className="shrink-0">
                            <img src={Logo} alt="Logo" className="h-5 sm:h-20 md:h-[50px] object-contain" />
                        </a>
                        <div
                            onClick={() => setLocationOpen(true)}
                            className="hidden md:flex flex-col items-start px-3 py-1.5 rounded-xl hover:bg-black/5 transition-all group cursor-pointer border max-w-[200px]"
                        >
                            {/* Top Label */}
                            <span className="text-[10px] text-[#a07870]">
                                Deliver to
                            </span>

                            {/* Location Row */}
                            <div className="flex items-center gap-2 w-full">

                                {/* Location Text with Truncate */}
                                <span className="flex items-center gap-1 text-[13px] font-semibold text-[#5a2a2a] w-full">

                                    {/* Icon (fixed size) */}
                                    <MapPin size={14} className="shrink-0" />

                                    {/* Address Text */}
                                    <span
                                        className="truncate"
                                        title={
                                            loading
                                                ? "Detecting..."
                                                : `${location.address} ${location.pincode || ""}`
                                        }
                                    >
                                        {loading
                                            ? "Detecting..."
                                            : `${location.address} ${location.pincode || ""}`}
                                    </span>
                                </span>

                                {/* Refresh Button */}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        refetchLocation();
                                    }}
                                    className="text-[10px] p-1 rounded-md text-[#8b2626] hover:bg-[#eabcbc] cursor-pointer shrink-0"
                                    title="Refresh location"
                                >
                                    <RefreshCcw size={14} />
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 max-w-xl mx-auto">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden sm:flex w-full items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl h-[36px] sm:h-[42px] pl-3 pr-3 text-left  transition-all duration-200 hover:bg-white/80 group"
                                style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(180,110,100,0.3)" }}
                            >
                                <span className="text-[#c4706a] group-hover:text-[#8b2626] transition-colors"><SearchIcon /></span>
                                <span className="flex-1 text-[12px] sm:text-[14px] md:text-[15px] text-[#c4908a]">
                                    Search flowers, cakes, gifts...
                                </span>
                            </button>
                            <button onClick={() => setSearchOpen(true)} className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 border border-[#d4a09a]/40 text-[#8b2626]">
                                <SearchIcon />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

                            <button
                                onClick={() => navigate('/subscription')}
                                className="hidden sm:flex items-center gap-1.5 px-4 h-10 sm:h-11 rounded-xl text-white text-[12px] sm:text-[13px] font-bold hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden transition-all duration-200 relative group"
                                style={{ background: "linear-gradient(135deg, #7c1c1c, #a02020)", boxShadow: "0 4px 16px rgba(124,28,28,0.35)" }}
                            >
                                <span className="absolute top-1 right-1 bg-[#f4a100] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide leading-none shadow-sm z-10">New</span>
                                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                                <SparkleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                Try Premium
                            </button>

                            <button
                                onClick={() => navigate("/wallet")}
                                className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#e8d5a0] bg-[#fdf8ee] hover:bg-[#fdf0d0] hover:border-[#c9a227] hover:scale-[1.03] active:scale-95 transition-all duration-200 group"
                            >
                                <Coins className=" text-[#b5943a]" size={16} />
                                <span className="text-[13px] font-bold text-[#7a5010] font-sans">{dbUser?.balance || 0}</span>
                                <span className="text-[14px] text-[#b07840] font-sans hidden md:block">cr</span>
                            </button>

                            <button
                                onClick={() => navigate('/products/saved')}
                                className="relative flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl hover:bg-black/5 text-[#5c2a2a]"
                            >
                                <HeartIcon />
                                <span className="hidden sm:block text-[12px] md:text-[14px] mt-0.5">Saved</span>
                                <span className="absolute top-1 right-1 sm:right-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#8b2626] text-white text-[8px] flex items-center justify-center">
                                    {USER.savedCount}
                                </span>
                            </button>

                            <div className="relative" ref={profileBtnRef}>
                                <button
                                    onClick={() => setProfileOpen(p => !p)}
                                    className={`relative flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl transition-colors ${profileOpen ? "bg-[#f2e5e5]" : "hover:bg-black/5"}`}
                                >
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#c4907a] flex items-center justify-center ring-2 transition-all ${profileOpen ? "ring-[#7c1c1c]" : "ring-transparent"}`}>
                                        <span className="text-white text-[11px] font-bold font-sans">{fname || "G"}</span>
                                    </div>
                                    <span className="hidden sm:block text-[12px] md:text-[14px] text-[#5c2a2a] mt-0.5">Account</span>
                                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 border-2 border-white" /> */}
                                </button>

                                {profileOpen && (
                                    <ProfilePopup
                                        onClose={() => setProfileOpen(false)}
                                        navigate={navigate}
                                    />
                                )}
                            </div>

                            <button
                                onClick={() => setMobileNavOpen(true)}
                                className="lg:hidden flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl hover:bg-black/5 text-[#5c2a2a]"
                            >
                                <MenuIcon />
                                <span className="text-[11px] sm:text-[13px] mt-0.5">Menu</span>
                            </button>

                        </div>
                    </div>
                </div>
            </header>

            {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
            <MobileNavDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        </>
    )
}