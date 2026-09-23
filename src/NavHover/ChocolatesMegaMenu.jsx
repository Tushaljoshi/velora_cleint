import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Choco from "../assets/b2.png"

const chocolatesMenu = [
  {
    title: "By Featured",
    items: [
      { label: "All Chocolates" },
      { label: "Best Sellers" },
      { label: "Same Day Chocolates" },
      { label: "New Arrivals" },
      { label: "Premium Chocolates", badge: true },
      { label: "Gourmet Gifts" },
      { label: "Milk Chocolates" },
      { label: "Dark Chocolates" },
      { label: "Personalised Chocolates" },
      { label: "Sugar Free Chocolates" },
      { label: "Handmade Chocolates" }
    ]
  },
  {
    title: "By Choices",
    items: [
      { label: "Chocolate Bouquets" },
      { label: "Chocolate Hampers" },
      { label: "Chocolate Combos" },
      { label: "Flowers n Chocolates" },
      { label: "Imported Chocolates" },
      { label: "Dubai Chocolates", badge: true }
    ]
  },
  {
    title: "By Brands",
    items: [
      { label: "Ferrero Rocher" },
      { label: "Cadbury" },
      { label: "Artisanal Chocolates" },
      { label: "FNP Premium Chocolates" },
      { label: "Lindt Chocolates" },
      { label: "Toblerone" },
      { label: "Hershey Chocolates" },
      { label: "Kitkat Chocolates" }
    ]
  },
  {
    title: "By Occasions",
    sections: [
      {
        items: [
          { label: "Birthday" },
          { label: "Anniversary" },
          { label: "Thank You" },
          { label: "Wedding" }
        ]
      },
      {
        title: "By Prices",
        items: [
          { label: "Gifts Rs 500 - Rs 1000" },
          { label: "Gifts Rs 1000 - Rs 2000" },
          { label: "Gifts above Rs 2000" }
        ]
      }
    ]
  },
  {
    title: "By Cities",
    items: [
      { label: "Delhi NCR" },
      { label: "Bengaluru" },
      { label: "Mumbai" },
      { label: "Pune" },
      { label: "Hyderabad" },
      { label: "Kolkata" },
      { label: "Chennai" },
      { label: "Lucknow" },
      { label: "All Other Cities" }
    ]
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

const PillButton = ({ item, navigate }) => (
  <button
    onClick={() => navigate(`/products/${item.label.toLowerCase().replace(/\s+/g, "-")}`)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
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
    {item.label}
    {item.badge && (
      <span style={{
        fontSize: 9, fontWeight: 700,
        background: "#e8003d", color: "#fff",
        padding: "1px 5px", borderRadius: 10,
      }}>
        New
      </span>
    )}
  </button>
)

function MobileSection({ title, col, navigate }) {
  const [open, setOpen] = useState(false)

  const allItems = col.sections
    ? col.sections.flatMap(s => s.items)
    : col.items

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
        <div style={{ background: "#fbefef", padding: "10px 16px 14px" }}>

          {col.sections ? (
            col.sections.map((section, j) => (
              <div key={j} style={{ marginBottom: j < col.sections.length - 1 ? 12 : 0 }}>
                {section.title && (
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: "#a04040",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    marginBottom: 6,
                  }}>
                    {section.title}
                  </p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px" }}>
                  {section.items.map(item => (
                    <PillButton key={item.label} item={item} navigate={navigate} />
                  ))}
                </div>
                {j < col.sections.length - 1 && (
                  <hr style={{ border: "none", borderTop: "1px solid #e8d5d5", margin: "10px 0 0" }} />
                )}
              </div>
            ))
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px" }}>
              {allItems.map(item => (
                <PillButton key={item.label} item={item} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ChocolatesMegaMenu() {
  const navigate = useNavigate()

  return (
    <div className="relative">

      <div className="hidden lg:flex absolute left-0 w-[1500px] bg-[#f2e5e5] shadow-xl border border-[#e6e6e6] p-6 gap-6 z-50">
        {chocolatesMenu.map((col, i) => (
          <div key={i} className="flex-1">
            {col.title && (
              <h4 className="text-[16px] font-bold text-gray-900 mb-3">{col.title}</h4>
            )}
            {col.sections ? (
              col.sections.map((section, j) => (
                <div key={j} className={j > 0 ? "mt-5" : ""}>
                  {section.title && (
                    <h4 className="text-[16px] font-bold text-gray-900 mb-2">{section.title}</h4>
                  )}
                  <ul className="flex flex-col gap-[4px]">
                    {section.items.map((item) => (
                      <li key={item.label} className="flex items-center gap-2">
                        <a href="#" className="text-[15px] text-gray-700 font-serif hover:text-[#e8003d]">
                          {item.label}
                        </a>
                        {item.badge && (
                          <span className="text-[9px] font-bold bg-[#e8003d] text-white px-2 py-[2px] rounded-full">New</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {j < col.sections.length - 1 && <hr className="my-4 border-[#ddd]" />}
                </div>
              ))
            ) : (
              <ul className="flex flex-col gap-[4px]">
                {col.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <a href="#" className="text-[15px] text-gray-700 font-serif hover:text-[#e8003d]">
                      {item.label}
                    </a>
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-[#e8003d] text-white px-2 py-[2px] rounded-full">New</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <img src={Choco} className="absolute bottom-4 right-4 h-[100px] w-[100px]" alt="" />
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
          {[
            { label: "Best Sellers" },
            { label: "Dubai Chocolates", badge: true },
            { label: "Ferrero Rocher" },
            { label: "Dark Chocolates" },
            { label: "Chocolate Hampers" },
            { label: "Premium Chocolates", badge: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(`/products/${item.label.toLowerCase().replace(/\s+/g, "-")}`)}
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
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
              {item.label}
              {item.badge && (
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  background: "#e8003d", color: "#fff",
                  padding: "1px 5px", borderRadius: 10,
                }}>
                  New
                </span>
              )}
            </button>
          ))}
        </div>

        {chocolatesMenu.map((col, i) => (
          <MobileSection
            key={i}
            title={col.title}
            col={col}
            navigate={navigate}
          />
        ))}

      </div>

    </div>
  )
}