import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Package, Ticket } from "lucide-react";
import { getStoredUser, tripService } from "../services/api";
import TripCard from "../components/TripCard";

const SendParcel = () => {
  const [trips, setTrips] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const searchRef = useRef(null);
  const user = getStoredUser();
  const canViewBookings = user?.role === "USER" || user?.role === "ADMIN";

  const fetchAllTrips = async () => {
    const data = await tripService.getAllTrips();
    setTrips(data);
  };

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert("Please enter both cities");
      return;
    }

    const data = await tripService.searchTrips(origin, destination);
    setTrips(data);
  };

  const handleFindRoute = () => {
    fetchAllTrips();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Send Parcel</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">Choose what you want to do</h2>
          <p className="mt-2 text-slate-600">
            Find routes to send your parcel, or open your booking history.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleFindRoute}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Compass size={16} />
              Find Route
            </button>

            {canViewBookings ? (
              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Ticket size={16} />
                My Bookings
              </Link>
            ) : (
              <div className="inline-flex flex-col rounded-lg border border-slate-200 px-4 py-2.5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
                  <Ticket size={16} />
                  My Bookings
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Available in User mode. Use the navbar role switch to become user.
                </span>
              </div>
            )}
          </div>
        </section>

        <section
          ref={searchRef}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="From (e.g Pune)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border border-slate-300 p-3 rounded-lg w-full"
          />

          <input
            type="text"
            placeholder="To (e.g Mumbai)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-slate-300 p-3 rounded-lg w-full"
          />

          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Package size={16} />
            Search
          </button>

          <button
            onClick={fetchAllTrips}
            className="rounded-lg bg-slate-100 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-200"
          >
            Reset
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {trips.length === 0 ? (
            <p className="text-center col-span-2 text-slate-600">No trips found</p>
          ) : (
            trips.map((trip) => <TripCard key={trip.tripId} trip={trip} />)
          )}
        </section>
      </div>
    </div>
  );
};

export default SendParcel;
