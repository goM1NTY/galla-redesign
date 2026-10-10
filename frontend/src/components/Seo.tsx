import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://galla.mk").replace(/\/$/, "");

const pages: Record<string, { title: string; description: string; index?: boolean }> = {
  "/": {
    title: "Galla Caffe | Italian-Style Espresso",
    description: "Discover Galla Caffe espresso blends and coffee capsules, carefully roasted and packed in North Macedonia since 2005.",
  },
  "/all-products": {
    title: "Coffee Collection | Galla Caffe",
    description: "Explore Galla Classic, Aroma, Cream and Black espresso blends, made with selected Arabica and Robusta coffee beans.",
  },
  "/capsules": {
    title: "Coffee Capsules | Galla Caffe",
    description: "Order Galla Classic and Aroma coffee capsules online for delivery across North Macedonia.",
  },
  "/privacy": { title: "Privacy Policy | Galla Caffe", description: "How Galla Caffe collects, uses and protects personal information." },
  "/terms": { title: "Terms and Conditions | Galla Caffe", description: "Terms for purchases from the Galla Caffe online store." },
  "/shipping": { title: "Shipping Policy | Galla Caffe", description: "Delivery areas, timing and shipping rules for Galla Caffe orders." },
  "/returns": { title: "Returns and Refunds | Galla Caffe", description: "Cancellation, return and refund information for Galla Caffe orders." },
  "/company-details": { title: "Company Details | Galla Caffe", description: "Contact and legal information for Galla Caffe in North Macedonia." },
  "/admin/orders": { title: "Order Administration | Galla Caffe", description: "Protected Galla Caffe order management.", index: false },
};

const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pages[pathname] || {
      title: "Page Not Found | Galla Caffe",
      description: "The requested page could not be found.",
      index: false,
    };
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
    const shareImage = `${SITE_URL}/social-share.webp`;

    document.title = page.title;
    document.documentElement.lang = "en";
    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[name="robots"]', "name", "robots", page.index === false ? "noindex, nofollow" : "index, follow");
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", shareImage);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", "Galla Caffe Espresso Italiano");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", shareImage);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);

  return null;
};

export default Seo;
