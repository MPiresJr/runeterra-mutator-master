
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
import RosterAlt4 from "./pages/RosterAlt4";
import RosterAlt5 from "./pages/RosterAlt5";
import RosterAlt6 from "./pages/RosterAlt6";
import RosterAlt7 from "./pages/RosterAlt7";
import RosterAlt8 from "./pages/RosterAlt8";
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
          <Route path="/roster-alt4" element={<RosterAlt4 />} />
          <Route path="/roster-alt5" element={<RosterAlt5 />} />
          <Route path="/roster-alt6" element={<RosterAlt6 />} />
          <Route path="/roster-alt7" element={<RosterAlt7 />} />
          <Route path="/roster-alt8" element={<RosterAlt8 />} />
          <Route path="/champion/:championName" element={<Champion />} />
          <Route path="/monthly-challenge" element={<MonthlyChallenge />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
