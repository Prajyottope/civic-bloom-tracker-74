import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { MunicipalAuthProvider } from "@/hooks/useMunicipalAuth";
import Index from "./pages/Index";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import MunicipalLogin from "./pages/MunicipalLogin";
import MunicipalDashboard from "./pages/MunicipalDashboard";
import MunicipalProfile from "./pages/MunicipalProfile";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MunicipalAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Authentication />} />
              <Route path="/auth" element={<Authentication />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/municipal-login" element={<MunicipalLogin />} />
              <Route path="/municipal-dashboard" element={<MunicipalDashboard />} />
              <Route path="/municipal-profile" element={<MunicipalProfile />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MunicipalAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
