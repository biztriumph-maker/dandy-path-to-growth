import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Block2 from "./pages/Block2";
import Block3 from "./pages/Block3";
import Block4 from "./pages/Block4";
import Block5 from "./pages/Block5";
import Block6 from "./pages/Block6";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ?reset=1 в URL сбрасывает прогресс и симулирует первого пользователя
if (new URLSearchParams(window.location.search).get("reset") === "1") {
  localStorage.removeItem("dandy_block_completion");
  localStorage.removeItem("dandy_lang");
  window.history.replaceState({}, "", window.location.pathname);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/block1" element={<Index />} />
          <Route path="/block2" element={<Block2 />} />
          <Route path="/block3" element={<Block3 />} />
          <Route path="/block4" element={<Block4 />} />
          <Route path="/block5" element={<Block5 />} />
          <Route path="/block6" element={<Block6 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
