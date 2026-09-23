import { useEffect } from "react";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl" />

      <div className="fixed inset-0 z-[501] flex items-center justify-center p-4">

        <div className="w-full max-w-[920px] h-[90vh] rounded-[26px] overflow-hidden shadow-2xl flex">

          <div className="hidden md:flex w-[42%] bg-[#0d0a0a] text-white flex-col justify-between p-8">
            
            <div>
              <h2 className="text-xl font-bold tracking-wide">Gifteasy</h2>
              <p className="text-xs mt-2 text-gray-400 tracking-widest">AI GIFTING</p>
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

          <div className="flex-1 bg-[#faf6f4] flex items-center justify-center px-6 relative">

            <div
              className="absolute inset-0"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="w-full max-w-sm z-10">

              <SignIn
                appearance={{
                  elements: {
                    card: "shadow-none bg-transparent",
                    formButtonPrimary:
                      "bg-gradient-to-r from-[#7c1c1c] to-[#c4504a] text-white rounded-xl",
                    headerTitle:
                      "text-2xl font-bold text-[#0f0505]",
                  },
                }}
                routing="path"
                path="/login"
                signUpUrl="/signup"
                forceRedirectUrl="/"
              />

            </div>

          </div>

        </div>
      </div>
    </>
  );
}