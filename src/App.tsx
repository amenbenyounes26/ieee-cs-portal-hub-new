import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Public pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Workshops from "./pages/Workshops";
import WorkshopDetail from "./pages/WorkshopDetail";
import Bootcamps from "./pages/Bootcamps";
import BootcampDetail from "./pages/BootcampDetail";
import Board from "./pages/Board";
import Contact from "./pages/Contact";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventForm from "./pages/admin/AdminEventForm";
import AdminWorkshops from "./pages/admin/AdminWorkshops";
import AdminWorkshopForm from "./pages/admin/AdminWorkshopForm";
import AdminBootcamps from "./pages/admin/AdminBootcamps";
import AdminBootcampForm from "./pages/admin/AdminBootcampForm";
import AdminBoard from "./pages/admin/AdminBoard";
import AdminBoardForm from "./pages/admin/AdminBoardForm";
import AdminSponsors from "./pages/admin/AdminSponsors";
import AdminSponsorForm from "./pages/admin/AdminSponsorForm";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:slug" element={<WorkshopDetail />} />
            <Route path="/bootcamps" element={<Bootcamps />} />
            <Route path="/bootcamps/:slug" element={<BootcampDetail />} />
            <Route path="/board" element={<Board />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join" element={<Join />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/events" element={<ProtectedAdminRoute><AdminEvents /></ProtectedAdminRoute>} />
            <Route path="/admin/events/:id" element={<ProtectedAdminRoute><AdminEventForm /></ProtectedAdminRoute>} />
            <Route path="/admin/workshops" element={<ProtectedAdminRoute><AdminWorkshops /></ProtectedAdminRoute>} />
            <Route path="/admin/workshops/:id" element={<ProtectedAdminRoute><AdminWorkshopForm /></ProtectedAdminRoute>} />
            <Route path="/admin/bootcamps" element={<ProtectedAdminRoute><AdminBootcamps /></ProtectedAdminRoute>} />
            <Route path="/admin/bootcamps/:id" element={<ProtectedAdminRoute><AdminBootcampForm /></ProtectedAdminRoute>} />
            <Route path="/admin/board" element={<ProtectedAdminRoute><AdminBoard /></ProtectedAdminRoute>} />
            <Route path="/admin/board/:id" element={<ProtectedAdminRoute><AdminBoardForm /></ProtectedAdminRoute>} />
            <Route path="/admin/sponsors" element={<ProtectedAdminRoute><AdminSponsors /></ProtectedAdminRoute>} />
            <Route path="/admin/sponsors/:id" element={<ProtectedAdminRoute><AdminSponsorForm /></ProtectedAdminRoute>} />
            <Route path="/admin/messages" element={<ProtectedAdminRoute><AdminMessages /></ProtectedAdminRoute>} />
            <Route path="/admin/newsletter" element={<ProtectedAdminRoute><AdminNewsletter /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
