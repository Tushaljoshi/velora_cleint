import { useState, useEffect, useRef } from "react";


const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Eternal Rose Bouquet",
    category: "Flowers",
    price: 849,
    originalPrice: 1199,
    badge: "Bestseller",
    rating: 4.8,
    reviews: 2341,
    image: "https://www.fnp.com/images/pr/m/v20250715223119/blooming-joy-rose-bouquet.jpg",
    tag: "Same Day",
    description: "A timeless bouquet of 20 premium Dutch roses.",
  },
  {
    id: 2,
    name: "Velvet Chocolate Cake",
    category: "Cakes",
    price: 649,
    originalPrice: 899,
    badge: "New",
    rating: 4.7,
    reviews: 1892,
    image: "https://cdn.jwplayer.com/v2/media/W4yH8741/thumbnails/8Mhboqg7.jpg?width=1280",
    tag: "Eggless",
    description: "Rich 5-star chocolate cake with ganache drizzle.",
  },
  {
    id: 3,
    name: "Orchid Elegance",
    category: "Flowers",
    price: 1299,
    originalPrice: 1799,
    badge: "Premium",
    rating: 4.9,
    reviews: 654,
    image: "https://m.media-amazon.com/images/I/81OXEQrFPTL._AC_UF1000,1000_QL80_.jpg",
    tag: "Gift Wrapped",
    description: "Exotic purple orchid plant in ceramic pot.",
  },
  {
    id: 4,
    name: "Anniversary Gift Box",
    category: "Gifts",
    price: 1599,
    originalPrice: 2199,
    badge: "Trending",
    rating: 4.6,
    reviews: 987,
    image: "https://royceindia.com/cdn/shop/files/RedRosetteBox-SignatureRedGiftCollection.webp?v=1712058240",
    tag: "Free Delivery",
    description: "Luxe hamper with chocolates, teddy & roses.",
  },
  {
    id: 5,
    name: "Sunflower Joy",
    category: "Flowers",
    price: 499,
    originalPrice: 699,
    badge: null,
    rating: 4.5,
    reviews: 3201,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcrOz0HcCTH_MvyvGvu0U2ndLMlVyJd-qTqQ&s",
    tag: "Same Day",
    description: "12 bright sunflowers to lighten any mood.",
  },
  {
    id: 6,
    name: "Butterscotch Dream",
    category: "Cakes",
    price: 549,
    originalPrice: 749,
    badge: "Bestseller",
    rating: 4.7,
    reviews: 2198,
    image: "https://bakebuddy.in/cdn/shop/files/Traditional_Butterscotch_Cake_e77ad1d9-833f-41d8-a33f-3848eafec479.jpg?v=1706457890",
    tag: "Eggless",
    description: "Creamy butterscotch cake with crunchy praline.",
  },
];

const CATEGORIES = ["All", "Flowers", "Cakes", "Gifts"];

const BADGE_COLORS = {
  Bestseller: { bg: "#fff3e0", text: "#e65100", dot: "#ff9800" },
  New: { bg: "#e8f5e9", text: "#2e7d32", dot: "#4caf50" },
  Premium: { bg: "#f3e5f5", text: "#6a1b9a", dot: "#9c27b0" },
  Trending: { bg: "#fce4ec", text: "#880e4f", dot: "#e91e63" },
};

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 24 24">
          {i < full ? (
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
          ) : i === full && half ? (
            <>
              <defs>
                <linearGradient id={`hg${i}`}><stop offset="50%" stopColor="#f59e0b" /><stop offset="50%" stopColor="#e5e7eb" /></linearGradient>
              </defs>
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={`url(#hg${i})`} stroke="#f59e0b" strokeWidth="1" />
            </>
          ) : (
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#e5e7eb" stroke="#e5e7eb" strokeWidth="1" />
          )}
        </svg>
      ))}
    </span>
  );
};

const ProductCard = ({ product, onWishlist, wishlisted }) => {
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const badge = BADGE_COLORS[product.badge];

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        boxShadow: hovered
          ? "0 20px 60px rgba(180,60,60,0.13), 0 4px 16px rgba(0,0,0,0.08)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        <div className="absolute top-2.5 left-2.5 bg-[#c4003a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </div>

        {badge && (
          <div
            className="absolute top-2.5 right-5 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: badge.bg, color: badge.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: badge.dot }} />
            {product.badge}
          </div>
        )}



        <div
          className="absolute bottom-2.5 left-2.5 text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.3s ease",
          }}
        >
          ⚡ {product.tag}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-3.5 flex-1">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#c4706a]">{product.category}</span>
        <h3 className="text-[13px] font-bold text-[#1a0808] leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-[11px] text-[#888] line-clamp-1">{product.description}</p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-[#aaa]">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[16px] font-black text-[#1a0808]">₹{product.price}</span>
            <span className="text-[11px] text-[#bbb] line-through">₹{product.originalPrice}</span>
          </div>

          <button
            className=" w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: wishlisted ? "#c4003a" : "rgba(255,255,255,0.9)",
              transform: wishlisted ? "scale(1.1)" : "scale(1)",
            }}
            onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={wishlisted ? "white" : "none"} stroke={wishlisted ? "none" : "#888"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ProductSystem() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState(new Set());
  const [adminOpen, setAdminOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = (product) => {
    if (editProduct) {
      setProducts(p => p.map(x => x.id === product.id ? product : x));
      showToast("Product updated successfully!");
    } else {
      setProducts(p => [...p, product]);
      showToast("Product published successfully!");
    }
    setAdminOpen(false);
    setEditProduct(null);
  };

  const handleDelete = (id) => {
    setProducts(p => p.filter(x => x.id !== id));
    showToast("Product removed", "error");
  };

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section className="w-full py-10 px-4 md:px-8" style={{ background: "rgba(255,242,255,0.3)" }}>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-[13px] font-semibold shadow-xl"
          style={{
            background: toast.type === "error" ? "#8b2626" : "#1a6b3a",
            animation: "slideUp 0.3s ease",
            minWidth: "220px",
          }}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            {toast.type === "error"
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <polyline points="20 6 9 17 4 12" />
            }
          </svg>
          {toast.msg}
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(12px)", transition: "all 0.5s ease" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2 ">
          <div className="w-7 h-0.5 bg-[#c4003a] rounded-full" />
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#c4706a] ">Curated Collection</p>
          </div>
          <h2 className="text-[26px] sm:text-[32px] font-black text-[#1a0808] leading-tight">
            Our <span style={{ color: "#c4003a" }}>Bestselling</span> Gifts
          </h2>
          <p className="text-[13px] text-[#888] mt-1">Handpicked with love · Delivered same day</p>
        </div>

        {/* Admin add button */}
        {/* <button
          onClick={() => { setEditProduct(null); setAdminOpen(true); }}
          className="self-start sm:self-auto flex items-center gap-2 text-[12px] font-bold text-white px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          style={{ background: "linear-gradient(135deg, #c4003a, #8b2626)", boxShadow: "0 6px 20px rgba(196,0,58,0.25)" }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Product
        </button> */}
      </div>

      <div
        className="flex gap-2 mb-7 overflow-x-auto pb-1 no-scrollbar"
        style={{ opacity: mounted ? 1 : 0, transition: "all 0.5s ease 0.1s" }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 text-[11px] font-bold px-4 py-2 rounded-full border transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: activeCategory === cat ? "#c4003a" : "white",
              color: activeCategory === cat ? "white" : "#9a6060",
              borderColor: activeCategory === cat ? "#c4003a" : "#f0dbd9",
              boxShadow: activeCategory === cat ? "0 4px 14px rgba(196,0,58,0.3)" : "none",
            }}
          >
            {cat === "All" ? "✦ All" : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#c4a0a0]">
          <p className="text-4xl mb-3">🌸</p>
          <p className="text-[15px] font-semibold">No products in this category yet</p>
          <p className="text-[12px] mt-1">Click "Add Product" to publish your first one</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="relative"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(20px)",
                transition: `all 0.5s ease ${i * 70}ms`,
              }}
            >
              <ProductCard product={product} onWishlist={toggleWishlist} wishlisted={wishlist.has(product.id)} />


            </div>
          ))}
        </div>
      )}

      {adminOpen && (
        <AdminPanel
          onClose={() => { setAdminOpen(false); setEditProduct(null); }}
          onSave={handleSave}
          editProduct={editProduct}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
      `}</style>
    </section>
  );
}