import { useState } from "react";
import Logo from "../assets/logo2.png"
import { Heart } from "lucide-react";
const links = {
    "Occasions": ["Birthday", "Anniversary", "Wedding", "Baby Shower", "Farewell", "Congratulations"],
    "Categories": [  "Chocolates", "Plants", "Personalised", "Combos"],
    "Company": ["About Us", "Careers", "Blog", "Press", "Corporate Gifting", "Franchise"],
    "Support": ["Track Order", "FAQs", "Returns", "Contact Us",  "Accessibility"],
};

const socials = [
    {
        name: "Instagram", href: "#",
        svg: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    },
    {
        name: "Facebook", href: "#",
        svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" stroke="none" />,
    },
    {
        name: "X", href: "#",
        svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" stroke="none" />,
    },
    {
        name: "YouTube", href: "#",
        svg: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="currentColor" stroke="none" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></>,
    },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    return (
        <footer className="w-full bg-[#0f0c0d] text-white" style={{ fontFamily: "system-ui, sans-serif" }}>

            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c4003a, #ff6b9d, #c4003a, transparent)" }} />

            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex flex-col lg:flex-row gap-10">

                    <div className="lg:w-56 flex-shrink-0">
                        <div className="flex items-baseline gap-0.5 mb-2">
                            {/* <span className="text-2xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif" }}>GiftEasyAi</span> */}
                            <img src={Logo} alt="Logo" className="h-42  w-40  object-contain shrink-0 mr-1" />
                            {/* <span className="text-rose-500 text-2xl font-black">.</span> */}
                        </div>
                        <p className="text-white/35 text-xs leading-relaxed mb-4">
                            India's most loved gifting destination. 
                        </p>

                        <div className="flex gap-2 mb-5">
                            {socials.map((s) => (
                                <a key={s.name} href={s.href} aria-label={s.name}
                                    className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-white/35 hover:text-rose-400 hover:border-rose-400/40 transition-all duration-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                                        {s.svg}
                                    </svg>
                                </a>
                            ))}
                        </div>


                        {sent ? (
                            <p className="text-emerald-400 text-xs font-medium">You're in! </p>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="flex">
                                <input
                                    type="email" required placeholder="Your email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white placeholder-white/25 text-xs px-3 py-2 rounded-l-md outline-none focus:border-rose-400/60 transition-colors"
                                />
                                <button type="submit"
                                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-2 rounded-r-md transition-colors duration-200 whitespace-nowrap">
                                    Join
                                </button>
                            </form>
                        )}
                    </div>


                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(links).map(([section, items]) => (
                            <div key={section}>
                                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 mb-3">{section}</p>
                                <ul className="space-y-2">
                                    {items.map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-white/35 hover:text-rose-300 text-xs transition-colors duration-150">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/8 mt-8 pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-white/20 text-[11px]">© 2026 GiftEasyAi. All rights reserved.</p>
                    <div className="flex gap-4">
                        {["Privacy", "Terms", "Cookies"].map((l) => (
                            <a key={l} href="#" className="text-white/20 hover:text-white/45 text-[11px] transition-colors">{l}</a>
                        ))}
                    </div>
                    <p className="text-white/15 text-[11px] flex gap-1 items-center">Made with <span className="text-rose-500"><Heart size={11}/></span> in India</p>
                </div>
            </div>

            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c4003a33, transparent)" }} />
        </footer>
    );
}