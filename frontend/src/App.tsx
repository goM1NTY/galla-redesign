import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import AllProducts from "./pages/AllProducts";
import Capsules from "./pages/Capsules";
import NotFound from "./pages/NotFound";
import StorePolicy from "./pages/StorePolicy";
import AdminOrders from "./pages/AdminOrders";

const queryClient = new QueryClient();

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/capsules" element={<Capsules />} />
          <Route path="/privacy" element={<StorePolicy type="privacy" />} />
          <Route path="/terms" element={<StorePolicy type="terms" />} />
          <Route path="/shipping" element={<StorePolicy type="shipping" />} />
          <Route path="/returns" element={<StorePolicy type="returns" />} />
          <Route path="/company-details" element={<StorePolicy type="company" />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
