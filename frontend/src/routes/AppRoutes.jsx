import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import ExploreHostels from "../pages/hostel/ExploreHostels";
import AddHostel from "../pages/owner/AddHostel";
import AddRoom from "../pages/owner/AddRoom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/student/StudentDashboard";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import HostelDetails from "../pages/hostel/HostelDetails";
import Booking from "../pages/booking/Booking";
import BookingHistory from "../pages/booking/BookingHistory";
import Profile from "../pages/profile/Profile";
import Favorites from "../pages/student/Favorites";
import AIRecommendation from "../pages/AIRecommendation";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageHostels from "../pages/admin/ManageHostels";
import NotFound from "../pages/NotFound";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/hostels" element={<ExploreHostels />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/owner/dashboard"
          element={<OwnerDashboard />}
        />

        <Route
          path="/hostel/:id"
          element={<HostelDetails />}
        />

        <Route
          path="/booking/:roomId"
          element={<Booking />}
        />

        <Route
          path="/my-bookings"
          element={<BookingHistory />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<ManageUsers />}
        />

        <Route
          path="/admin/hostels"
          element={<ManageHostels />}
        />
        <Route
          path="/owner/add-hostel"
          element={<AddHostel />}
        />

        <Route
          path="/owner/hostels/:id/add-room"
          element={<AddRoom />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/ai"
          element={<AIRecommendation />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default AppRoutes;