import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import Logo from "./assets/logo.png"
import Layout from "./Layout/Layout";
import Loader from "./Components/Loader";
import Home from "./pages/Home";
import Results from "./pages/Results";
import SubscriptionPage from "./pages/SubscriptionPage";
import WalletPage from "./pages/WalletPage";
import ProductSystem from "./Components/Productsystem";
import SavedProducts from "./Components/SavedComponents";
import ChatPage from "./ChatBot/ChatPage";
import GetStartedPopup from "./pages/GetStartedPopup";
import AuthModal from "./pages/AuthModal";
import VendorPanel from "./pages/VendorPanel";

import { useUserData } from "./context/userContext";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [authView, setAuthView] = useState(null);
  const { dbUser, setDbUser } = useUserData();

  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const syncingRef = useRef(false);
  const [chatForced, setChatForced] = useState(false)
  const [chatActivated, setChatActivated] = useState(false)
  const [creditPopup, setCreditPopup] = useState(false)
  const [pendingResolve, setPendingResolve] = useState(null)
  const [lowCreditsPopup, setLowCreditsPopup] = useState(false)
  useEffect(() => {
    if (!dbUser) return;

    if (dbUser.role === "customer") {
      const lastSeen = localStorage.getItem("chat_seen");

      if (!lastSeen || Date.now() - Number(lastSeen) > 86400000) {
        handleChatOpen()
        setChatForced(true);
      }
    }
  }, [dbUser]);
  const deductCredits = async () => {
    try {
      const token = await getToken()

      const res = await fetch(`${API}/api/user/wallet/deduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 5,
          reason: "Ai bot use"
        }),
      })

      const data = await res.json()

      if (!res.ok) return false

      setDbUser(prev => ({ ...prev, balance: data.balance }))
      return true

    } catch (err) {
      console.error(err)
      return false
    }
  }
  const handleChatOpen = () => {
    setChatOpen(true)
  }

  useEffect(() => {
    if (syncingRef.current) return;
    if (!isLoaded || !isSignedIn || !user) return;

    syncingRef.current = true;

    const syncUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          console.log("No token yet");
          syncingRef.current = false;
          return;
        }
        const role = localStorage.getItem("selectedRole") || "customer";

        const res = await fetch(`${API}/api/user/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: user.primaryEmailAddress?.emailAddress,
            role,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }

        const data = await res.json();

        setDbUser((prev) => {
          if (prev?.id === data.id && prev?.role === data.role) {
            return prev;
          }
          return data;
        });

        localStorage.removeItem("selectedRole");

      } catch (err) {
        console.error("Error syncing user:", err);
        syncingRef.current = false;
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!dbUser) return;

    const path = location.pathname;

    if (dbUser.role === "vendor" && path !== "/vendor") {
      navigate("/vendor", { replace: true });
    }

    if (dbUser.role === "customer" && path !== "/") {
      navigate("/", { replace: true });
    }
  }, [dbUser?.role]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      setAuthView((prev) => (prev !== null ? null : prev));
      return;
    }

    const seen = localStorage.getItem("gifteasy_seen");

    if (!seen) {
      setAuthView((prev) =>
        prev !== "getStarted" ? "getStarted" : prev
      );
    }
  }, [isLoaded, isSignedIn]);

  const handleCloseChat = () => {
    localStorage.setItem("chat_seen", String(Date.now()))
    setChatForced(false)
    setChatOpen(false)

    setChatActivated(false)
  };
 const handlePaidAction = async () => {
  if (!isSignedIn) {
    setAuthView("login")
    return false
  }

  if (!dbUser || dbUser.balance < 5) {
    setLowCreditsPopup(true)
    return false
  }

  return new Promise((resolve) => {
    setCreditPopup(true)
    setPendingResolve(() => resolve)
  })
}
  const handleConfirmPayment = async () => {
    const success = await deductCredits()

    if (pendingResolve) pendingResolve(success)

    setCreditPopup(false)
    setPendingResolve(null)
  }

  const handleCancelPayment = () => {
    if (pendingResolve) pendingResolve(false)

    setCreditPopup(false)
    setPendingResolve(null)
  }
  if (!isLoaded) return <Loader />;
  if (isSignedIn && !dbUser) return <Loader />;
  const VendorRoute = ({ children }) => {
    if (dbUser === undefined) return <Loader />;
    if (!dbUser) return null;
    return dbUser.role === "vendor" ? children : <Navigate to="/" />;
  };


  const handleFirstInteraction = async () => {
    const allowed = await handlePaidAction()
    return allowed
  }

  return (
    <div className="relative">
      <div className={chatForced ? "blur-sm pointer-events-none" : ""}>

        <Routes>
          <Route path="/" element={<Layout Wallet={dbUser} />}>
            <Route index element={<Home />} />
            <Route path="products/:category" element={<ProductSystem />} />
            <Route path="products/saved" element={<SavedProducts />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="wallet" element={<WalletPage />} />
          </Route>

          <Route path="/vendor" element={<VendorPage />} />

          <Route path="/results" element={<Results />} />
        </Routes>
      </div>

      {authView === "getStarted" && (
        <GetStartedPopup
          onSignup={() => setAuthView("signup")}
          onLogin={() => setAuthView("login")}
          onClose={() => setAuthView(null)}
        />
      )}

      {(authView === "signup" || authView === "login") && (
        <AuthModal
          mode={authView}
          onClose={() => setAuthView(null)}
        />
      )}

      {chatOpen && (
        <div className="fixed inset-0 z-[500] flex">
          <div
            className="hidden md:block md:w-1/2 backdrop-blur-sm bg-black/20"
            onClick={() => {
              if (!chatForced) setChatOpen(false);
            }}
          />
          <div className="w-full md:w-1/2 bg-white shadow-2xl">
            <ChatPage
              closeChat={handleCloseChat}
              onFirstInteraction={handleFirstInteraction}
              onPaidAction={handlePaidAction}
            />

          </div>
        </div>
      )}
      {location.pathname !== "/vendor" && !chatOpen && (
        <button
          onClick={handleChatOpen}
          className="fixed bottom-6 right-6 z-[500] flex items-center gap-[10px] px-4 py-[10px] pl-[10px] rounded-full bg-white border border-rose-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
          style={{ boxShadow: "0 4px 18px rgba(190,18,60,0.13), 0 1px 4px rgba(0,0,0,0.06)" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(190,18,60,0.22), 0 2px 6px rgba(0,0,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 18px rgba(190,18,60,0.13), 0 1px 4px rgba(0,0,0,0.06)"}
        >
          <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0"
          >
            <img
              src={Logo}
              alt="Valora Gifter"
              className="w-[18px] h-[18px] object-contain brightness-200"
            />
          </div>

          <div className="flex flex-col items-start gap-0">
            <span className="text-[13.5px] font-semibold text-rose-800 leading-tight tracking-tight">
              Ask Valora Gifter
            </span>
            <span className="text-[10.5px] font-normal text-rose-300 leading-tight">
              Let Valora Gifter help you
            </span>
          </div>
        </button>
      )}
      {creditPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-[300px] shadow-xl text-center">

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚠ This will cost 5 credits
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Do you want to continue?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelPayment}
                className="px-4 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white"
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      )}
      {lowCreditsPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-[300px] shadow-xl text-center">

            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-1">
              not enough credits
            </h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              you need at least <span className="text-rose-700 font-medium">5 credits</span> to
              use this feature. upgrade your plan to get more.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setLowCreditsPopup(false)
                  navigate("/subscription")
                }}
                className="w-full py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold"
              >
                view plans
              </button>
              <button
                onClick={() => setLowCreditsPopup(false)}
                className="w-full py-2.5 rounded-lg border text-gray-500 text-sm"
              >
                maybe later
              </button>
            </div>

          </div>
        </div>
      )}
    </div>

  );
}


const VendorPage = () => {
  const { dbUser } = useUserData();

  if (dbUser === undefined) return <Loader />;
  if (!dbUser) return null;

  return dbUser.role === "vendor"
    ? <VendorPanel />
    : <Navigate to="/" />;
};