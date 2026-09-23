import { useState } from "react";
import mother from "../assets/mother1.png"
import father from "../assets/father2.png"
import sister from "../assets/sister1.png"
import brother from "../assets/brother1.png"
import girlf from "../assets/girlf.png"
import boyf from "../assets/boyf.png"
import wife from "../assets/wife1.png"
import husband from "../assets/husband.png"
import best from "../assets/best1.png"
const RELATIONS = [
  {
    id: "mother",
    label: "Mother",
    tagline: "Unconditional love",
    color: "#e05c97",
    ring: "ring-[#e05c97]",
    shadow: "hover:shadow-[0_12px_32px_#e05c9740]",
    textHover: "group-hover:text-[#e05c97]",
    tagHover: "group-hover:text-[#e05c97]/70",
    bgHover: "group-hover:bg-[#fdf0f8]",
    dotColor: "bg-[#e05c97]",
    href: "/gifts/mother-lp",
    img: mother,
  },
  {
    id: "father",
    label: "Father",
    tagline: "Strength & wisdom",
    color: "#2563eb",
    ring: "ring-[#2563eb]",
    shadow: "hover:shadow-[0_12px_32px_#2563eb40]",
    textHover: "group-hover:text-[#2563eb]",
    tagHover: "group-hover:text-[#2563eb]/70",
    bgHover: "group-hover:bg-[#eff6ff]",
    dotColor: "bg-[#2563eb]",
    href: "/gifts/father-lp",
    img: father,
  },
  {
    id: "sister",
    label: "Sister",
    tagline: "Forever bestie",
    color: "#ff4d6d",
    ring: "ring-[#ff4d6d]",
    shadow: "hover:shadow-[0_12px_32px_#ff4d6d40]",
    textHover: "group-hover:text-[#ff4d6d]",
    tagHover: "group-hover:text-[#ff4d6d]/70",
    bgHover: "group-hover:bg-[#fff0f3]",
    dotColor: "bg-[#ff4d6d]",
    href: "/gifts/sister-lp",
    img: sister,
  },
  {
    id: "brother",
    label: "Brother",
    tagline: "Ride or die",
    color: "#0891b2",
    ring: "ring-[#0891b2]",
    shadow: "hover:shadow-[0_12px_32px_#0891b240]",
    textHover: "group-hover:text-[#0891b2]",
    tagHover: "group-hover:text-[#0891b2]/70",
    bgHover: "group-hover:bg-[#ecfeff]",
    dotColor: "bg-[#0891b2]",
    href: "/gifts/brother-lp",
    img: brother,
  },
  {
    id: "girlfriend",
    label: "Girlfriend",
    tagline: "She deserves it all",
    color: "#f43f5e",
    ring: "ring-[#f43f5e]",
    shadow: "hover:shadow-[0_12px_32px_#f43f5e40]",
    textHover: "group-hover:text-[#f43f5e]",
    tagHover: "group-hover:text-[#f43f5e]/70",
    bgHover: "group-hover:bg-[#fff1f2]",
    dotColor: "bg-[#f43f5e]",
    href: "/gifts/girlfriend-lp",
    img: girlf,
  },
  {
    id: "boyfriend",
    label: "Boyfriend",
    tagline: "Make him smile",
    color: "#7c3aed",
    ring: "ring-[#7c3aed]",
    shadow: "hover:shadow-[0_12px_32px_#7c3aed40]",
    textHover: "group-hover:text-[#7c3aed]",
    tagHover: "group-hover:text-[#7c3aed]/70",
    bgHover: "group-hover:bg-[#f5f3ff]",
    dotColor: "bg-[#7c3aed]",
    href: "/gifts/boyfriend-lp",
    img: boyf,
  },
  {
    id: "wife",
    label: "Wife",
    tagline: "Love every day",
    color: "#db2777",
    ring: "ring-[#db2777]",
    shadow: "hover:shadow-[0_12px_32px_#db277740]",
    textHover: "group-hover:text-[#db2777]",
    tagHover: "group-hover:text-[#db2777]/70",
    bgHover: "group-hover:bg-[#fdf2f8]",
    dotColor: "bg-[#db2777]",
    href: "/gifts/wife-lp",
    img: wife,
  },
  {
    id: "husband",
    label: "Husband",
    tagline: "Always there",
    color: "#1d4ed8",
    ring: "ring-[#1d4ed8]",
    shadow: "hover:shadow-[0_12px_32px_#1d4ed840]",
    textHover: "group-hover:text-[#1d4ed8]",
    tagHover: "group-hover:text-[#1d4ed8]/70",
    bgHover: "group-hover:bg-[#eff6ff]",
    dotColor: "bg-[#1d4ed8]",
    href: "/gifts/husband-lp",
    img: husband,
  },
  {
    id: "friend",
    label: "Best Friend",
    tagline: "Because why not",
    color: "#059669",
    ring: "ring-[#059669]",
    shadow: "hover:shadow-[0_12px_32px_#05966940]",
    textHover: "group-hover:text-[#059669]",
    tagHover: "group-hover:text-[#059669]/70",
    bgHover: "group-hover:bg-[#ecfdf5]",
    dotColor: "bg-[#059669]",
    href: "/gifts/friend-lp",
    img: best,
  },
];

const RelationIcon = ({ id, color }) => {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    mother:    <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v3M10 13h4" stroke={color}/></svg>,
    father:    <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M8 21s1-3 4-3 4 3 4 3" stroke={color}/></svg>,
    sister:    <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M9 14l1.5 2 1.5-2 1.5 2 1.5-2" stroke={color}/></svg>,
    brother:   <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M9 17l3-2 3 2" stroke={color}/></svg>,
    girlfriend:<svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    boyfriend: <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 14l2 2-2 2" stroke={color}/></svg>,
    wife:      <svg {...props}><circle cx="12" cy="8" r="3"/><path d="M12 11v3M9 17a3 3 0 0 1 6 0"/><path d="M8 6.5A4 4 0 0 1 12 4a4 4 0 0 1 4 2.5"/><path d="M10 22h4"/></svg>,
    husband:   <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.5l2 2-2 2" stroke={color}/></svg>,
    friend:    <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  };
  return icons[id] || icons.friend;
};

export default function RelationsStrip() {
  const [active, setActive] = useState(null);

  return (
    <section className="w-full bg-[#fff8f9] py-10 sm:py-12 lg:py-14 overflow-hidden">

      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-[2.5px] bg-[#c4003a] rounded-full" />
          <p className="text-[10.5px] font-black tracking-[0.22em] uppercase text-[#c4003a]">
            shop by relation
          </p>
        </div>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 leading-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Gifts for Every{" "}
          <em className="not-italic italic text-[#c4003a]" style={{ fontFamily: "'Georgia', serif" }}>
            Bond
          </em>
        </h2>
        <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#c4a0a8] font-medium">
          Handpicked with love · Same-day delivery across India
        </p>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3 sm:gap-4 lg:gap-5">
          {RELATIONS.map((rel, i) => {
            const isActive = active === rel.id;
            return (
              <a
                key={rel.id}
                href={rel.href}
                className="group flex flex-col items-center gap-0 cursor-pointer no-underline outline-none"
                style={{ animation: `relPopIn 0.4s ease ${i * 50}ms both` }}
                onMouseEnter={() => setActive(rel.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div
                  className={[
                    "relative w-full aspect-square overflow-hidden rounded-2xl",
                    "transition-all duration-300 ease-out",
                    "ring-0 ring-offset-0",
                    isActive
                      ? `ring-2 ${rel.ring} -translate-y-1.5 scale-[1.04] ${rel.bgHover}`
                      : "bg-[#f5eff0] shadow-[0_3px_10px_rgba(0,0,0,0.07)]",
                    isActive ? rel.shadow : "",
                  ].join(" ")}
                >
                  <img
                    src={rel.img}
                    alt={rel.label}
                    loading="lazy"
                    className={[
                      "w-full h-full object-cover block",
                      "transition-transform duration-500",
                      isActive ? "scale-[1.08]" : "scale-100",
                    ].join(" ")}
                  />

                  <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${rel.color}25 0%, transparent 65%)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />

                  <div
                    className={[
                      "absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full",
                      "flex items-center justify-center",
                      "transition-all duration-250",
                      "shadow-[0_2px_8px_rgba(0,0,0,0.14)]",
                      isActive ? "scale-110 -rotate-6" : "scale-100 rotate-0",
                    ].join(" ")}
                    style={{
                      background: isActive ? rel.color : "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <RelationIcon id={rel.id} color={isActive ? "#fff" : rel.color} />
                  </div>
                </div>

                <p
                  className={[
                    "mt-2.5 text-center font-bold leading-tight transition-colors duration-200",
                    "text-[11px] sm:text-[12px] lg:text-[13px]",
                    "whitespace-nowrap",
                    isActive ? "" : "text-[#1a0808]",
                    rel.textHover,
                  ].join(" ")}
                  style={{ color: isActive ? rel.color : undefined }}
                >
                  {rel.label}
                </p>

                <p
                  className={[
                    "hidden sm:block mt-0.5 text-center font-medium leading-snug transition-colors duration-200",
                    "text-[9px] lg:text-[10px]",
                    "whitespace-nowrap",
                  ].join(" ")}
                  style={{ color: isActive ? `${rel.color}bb` : "#c4a0a8" }}
                >
                  {rel.tagline}
                </p>

                <div
                  className={[
                    "mt-1.5 rounded-full transition-all duration-300",
                    isActive ? `w-4 h-1.5 ${rel.dotColor}` : "w-1.5 h-1.5 bg-[#e8d8da]",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes relPopIn {
          from { opacity: 0; transform: translateY(14px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}