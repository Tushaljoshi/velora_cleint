import HeroBanner from '../Components/HeroBanner'
import PickFavFlowers from "../Components/PickFavFlowers"
import BirthdayGiftsSection from "../Components/BirthdayGiftsSection"
import LoveRomanceSection from "../Components/LoveRomanceSection"
import TailoredOccasions from "../Components/TailoredOccasions"
import FeaturedGiftCategories from "../Components/FeaturedGiftCategories"
import RelationsStrip from '../Components/Relationsstrip'
import TryPremiumCTA from '../Components/Trypremiumcta'
import NearbyShops from '../Components/GiftShops'

export default function Home() {
  return (
    <>
      <HeroBanner />
      <NearbyShops />
      <RelationsStrip />
      <PickFavFlowers />
      <BirthdayGiftsSection />
      <LoveRomanceSection />
      <TailoredOccasions />
      <FeaturedGiftCategories />
      <TryPremiumCTA />
    </>
  )
}