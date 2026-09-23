import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Birthday from "../assets/b2.png"

const occasionsMenu = [
  {
    title: "Festive Vibes",
    items: [
      "Ramadan - 17th Feb - 19th Mar",
      "Eid ul Fitr - 19th - 21st Mar"
    ]
  },
  {
    title: "Moments of Joy",
    items: [
      { label: "Gifts in 60 mins", badge: true },
      "Mother's Day - 10th May",
      "Father's Day - 21st Jun",
      "Wife Appreciation Day - 21st Sep",
      "International Men's Day - 19th Nov",
      "Valentine's Day - 14th Feb"
    ]
  },
  {
    title: "Celebrations & Sentiments",
    items: [
      "Wedding", "Congratulations", "I Am Sorry", "Love n Romance",
      "Miss You", "Thank You", "Thinking of You", "Best Wishes",
      "Get Well Soon", "House Warming", "New Born Baby",
      "Baby Shower", "Retirement", "Sympathy n Funeral"
    ]
  },
  {
    title: "Gift Ideas",
    items: [
      "Flowers", "Cakes", "Chocolates", "Personalised Gifts",
      "Gift Hampers", "Plants", "Balloon Decor", "Greeting Cards", "Experiential Gifts"
    ]
  },
  {
    title: "Send Gifts To",
    items: [
      "Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Hyderabad",
      "Kolkata", "Chennai", "Lucknow", "Ahmedabad", "All Other Cities"
    ]
  }
]

const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 16 16"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.22s ease", flexShrink: 0 }}>
    <path d="M3 6l5 4 5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

function MobileSection({ col, navigate }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: "1px solid #e8d5d5" }}>
      <button onClick={() => setOpen(p => !p)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 16px", background: open ? "#eedcdc" : "#f2e5e5",
        border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#2a0a0a" }}>{col.title}</span>
        <span style={{ color: "#a04040" }}><ChevronIcon open={open} /></span>
      </button>
      {open && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px", padding: "10px 16px 14px", background: "#fbefef" }}>
          {col.items.map((item) => {
            const isObject = typeof item === "object"
            const label = isObject ? item.label : item
            const badge = isObject && item.badge
            return (
              <button key={label}
                onClick={() => navigate(`/products/${label.toLowerCase().replace(/\s+/g, "-")}`)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 11px", borderRadius: 20, border: "1px solid #d4a0a0",
                  background: "#fff", fontSize: 12, color: "#5a1a1a", cursor: "pointer",
                  whiteSpace: "nowrap", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e8003d"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#e8003d" }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#5a1a1a"; e.currentTarget.style.borderColor = "#d4a0a0" }}
              >
                {label}
                {badge && <span style={{ fontSize: 9, fontWeight: 700, background: "#e8003d", color: "#fff", padding: "1px 5px", borderRadius: 10 }}>New</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function OccasionsMegaMenu() {
  const navigate = useNavigate()
  return (
    <div className="relative">
      <div className="hidden lg:flex absolute left-0 w-[1500px] bg-[#f2e5e5] shadow-xl border border-[#e6e6e6] p-6 gap-5 z-50">
        {occasionsMenu.map((col) => (
          <div key={col.title} className="flex-1">
            <h4 className="text-[16px] font-bold text-gray-900 mb-3">{col.title}</h4>
            <ul className="flex flex-col gap-[3px]">
              {col.items.map((item) => {
                const isObject = typeof item === "object"
                return (
                  <li key={isObject ? item.label : item} className="flex items-center gap-2">
                    <a href="#" className="text-[14px] font-serif text-gray-700 hover:text-[#e8003d]">
                      {isObject ? item.label : item}
                    </a>
                    {isObject && item.badge && <span className="text-[9px] bg-[#e8003d] text-white px-2 py-[2px] rounded-full font-bold">New</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        <img src={Birthday} className="absolute bottom-4 right-4 h-[100px] w-[100px]" alt="" />
      </div>

      <div className="lg:hidden" style={{ background: "#f2e5e5" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px", borderBottom: "1px solid #e8d5d5", scrollbarWidth: "none" }}>
          {["Wedding", "Thank You", "Love n Romance", "Congratulations", "Get Well Soon", "Flowers"].map(label => (
            <button key={label} onClick={() => navigate(`/products/${label.toLowerCase().replace(/\s+/g, "-")}`)}
              style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "1.5px solid #c47070", background: "#fff", fontSize: 12, fontWeight: 500, color: "#7c1c1c", cursor: "pointer", whiteSpace: "nowrap" }}>
              {label}
            </button>
          ))}
        </div>
        {occasionsMenu.map((col, i) => <MobileSection key={i} col={col} navigate={navigate} />)}
      </div>
    </div>
  )
}