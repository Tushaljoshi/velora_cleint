import { useEffect, useState } from "react";

const extractPincode = (displayName) => {
  const match = displayName?.match(/\b\d{6}\b/);
  return match ? match[0] : "";
};

export const useUserLocation = () => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: "Detecting...",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const fetchLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      fallbackIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB2cTm0Hcx0WvUGCLlS9bm1EwEptlL6UAk`
          );
          const data = await res.json();
          console.log(data)
          const result = data.results[0];

          const loc = {
            lat,
            lng,
            address: result.formatted_address,
            city: result.address_components.find(c => c.types.includes("locality"))?.long_name || "",
            pincode: result.address_components.find(c => c.types.includes("postal_code"))?.long_name || "",
          };

          localStorage.setItem("userLocation", JSON.stringify(loc));
          setLocation(loc);
        } catch {
          fallbackIP();
        } finally {
          setLoading(false);
        }
      },
      () => fallbackIP(),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  };
  const fallbackIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const loc = {
        lat: data.latitude,
        lng: data.longitude,
        address: data.city || "Unknown",
        city: data.city || "",
        pincode: data.postal || "",
      };

      localStorage.setItem("userLocation", JSON.stringify(loc));
      setLocation(loc);
    } catch {
      setLocation({
        lat: null,
        lng: null,
        address: "Unavailable",
        pincode: "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const saved = localStorage.getItem("userLocation");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      // ensure it's valid object
      if (typeof parsed === "object" && parsed !== null) {
        setLocation(parsed);
        setLoading(false);
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.warn("Invalid stored location, clearing...", err);

      // remove bad data
      localStorage.removeItem("userLocation");

      // fallback
      fetchLocation();
      return;
    }
  }

  if (!navigator.geolocation) {
    fallbackIP();
    return;
  }

  fetchLocation();
}, []);

  return { location, loading, refetchLocation: fetchLocation };
};