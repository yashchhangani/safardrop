import { useEffect, useState } from "react";
import { bookingService, tripService, userService } from "../services/api";

const ROLE_OPTIONS = ["USER", "TRAVELLER", "ADMIN"];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersData, tripsData, bookingsData] = await Promise.all([
        userService.getAllUsers(),
        tripService.getAllTrips(),
        bookingService.getAllBookings()
      ]);

      setUsers(usersData || []);
      setTrips(tripsData || []);
      setBookings(bookingsData || []);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
      setError(err.response?.data?.message || err.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingUserId(userId);
      await userService.updateUserRole(userId, role);
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.user_id === userId ? { ...user, role } : user))
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-12 text-slate-600">Loading admin dashboard...</p>;
  }

  if (error) {
    return <p className="text-center mt-12 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto my-10 p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage users, trips, and bookings from one place.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Trips</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{trips.length}</p>
        </div>
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{bookings.length}</p>
        </div>
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-slate-900">{user.user_name}</td>
                  <td className="py-3 pr-4 text-slate-600">{user.email}</td>
                  <td className="py-3 pr-4 text-slate-600">{user.phone_no}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={user.role}
                      disabled={updatingUserId === user.user_id}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      className="border rounded-lg px-3 py-2 bg-white"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Trips</h2>
        <div className="grid gap-4">
          {trips.map((trip) => (
            <div key={trip.tripId} className="border rounded-xl p-4">
              <p className="font-semibold text-slate-900">
                {trip.origin} to {trip.destination}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Traveller: {trip.ownerName} | Date: {trip.travelDate} | Fare: Rs. {trip.fare}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="border rounded-xl p-4">
              <p className="font-semibold text-slate-900">
                Booking #{booking.bookingId}: {booking.origin} to {booking.destination}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                User: {booking.customerName} | Traveller: {booking.tripOwnerName}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Status: {booking.status} | Payment: {booking.paymentStatus} | Amount: Rs. {booking.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
