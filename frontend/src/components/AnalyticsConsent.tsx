import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type Consent = "accepted" | "declined" | null;

const CONSENT_KEY = "galla_analytics_consent";
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const enableAnalytics = () => {
  if (!measurementId || document.getElementById("galla-google-analytics")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: false });

  const script = document.createElement("script");
  script.id = "galla-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
};

const AnalyticsConsent = () => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consent, setConsent] = useState<Consent>(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    return saved === "accepted" || saved === "declined" ? saved : null;
  });

  useEffect(() => {
    if (consent === "accepted") enableAnalytics();
  }, [consent]);

  useEffect(() => {
    const reopen = () => setSettingsOpen(true);
    window.addEventListener("galla:open-consent", reopen);
    return () => window.removeEventListener("galla:open-consent", reopen);
  }, []);

  useEffect(() => {
    if (consent === "accepted" && window.gtag) {
      window.gtag("event", "page_view", { page_path: `${location.pathname}${location.search}` });
    }
  }, [consent, location.pathname, location.search]);

  if (!settingsOpen && (!measurementId || consent !== null)) return null;

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    if (value === "declined" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
    if (value === "accepted" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
    setConsent(value);
    setSettingsOpen(false);
  };

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-xl border border-[#d8c8bd] bg-white p-4 text-sm text-[#302b27] shadow-2xl md:flex md:items-center md:gap-5" aria-label="Privacy settings">
      <div>
      <h2 className="mb-2 font-semibold">Privacy settings</h2>
      <p className="leading-6">
        {measurementId
          ? "We use optional analytics to understand website visits. Analytics loads only if you accept."
          : "Optional analytics is currently inactive. Essential browser storage keeps your cart, language preference, and privacy choice."}{" "}
        See our{" "}
        <Link to="/privacy" className="font-semibold text-[#9e0102] underline">Privacy Policy</Link>.
      </p>
      </div>
      <div className="mt-3 flex shrink-0 gap-2 md:mt-0">
        {measurementId ? <>
        <button type="button" onClick={() => choose("declined")} className="rounded-md border border-[#9e0102] px-4 py-2 font-semibold text-[#9e0102]">Decline</button>
        <button type="button" onClick={() => choose("accepted")} className="rounded-md bg-[#9e0102] px-4 py-2 font-semibold text-white">Accept</button>
        </> : <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-md bg-[#9e0102] px-4 py-2 font-semibold text-white">Close</button>}
      </div>
    </aside>
  );
};

export default AnalyticsConsent;
