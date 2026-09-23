import { useState } from "react"

const gifts = [
  {
    id: "bags",
    label: "bags",
    sub: "Chic & Stylish",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    href: "#",
  },
  {
    id: "Watches",
    label: "Watches",
    sub: "Classic & Refined",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    href: "#",
  },
  {
    id: "personalised",
    label: "Personalised",
    sub: "Made Just for Them",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/birthday/personalized.jpg",
    href: "#",
  },
  {
    id: "experiences",
    label: "Balloon & Guitarist",
    sub: "Unforgettable Moments",
    img: "https://static-assets-prod.fnp.com/assets/images/custom/new-home-2025/balloon-decor-guitar_lates.jpg",
    href: "#",
  }
]

export default function BirthdayGifts() {

  const [hovered, setHovered] = useState(null)

  return (
    <section className="w-full px-6 md:px-16 py-14 bg-[rgba(255,242,255,0.54)]" style={{ fontFamily: "'Georgia', serif" }}>

      <div className="flex items-end justify-between mb-10">

        <div className="">
          <div className="flex items-center gap-2 mb-2">

            <div className="w-7 h-0.5 bg-[#c4003a] rounded-full" />
            <p className="text-[10.5px] font-black tracking-[0.2em] uppercase text-[#c4003a]">
              Curated Collection
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 leading-tight flex gap-2">
            Birthday Gifts
            <span className="block text-[#e8003d] font-light italic">
              That Wow
            </span>
          </h2>
        </div>



      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {gifts.map((gift) => {

          const isHovered = hovered === gift.id

          return (
            <a
              key={gift.id}
              href={gift.href}
              onMouseEnter={() => setHovered(gift.id)}
              onMouseLeave={() => setHovered(null)}
              className="group block"
            >

              <div className="relative overflow-hidden rounded-xl">

                <img
                  src={gift.img}
                  alt={gift.label}
                  className={`w-full h-[260px] object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-1"
                    }`}
                />

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />

              </div>

              <div className="mt-3">

                <h3 className="text-[15px] font-semibold text-gray-900">
                  {gift.label}
                </h3>

                <p className="text-[12px] text-gray-500 mt-[2px]">
                  {gift.sub}
                </p>

              </div>

            </a>
          )
        })}

      </div>

    </section>
  )
}