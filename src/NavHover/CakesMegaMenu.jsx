import Cake from "../assets/b2.png"

const cakesMenu = [
  {
    title: "Celebrate Special Occasions",
    items: [
      { label: "All Cakes" },
      { label: "Birthday Cakes" },
      { label: "Anniversary Cakes" },
      { label: "Congratulations" },
      { label: "25th Anniversary" },
      { label: "Kid's Birthday Cakes" },
      { label: "Wedding Cakes" },
      { label: "1st Anniversary" },
      { label: "Make Small Celebrations Big" },
      { label: "Explore Cakes Collection" }
    ]
  },
  {
    title: "Top Picks",
    items: [
      { label: "Healthy Cakes", badge: true },
      { label: "Dry Cakes" },
      { label: "Cakes in 60 mins", badge: true },
      { label: "Best Sellers" },
      { label: "Same Day Delivery" },
      { label: "Midnight Delivery" },
      { label: "Luxe Cakes", badge: true },
      { label: "Flowers n Cakes" },
      { label: "Cakes n Guitarist" },
      { label: "Cake Combos" },
      { label: "Cake With Plants" },
      { label: "Cake With Chocolates" },
      { label: "New Arrivals" }
    ]
  },
  {
    title: "Yummy Treats",
    items: [
      { label: "Gourmet Cakes" },
      { label: "Eggless Cakes" },
      { label: "Half Cakes" },
      { label: "Cup Cakes" },
      { label: "Bento Cakes" },
      { label: "Photo Cakes" },
      { label: "Fusion Cakes" },
      { label: "Jar Cakes" },
      { label: "Designer Cakes" },
      { label: "Fondant Cakes" },
      { label: "Heart Shaped Cakes" }
    ]
  },
  {
    title: "Flavour Choices",
    items: [
      { label: "Butterscotch Cakes" },
      { label: "Pineapple Cakes" },
      { label: "Truffle Cakes" },
      { label: "Chocolate Cakes" },
      { label: "Black Forest Cakes" },
      { label: "Vanilla Cakes" },
      { label: "Red Velvet Cakes" },
      { label: "Blueberry Cakes" },
      { label: "Walnut Cakes" },
      { label: "Coffee Cakes" },
      { label: "Pinata Cakes" },
      { label: "Fresh Fruit Cakes" },
      { label: "Caramel Cakes" }
    ]
  },
  {
    title: "Send Cakes To",
    items: [
      { label: "Delhi" },
      { label: "Mumbai" },
      { label: "Bengaluru" },
      { label: "Pune" },
      { label: "Hyderabad" },
      { label: "Kolkata" }
    ]
  }
]

export default function CakesMegaMenu() {

  return (
    <div className="absolute left-0 w-[1500px] bg-[#f2e5e5] shadow-xl border border-[#e6e6e6] p-6 flex gap-6 z-50">

      {cakesMenu.map((col, i) => (
        <div key={i} className="flex-1">

          <h4 className="text-[15px] font-bold text-black mb-3">
            {col.title}
          </h4>

          <ul className="flex flex-col gap-[4px]">

            {col.items.map((item) => (
              <li key={item.label} className="flex items-center gap-2">

                <a
                  href="#"
                  className="text-[13px] text-[#333] hover:text-[#e8003d]"
                >
                  {item.label}
                </a>

                {item.badge && (
                  <span className="text-[9px] font-bold bg-[#e8003d] text-white px-2 py-[2px] rounded-full">
                    New
                  </span>
                )}

              </li>
            ))}

          </ul>

        </div>
      ))}

      <img
        src={Cake}
        className="absolute bottom-4 right-4 h-[100px] w-[100px]"
        alt=""
      />

    </div>
  )
}