import { useEffect, useState } from "react";
import { SignIn, SignUp, useUser} from "@clerk/clerk-react";
import Logo from "../assets/logo.png"
export default function AuthModal({ onClose, mode: initialMode }) {
  
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState(initialMode || "signup")
  const { isSignedIn } = useUser();
  
  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    setRole(savedRole || "customer")
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    if (isSignedIn) {
      localStorage.setItem("gifteasy_seen", "1");
      onClose();
    }
  }, [isSignedIn]);

  return (
    <>
      <div
        className="fixed inset-0 z-[500] backdrop-blur-sm"
        style={{
          background: "rgba(8,1,1,0.78)",
          animation: `0.3s ease forwards`,
        }}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[501] flex items-center justify-center p-4">

        <div className="w-full max-w-[920px]  rounded-[26px] overflow-hidden shadow-2xl flex relative">

          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/10 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center"
          >
            ✕
          </button>

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

          <div className="flex-1 bg-gradient-to-br from-[#fff7f6] via-[#fffafa] to-[#fdf2f2] flex items-center justify-center relative overflow-hidden p-2">

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(196,112,106,0.15),transparent_60%)]" />



            <div className="relative z-10 w-full max-w-[460px]  bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col ">

              <div className="flex mb-4 p-2 border-b border-[#f1dede]">
                {["signup", "login"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 pb-2 text-sm font-semibold transition ${mode === m
                      ? "text-[#7c1c1c] border-b-2 border-[#7c1c1c]"
                      : "text-[#b08a8a] hover:text-[#7c1c1c]"
                      }`}
                  >
                    {m === "signup" ? "Create Account" : "Sign In"}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col items-center mx-auto  justify-center">

                {mode === "signup" ? (
                  <SignUp
                    appearance={{
                      elements: {
                        rootBox: "w-full max-w-full",
                        card: "w-full max-w-full shadow-none bg-transparent p-5",

                        headerTitle: "hidden",
                        headerSubtitle: "hidden",

                        formFieldInput:
                          "h-[44px] rounded-lg border border-[#e8d5d0] focus:border-[#c4504a] focus:ring-1 focus:ring-[#f5d3d3] text-[13px]",

                        formButtonPrimary:
                          "h-[44px] mt-2 rounded-lg bg-gradient-to-r from-[#7c1c1c] to-[#c4504a] text-white font-semibold shadow-sm",

                        footer: "hidden",
                        footerAction: "hidden",
                        footerActionText: "hidden",
                        footerActionLink: "hidden",

                        form: "gap-4",
                      },
                      layout: {
                        showOptionalFields: false,
                      },
                    }}
                    afterSignUpUrl="/"
                  />
                ) : (
                  <SignIn
                    appearance={{
                      elements: {
                        rootBox: "w-full max-w-full",
                        card: "w-full max-w-full shadow-none bg-transparent p-5",

                        headerTitle: "hidden",
                        headerSubtitle: "hidden",

                        formFieldInput:
                          "h-[44px] rounded-lg border border-[#e8d5d0] focus:border-[#c4504a] focus:ring-1 focus:ring-[#f5d3d3] text-[13px]",

                        formButtonPrimary:
                          "h-[44px] mt-2 rounded-lg bg-gradient-to-r from-[#7c1c1c] to-[#c4504a] text-white font-semibold shadow-sm",

                        footer: "hidden",
                        footerAction: "hidden",
                        footerActionText: "hidden",
                        footerActionLink: "hidden",

                        form: "gap-2",
                      },
                    }}
                    afterSignInUrl="/"
                  />
                )}

              </div>

              <div className="mt-2 p-2 text-center">
                {mode === "signup" ? (
                  <p className="text-xs text-[#a07070]">
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="text-[#7c1c1c] font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-[#a07070]">
                    New here?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-[#7c1c1c] font-semibold"
                    >
                      Create account
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}