import React, { useState, useEffect, useRef } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useUserData } from "../context/userContext";
import { useClerk, useUser, useAuth } from "@clerk/clerk-react";
import Logo from "../assets/logo.png"
import { Hourglass, ShieldCheck, ShoppingBag, Coins, MapPin, Building2Icon, Phone, Mail } from "lucide-react"
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const API = import.meta.env.VITE_API_URL;
// const PLANS = [
//   {
//     id: "basic", name: "Starter", price: 499, badge: null, highlight: false,
//     features: ["1 Shop listing", "Standard badge", "Email support", "Basic visibility"],
//   },
//   {
//     id: "pro", name: "Pro", price: 999, badge: "Popular", highlight: true,
//     features: ["Up to 3 listings", "Verified badge", "WhatsApp support", "Priority placement"],
//   },
//   {
//     id: "business", name: "Business", price: 1999, badge: null, highlight: false,
//     features: ["Unlimited listings", "Premium badge", "Dedicated manager", "Featured in search"],
//   },
// ];
const DURATION_LABELS = {
  "1_month": "1 Month",
  "3_months": "3 Months",
  "6_months": "6 Months",
  "1_year": "1 Year",
  "lifetime": "Lifetime",
};
const EMPTY = {
  keeperName: "", keeperPhone: "", keeperEmail: "",
  shopName: "", shopAddress: "", googleMapLink: "",
  openTime: "09:00", closeTime: "21:00",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

const STATUS_MAP = {
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200" },
  confirmed: { label: "Confirmed", dot: "bg-emerald-500", text: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  rejected: { label: "Rejected", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  disabled: {
    label: "Disabled",
    dot: "bg-gray-400",
    text: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-300",
  },
};

function isValidMapLink(url) {
  if (!url?.trim()) return false;
  try {
    const u = new URL(url.trim());
    return u.hostname.includes("google.com") || u.hostname.includes("goo.gl");
  } catch { return false; }
}

function Label({ children }) {
  return (
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

function FieldErr({ msg }) {
  return msg ? <p className="text-xs text-red-500 font-medium mt-1.5">{msg}</p> : null;
}

function Field({ label, err, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      <FieldErr msg={err} />
    </div>
  );
}

const inputCls = (err) =>
  `w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border outline-none transition-all
   bg-gray-50 text-gray-800 placeholder-gray-300
   ${err
    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"}`;

function StatCard({ icon: Icon, value, label, iconBg }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${iconBg}`}>
        <Icon />
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-gray-400 mt-1.5 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PricingScreen({ onSelect, onBack, plans }) {
  const [sel, setSel] = useState(null);
  const plan = plans.find(p => p.name === sel);
  useEffect(() => {
    if (plans.length > 0 && !sel) {
      setSel(plans[0].name);
    }
  }, [plans]);
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap'); :root { --font-body: 'Plus Jakarta Sans', sans-serif; --font-head: 'Sora', sans-serif; } body { font-family: var(--font-body); }`}</style>

      <div className="bg-white border-b border-gray-100 px-8 py-4">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to dashboard
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-14">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-orange-100">
            Plans & Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4 leading-tight" style={{ fontFamily: "var(--font-head, 'Sora', sans-serif)" }}>
            Choose the right plan<br />for your business
          </h1>
          <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
            Every plan includes customer discovery, directions, and a verified listing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {plans.map(p => (
            <div key={p.name} onClick={() => setSel(p.name)}
              className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200
                ${sel === p.name
                  ? "border-orange-400 shadow-xl shadow-orange-100 -translate-y-1"
                  : "border-gray-100 hover:border-orange-200 hover:shadow-md"}`}>
              {p.badge && (
                <span className="absolute -top-3 left-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {p.badge}
                </span>
              )}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${sel === p.name ? "text-orange-500" : "text-gray-400"}`}>
                    {p.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-gray-900 leading-none" style={{ fontFamily: "var(--font-head, 'Sora', sans-serif)" }}>
                      ₹{p.price}
                    </span>
                    <span>
                      /{DURATION_LABELS[p.duration]?.toLowerCase() || "plan"}
                    </span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all
                  ${sel === p.name ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}>
                  {sel === p.name && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              <ul className="space-y-3">
                <li>Up to {p.shopLimit} shop listings</li>
                <li>{DURATION_LABELS[p.duration] || p.duration}</li>
                {p.features?.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Selected Plan</p>
            {plan ? (
              <p className="text-xl font-bold text-gray-900">
                {plan.name} — <span className="text-orange-500">₹{plan.price}</span>
              </p>
            ) : (
              <p className="text-gray-400">Loading plan...</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Billed {DURATION_LABELS[plan?.duration]?.toLowerCase() || "once"} · Cancel anytime
            </p>
          </div>
          <button type="button" onClick={() => plan && onSelect(plan)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Continue to Register
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4">
          💳 Secure payment via Cashfree        </p>
      </div>
    </div>
  );
}

export default function VendorPanel() {
  const [screen, setScreen] = useState("dashboard");
  const [plan, setPlan] = useState(null);
  // const [shops, setShops] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [delId, setDelId] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const [profMenu, setProfMenu] = useState(false);
  const profRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useAuth();
  const [shops, setShops] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [plans, setPlans] = useState([]);
  const { signOut, session } = useClerk();
  const { isSignedIn, isLoaded } = useUser();
  const { dbUser, setDbUser } = useUserData();
  const fname = dbUser?.name?.trim()?.[0]?.toUpperCase() || "V";
  const { user } = useUser();
  const API = import.meta.env.VITE_API_URL;

  const fetchDbUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API}/api/user/login`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDbUser(data);
    } catch (err) {
      console.log("Failed to refresh user:", err);
    }
  };
  const fetchVendorPlans = async () => {
    try {
      const res = await fetch(`${API}/api/plans/getVendorPlans`);
      const data = await res.json();

      if (!res.ok) throw new Error();

      const formatted = data.map(plan => ({
        ...plan,
        features: Object.keys(plan.features || {}).filter(f => plan.features[f]),
      }));

      setPlans(formatted);
    } catch (err) {
      console.log("Failed to fetch vendor plans");
    }
  };
  useEffect(() => {
    fetchVendorPlans();
  }, []);
  const fetchShop = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API}/api/user/vendor/get-shops`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        setShops([]);
        return;
      }
      const getStatus = (shop) => {
        if (shop.isDisabled) return "disabled";
        if (shop.isRejected) return "rejected";
        if (shop.isApproved) return "confirmed";
        return "pending";
      };
      const formatted = data.map((s) => ({
        ...s,
        status: getStatus(s),
      }));

      setShops(formatted);
      await fetchDbUser();
    } catch (err) {
      console.log("Fetch shop error:", err);
    }
  };
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;


    fetchShop();
  }, [isLoaded, isSignedIn]);
  const handlePlanWithPayment = async (plan) => {
    try {
      const res = await fetch(`${API}/api/vendor-payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, itemId: plan.name }),
      });
      const data = await res.json();

      const cashfree = await load({ mode: "sandbox" });
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `http://localhost:5173/vendor-dashboard?order_status={order_status}`,
      });
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed");
    }
  };

  // const handleSubmitWithPayment = async () => {
  //   const e = v2();
  //   if (Object.keys(e).length) {
  //     setErr(e);
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`${API}/api/vendor-payment/create-order`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: user?.id,
  //         type: "vendor_plan",
  //         itemId: plan.name,
  //       }),
  //     });

  //     const data = await res.json();

  //     const cashfree = await load({ mode: "sandbox" });

  //     await cashfree.checkout({
  //       paymentSessionId: data.payment_session_id,
  //       returnUrl: `http://localhost:5173/vendor-dashboard`,
  //     });

  //     await submit();

  //   } catch (err) {
  //     console.error("Payment Error:", err);
  //     alert("Payment failed");
  //   }
  // };
  // useEffect(() => {
  //   if (!isLoaded) return;
  //   if (!isSignedIn) setDbUser(null);
  // }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const h = e => { if (profRef.current && !profRef.current.contains(e.target)) setProfMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const sf = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]: "" })); };
  const toggleDay = d => sf("days", form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d]);

  const v1 = () => {
    const e = {};
    if (!form.keeperName.trim()) e.keeperName = "Required";
    if (!/^[6-9]\d{9}$/.test(form.keeperPhone.replace(/\D/g, ""))) e.keeperPhone = "Enter a valid 10-digit number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.keeperEmail)) e.keeperEmail = "Enter a valid email";
    return e;
  };

  const v2 = () => {
    const e = {};
    if (!form.shopName.trim()) e.shopName = "Required";
    if (!form.shopAddress.trim()) e.shopAddress = "Required";
    if (!isValidMapLink(form.googleMapLink)) e.googleMapLink = "Paste a valid Google Maps link";
    if (form.closeTime <= form.openTime) e.closeTime = "Closing must be after opening";
    if (!form.days.length) e.days = "Select at least one day";
    return e;
  };

  const openReg = () => {
    setForm(EMPTY);
    setErr({});
    setStep(1);
    setDone(false);
    setEditing(null);
    setModal("reg");
  };

  const openEdit = (s) => {
    setForm({
      keeperName: s.ownerName || "",
      keeperPhone: s.ownerNumber || "",
      keeperEmail: s.ownerEmail || "",
      shopName: s.shopName || "",
      shopAddress: s.shopAddress || "",
      googleMapLink: s.mapLink || "",
      openTime: s.openTime || "09:00",
      closeTime: s.closingTime || "21:00",
      days: s.workingDays || [],
    });

    setErr({});
    setStep(1);
    setDone(false);
    setEditing(s.id);
    setModal("edit");
  };

  const next = () => {
    const e = v1();
    if (Object.keys(e).length) { setErr(e); return; }
    setStep(2);
  };

  const submit = async () => {
    const e = v2();
    if (Object.keys(e).length) {
      setErr(e);
      return;
    }

    try {
      setSubmitting(true);
      const token = await session?.getToken();

      const isEdit = !!editing;

      const url = isEdit
        ? `${API}/api/user/vendor/update-shop/${editing}`
        : `${API}/api/user/vendor/create-shop`;

      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        name: form.keeperName,
        number: form.keeperPhone,
        email: form.keeperEmail,
        shopName: form.shopName,
        shopAddress: form.shopAddress,
        mapLink: form.googleMapLink,
        openTime: form.openTime,
        closingTime: form.closeTime,
        workingDays: form.days,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }



      await fetchShop();

      setDone(true);


    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    finally {
      setSubmitting(false)
    }
  };

  const close = () => {
    setModal(false);
    setForm(EMPTY);
    setErr({});
    setStep(1);
    setDone(false);
    setEditing(null);
  };

  const handlePlan = p => {
    setPlan(p);
    setScreen("dashboard");
    setForm(EMPTY);
    setErr({});
    setStep(1);
    setDone(false);
    setEditing(null);
    setModal("reg");
  };
  const handleDelete = async () => {
  try {
    setDeleting(true);
    const token = await session?.getToken();
    if (!token) return;

    const res = await fetch(`${API}/api/user/vendor/delete-shop/${delId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Delete failed");

    setDelId(null);
    await fetchShop();
    await fetchDbUser(); 
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setDeleting(false);
  }
};
  const handleRegisterClick = () => {
    const limit = dbUser?.shopLimit ?? 0;
    const used = dbUser?.usedShops ?? 0;

    if (used >= limit) {
      setScreen("pricing");
      return;
    }

    openReg();
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("order_status");

    if (status === "PAID") {
      window.history.replaceState({}, "", window.location.pathname);
      const init = async () => {
        await fetchDbUser();
        await fetchShop();
        openReg();
      };
      if (isLoaded && isSignedIn) init();
    }
  }, [isLoaded, isSignedIn]);

  const handleSignOut = async () => {
    try { setProfMenu(false); setDbUser(null); await signOut(); } catch (e) { console.error(e); }
  };

  if (screen === "pricing") {
    return (
      <PricingScreen
        plans={plans}
        onSelect={handlePlanWithPayment}
        onBack={() => setScreen("dashboard")}
      />
    );
  }
  const confirmedCount = shops.filter(s => s.status === "confirmed").length;
  const pendingCount = shops.filter(s => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');`}</style>

      <header className="bg-[#e0c6c5]/90 px-5 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">

        <div className="flex items-center gap-5">
          <span className="text-lg font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            <img src={Logo} alt="" className="h-18 w-24 brightness-200" />
          </span>

          <div className="w-px h-5 bg-gray-200" />

          <div className="relative" ref={profRef}>
            <button type="button" onClick={() => setProfMenu(p => !p)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#7c1c1c] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {fname}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{dbUser?.name || "Vendor"}</p>
                <p className="text-xs text-gray-400">Vendor account</p>
              </div>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"
                className={`hidden sm:block text-gray-400 transition-transform duration-200 ${profMenu ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {profMenu && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3.5 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-800">{dbUser?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{dbUser?.email}</p>
                </div>
                <button type="button" onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setScreen("pricing")}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl px-3.5 py-2 hover:bg-gray-50 transition-colors">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Plans</span>
          </button>
          <button type="button" onClick={handleRegisterClick}
            className="flex items-center gap-1.5 bg-[#7c1c1c] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-orange-200 hover:-translate-y-px transition-all">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Register Shop</span>
            <span className="sm:hidden">Register</span>
          </button>
        </div>
      </header>

      <div className="w-full mx-auto bg-[#fff8f9] px-5 md:px-44 sm:px-8 py-10 ">

        <div className="mb-10">
          <p className="text-xs font-bold text-[#7c1c1c] uppercase tracking-widest mb-2">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
            Welcome back, {dbUser?.name?.split(" ")[0] || "Vendor"}
          </h1>
          <p className="text-sm text-gray-500">Here's an overview of your shops and activity.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={ShoppingBag} value={dbUser.usedShops || 0} label="Total Shops" iconBg="bg-orange-50" />
          <StatCard icon={ShieldCheck} value={dbUser.approved || 0} label="Active" iconBg="bg-emerald-50" />
          <StatCard icon={Hourglass} value={dbUser.pending || 0} label="Pending Review" iconBg="bg-amber-50" />
          <StatCard icon={Coins} value={dbUser?.totalshops || 0} label="Total Credits Left" iconBg="bg-violet-50" />
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>My Shops</h2>
            <p className="text-sm text-gray-400 mt-0.5">{shops.length} shop{shops.length !== 1 ? "s" : ""} registered</p>
          </div>
          <button type="button" onClick={handleRegisterClick}
            className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 hover:bg-orange-100 transition-colors">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add Shop
          </button>
        </div>

        {shops.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center text-center px-8">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl mb-5">🏪</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>No shops yet</h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
              Register your first shop to start connecting with customers in your area.
            </p>
            <button type="button" onClick={handleRegisterClick}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-orange-200 hover:-translate-y-px transition-all">
              Register your first shop
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-[2fr_1fr_100px_120px_130px] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
              {["Shop", "Hours", "Plan", "Status", "Actions"].map(h => (
                <p key={h} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</p>
              ))}
            </div>

            <div className="divide-y divide-gray-50">
              {shops.map(s => (
                <div key={s.id} className="group hover:bg-gray-50/80 transition-colors">

                  <div className="hidden md:grid grid-cols-[2fr_1fr_100px_120px_130px] gap-4 px-6 py-5 items-center">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate flex items-center  gap-1"><Building2Icon size={12} />{s.shopName}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center  gap-1"><MapPin size={12} />{s.shopAddress}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center  gap-1"><Phone size={12} />{s.ownerNumber}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center  gap-1"><Mail size={12} />{s.ownerEmail}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {s.mapLink && (
                          <a
                            href={s.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                          >
                            Location
                          </a>
                        )}

                        {/* <span className="text-xs font-mono text-gray-300">
                          {s.id}
                        </span> */}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{s.openTime} – {s.closingTime}</p>
                    <span className="inline-block text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full capitalize">
                      {dbUser?.plan || "No Plan"}
                    </span>
                    <StatusBadge status={s.status} />
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEdit(s)}
                        className="text-xs font-semibold text-gray-600 border border-gray-200 px-3.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelId(s.id)}
                        className="text-xs font-semibold text-red-500 border border-red-100 px-3.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="md:hidden px-5 py-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate flex items-center  gap-1"><Building2Icon size={12} />{s.shopName}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center  gap-1"><MapPin size={12} />{s.shopAddress}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center  gap-1"><Phone size={12} />{s.ownerNumber}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center  gap-1"><Mail size={12} />{s.ownerEmail}</p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {s.mapLink && (
                        <a
                          href={s.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                        >
                          Location
                        </a>
                      )}

                      {/* <span className="text-xs font-mono text-gray-300">
                          {s.id}
                        </span> */}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-gray-400">{s.openTime} – {s.closingTime}</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(s)}
                          className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          Edit
                        </button>
                        <button type="button" onClick={() => setDelId(s.id)}
                          className="text-xs font-semibold text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/30 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setDelId(null); }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Delete this shop?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-7">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDelId(null)}
                className="flex-1 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all
    ${deleting
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-md"}
  `}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "92vh" }}
            onClick={e => e.stopPropagation()}>

            {done ? (
              <div className="flex flex-col items-center text-center px-8 py-14">
                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mb-5">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {modal === "reg" ? "Shop Registered!" : "Changes Saved!"}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
                  {modal === "reg"
                    ? "Submitted for admin review. Your shop will be live within 24 hours."
                    : "Your changes have been sent for admin review."}
                </p>
                {plan && modal === "reg" && (
                  <div className="w-full bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 text-left mb-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Registration Charge</p>
                    <p className="text-base font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {plan.name} —
                      <span className="text-orange-500">
                        ₹{plan.price}/{DURATION_LABELS[plan.duration] || "plan"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">💳 Payment collected once gateway is live.</p>
                  </div>
                )}
                <p className="font-mono text-xs text-orange-500 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl mb-7">
                  {modal === "reg" ? shops[shops.length - 1]?.id : editing}
                </p>
                <button type="button" onClick={close}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm px-10 py-3 rounded-xl shadow-sm shadow-orange-200 hover:shadow-md hover:-translate-y-px transition-all">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex-shrink-0 sm:px-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1.5">
                        {modal === "reg" ? "New Registration" : "Edit Details"}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {modal === "reg" ? "Register Your Shop" : "Update Details"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Step {step} of 2 — {step === 1 ? "Your details" : "Shop details"}
                      </p>
                    </div>
                    <button type="button" onClick={close}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors flex-shrink-0">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {plan && modal === "reg" && (
                    <div className="mt-4 flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-2.5">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-xs font-semibold text-orange-700">
                        {plan.name} · <strong>₹{plan.price}/month</strong> will be charged
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {[1, 2].map(n => (
                      <div key={n}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= n ? "bg-gradient-to-r from-orange-400 to-red-400" : "bg-gray-100"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="px-6 py-6 overflow-y-auto flex-1 space-y-5 sm:px-7">
                  {step === 1 ? (
                    <>
                      <Field label="Full Name" err={err.keeperName}>
                        <input className={inputCls(err.keeperName)} placeholder="Your full name"
                          value={form.keeperName} onChange={e => sf("keeperName", e.target.value)} />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Mobile Number" err={err.keeperPhone}>
                          <input className={inputCls(err.keeperPhone)} placeholder="10-digit number" inputMode="numeric"
                            value={form.keeperPhone} onChange={e => sf("keeperPhone", e.target.value)} />
                        </Field>
                        <Field label="Email" err={err.keeperEmail}>
                          <input className={inputCls(err.keeperEmail)} placeholder="you@email.com" inputMode="email"
                            value={form.keeperEmail} onChange={e => sf("keeperEmail", e.target.value)} />
                        </Field>
                      </div>
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                        <svg className="flex-shrink-0 mt-0.5" width="14" height="14" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" stroke="#d97706" strokeWidth="1.8" />
                          <path d="M12 8v4M12 16h.01" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <p className="text-xs text-amber-800 leading-relaxed">Used for shop verification only.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Field label="Shop Name" err={err.shopName}>
                        <input className={inputCls(err.shopName)} placeholder="Your shop name"
                          value={form.shopName} onChange={e => sf("shopName", e.target.value)} />
                      </Field>

                      <Field label="Shop Address" err={err.shopAddress}>
                        <textarea className={`${inputCls(err.shopAddress)} resize-none`} rows={2}
                          placeholder="Street, area, city, pincode"
                          value={form.shopAddress} onChange={e => sf("shopAddress", e.target.value)} />
                      </Field>

                      <Field label="Google Maps Location" err={err.googleMapLink}>
                        <div className="relative">
                          <input className={`${inputCls(err.googleMapLink)} pr-10`}
                            placeholder="Paste your Google Maps link"
                            value={form.googleMapLink} onChange={e => sf("googleMapLink", e.target.value)} />
                          {isValidMapLink(form.googleMapLink) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="#d1fae5" />
                                <path d="M7 13l3 3 7-7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="mt-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 space-y-2">
                          <p className="text-xs font-semibold text-blue-700 flex items-center gap-2">
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="1.8" />
                              <path d="M12 8v4M12 16h.01" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                            How to get your Google Maps link
                          </p>
                          <ol className="text-xs text-blue-600 space-y-1 pl-1 leading-relaxed">
                            <li>1. Open <strong>Google Maps</strong> and find your shop</li>
                            <li>2. Tap <strong>Share</strong> → <strong>Copy link</strong></li>
                            <li>3. Paste it in the field above</li>
                          </ol>
                        </div>
                      </Field>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Opening Time">
                          <input type="time" className={inputCls(false)} value={form.openTime}
                            onChange={e => sf("openTime", e.target.value)} />
                        </Field>
                        <Field label="Closing Time" err={err.closeTime}>
                          <input type="time" className={inputCls(err.closeTime)} value={form.closeTime}
                            onChange={e => sf("closeTime", e.target.value)} />
                        </Field>
                      </div>

                      <Field label="Working Days" err={err.days}>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {DAYS.map(d => (
                            <button key={d} type="button" onClick={() => toggleDay(d)}
                              className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all
                                ${form.days.includes(d)
                                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                              {d}
                            </button>
                          ))}
                        </div>
                      </Field>

                      {plan && modal === "reg" && (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Registration Summary</p>
                          <div className="space-y-2.5 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">{plan.name} Plan</span>
                              <span className="font-semibold text-gray-900">₹{plan.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Billing</span>
                              <span className="text-gray-800">Monthly</span>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-800">Total due</span>
                            <span className="text-2xl font-bold text-orange-500" style={{ fontFamily: "'Sora', sans-serif" }}>
                              ₹{plan.price}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 sm:px-7">
                  {step === 2 && (
                    <button type="button" onClick={() => setStep(1)}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                      ← Back
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={step === 1 ? next : submit}
                    className={`flex-1 sm:flex-none sm:ml-auto py-2.5 px-6 rounded-xl text-sm font-semibold transition-all
    ${submitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:-translate-y-px"}
  `}
                  >
                    {submitting
                      ? "Processing..."
                      : step === 1
                        ? "Continue →"
                        : modal === "reg"
                          ? `Register Shop`
                          : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}