import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    alt: "Birthday",
    href: "/gifts/birthday-lp?promo=desk_top_banner_pos_1a",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Birthday_Desk-V4-latest.jpg",
  },
  {
    alt: "Cakes",
    href: "/cakes-lp?promo=desk_top_banner_pos_1d",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Cakes_Desk_V2.jpg",
  },
  {
    alt: "Wedding",
    href: "/gifts/wedding-lp?promo=desk_top_banner_pos_1b",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Wedding_Desk_02.jpg",
  },
  {
    alt: "Best Wishes",
    href: "/gifts/best-wishes-lp?promo=desk_top_banner_pos_1c",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Best_Wishes_Banner_Desk.jpg",
  },
  {
    alt: "Hatke Gifts",
    href: "/all-hatke-gifts-lp?promo=desk_top_banner_pos_1i",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Hatke_Banner_Desk-01-12-2025.jpg",
  },
  {
    alt: "Retirement",
    href: "/gifts/retirement-lp?promo=desk_top_banner_pos_1f",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Retirement_Gifts_Desk_latest11.jpg",
  },
  {
    alt: "Balloon Decor",
    href: "/balloon-decorations-lp?promo=desk_top_banner_pos_1",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Balloon_Decor_Desk-16-01-2026.jpg",
  },
  {
    alt: "Ramadan",
    href: "/gifts/eid-lp?promo=desk_top_banner_pos_1e",
    src: "https://static-assets-prod.fnp.com/assets/images/custom/desk-home-banners/Ramadan_Desk_v3.jpg",
  },
];

const AUTO_PLAY_MS = 4000;

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);
  const total = slides.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const VISIBLE = isMobile ? 1 : 2;

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((index + total) % total);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, total]);

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goTo(current + 1), AUTO_PLAY_MS);
  }, [current, goTo]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const visibleSlides = Array.from({ length: VISIBLE }, (_, i) => slides[(current + i) % total]);

  return (
    <div
      id="heroBanner"
      className="relative w-full mt-6 select-none px-2 sm:px-10 py-2"
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={startTimer}
    >
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10
          flex items-center justify-center
          w-7 h-7 sm:w-9 sm:h-9
          rounded-full bg-white/90 shadow-md
          hover:shadow-lg hover:bg-white
          transition-all duration-200"
      >
        <ArrowLeft />
      </button>

      <div
        className="flex gap-2 sm:gap-3"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateX(-6px)" : "translateX(0px)",
          transition: "opacity 0.55s linear, transform 0.55s linear",
        }}
      >
        {visibleSlides.map((slide, i) => (
          <a
            key={`${slide.alt}-${current}-${i}`}
            href={slide.href}
            className="flex-1 overflow-hidden rounded-xl sm:rounded-2xl block"
          >
            <img
              alt={slide.alt}
              src={slide.src}
              width={1616}
              height={876}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover block rounded-xl sm:rounded-2xl"
            />
          </a>
        ))}
      </div>

      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10
          flex items-center justify-center
          w-7 h-7 sm:w-9 sm:h-9
          rounded-full bg-white/90 shadow-md
          hover:shadow-lg hover:bg-white
          transition-all duration-200"
      >
        <ArrowRight />
      </button>

      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              borderRadius: "999px",
              background: i === current ? "#c4003a" : "#ddd",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.35s ease, background 0.35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}