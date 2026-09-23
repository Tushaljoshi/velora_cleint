import { useState, useRef } from "react"

const TABS = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "love", label: "Love & Romance" },
  { id: "wedding", label: "Wedding" },
  { id: "congrats", label: "Congratulations" },
  { id: "thankyou", label: "Thank You" },
]

const BASE_PRODUCTS = [
  { id: 1, name: "Syngonium In Birthday Bottle Planter", mrp: 1199, price: 849, badge: "hot", rating: 4.8, reviews: 412, img: "https://m-i1.fnp.com/images/pr/l/v20230915191707/syngonium-plant-in-birthday-antiquity-bottle-planters_1.jpg" },
  { id: 2, name: "Sweet Birthday Wishes Personalised Mug", mrp: 499, price: 399, badge: "off", rating: 4.9, reviews: 280, img: "https://m-i1.fnp.com/images/pr/l/v20241015124859/sweet-birthday-wishes-personalised-mug_1.jpg" },
  { id: 3, name: "Rainbow Surprise Chocolate Cake 1.5Kg", mrp: 1849, price: 1599, badge: "", rating: 4.7, reviews: 195, img: "https://m-i1.fnp.com/images/pr/l/v20241023104452/rainbow-surprise-chocolate-cake-15kg_1.jpg" },
  { id: 4, name: "Chocolaty Orchid Affair", mrp: 1449, price: 899, badge: "off", rating: 4.9, reviews: 361, img: "https://m-i1.fnp.com/images/pr/l/v20250313104434/chocolaty-orchid-affair_1.jpg" },
  { id: 5, name: "Golden Glow Sansevieria Birthday Planter", mrp: 1499, price: 849, badge: "new", rating: 4.8, reviews: 143, img: "https://m-i1.fnp.com/images/pr/l/v20250326123132/golden-glow-sansevieria-birthday-planter_1.jpg" },
  { id: 6, name: "Angelic Rose Bouquet & Black Forest Bliss", mrp: 899, price: 749, badge: "hot", rating: 5.0, reviews: 373, img: "https://m-i1.fnp.com/images/pr/l/v20250915152354/angelic-rose-bouquet-n-black-forest-birthday-bliss_1.jpg" },
  { id: 7, name: "Personalised Delight Birthday Hamper", mrp: 1699, price: 1099, badge: "off", rating: 4.8, reviews: 229, img: "https://m-i1.fnp.com/images/pr/l/v20231118134508/personalised-delight-birthday-hamper_1.jpg" },
  { id: 8, name: "Happy Birthday Jade Plant Terrarium", mrp: 749, price: 449, badge: "new", rating: 4.9, reviews: 355, img: "https://m-i1.fnp.com/images/pr/l/v20250917172605/happy-birthday-jade-plant-terrarium_1.jpg" },
  { id: 9, name: "Joyful Personalised Rose Bouquet", mrp: 1699, price: 1049, badge: "hot", rating: 4.9, reviews: 709, img: "https://m-i1.fnp.com/images/pr/l/v20241113121036/joyful-personalised-rose-bouquet_1.jpg" },
  { id: 10, name: "Aura Orchid Birthday Charm", mrp: 1539, price: 1419, badge: "", rating: 4.7, reviews: 88, img: "https://m-i1.fnp.com/images/pr/l/v20241025152943/aura-orchid-birthday-charm_1.jpg" },
  { id: 11, name: "Birthday Celebration Mugs", mrp: 449, price: 279, badge: "off", rating: 4.8, reviews: 312, img: "https://m-i1.fnp.com/images/pr/l/v20241025173402/birthday-celebration-mugs_1.jpg" },
  { id: 12, name: "Personalised Keepsake Photo Frame", mrp: 799, price: 599, badge: "new", rating: 4.9, reviews: 117, img: "https://m-i1.fnp.com/images/pr/l/v20241113182259/personalised-keepsake-photo-frame_1.jpg" },
]

const products = TABS.reduce((acc, tab) => {
  acc[tab.id] = [...BASE_PRODUCTS].sort(() => Math.random() - 0.5)
  return acc
}, {})

function StarRating({ rating }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating)
        const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.5
        return (
          <svg key={i} viewBox="0 0 12 12" className="w-[10px] h-[10px]">
            {filled && <path d="M6 1l1.5 3.1 3.4.5-2.5 2.4.6 3.4L6 8.8l-3 1.6.6-3.4L1.1 4.6l3.4-.5z" fill="#f5a623" />}
            {half && <>
              <path d="M6 1l1.5 3.1 3.4.5-2.5 2.4.6 3.4L6 8.8V1z" fill="#f5a623" />
              <path d="M6 1v7.8l-3 1.6.6-3.4L1.1 4.6l3.4-.5z" fill="#e0e0e0" />
            </>}
            {!filled && !half && <path d="M6 1l1.5 3.1 3.4.5-2.5 2.4.6 3.4L6 8.8l-3 1.6.6-3.4L1.1 4.6l3.4-.5z" fill="#e0e0e0" />}
          </svg>
        )
      })}
    </div>
  )
}

function Badge({ type, discount }) {
  const base = "absolute top-2.5 left-2.5 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full leading-none"
  if (type === "off") return <span className={`${base} bg-[#c4003a]`}>{discount}% off</span>
  if (type === "hot") return <span className={`${base} bg-[#e05200]`}>Bestseller</span>
  if (type === "new") return <span className={`${base} bg-[#0a7a50]`}>New</span>
  return null
}

function GiftCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <a
      href={`/gift/${product.id}`}
      className="flex-none w-[calc(25%-14px)] min-w-[185px] block"
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden transition-all duration-300 h-full"
        style={{
          border: hovered ? "1.5px solid #c4003a" : "1.5px solid #f2f2f2",
          // transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? "0 16px 40px rgba(196,0,58,0.12)" : "none",
        }}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-[#f8f2f4]">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />

          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 45%)",
              opacity: hovered ? 1 : 0,
            }}
          />

          <Badge type={product.badge} discount={discount} />

          <button
            className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: wishlisted ? "#c4003a" : "rgba(255,255,255,0.92)",
              opacity: hovered || wishlisted ? 1 : 0,
              border: "none",
              cursor: "pointer",
            }}
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted) }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={wishlisted ? "#fff" : "none"} stroke={wishlisted ? "#fff" : "#c4003a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>

          <div
            className="absolute bottom-2.5 left-1/2 bg-white text-[#c4003a] text-[9.5px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 pointer-events-none"
            style={{
              transform: `translateX(-50%) translateY(${hovered ? "0" : "6px"})`,
              opacity: hovered ? 1 : 0,
              border: "1px solid #f0c0cc",
            }}
          >
            Quick View
          </div>
        </div>

        <div className="p-3.5 pb-4">
          <p className="text-[12.5px] text-[#1c1c1c] font-bold leading-snug mb-2.5 line-clamp-2 min-h-[36px]">
            {product.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className="text-[16px] font-black text-[#c4003a] tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-[#c8c8c8] line-through font-medium">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-[9.5px] font-black text-[#0a7a50] bg-[#e5f4ee] px-2 py-0.5 rounded-full tracking-wide">
                Save {discount}%
              </span>
            )}
          </div>
          <div className="h-px bg-[#f5f5f5] mb-2.5" />
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-[11px] font-black text-[#c4003a]">{product.rating}</span>
            <span className="text-[11px] text-[#bbb] font-medium">({product.reviews})</span>
          </div>
        </div>
      </div>
    </a>
  )
}

function ArrowBtn({ dir, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="absolute top-[42%] -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-[22px] leading-none transition-all duration-200"
      style={{
        [dir === "left" ? "left" : "right"]: "-18px",
        background: hov ? "#c4003a" : "#fff",
        color: hov ? "#fff" : "#555",
        border: "1.5px solid #e8e8e8",
        boxShadow: hov ? "0 6px 20px rgba(196,0,58,0.3)" : "0 4px 16px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  )
}

export default function TailoredOccasions() {
  const [activeTab, setActiveTab] = useState("birthday")
  const [activeDot, setActiveDot] = useState(0)
  const trackRef = useRef(null)

  const list = products[activeTab]
  const totalPages = Math.ceil(list.length / 4)
  const activeLabel = TABS.find(t => t.id === activeTab)?.label

  const scroll = (dir) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: dir * trackRef.current.offsetWidth, behavior: "smooth" })
  }

  const onScroll = () => {
    if (!trackRef.current) return
    const cw = (trackRef.current.querySelector("a")?.offsetWidth || 1) + 18
    const pg = Math.min(Math.round(trackRef.current.scrollLeft / (cw * 4)), totalPages - 1)
    setActiveDot(pg)
  }

  const scrollToPage = (page) => {
    if (!trackRef.current) return
    const cw = (trackRef.current.querySelector("a")?.offsetWidth || 1) + 18
    trackRef.current.scrollTo({ left: page * cw * 4, behavior: "smooth" })
    setActiveDot(page)
  }

  return (
    <div className="w-full bg-[rgba(255,242,255,0.54)] px-6 md:px-12 py-10">

      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-0.5 bg-[#c4003a] rounded-full" />
            <span className="text-[10.5px] font-black tracking-[0.2em] uppercase text-[#c4003a]">
              handpicked for every moment
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 leading-tight flex gap-2">
            Tailored For Your{" "}
            <em className="not-italic" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#c4003a" }}>
              Occasions
            </em>
          </h2>
        </div>
        {/* <a
          href={`/gifts/${activeTab}-lp`}
          className="hidden md:flex items-center gap-1.5 text-[11.5px] font-black tracking-widest uppercase text-[#c4003a] px-5 py-2.5 rounded-lg border border-[#f0c0cc] bg-[#fff8f9] transition-all duration-200 hover:bg-[#c4003a] hover:text-white hover:border-[#c4003a]"
          style={{ textDecoration: "none" }}
        >
          View All {activeLabel}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a> */}
      </div>

      <div className="overflow-x-auto mb-6" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-2 min-w-max">
          {TABS.map((tab, index) => {
            const on = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setActiveDot(0)
                }}
                className="flex-none px-5 py-2 text-[12px] font-black tracking-wide transition-all duration-200 whitespace-nowrap relative"
                style={{
                  background: on ? "#c4003a" : "#fff",
                  color: on ? "#fff" : "#999",
                  border: on ? "1.5px solid #c4003a" : "1.5px solid #ebebeb",
                  boxShadow: on ? "0 6px 20px rgba(196,0,58,0.28)" : "none",
                  cursor: "pointer",
                  outline: "none",

                  clipPath:
                    "polygon(0% 0%, 100% 0%, calc(100% - 14px) 50%, 100% 100%, 0% 100%, 14px 50%)",

                  marginLeft: index === 0 ? "0" : "-12px",

                  zIndex: TABS.length - index,
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative mx-1">
        <ArrowBtn dir="left" onClick={() => scroll(-1)} />

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-[18px] overflow-x-auto pb-3"
          style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
        >
          {list.map((product) => (
            <GiftCard key={product.id} product={product} />
          ))}
        </div>

        <ArrowBtn dir="right" onClick={() => scroll(1)} />
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-4 mb-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className="h-[7px] rounded-full transition-all duration-250"
            style={{
              width: i === activeDot ? "28px" : "7px",
              background: i === activeDot ? "#c4003a" : "#e8e8e8",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      

    </div>
  )
}