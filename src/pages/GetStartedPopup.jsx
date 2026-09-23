import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../assets/logo.png"
import { useUser } from "@clerk/clerk-react";

export default function GetStartedPopup({ onSignup, onLogin, onClose }) {
    const [closing, setClosing] = useState(false)
    const close = () => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            sessionStorage.setItem("gifteasy_seen", "1")
            onClose && onClose()
        }, 320)
    }

    const { isSignedIn } = useUser();



    useEffect(() => {
        if (!isSignedIn) {
            document.body.style.overflow = "hidden"
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isSignedIn])

    // const close = () => {
    //     setClosing(true)
    //     setTimeout(() => {
    //         setVisible(false)
    //         setClosing(false)
    //         sessionStorage.setItem("gifteasy_seen", "1")
    //     }, 320)
    // }
const handleGetStarted = (role) => {
    localStorage.setItem("selectedRole", role);

    setClosing(true);

    setTimeout(() => {
        setClosing(false);
        onSignup && onSignup();
    }, 320);
};
    if (isSignedIn) return null
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=DM+Sans:wght@400;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        @keyframes overlayIn {from{opacity:0}to{opacity:1}}
        @keyframes overlayOut {from{opacity:1}to{opacity:0}}
        @keyframes cardIn {from{opacity:0;transform:scale(.93) translateY(28px)}to{opacity:1;transform:scale(1)}}
        @keyframes cardOut {from{opacity:1}to{opacity:0;transform:scale(.96) translateY(14px)}}
      `}</style>

            <div
                className="fixed inset-0 z-[1000] backdrop-blur-sm"
                style={{
                    background: "rgba(8,1,1,0.78)",
                    animation: `${closing ? "overlayOut" : "overlayIn"} 0.3s ease forwards`,
                }}
            />

            <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                <div
                    className="w-full max-w-[920px] flex rounded-[26px] overflow-hidden shadow-2xl"
                    style={{
                        animation: `${closing ? "cardOut" : "cardIn"} 0.4s ease forwards`,
                    }}
                >

                    <div className="hidden md:flex w-[42%] bg-[#0d0a0a] text-white flex-col justify-between p-8">
                        <div className="flex items-center ">
                            <img src={Logo} className="h-24 brightness-200" />
                            {/* <p className="text-xs mt-2 text-gray-400 tracking-widest">AI GIFTING</p> */}
                        </div>

                        <div className="text-center">
                            <p className="text-4xl font-bold tracking-tight opacity-30">GIFTING</p>
                            <p className="text-4xl font-bold">UNLOCKED</p>
                        </div>

                        <div className="grid grid-cols-3 text-center text-xs">
                            <div>
                                <p className="font-bold text-lg">10K+</p>
                                <p className="opacity-50">Gifters</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg">50K+</p>
                                <p className="opacity-50">Gifts</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg">4.9★</p>
                                <p className="opacity-50">Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#faf6f4] flex flex-col justify-center px-8 py-10 relative overflow-hidden">

                        <button
                            onClick={close}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-red-100 text-gray-500 hover:text-red-700 flex items-center justify-center transition"
                        >
                            ✕
                        </button>

                        <div className="space-y-4 max-w-sm">
                            <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-widest">
                                Welcome to Gifteasy
                            </div>

                            <h1 className="text-3xl font-bold leading-tight">
                                Gifting just got
                            </h1>

                            <h1 className="text-4xl italic font-bold text-red-800">
                                way smarter ✦
                            </h1>

                            <p className="text-sm text-gray-600">
                                AI that finds the perfect gift for anyone, any occasion, any budget.
                            </p>



                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs">
                                <p className="font-bold text-yellow-800">2 free credits for new users </p>
                                {/* <p className="text-yellow-600">No card required</p> */}
                            </div>

                            <button
                                onClick={() => handleGetStarted("customer")}
                                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-700 to-pink-500 hover:opacity-90 transition"
                            >
                                Register As Customer
                            </button>
                            <button
                                onClick={() => handleGetStarted("vendor")}
                                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-700 to-pink-500 hover:opacity-90 transition"
                            >
                                Register As ShopKeeper
                            </button>

                            <button
                                onClick={close}
                                className="w-full py-2 border rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition"
                            >
                                maybe later
                            </button>

                            <p className="text-xs text-center text-gray-500">
                                Already using it?{" "}
                                <span
                                    onClick={() => {
                                        setClosing(true)
                                        setTimeout(() => {
                                            setVisible(false)
                                            setClosing(false)
                                            onLogin && onLogin()
                                        }, 300)
                                    }}
                                    className="text-red-700 font-semibold cursor-pointer"
                                >
                                    Sign in →
                                </span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}