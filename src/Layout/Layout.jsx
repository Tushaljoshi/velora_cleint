import Navbar from "../Components/Navbar"
import CategoryNav from "../Components/Categorynav"
import Footer from "../Components/Footer"
import { Outlet } from "react-router-dom"

export default function Layout({Wallet}) {
  return (
    <>
      <Navbar dbUser={Wallet}/>

     
        <CategoryNav />
      

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}