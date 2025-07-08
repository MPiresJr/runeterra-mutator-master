
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MutatorsDatabase from "./pages/MutatorsDatabase";
import Roster from "./pages/Roster";
import RosterAlt1 from "./pages/RosterAlt1";
import RosterAlt2 from "./pages/RosterAlt2";
import RosterAlt3 from "./pages/RosterAlt3";
import Champion from "./pages/Champion";
import MonthlyChallenge from "./pages/MonthlyChallenge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mutators" element={<MutatorsDatabase />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/roster-alt1" element={<RosterAlt1 />} />
          <Route path="/roster-alt2" element={<RosterAlt2 />} />
          <Route path="/roster-alt3" element={<RosterAlt3 />} />
          <Route path="/champion/:championName" element={<Champion />} />
          <Route path="/monthly-challenge" element={<MonthlyChallenge />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
