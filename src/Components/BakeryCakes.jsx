import { useState, useRef, useEffect } from "react";

const cakes = [
  {
    id: "chocolate",
    label: "Chocolate",
    tag: "Bestseller",
    tagColor: "bg-amber-100 text-amber-800",
    href: "/chocolate-cakes-lp",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/cakes/chocolate-13-02-2026.png",
    badge: "🍫",
    filter: "bestsellers",
  },
  {
    id: "butterscotch",
    label: "Butterscotch",
    tag: null,
    href: "/butterscotch-cakes-lp",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/cakes/butterscotch-13-02-2026.png",
    badge: "🧈",
    filter: "bestsellers",
  },
  {
    id: "luxe",
    label: "Luxe",
    tag: "Premium",
    tagColor: "bg-rose-100 text-rose-800",
    href: "/fnpluxe-cakes-lp",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/cakes/luxe-13-02-2026.png",
    badge: "✨",
    filter: "premium",
  },
  {
    id: "fresh-fruits",
    label: "Fresh Fruits",
    tag: "Seasonal",
    tagColor: "bg-green-100 text-green-800",
    href: "/fresh-fruit-cakes-lp",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/cakes/fresh-fruits-13-02-2026.png",
    badge: "🍓",
    filter: "seasonal",
  },
  {
    id: "cakes-with-flowers",
    label: "Cakes with Flowers",
    tag: "With Flowers",
    tagColor: "bg-pink-100 text-pink-800",
    href: "/flowers-n-cakes-lp",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/cakes/cakes-with-flowers-13-02-2026.png",
    badge: "🌸",
    filter: "with-flowers",
  },
];

const filters = [
  { id: "all", label: "All" },
  { id: "bestsellers", label: "Bestsellers" },
  { id: "with-flowers", label: "With Flowers" },
  { id: "premium", label: "Premium" },
  { id: "seasonal", label: "Seasonal" },
];

function CakeCard({ cake, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <a
      href={cake.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col gap-3 cursor-pointer no-underline"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.45s ease ${index * 80}ms, transform 0.45s ease ${index * 80}ms`,
      }}
    >
      {/* Image container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100">
        {/* Overlay on hover */}
        <div
          className="absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 55%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Tag badge */}
        {cake.tag && (
          <div
            className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide transition-all duration-300 ${cake.tagColor} ${
              hovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"
            }`}
          >
            {cake.tag}
          </div>
        )}

        {/* Quick view button on hover */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap px-4 py-1.5 rounded-full bg-white text-stone-800 text-[11px] font-semibold tracking-wide shadow-lg transition-all duration-300 ${
            hovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          Order Now →
        </div>

        {/* Image */}
        <img
          src={cake.img}
          alt={cake.label}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        />
      </div>

      {/* Label */}
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-sm font-medium text-stone-800 tracking-tight leading-tight text-center">
          {cake.label}
        </span>
      </div>
    </a>
  );
}

export default function BakeryCakes() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? cakes
      : cakes.filter((c) => c.filter === activeFilter);

  return (
    <div className="w-full  mx-auto px-4 py-10 font-sans">
      {/* Header row */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-1">
            Freshly baked daily
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight tracking-tight">
            Bakery-Fresh Cakes
          </h2>
        </div>
        <a
          href="/cakes"
          className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors duration-200 no-underline"
        >
          View all
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 whitespace-nowrap ${
              activeFilter === f.id
                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid gap-4 md:gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        }}
      >
        {filtered.map((cake, i) => (
          <CakeCard key={cake.id} cake={cake} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">
          No cakes in this category yet.
        </div>
      )}

      <div className="mt-8 flex md:hidden justify-center">
        <a
          href="/cakes"
          className="px-6 py-2.5 rounded-full border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-200 no-underline"
        >
          View all cakes
        </a>
      </div>
    </div>
  );
}