import Home from "../assets/home.png"
import dress from "../assets/dress.png"
import fragnance from "../assets/fragnance.png"
import weddingGift from "../assets/weddingGIft.png"
import sippers from "../assets/sippers.png"
import nature from "../assets/nature.png"
import summergift from "../assets/summergift.png"
import jewellery from "../assets/jewellery.png"
import cat from "../assets/cat.png"

const heroImage = {
  src: cat,
  href: "/summer-special-gifts-lp",
}

const columns = [
  [
    { label: "Home Decor",   img: Home,      href: "/summer-flowers-lp" },
    { label: "Fragrances",       img: fragnance,    href: "/perfumes-lp" },
  ],
  [
    { label: "Clothes collection", img: dress,       href: "/fresh-fruit-cakes-lp" },
    { label: "Wedding Gifts",    img: weddingGift,  href: "/gifts/wedding-lp" },
  ],
  [
    { label: "Sippers",          img: sippers,      href: "/personalised-water-bottles-lp" },
    { label: "Nature's Picks",   img: nature,       href: "/indoor-plants-lp" },
  ],
  [
    { label: "Summer Gift Sets", img: summergift,   href: "/summer-combos-lp" },
    { label: "Summer Jewellery", img: jewellery,    href: "/jewellery-lp" },
  ],
]

export default function FeaturedGiftCategories() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-10 xl:px-16 py-5 md:py-6 bg-[rgba(255,242,255,0.54)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-5 xl:gap-6">

        {/* ── Hero Image ── */}
        {/* Mobile: smaller centered | Desktop: ~30% wide */}
        <div className="w-[60%] sm:w-[32%] md:w-[30%] xl:w-[28%] flex-shrink-0">
          <a href={heroImage.href} className="block">
            <img
              src={heroImage.src}
              alt="Summer Special Gifts"
              className="w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </a>
        </div>

        {/* ── 4-column grid ── */}
        <div className="w-full sm:flex-1">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 xl:gap-5">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-2 sm:gap-3 md:gap-4 xl:gap-5">
                {col.map((item, ii) => (
                  <a
                    key={ii}
                    href={item.href}
                    className="block group"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex flex-col">

                      <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-square w-full">
                        <img
                          src={item.img}
                          alt={item.label}
                          loading="lazy"
                          className="w-full  object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-1 py-1.5">
                          <p className="text-white text-[7px] font-bold text-center capitalize leading-tight line-clamp-2">
                            {item.label}
                          </p>
                        </div>
                      </div>

                      <p className="hidden sm:block mt-1.5 text-center text-[10px] md:text-[11px] xl:text-[13px] font-medium text-red-500 capitalize leading-snug line-clamp-2">
                        {item.label}
                      </p>

                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}