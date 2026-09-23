import { useState } from "react"
import BirthdayMegaMenu from "../NavHover/BirthdayMegaMenu"
import OccasionsMegaMenu from "../NavHover/OccasionsMegaMenu"
import AnniversaryMegaMenu from "../NavHover/AnniversaryMegaMenu"
import FlowersMegaMenu from "../NavHover/FlowersMegaMenu"
import CakesMegaMenu from "../NavHover/CakesMegaMenu"
import PersonalisedMegaMenu from "../NavHover/PersonalisedMegaMenu"
import PlantsMegaMenu from "../NavHover/PlantsMegaMenu"
import ChocolatesMegaMenu from "../NavHover/ChocolatesMegaMenu"
import HampersMegaMenu from "../NavHover/HampersMegaMenu"
import LifestyleMegaMenu from "../NavHover/LifestyleMegaMenu"

const occasions = [
  { label: "Birthday" },
  { label: "Anniversary" },
  { label: "Wedding Specials" },
  { label: "Festive Vibes" },
  { label: "Moments of Joy" },
  { label: "Celebrations n Sentiments" },
]

const categories = [
  { label: "Birthday" },
  { label: "Occasions" },
  { label: "Anniversary" },
  { label: "Flowers" },
  { label: "Personalised" },
  { label: "Chocolates" },
  { label: "Hampers" },
  { label: "Lifestyle" },
]

const megaMenuMap = {
  Birthday: BirthdayMegaMenu,
  Occasions: OccasionsMegaMenu,
  Anniversary: AnniversaryMegaMenu,
  Flowers: FlowersMegaMenu,
  Cakes: CakesMegaMenu,
  Personalised: PersonalisedMegaMenu,
  Plants: PlantsMegaMenu,
  Chocolates: ChocolatesMegaMenu,
  Hampers: HampersMegaMenu,
  Lifestyle: LifestyleMegaMenu,
}

const ChevronDown = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.25s ease",
      flexShrink: 0,
    }}
  >
    <path
      d="M3 6l5 4 5-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export function MobileAccordion() {
  const [activeTab, setActiveTab] = useState("occasions")
  const [openItem, setOpenItem] = useState(null)

  const toggle = (label) => {
    setOpenItem((prev) => (prev === label ? null : label))
  }

  const accordionItems =
    activeTab === "occasions"
      ? occasions
      : categories.map((c) => ({ label: c.label }))

  return (
    <div style={{ background: "#fff" }}>
      <div
        style={{
          padding: "16px 16px 0",
          fontWeight: 700,
          fontSize: 18,
          color: "#1a1a1a",
        }}
      >
        All Gifts
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e8ddd0",
          margin: "12px 16px 0",
        }}
      >
        {[
          { id: "occasions", label: "Shop By Occasions" },
          { id: "category", label: "Shop By Category" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setOpenItem(null)
            }}
            style={{
              flex: 1,
              padding: "10px 4px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#5a6e28" : "#9b9b9b",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid #5a6e28"
                  : "2px solid transparent",
              transition: "all 0.2s ease",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "8px 0 16px" }}>
        {accordionItems.map(({ label }) => {
          const isOpen = openItem === label
          const MegaMenu = megaMenuMap[label]

          return (
            <div key={label}>
              <button
                onClick={() => toggle(label)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  border: "none",
                  borderTop: "1px solid #f0ece5",
                  background: isOpen ? "#faf7f2" : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: "#2a2a2a",
                    fontWeight: isOpen ? 500 : 400,
                  }}
                >
                  {label}
                </span>

                <span style={{ color: isOpen ? "#5a6e28" : "#888" }}>
                  <ChevronDown open={isOpen} />
                </span>
              </button>

              {/* SAFE expandable section */}
              <div
                style={{
                  maxHeight: isOpen ? "60vh" : "0px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  borderTop: isOpen ? "1px solid #f0ece5" : "none",
                  background: "#faf7f2",
                }}
              >
                {isOpen &&
                  (MegaMenu ? (
                    <div style={{ overflowY: "auto" }}>
                      <MegaMenu />
                    </div>
                  ) : (
                    <div style={{ padding: 16, fontSize: 13, color: "#888" }}>
                      Products coming soon…
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DesktopNav() {
  const [active, setActive] = useState("Birthday")
  const [hovered, setHovered] = useState(null)

  const MegaMenu = megaMenuMap[hovered]

  return (
    <div
      className="w-full bg-gradient-to-b from-white to-[#faf7f2] border-b border-[#e8ddd0]"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex items-center overflow-x-auto scrollbar-hide px-2 md:px-5">
        {categories.map(({ label }) => {
          const isActive = active === label
          const isHovered = hovered === label

          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              onMouseEnter={() => setHovered(label)}
              className={`
                relative flex items-center gap-2
                shrink-0 whitespace-nowrap
                px-3 md:px-4
                h-[42px] md:h-[48px]
                text-[11px] md:text-[14px]
                tracking-[0.05em]
                uppercase font-medium
                transition-all duration-200
                ${isActive ? "text-[#7a2e2e]" : isHovered ? "text-[#8B3A3A]" : "text-[#6b5244]"}
              `}
            >
              {label}

              <span className={`${isActive || isHovered ? "opacity-60" : "opacity-30"}`}>
                <ChevronDown open={false} />
              </span>

              <span
                className={`
                  absolute bottom-0 left-0 right-0 h-[2px]
                  transition-all duration-200
                  ${isHovered ? "bg-[#c87070] opacity-40" : "opacity-0"}
                `}
              />
            </button>
          )
        })}
      </div>

      <div>{MegaMenu && <MegaMenu />}</div>
    </div>
  )
}

export default function CategoryNav() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopNav />
      </div>
    </>
  )
}