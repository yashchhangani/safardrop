import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Navigation, Package } from "lucide-react";
import { bookingService, getStoredUser } from "../services/api";

const TripCard = ({ trip }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser();
  const canAcceptRide = Number(trip.fare) > 0;
  const canBookTrip = user?.role === "USER" || user?.role === "ADMIN";
  const isOwnTrip = Number(user?.userId) === Number(trip.userId);

  const handleAcceptRide = async () => {
    if (!user) {
      alert("Please login to accept a ride.");
      return;
    }

    if (!canBookTrip) {
      alert("Only user or admin accounts can book trips.");
      return;
    }

    if (isOwnTrip) {
      alert("You cannot book your own trip.");
      return;
    }

    const tripId = trip.tripId;

    if (!tripId) {
      alert("Trip ID missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await bookingService.createBooking({
        tripId,
        customerId: user.userId,
        amount: trip.fare || 0
      });

      navigate(`/booking/${response.bookingId}`);
    } catch (err) {
      alert(err.message || "Failed to accept ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400">From</p>
          <p className="font-bold flex items-center gap-1">
            <MapPin size={14} /> {trip.origin}
          </p>
          {trip.pickupArea && <p className="text-xs text-slate-500 mt-1">{trip.pickupArea}</p>}
        </div>

        <ArrowRight />

        <div>
          <p className="text-xs text-gray-400">To</p>
          <p className="font-bold flex items-center gap-1">
            {trip.destination} <Navigation size={14} />
          </p>
          {trip.dropArea && <p className="text-xs text-slate-500 mt-1">{trip.dropArea}</p>}
        </div>
      </div>

      <div className="flex justify-between mb-4 text-sm">
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {trip.travelDate}
        </span>

        <span className="flex items-center gap-1 text-green-600">
          <Package size={14} /> {trip.capacity} kg
        </span>
      </div>

      <p className="mb-2 text-sm font-semibold text-slate-700">
        Fare: Rs. {trip.fare ?? 0}
      </p>

      <p className="mb-4 text-sm text-slate-500">
        Posted by: <span className="font-semibold text-slate-700">{trip.ownerName || "Traveller"}</span>
      </p>

      {!canAcceptRide && (
        <p className="mb-4 text-sm text-amber-700">
          This trip cannot be booked until a fare greater than 0 is set.
        </p>
      )}

      {user && !canBookTrip && (
        <p className="mb-4 text-sm text-slate-500">
          Traveller accounts can post routes. User accounts can book and pay.
        </p>
      )}

      <button
        onClick={handleAcceptRide}
        disabled={loading || !canAcceptRide || (user && (!canBookTrip || isOwnTrip))}
        className={`w-full py-2 rounded-lg mb-2 ${
          canAcceptRide && (!user || (canBookTrip && !isOwnTrip))
            ? "bg-blue-600 text-white"
            : "bg-slate-200 text-slate-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : "Accept Ride"}
      </button>

      <Link to={`/trip/${trip.tripId}`}>
        <button className="w-full bg-gray-200 py-2 rounded-lg">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default TripCard;
