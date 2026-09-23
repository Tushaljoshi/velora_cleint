import { useState, useEffect } from "react";

const SAVED_PRODUCTS = [];

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const ProductCard = ({ product, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "0.5px solid",
        borderColor: hovered ? "#e0c0c0" : "#f0e8e8",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 48px rgba(196,0,58,0.10)" : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: "#f9f0f0" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.38) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s",
          }}
        />

        <div className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "#c4003a" }}>
          -{discount}%
        </div>

        {product.badge && (
          <div
            className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: product.badgeBg, color: product.badgeText }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: product.badgeDot }} />
            {product.badge}
          </div>
        )}

        <div
          className="absolute bottom-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.52)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(5px)",
            transition: "all 0.3s",
          }}
        >
          ⚡ {product.tag}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(product.id); }}
          className="absolute top-2 right-2 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: 26,
            height: 26,
            background: "rgba(255,255,255,0.92)",
            border: "none",
            cursor: "pointer",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.85)",
            transition: "all 0.25s",
            display: product.badge ? "none" : "flex",
          }}
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#c4706a" }}>
          {product.category}
        </span>
        <p className="text-[12.5px] font-bold leading-snug line-clamp-2" style={{ color: "#1a0808" }}>
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5 mt-auto pt-1">
          <span className="text-[15px] font-black" style={{ color: "#1a0808" }}>₹{product.price}</span>
          <span className="text-[11px] line-through" style={{ color: "#bbb" }}>₹{product.originalPrice}</span>
        </div>
      </div>

      {product.badge && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(product.id); }}
          className="absolute bottom-3 right-3 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: 26,
            height: 26,
            background: hovered ? "#c4003a" : "rgba(255,255,255,0.92)",
            border: "0.5px solid #e0c0c0",
            cursor: "pointer",
            color: hovered ? "white" : "#888",
            // opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.85)",
            transition: "all 0.25s",
          }}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default function SavedProducts() {
  const [items, setItems] = useState(SAVED_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const categories = ["All", ...new Set(SAVED_PRODUCTS.map((p) => p.category))];

  const filtered = activeCategory === "All" ? items : items.filter((p) => p.category === activeCategory);

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    showToast("Removed from saved");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <section className="w-full py-8 px-4 md:px-8" style={{ background: "rgba(255,242,255,0.3)" }}>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-white text-[12px] font-semibold shadow-lg"
          style={{ background: "#8b2626", animation: "slideUp 0.3s ease", whiteSpace: "nowrap" }}
        >
          {toast}
        </div>
      )}

      <div
        className="mb-6"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(10px)",
          transition: "all 0.5s ease",
        }}
      >
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#c4706a" }}>
          Your Wishlist
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h2 className="text-[24px] font-black leading-tight" style={{ color: "#1a0808" }}>
            Saved <span style={{ color: "#c4003a" }}>Items</span>
          </h2>
          <span className="text-[11px] pb-0.5" style={{ color: "#999" }}>
            {items.length} saved
          </span>
        </div>
      </div>

      <div
        className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar"
        style={{ opacity: mounted ? 1 : 0, transition: "all 0.5s ease 0.1s" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 text-[10.5px] font-bold px-4 py-1.5 rounded-full border transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: activeCategory === cat ? "#c4003a" : "white",
              color: activeCategory === cat ? "white" : "#9a6060",
              borderColor: activeCategory === cat ? "#c4003a" : "#f0dbd9",
              boxShadow: activeCategory === cat ? "0 4px 12px rgba(196,0,58,0.28)" : "none",
            }}
          >
            {cat === "All" ? "✦ All" : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[14px] font-semibold" style={{ color: "#1a0808" }}>Nothing saved here yet</p>
          <p className="text-[11px] mt-1" style={{ color: "#aaa" }}>Try another category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(14px)",
                transition: `all 0.45s ease ${i * 55}ms`,
              }}
            >
              <ProductCard product={product} onRemove={handleRemove} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </section>
  );
}