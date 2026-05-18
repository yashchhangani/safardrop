import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { bookingService } from "../services/api";

const PickupMap = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
        setError("");
      } catch (loadError) {
        console.error("Failed to load booking for pickup map:", loadError);
        if (!location.state?.booking) {
          setError("Could not load pickup location details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, location.state]);

  const pickupLabel = [booking?.pickupArea, booking?.origin].filter(Boolean).join(", ");
  const dropLabel = [booking?.dropArea, booking?.destination].filter(Boolean).join(", ");

  const pickupQuery = pickupLabel ? encodeURIComponent(pickupLabel) : "";
  const destinationQuery = dropLabel ? encodeURIComponent(dropLabel) : "";

  const mapUrl = pickupQuery
    ? `https://maps.google.com/maps?q=${pickupQuery}&z=14&output=embed`
    : "";

  const directionsUrl =
    pickupQuery && destinationQuery
      ? `https://www.google.com/maps/dir/?api=1&origin=${pickupQuery}&destination=${destinationQuery}`
      : "";

  if (loading) {
    return <p className="mt-12 text-center text-slate-600">Loading pickup location...</p>;
  }

  if (error) {
    return <p className="mt-12 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-4 pb-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Pickup Location Map</h1>
          <p className="mt-1 text-sm text-slate-600">
            Shared with both customer and traveller after payment confirmation.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Travel Date</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{booking?.travelDate || "N/A"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Pickup</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{pickupLabel || "N/A"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Drop</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{dropLabel || "N/A"}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {mapUrl ? (
          <iframe
            title="Pickup location map"
            src={mapUrl}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-[420px] items-center justify-center bg-slate-50 px-4 text-center text-sm text-slate-600">
            Pickup location is not available for this booking yet.
          </div>
        )}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-3">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Open Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupMap;
