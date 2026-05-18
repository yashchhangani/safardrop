import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import BookingDetails from "./pages/BookingDetails";
import CreateTrip from "./pages/CreateTrip";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import MyTrips from "./pages/MyTrips";
import Notifications from "./pages/Notifications";
import Payment from "./pages/Payment";
import PickupMap from "./pages/PickupMap";
import SendParcel from "./pages/SendParcel";
import Signup from "./pages/Signup";
import TripDetails from "./pages/TripDetails";
import { getStoredUser } from "./services/api";

export default function App() {
  const isLoggedIn = !!getStoredUser();

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trip/:id" element={<TripDetails />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/send-parcel"
          element={
            <ProtectedRoute>
              <SendParcel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-trip"
          element={
            <ProtectedRoute allowedRoles={["TRAVELLER", "ADMIN"]}>
              <CreateTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-trips"
          element={
            <ProtectedRoute allowedRoles={["TRAVELLER", "ADMIN"]}>
              <MyTrips />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["TRAVELLER", "ADMIN"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <BookingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pickup-map/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["USER", "TRAVELLER", "ADMIN"]}>
              <PickupMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
      </Routes>
    </>
  );
}
