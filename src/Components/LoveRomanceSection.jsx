import { useState } from "react"
import hero from "../assets/herobg.png"
import wed from "../assets/bg4.png"
import wedding from "../assets/wedding1.png"
import anniversary from "../assets/anniversary.png"
import sorry from "../assets/sorry.png"
import gift from "../assets/herbirth.png"
import girlfriend from "../assets/girlf.png"
import boyfriend from "../assets/propose.png"
import couple from "../assets/couple.png"
import miss from "../assets/miss.png"

const columns = [
  [
    { label: "Wedding", defaultImg: wed, hoverImg: wedding, href: "#" },
    { label: "Her/His Birthday", defaultImg: wed, hoverImg: gift, href: "#" },
  ],
  [
    { label: "Anniversary", defaultImg: wed, hoverImg: anniversary, href: "#" },
    { label: "For Girlfriend", defaultImg: wed, hoverImg: girlfriend, href: "#" },
  ],
  [
    { label: "Propose", defaultImg: wed, hoverImg: boyfriend, href: "#" },
    { label: "For Boyfriend", defaultImg: wed, hoverImg: couple, href: "#" },
  ],
  [
    { label: "I am Sorry", defaultImg: wed, hoverImg: sorry, href: "#" },
    { label: "Miss You", defaultImg: wed, hoverImg: miss, href: "#" },
  ],
]

export default function LoveRomanceSection() {
  const [hovered, setHovered] = useState(null)

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 bg-[rgba(255,242,255,0.54)]">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10">

       
        <div className="w-[55%] sm:w-[45%] md:w-[38%] lg:w-[35%] py-0 lg:py-5 flex-shrink-0">
          <a href="#" className="block rounded-3xl overflow-hidden transition">
            <img
              src="https://static.vecteezy.com/system/resources/previews/024/098/009/non_2x/lovers-couple-in-heart-free-png.png"
              alt="Love & Romance"
              className="w-full h-full object-contain"
            />
          </a>
        </div>

        
        <div className="w-full lg:w-[65%] grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col ">
              {col.map((item) => {
                const key = `${ci}-${item.label}`
                const isHovered = hovered === key

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    onTouchStart={() => setHovered(key)}
                    onTouchEnd={() => setHovered(null)}
                    className="group block"
                  >
                    <div className="relative   transition-all duration-300 aspect-[3/3]">
                      {/* <img
                        src={item.defaultImg}
                        alt={item.label}
                        className={`absolute inset-0 w-full object-cover transition-all duration-500 ${
                          isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
                        }`}
                      /> */}
                      <img
                        src={item.hoverImg}
                        alt={item.label}
                        className={`absolute inset-0 w-full object-cover transition-all duration-500 ${
                          isHovered ? " scale-100" : " scale-90"
                        }`}
                      />

                    
                    </div>
                    <p className={` text-center text-[10px] md:text-[12px] lg:text-[13px] font-bold capitalize transition-colors duration-300 ${
                      isHovered ? "text-[#c4003a]" : "text-[#e8003d]"
                    }`}>
                      {item.label}
                    </p>

                  </a>
                )
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}