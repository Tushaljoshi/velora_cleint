import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Anniversary from "../assets/b2.png"

const anniversaryMenu = [
  {
    title: "Must Haves",
    items: [
      "Anniversary Cakes", "Flowers", "Flowers n Cakes", "Flowers n Chocolates",
      "Personalised Gifts", "Plants", "Combos", "Chocolates",
      "Gift Hampers", "Greeting Cards"
    ]
  },
  {
    title: "Prime Picks",
    items: [
      "All Gifts", "Bestsellers", "New Arrivals", "Premium Gifts",
      "Luxury Anniversary", "Romantic Gifts", "Midnight Delivery", "Same Day Delivery"
    ]
  },
  {
    title: "Personal Picks",
    items: ["Romantic Gifts", "Couple Gifts", "Memory Frames", "Photo Gifts", "Love Notes"]
  },
  {
    title: "Anniversary Gifts For",
    items: ["Husband", "Wife", "Couple", "Parents", "Friends", "Boyfriend", "Girlfriend"]
  },
  {
    title: "Milestone Anniversary",
    items: [
      "1st Anniversary", "5th Anniversary", "10th Anniversary",
      "25th Anniversary", "50th Anniversary"
    ]
  },
  {
    title: "Unique Gifting",
    items: [
      "Jewellery", "Experiential Gifts", "Luxury Hampers",
      "Home Decor", "Personalised Frames"
    ]
  },
  {
    title: "Price Wise Gifts",
    items: ["Rs 500 - Rs 1000", "Rs 1000 - Rs 2000", "Above Rs 2000", "Below Rs 500"]
  }
]

const ChevronIcon = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 16 16"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.22s ease", flexShrink: 0 }}
  >
    <path d="M3 6l5 4 5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

function MobileSection({ title, items, navigate }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: "1px solid #e8d5d5" }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: open ? "#eedcdc" : "#f2e5e5",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#2a0a0a" }}>{title}</span>
        <span style={{ color: "#a04040" }}><ChevronIcon open={open} /></span>
      </button>

      {open && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 8px",
          padding: "10px 16px 14px",
          background: "#fbefef",
        }}>
          {items.map((item) => (
            <button
              key={item}
              onClick={() => navigate(`/products/${item.toLowerCase().replace(/\s+/g, "-")}`)}
              style={{
                padding: "5px 11px",
                borderRadius: 20,
                border: "1px solid #d4a0a0",
                background: "#fff",
                fontSize: 12,
                color: "#5a1a1a",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#e8003d"
                e.currentTarget.style.color = "#fff"
                e.currentTarget.style.borderColor = "#e8003d"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#fff"
                e.currentTarget.style.color = "#5a1a1a"
                e.currentTarget.style.borderColor = "#d4a0a0"
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AnniversaryMegaMenu() {
  const navigate = useNavigate()

  return (
    <div className="relative">

      <div className="hidden lg:flex absolute left-0 w-[1500px] bg-[#f2e5e5] shadow-xl border border-[#e6e6e6] p-6 gap-5 z-50">
        {anniversaryMenu.map((col) => (
          <div key={col.title} className="flex-1">
            <h4 className="text-[15px] font-bold text-gray-900 mb-3">{col.title}</h4>
            <ul className="flex flex-col gap-[3px]">
              {col.items.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => navigate(`/products/${item.toLowerCase().replace(/\s+/g, "-")}`)}
                    className="text-[15px] font-serif text-gray-700 hover:text-[#e8003d] text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <img src={Anniversary} className="absolute bottom-4 right-4 h-[100px] w-[100px]" alt="" />
      </div>

      <div className="lg:hidden" style={{ background: "#f2e5e5" }}>

        <div style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "10px 16px",
          borderBottom: "1px solid #e8d5d5",
          scrollbarWidth: "none",
        }}>
          {["Flowers", "Anniversary Cakes", "Romantic Gifts", "Couple Gifts", "Jewellery", "Midnight Delivery"].map(item => (
            <button
              key={item}
              onClick={() => navigate(`/products/${item.toLowerCase().replace(/\s+/g, "-")}`)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                border: "1.5px solid #c47070",
                background: "#fff",
                fontSize: 12,
                fontWeight: 500,
                color: "#7c1c1c",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {anniversaryMenu.map((col) => (
          <MobileSection
            key={col.title}
            title={col.title}
            items={col.items}
            navigate={navigate}
          />
        ))}

      </div>

    </div>
  )
}