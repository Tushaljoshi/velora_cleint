import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { useUserLocation } from "../Hooks/MapPicker";

const FILTERS = ["All", "Open Now", "Nearest", "Top Rated"];

const IMAGES = [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80",
    "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80",
];

function ShopCard({ shop, index }) {
    return (
        <div
            className="flex-shrink-0 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            style={{ width: "min(72vw, 300px)" }}
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={IMAGES[index % IMAGES.length]}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium">
                    {shop.distanceText}
                </div>
                <div className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-lg font-medium ${shop.open ? "bg-green-500 text-white" : "bg-gray-800 text-white"}`}>
                    {shop.open ? "Open" : "Closed"}
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 leading-tight">{shop.name}</h3>
                    <p className="text-sm text-gray-500">{shop.category}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-yellow-500 font-medium">
                        <Star size={14} fill="currentColor" />
                        {shop.rating}
                        <span className="text-gray-400 text-xs ml-1">({shop.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock size={14} />
                        {shop.openTime} - {shop.closeTime}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {shop.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{tag}</span>
                    ))}
                </div>

                <div className="flex gap-2 pt-2">
                    <a href={`tel:${shop.phone}`} className="flex-1 text-center bg-[#7c1c1c] text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition">
                        Call
                    </a>
                    <a href={shop.googleMapLink} target="_blank" rel="noreferrer" className="flex-1 text-center border border-gray-200 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                        Directions
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function NearbyShops() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const scrollRef = useRef(null);
    const { location } = useUserLocation();
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };
    const isOpen = (openTime, closeTime) => {
        const now = new Date();
        const [h, m] = openTime.split(":");
        const [ch, cm] = closeTime.split(":");

        const open = new Date();
        open.setHours(Number(h), Number(m));

        const close = new Date();
        close.setHours(Number(ch), Number(cm));

        return now >= open && now <= close;
    };

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const snapshot = await getDocs(collection(db, "shops"));

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const nearby = data
                    .map(shop => {
                        if (!shop.lat || !shop.lng) return null;

                        const distance = getDistance(
                            location.lat,
                            location.lng,
                            shop.lat,
                            shop.lng
                        );

                        return {
                            id: shop.id,
                            name: shop.shopName,
                            category: "Gift Shop",
                            phone: shop.ownerNumber,
                            openTime: shop.openTime,
                            closeTime: shop.closingTime,
                            googleMapLink: shop.mapLink,
                            rating: 4.5,
                            reviews: 50,
                            tags: ["Nearby"],
                            distance: distance,
                            distanceText: distance.toFixed(1) + " km",
                            open: isOpen(shop.openTime, shop.closingTime),
                        };
                    })
                    .filter(Boolean)
                    .filter(shop => shop.distance <= 5)
                    .sort((a, b) => a.distance - b.distance);

                setShops(nearby);
                setLoading(false);

            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (location.lat && location.lng) {
            fetchShops();
        }
    }, [location]);

    const filtered = shops.filter(s => {
        if (activeFilter === "Open Now") return s.open;
        return true;
    }).sort((a, b) => {
        if (activeFilter === "Nearest") return parseFloat(a.distance) - parseFloat(b.distance);
        if (activeFilter === "Top Rated") return b.rating - a.rating;
        return 0;
    });
    if (loading) return <p>Loading shops...</p>;
    return (
        <div className="bg-[#fff8f9]">
            <style>{`
                .no-sb  { scrollbar-width: none; -ms-overflow-style: none; }
                .no-sb::-webkit-scrollbar { display: none; }
            `}</style>

            <div className="px-6 py-6">
                <h1 className="text-2xl font-bold text-[#7c1c1c] mb-1">Gift Shops Nearby</h1>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setActiveFilter(f)}
                            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${activeFilter === f
                                ? "bg-[#7c1c1c] text-white border-gray-900"
                                : "bg-white text-pink-900 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="py-6 px-6">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm text-gray-400">No shops found.</p>
                    </div>
                ) : (
                    <div ref={scrollRef} className="no-sb flex gap-4 overflow-x-auto pb-2">
                        {filtered.map((shop, i) => (
                            <ShopCard key={shop.id} shop={shop} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}