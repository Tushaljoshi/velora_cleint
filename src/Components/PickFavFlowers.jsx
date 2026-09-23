import { useState, useRef, useEffect, useCallback } from "react";

const BASE_GIFTS= [
  {
    id: "jewellery",
    label: "Jewellery",
    color: "#c9a227",
    bg: "#fdf8ee",
    desc: "Elegant & Timeless",
    mood: "For someone precious",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    href: "/products/jewellery",
  },
  {
    id: "makeup",
    label: "Makeup Kit",
    color: "#e05c97",
    bg: "#fdf0f8",
    desc: "Glam & Gorgeous",
    mood: "For the beauty lover",
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80",
    href: "/products/makeup-kit",
  },
  {
    id: "home",
    label: "Home Decor",
    color: "#c4706a",
    bg: "#fff5f4",
    desc: "Warm & Cosy",
    mood: "For a beautiful home",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    href: "/products/home-decor",
  },
  {
    id: "mobile-covers",
    label: "Phone Cases",
    color: "#5b8dee",
    bg: "#f0f4ff",
    desc: "Trendy & Protective",
    mood: "For the tech lover",
    img: "https://images.unsplash.com/photo-1692780256774-198bc0a3bbf0?q=80&w=1142&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/products/mobile-covers",
  },
  {
    id: "pots",
    label: "Pots & Plants",
    color: "#2d9e6b",
    bg: "#eafaf3",
    desc: "Fresh & Calming",
    mood: "For the nature lover",
    img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    href: "/products/pots",
  },
  {
    id: "perfumes",
    label: "Perfumes",
    color: "#9b5de5",
    bg: "#f5f0ff",
    desc: "Luxe & Captivating",
    mood: "For a lasting impression",
    img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/products/perfumes",
  },
  {
    id: "watches",
    label: "Watches",
    color: "#b5943a",
    bg: "#fdf8ee",
    desc: "Classic & Refined",
    mood: "For the style icon",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    href: "/products/watches",
  },
  {
    id: "skincare",
    label: "Skincare",
    color: "#e8874a",
    bg: "#fff6f0",
    desc: "Pure & Nourishing",
    mood: "For a glowing skin",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    href: "/products/skincare",
  },
  {
    id: "bags",
    label: "Handbags",
    color: "#a0522d",
    bg: "#fdf4ee",
    desc: "Chic & Stylish",
    mood: "For the fashionista",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    href: "/products/bags",
  },
]


const GIFTS = [...BASE_GIFTS, ...BASE_GIFTS, ...BASE_GIFTS];
const N = BASE_GIFTS.length;
const CARD_W = 148;
const CARD_GAP = 10;
const STEP = CARD_W + CARD_GAP;
const AUTO_INTERVAL = 3500;

export default function PickFavGIFTS() {
  const [activeId, setActiveId] = useState(BASE_GIFTS[0].id);
  const stripRef = useRef(null);
  const autoTimer = useRef(null);
  const userInteracting = useRef(false);
  const resumeTimeout = useRef(null);
  const ticking = useRef(false);
  const isJumping = useRef(false);

  const af = BASE_GIFTS.find((f) => f.id === activeId) || BASE_GIFTS[0];
useEffect(() => {
  const el = stripRef.current;
  if (!el) return;
  el.scrollLeft = N * STEP;
}, []);

  const syncActive = useCallback((el) => {
    const center = el.scrollLeft + el.offsetWidth / 2;
    let closest = null;
    let minDist = Infinity;
    Array.from(el.children).forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = GIFTS[i];
      }
    });
    if (closest) setActiveId(closest.id);
  }, []);

  const handleScroll = useCallback(() => {
    if (ticking.current || isJumping.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const el = stripRef.current;
      if (!el) return;
      const sl = el.scrollLeft;
      if (sl < N * STEP - STEP * 2) {
        isJumping.current = true;
        el.scrollLeft = sl + N * STEP;
        setTimeout(() => { isJumping.current = false; }, 50);
        return;
      }
      if (sl > N * STEP * 2 + STEP * 2) {
        isJumping.current = true;
        el.scrollLeft = sl - N * STEP;
        setTimeout(() => { isJumping.current = false; }, 50);
        return;
      }
      syncActive(el);
    });
  }, [syncActive]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const startAuto = useCallback(() => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      if (userInteracting.current) return;
      const el = stripRef.current;
      if (!el) return;
      const target = el.scrollLeft + STEP;
      el.scrollTo({ left: target, behavior: "smooth" });
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    startAuto();
    return () => {
      clearInterval(autoTimer.current);
      clearTimeout(resumeTimeout.current);
    };
  }, [startAuto]);

  const onInteractStart = () => {
    userInteracting.current = true;
    clearTimeout(resumeTimeout.current);
  };

  const onInteractEnd = () => {
    clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      userInteracting.current = false;
    }, 2000);
  };

  const scrollToIndex = (globalIndex) => {
    const el = stripRef.current;
    if (!el) return;
    const card = el.children[globalIndex];
    if (!card) return;
    const target = card.offsetLeft - (el.offsetWidth - CARD_W) / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
    setActiveId(GIFTS[globalIndex].id);
    onInteractStart();
    onInteractEnd();
  };

  const scrollToDot = (flowerId) => {
    const el = stripRef.current;
    if (!el) return;
    const idx = N + BASE_GIFTS.findIndex((b) => b.id === flowerId);
    scrollToIndex(idx);
  };

  return (
    <div
      className="w-full overflow-hidden"
      style={{ background: af.bg, transition: "background 0.6s ease" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');

        .pff-strip {
          display: flex;
          gap: ${CARD_GAP}px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 12px 0 16px;
        }
        .pff-strip::-webkit-scrollbar { display: none; }

        .pff-card {
          scroll-snap-align: center;
          flex-shrink: 0;
          width: ${CARD_W}px;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 2.5px solid transparent;
          transition: transform 0.35s cubic-bezier(0.34,1.4,0.64,1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
        }
        .pff-card:hover { transform: translateY(-4px); }
        .pff-card.active { transform: translateY(-6px) scale(1.03); }

        .shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: white;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .shop-btn:hover { opacity: 0.88; transform: scale(1.03); }

        @keyframes heroIn {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        .hero-in { animation: heroIn 0.4s ease forwards; }

        @keyframes textIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .text-in { animation: textIn 0.32s ease 0.08s both; }
      `}</style>

      <div className="px-4 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">

        <div className="mb-7 sm:mb-9">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-[#c4003a]" />
            <p
              className="text-[10px] font-black tracking-[0.22em] uppercase"
              style={{ color: "#c4003a" }}
            >
              curated collection
            </p>
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Pick Their Fav{" "}
            <em
              style={{
                color: af.color,
                fontStyle: "italic",
                transition: "color 0.5s ease",
              }}
            >
              {af.label}
            </em>
          </h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 xl:gap-10 items-stretch">

          <div
            className="xl:w-72 2xl:w-80 flex-shrink-0 rounded-3xl overflow-hidden relative"
            style={{
              minHeight: 320,
              boxShadow: `0 20px 56px ${af.color}28`,
              transition: "box-shadow 0.5s ease",
            }}
          >
            <img
              key={af.id}
              src={af.img}
              alt={af.label}
              className="hero-in w-full h-full object-cover absolute inset-0"
              style={{ minHeight: 320 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${af.color}e8 0%, ${af.color}30 45%, transparent 72%)`,
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p
                key={af.id + "-mood"}
                className="text-in text-white/65 text-[10px] tracking-[0.18em] uppercase mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {af.mood}
              </p>
              <p
                className="text-white font-semibold leading-snug mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(20px, 3vw, 28px)",
                }}
              >
                {af.label}
                <br />
                <span
                  className="font-normal italic text-white/75"
                  style={{ fontSize: "0.7em" }}
                >
                  {af.desc}
                </span>
              </p>
              <a href={af.href} className="shop-btn" style={{ background: af.color }}>
                Shop now
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-evenly gap-4">

            <div className="overflow-hidden">
              <div
                ref={stripRef}
                className="pff-strip"
                onMouseDown={onInteractStart}
                onTouchStart={onInteractStart}
                onMouseUp={onInteractEnd}
                onTouchEnd={onInteractEnd}
              >
                {GIFTS.map((flower, i) => {
                  const isActive = activeId === flower.id;
                  return (
                    <button
                      key={`${flower.id}-${i}`}
                      onClick={() => scrollToIndex(i)}
                      className={`pff-card ${isActive ? "active" : ""}`}
                      style={{
                        borderColor: isActive ? flower.color : "transparent",
                        boxShadow: isActive
                          ? `0 8px 24px ${flower.color}38`
                          : "0 2px 8px rgba(0,0,0,0.07)",
                      }}
                    >
                      <div className="relative" style={{ aspectRatio: "2/3" }}>
                        <img
                          src={flower.img}
                          alt={flower.label}
                          className="w-full h-full  object-cover"
                        />
                        <div
                          className="absolute inset-0 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(to top, ${flower.color}c0 0%, transparent 52%)`,
                            opacity: isActive ? 1 : 0.55,
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p
                            className="text-white font-bold leading-tight"
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "clamp(13px, 1.5vw, 15px)",
                            }}
                          >
                            {flower.label}
                          </p>
                          <p
                            className="text-white/70 leading-snug"
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 9,
                              fontWeight: 500,
                            }}
                          >
                            {flower.desc}
                          </p>
                        </div>
                        {isActive && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: flower.color }}
                          >
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-3">
            

              <div className="flex gap-1.5 items-center">
                {BASE_GIFTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => scrollToDot(f.id)}
                    style={{
                      width: activeId === f.id ? 20 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: activeId === f.id ? f.color : "#d1d5db",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.35s ease",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}