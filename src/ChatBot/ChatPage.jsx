import { useState, useEffect, useRef } from "react"

const START_API = "https://velora-ai-model.onrender.com/chat/start"
const CHAT_API = "https://velora-ai-model.onrender.com/chat/message"

const RELATION_CHIPS = [
    "Mother", "Father", "Sister", "Brother", "Girlfriend", "Boyfriend",
    "Wife", "Husband", "Friend", "Bestie", "Partner", "Cousin", "Mentor", "Colleague",
]

const CONTEXT = {
    mother: { occasions: ["Birthday", "Mother's Day", "Anniversary", "Retirement", "Get Well Soon", "Diwali", "Christmas", "Housewarming", "Just Because"], ages: ["35–45", "45–55", "55–65", "65+"] },
    father: { occasions: ["Birthday", "Father's Day", "Anniversary", "Retirement", "Get Well Soon", "Diwali", "Christmas", "Housewarming", "Just Because"], ages: ["35–45", "45–55", "55–65", "65+"] },
    sister: { occasions: ["Birthday", "Raksha Bandhan", "Graduation", "New Job", "Breakup Recovery", "Get Well Soon", "Diwali", "Christmas", "Just Because"], ages: ["Under 10", "10–18", "18–25", "25–35", "35+"] },
    brother: { occasions: ["Birthday", "Raksha Bandhan", "Graduation", "New Job", "Get Well Soon", "Diwali", "Christmas", "Just Because"], ages: ["Under 10", "10–18", "18–25", "25–35", "35+"] },
    girlfriend: { occasions: ["Birthday", "Valentine's Day", "Anniversary", "Graduation", "New Job", "Breakup Recovery", "Get Well Soon", "Christmas", "Just Because"], ages: ["18–22", "22–27", "27–32", "32+"] },
    boyfriend: { occasions: ["Birthday", "Valentine's Day", "Anniversary", "Graduation", "New Job", "Get Well Soon", "Christmas", "Just Because"], ages: ["18–22", "22–27", "27–32", "32+"] },
    wife: { occasions: ["Birthday", "Valentine's Day", "Anniversary", "Mother's Day", "Get Well Soon", "Diwali", "Christmas", "Housewarming", "Just Because"], ages: ["22–28", "28–35", "35–45", "45+"] },
    husband: { occasions: ["Birthday", "Valentine's Day", "Anniversary", "Father's Day", "Get Well Soon", "Diwali", "Christmas", "Housewarming", "Just Because"], ages: ["22–28", "28–35", "35–45", "45+"] },
    friend: { occasions: ["Birthday", "Graduation", "New Job", "Breakup Recovery", "Get Well Soon", "Friendship Day", "Housewarming", "Just Because", "Christmas"], ages: ["15–20", "20–28", "28–38", "38+"] },
    bestie: { occasions: ["Birthday", "Graduation", "New Job", "Breakup Recovery", "Get Well Soon", "Friendship Day", "Housewarming", "Just Because", "Valentine's Day"], ages: ["15–20", "20–25", "25–30", "30+"] },
    partner: { occasions: ["Birthday", "Valentine's Day", "Anniversary", "Graduation", "New Job", "Get Well Soon", "Diwali", "Christmas", "Just Because"], ages: ["18–25", "25–35", "35–45", "45+"] },
    cousin: { occasions: ["Birthday", "Graduation", "New Job", "Wedding", "Diwali", "Christmas", "Raksha Bandhan", "Just Because"], ages: ["Under 15", "15–22", "22–30", "30+"] },
    mentor: { occasions: ["Birthday", "Retirement", "Farewell", "Teacher's Day", "Professional Milestone", "Just Because"], ages: ["30–40", "40–55", "55+"] },
    colleague: { occasions: ["Birthday", "Farewell", "New Job", "Promotion", "Professional Milestone", "Just Because"], ages: ["22–30", "30–40", "40–55", "55+"] },
}

const BUDGET_CHIPS = [
    "Under ₹500", "₹500–1,000", "₹1,000–2,500", "₹2,500–5,000", "₹5,000–10,000", "₹10,000–25,000", "No limit",
]

const STEP_ORDER = ["relation", "occasion", "age", "budget", "done"]
const PROGRESS = { relation: 20, occasion: 45, age: 70, budget: 90, done: 100 }

function uid() { return Date.now() + Math.random().toString(36).slice(2) }
function getTime() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }

function parseGiftSuggestions(text) {
    const items = [], re = /\d+\.\s\*?\*?(.*?)\*?\*?\s*([^]*?)(?=Search:\s*"([^"]+)")/g
    const reSearch = /\d+\.\s\*?\*?(.*?)\*?\*?\s*([\s\S]*?)Search:\s*"([^"]+)"/g
    let m
    while ((m = reSearch.exec(text)) !== null)
        items.push({ name: m[1].trim().replace(/\*/g, ""), description: m[2].trim().replace(/\n/g, " "), search: m[3].trim() })
    return items
}

function cleanBotFinalMessage(text) {
    // Remove the numbered gift list — keep only intro sentence before "1."
    const cutIdx = text.search(/\d+\.\s/)
    if (cutIdx > 0) {
        let intro = text.slice(0, cutIdx).trim()
        // Replace walls of text about budget limits with something friendly
        intro = intro
            .replace(/However,.*?guidelines\.\s*/gi, "")
            .replace(/I['']ll be suggesting gifts within.*?\.\s*/gi, "")
            .replace(/as per my guidelines\.\s*/gi, "")
            .trim()
        // If intro got too long or empty, use a default
        if (!intro || intro.length > 200) intro = "Here are some handpicked ideas I think you'll love"
        return intro
    }
    // No numbered list found, return as is (trimmed)
    return text.replace(/\*\*/g, "").trim()
}

const GiftSVG = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" rx="1" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
)
const UserSVG = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)
const SendSVG = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)
const XSvg = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const PlusSVG = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const SearchSVG = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const EditSVG = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)
const SparkSVG = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
)

const TypingDots = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "12px 16px" }}>
        {[0, 1, 2].map(i => (
            <span key={i} style={{
                width: 7, height: 7, borderRadius: "50%", background: "#f43f5e", display: "inline-block",
                animation: `tdot 1.2s ease-in-out ${i * 0.18}s infinite`,
            }} />
        ))}
    </div>
)

const Chip = ({ label, onClick, dashed = false }) => (
    <button onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "7px 15px", borderRadius: 999,
        border: dashed ? "1.5px dashed #fecdd3" : "1.5px solid #fecdd3",
        background: "white", color: dashed ? "#fb7185" : "#9f1239",
        fontSize: 12.5, fontFamily: "inherit", fontWeight: 600,
        cursor: "pointer", transition: "all .15s",
        whiteSpace: "nowrap",
    }}
        onMouseEnter={e => {
            e.currentTarget.style.background = dashed ? "#fff1f2" : "#be123c"
            e.currentTarget.style.color = dashed ? "#e11d48" : "white"
            e.currentTarget.style.borderColor = dashed ? "#fda4af" : "#be123c"
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = "white"
            e.currentTarget.style.color = dashed ? "#fb7185" : "#9f1239"
            e.currentTarget.style.borderColor = "#fecdd3"
        }}>
        {dashed && <EditSVG />}
        {label}
    </button>
)

const ChipGroup = ({ chips, onSelect, onOther }) => (
    <div style={{ paddingLeft: 36, display: "flex", flexDirection: "column", gap: 8, animation: "popIn .25s ease" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {chips.map((c, i) => <Chip key={i} label={c} onClick={() => onSelect(c)} />)}
            <Chip label="other…" onClick={onOther} dashed />
        </div>
    </div>
)

const ProductCard = ({ product, index }) => (
    <div style={{
        minWidth: 165, maxWidth: 185, flexShrink: 0,
        background: "white",
        border: "1.5px solid #fecdd3",
        borderRadius: 16, padding: "12px 12px 10px",
        display: "flex", flexDirection: "column", gap: 7,
        animation: `popIn .3s ease ${index * 0.06}s both`,
        position: "relative", overflow: "hidden",
    }}>
        {/* Number badge */}
        <div style={{
            position: "absolute", top: 10, right: 10,
            width: 18, height: 18, borderRadius: "50%",
            background: "#fff1f2", color: "#fda4af",
            fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
        }}>{index + 1}</div>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: "#9f1239", lineHeight: 1.35, margin: 0, paddingRight: 20 }}>{product.name}</p>
        <div style={{ width: 28, height: 2, background: "#fecdd3", borderRadius: 2 }} />
        <p style={{ fontSize: 11, color: "#78716c", lineHeight: 1.55, flex: 1, margin: 0 }}>{product.description}</p>
        <button onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(product.search)}`, "_blank")}
            style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                marginTop: 2, padding: "6px 10px", borderRadius: 10,
                background: "linear-gradient(135deg,#e11d48,#9f1239)",
                color: "white", fontSize: 11, fontWeight: 700,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                letterSpacing: 0.2,
            }}>
            <SearchSVG /> search online
        </button>
    </div>
)

export default function ChatPage({ closeChat, onFirstInteraction, onPaidAction }) {
    const [sessionId, setSessionId] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const [starting, setStarting] = useState(true)
    const [manualMode, setManualMode] = useState(false)
    const [products, setProducts] = useState(null)
    const [panelLabel, setPanelLabel] = useState("picked just for you")
    const [step, setStep] = useState("relation")
    const [chipList, setChipList] = useState([])
    const [userData, setUserData] = useState({})
    const [progress, setProgress] = useState(20)
    const [showPostActions, setShowPostActions] = useState(false)

    const bottomRef = useRef(null)
    const textareaRef = useRef(null)
    const panelOpen = Array.isArray(products) && products.length > 0

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing, chipList, manualMode, showPostActions])
    useEffect(() => { if (manualMode) textareaRef.current?.focus() }, [manualMode])

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch(START_API, { method: "POST" })
                const data = await res.json()
                setSessionId(data.session_id)
                setMessages([{ id: uid(), from: "bot", text: data.message, time: getTime() }])
                setChipList(RELATION_CHIPS)
                setStep("relation")
            } catch {
                setMessages([{ id: uid(), from: "bot", text: "hey! couldn't connect. please refresh.", time: getTime() }])
            } finally { setStarting(false) }
        }
        init()
    }, [])

    const getChipsForStep = (nextStep, newUserData) => {
        const relKey = (newUserData.relation || "").toLowerCase()
        const ctx = CONTEXT[relKey] || CONTEXT.friend
        if (nextStep === "occasion") return ctx.occasions
        if (nextStep === "age") return ctx.ages
        if (nextStep === "budget") return BUDGET_CHIPS
        return []
    }

    const sendAnswer = async (answer, nextStep, newUserData) => {
        setChipList([])
        setManualMode(false)
        setTyping(true)
        setMessages(p => [...p, { id: uid(), from: "me", text: answer, time: getTime() }])

        if (nextStep === "done") {
            try {
                const res = await fetch(CHAT_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: answer, session_id: sessionId }),
                })
                const data = await res.json()
                const rawText = data.message || data.reply || ""

                // Always try to parse gift cards from the response
                const suggested = Array.isArray(data.products) && data.products.length ? data.products : null
                const parsed = suggested || parseGiftSuggestions(rawText)

                // Clean the intro text — strip the numbered list + budget disclaimer noise
                const displayText = cleanBotFinalMessage(rawText.replace(/\*\*/g, ""))

                setMessages(p => [...p, { id: uid(), from: "bot", text: displayText, time: getTime() }])

                if (parsed.length) {
                    setProducts(parsed)
                    setPanelLabel("gift ideas for you")
                }
                setShowPostActions(true)
            } catch {
                setMessages(p => [...p, { id: uid(), from: "bot", text: "something went wrong, try again?", time: getTime() }])
            }
            setTyping(false)
            setProgress(PROGRESS.done)
            return
        }

        try {
            const res = await fetch(CHAT_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: answer, session_id: sessionId }),
            })
            const data = await res.json()
            const botText = (data.message || data.reply || "").replace(/\*\*/g, "")
            setMessages(p => [...p, { id: uid(), from: "bot", text: botText, time: getTime() }])
            const nextChips = getChipsForStep(nextStep, newUserData)
            setChipList(nextChips)
            setStep(nextStep)
            setProgress(PROGRESS[nextStep] || 100)
        } catch {
            setMessages(p => [...p, { id: uid(), from: "bot", text: "hmm something broke, try again?", time: getTime() }])
        }
        setTyping(false)
    }

    const handleChip = async (value) => {
        if (step === "relation") {
            const allowed = await onPaidAction()

            if (!allowed) return
        }

        const idx = STEP_ORDER.indexOf(step)
        const nextStep = STEP_ORDER[idx + 1] || "done"

        const newData = { ...userData, [step]: value }
        setUserData(newData)

        if (step === "budget" && progress === PROGRESS.done) {
            sendAnswer(value, "done", newData)
        } else {
            sendAnswer(value, nextStep, newData)
        }
    }

    // Sends a free-text message to the API after results, stays in "done" state
    const sendFreeText = async (text) => {
        setShowPostActions(false)
        setChipList([])
        setTyping(true)
        setMessages(p => [...p, { id: uid(), from: "me", text, time: getTime() }])
        try {
            const res = await fetch(CHAT_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, session_id: sessionId }),
            })
            const data = await res.json()
            const rawText = data.message || data.reply || ""
            const suggested = Array.isArray(data.products) && data.products.length ? data.products : null
            const parsed = suggested || parseGiftSuggestions(rawText)
            const displayText = cleanBotFinalMessage(rawText.replace(/\*\*/g, ""))
            setMessages(p => [...p, { id: uid(), from: "bot", text: displayText, time: getTime() }])
            if (parsed.length) { setProducts(parsed); setPanelLabel("more ideas for you") }
            setShowPostActions(true)
        } catch {
            setMessages(p => [...p, { id: uid(), from: "bot", text: "something went wrong, try again?", time: getTime() }])
            setShowPostActions(true)
        }
        setTyping(false)
    }

    // Handle "change budget" — show budget chips again
    const handleChangeBudget = () => {
        setShowPostActions(false)
        setChipList(BUDGET_CHIPS)
        setStep("budget")
    }

    const handleManualSend = () => {
        const msg = input.trim()
        if (!msg || typing) return
        setInput("")
        if (textareaRef.current) textareaRef.current.style.height = "auto"
        const idx = STEP_ORDER.indexOf(step)
        const nextStep = STEP_ORDER[idx + 1] || "done"
        const newData = { ...userData, [step]: msg }
        setUserData(newData)
        sendAnswer(msg, nextStep, newData)
    }

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleManualSend() }
    }

    const handleInputChange = (e) => {
        setInput(e.target.value)
        const el = textareaRef.current
        if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 100) + "px" }
    }

    const handleNew = () => {
        setMessages([]); setInput(""); setProducts(null)
        setManualMode(false); setChipList([]); setStep("relation")
        setUserData({}); setStarting(true); setSessionId(null); setProgress(20); setShowPostActions(false)
        fetch(START_API, { method: "POST" }).then(r => r.json())
            .then(d => {
                setSessionId(d.session_id)
                setMessages([{ id: uid(), from: "bot", text: d.message, time: getTime() }])
                setChipList(RELATION_CHIPS)
            })
            .catch(() => {
                setMessages([{ id: uid(), from: "bot", text: "couldn't connect, please refresh.", time: getTime() }])
            })
            .finally(() => setStarting(false))
    }

    const canSend = input.trim().length > 0 && !typing

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes tdot { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-6px);opacity:1} }
        @keyframes popIn { from{opacity:0;transform:scale(.93) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #fecdd3; border-radius: 4px; }
        textarea:focus { outline: none; }
        .msg-scroll { overflow-y: auto; flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
      `}</style>

            <div style={{
                display: "flex", flexDirection: "column", height: "100vh",
                background: "white", overflow: "hidden",
                fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>

                {/* Header */}
                <header style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderBottom: "1px solid #fce7eb",
                    background: "white", flexShrink: 0,
                }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: "50%",
                        background: "linear-gradient(135deg,#fb7185,#be123c)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", flexShrink: 0, boxShadow: "0 2px 8px rgba(190,18,60,.25)",
                    }}>
                        <GiftSVG size={18} />
                    </div>
                    <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#1c1917", letterSpacing: -0.3 }}>Valora Gifter</p>
                        <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#a8a29e", marginTop: 1 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                            your gift bestie is online
                        </p>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={handleNew} disabled={starting} style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
                            borderRadius: 10, border: "1px solid #fecdd3", background: "white",
                            color: "#a8a29e", fontSize: 11, fontWeight: 600, cursor: "pointer",
                            fontFamily: "inherit", transition: "all .15s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.color = "#be123c" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#a8a29e" }}>
                            <PlusSVG /> new chat
                        </button>
                        {closeChat && (
                            <button onClick={closeChat} style={{
                                width: 32, height: 32, borderRadius: 10, border: "1px solid #fecdd3",
                                background: "white", color: "#a8a29e", display: "flex", alignItems: "center",
                                justifyContent: "center", cursor: "pointer", transition: "all .15s",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.color = "#be123c" }}
                                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#a8a29e" }}>
                                <XSvg size={14} />
                            </button>
                        )}
                    </div>
                </header>

                {/* Progress bar */}
                <div style={{ height: 3, background: "#fff1f2", flexShrink: 0 }}>
                    <div style={{
                        height: "100%",
                        background: "linear-gradient(90deg,#fb7185,#be123c)",
                        borderRadius: "0 2px 2px 0",
                        width: `${progress}%`,
                        transition: "width .5s cubic-bezier(.4,0,.2,1)",
                    }} />
                </div>

                {/* Step pills */}
                <div style={{
                    display: "flex", gap: 6, padding: "10px 16px 6px",
                    background: "white", flexShrink: 0, borderBottom: "1px solid #fff1f2",
                }}>
                    {["relation", "occasion", "age", "budget"].map((s, i) => {
                        const done = STEP_ORDER.indexOf(s) < STEP_ORDER.indexOf(step)
                        const active = s === step
                        return (
                            <div key={s} style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "3px 10px", borderRadius: 999,
                                background: done ? "#be123c" : active ? "#fff1f2" : "transparent",
                                border: done ? "1px solid #be123c" : active ? "1px solid #fecdd3" : "1px solid #f4f4f4",
                                fontSize: 10.5, fontWeight: 600,
                                color: done ? "white" : active ? "#be123c" : "#d4d0cc",
                                transition: "all .3s",
                            }}>
                                {done ? "✓" : `${i + 1}.`} {s}
                            </div>
                        )
                    })}
                </div>

                {/* Messages */}
                {starting ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #fecdd3", borderTopColor: "#be123c", animation: "spin 1s linear infinite" }} />
                        <p style={{ fontSize: 12, color: "#fda4af", fontWeight: 600 }}>loading your gift bestie…</p>
                    </div>
                ) : (
                    <div className="msg-scroll">
                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
                            <div style={{ flex: 1, height: 1, background: "#fff1f2" }} />
                            <span style={{ fontSize: 10, color: "#d4d0cc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>today</span>
                            <div style={{ flex: 1, height: 1, background: "#fff1f2" }} />
                        </div>

                        {messages.map(msg => (
                            <div key={msg.id}
                                style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: msg.from === "me" ? "row-reverse" : "row", animation: "msgIn .22s ease" }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    background: msg.from === "bot" ? "linear-gradient(135deg,#fb7185,#be123c)" : "#f5f5f4",
                                    color: msg.from === "bot" ? "white" : "#a8a29e",
                                }}>
                                    {msg.from === "bot" ? <GiftSVG size={13} /> : <UserSVG size={12} />}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", maxWidth: "72%", alignItems: msg.from === "me" ? "flex-end" : "flex-start" }}>
                                    <div style={{
                                        padding: "9px 14px", fontSize: 13.5, lineHeight: 1.6, wordBreak: "break-word",
                                        borderRadius: msg.from === "bot" ? "18px 18px 18px 5px" : "18px 18px 5px 18px",
                                        background: msg.from === "bot" ? "#fff1f2" : "linear-gradient(135deg,#e11d48,#9f1239)",
                                        color: msg.from === "bot" ? "#292524" : "white",
                                    }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: 10, color: "#d4d0cc", marginTop: 4, padding: "0 4px" }}>{msg.time}</span>
                                </div>
                            </div>
                        ))}

                        {/* Chips */}
                        {chipList.length > 0 && !typing && (
                            <ChipGroup chips={chipList} onSelect={handleChip} onOther={() => { setChipList([]); setManualMode(true) }} />
                        )}

                        {/* Post-result action buttons */}
                        {showPostActions && !typing && (
                            <div style={{ paddingLeft: 36, display: "flex", flexDirection: "column", gap: 8, animation: "popIn .3s ease" }}>
                                <p style={{ fontSize: 11.5, color: "#a8a29e", fontWeight: 500 }}>want to explore more?</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {/* Change budget */}
                                    <button onClick={handleChangeBudget} style={{
                                        display: "inline-flex", alignItems: "center", gap: 6,
                                        padding: "8px 16px", borderRadius: 999,
                                        border: "1.5px solid #fecdd3", background: "white",
                                        color: "#9f1239", fontSize: 12.5, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "#be123c"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#be123c" }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#9f1239"; e.currentTarget.style.borderColor = "#fecdd3" }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                        change budget
                                    </button>
                                    {/* Show me more */}
                                    <button onClick={async () => {
                                        const allowed = await onPaidAction()

                                        if (!allowed) return

                                        sendFreeText("Show me more gift ideas")
                                    }} style={{
                                        display: "inline-flex", alignItems: "center", gap: 6,
                                        padding: "8px 16px", borderRadius: 999,
                                        border: "1.5px solid transparent",
                                        background: "linear-gradient(135deg,#e11d48,#9f1239)",
                                        color: "white", fontSize: 12.5, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                                        boxShadow: "0 2px 8px rgba(190,18,60,.25)",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(190,18,60,.35)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(190,18,60,.25)"; e.currentTarget.style.transform = "translateY(0)" }}>
                                        <SparkSVG /> show me more
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Manual input inline */}
                        {manualMode && !typing && (
                            <div style={{ paddingLeft: 36, animation: "popIn .2s ease" }}>
                                <div style={{
                                    display: "flex", alignItems: "flex-end", gap: 8,
                                    background: "#fff1f2", border: "1.5px solid #fecdd3",
                                    borderRadius: 16, padding: "8px 12px",
                                    transition: "border-color .15s",
                                }}>
                                    <textarea
                                        ref={textareaRef}
                                        rows={1}
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKey}
                                        placeholder="type your answer…"
                                        style={{
                                            flex: 1, background: "transparent", border: "none", outline: "none",
                                            resize: "none", fontSize: 13.5, color: "#292524", lineHeight: 1.5,
                                            fontFamily: "inherit", maxHeight: 100,
                                        }}
                                    />
                                    <button onClick={handleManualSend} disabled={!canSend} style={{
                                        width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "none", fontFamily: "inherit", cursor: canSend ? "pointer" : "default",
                                        background: canSend ? "linear-gradient(135deg,#e11d48,#9f1239)" : "#fecdd3",
                                        color: canSend ? "white" : "#fda4af",
                                        transition: "all .15s", flexShrink: 0,
                                    }}>
                                        <SendSVG />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Typing indicator */}
                        {typing && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, animation: "msgIn .2s ease" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#fb7185,#be123c)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                                    <GiftSVG size={13} />
                                </div>
                                <div style={{ background: "#fff1f2", borderRadius: "18px 18px 18px 5px" }}>
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}

                {/* Product panel */}
                <div style={{
                    borderTop: "1px solid #fce7eb", background: "white", flexShrink: 0,
                    overflow: "hidden", maxHeight: panelOpen ? 250 : 0,
                    transition: "max-height .45s cubic-bezier(.4,0,.2,1)",
                }}>
                    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#be123c", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                <SparkSVG /> {panelLabel}
                            </p>
                            <button onClick={() => setProducts(null)} style={{
                                width: 24, height: 24, borderRadius: 8, border: "1px solid #fecdd3",
                                background: "white", color: "#a8a29e", display: "flex", alignItems: "center",
                                justifyContent: "center", cursor: "pointer",
                            }}>
                                <XSvg size={12} />
                            </button>
                        </div>
                        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "thin" }}>
                            {(products || []).map((p, i) => <ProductCard key={p.id || i} product={p} index={i} />)}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: "1px solid #fce7eb", padding: "8px 16px", background: "white", flexShrink: 0 }}>
                    <p style={{ fontSize: 10, color: "#d4d0cc", textAlign: "center", lineHeight: 1.5 }}>
                        giftgenie can make mistakes · always double-check order details
                    </p>
                </div>

            </div >
        </>
    )
}