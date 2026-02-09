import { Routes, Route } from "react-router-dom";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";

// Admin pages
import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminEvents from "../../pages/admin/AdminEvents";
import AdminEventForm from "../../pages/admin/AdminEventForm";
import AdminWorkshops from "../../pages/admin/AdminWorkshops";
import AdminWorkshopForm from "../../pages/admin/AdminWorkshopForm";
import AdminBootcamps from "../../pages/admin/AdminBootcamps";
import AdminBootcampForm from "../../pages/admin/AdminBootcampForm";
import AdminBoard from "../../pages/admin/AdminBoard";
import AdminBoardForm from "../../pages/admin/AdminBoardForm";
import AdminSponsors from "../../pages/admin/AdminSponsors";
import AdminSponsorForm from "../../pages/admin/AdminSponsorForm";
import AdminMessages from "../../pages/admin/AdminMessages";
import AdminNewsletter from "../../pages/admin/AdminNewsletter";
import AdminSettings from "../../pages/admin/AdminSettings";

export function AdminRoutes() {
  return (
    <ProtectedAdminRoute>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/events/:id" element={<AdminEventForm />} />
        <Route path="/admin/workshops" element={<AdminWorkshops />} />
        <Route path="/admin/workshops/:id" element={<AdminWorkshopForm />} />
        <Route path="/admin/bootcamps" element={<AdminBootcamps />} />
        <Route path="/admin/bootcamps/:id" element={<AdminBootcampForm />} />
        <Route path="/admin/board" element={<AdminBoard />} />
        <Route path="/admin/board/:id" element={<AdminBoardForm />} />
        <Route path="/admin/sponsors" element={<AdminSponsors />} />
        <Route path="/admin/sponsors/:id" element={<AdminSponsorForm />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </ProtectedAdminRoute>
  );
}
