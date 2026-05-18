import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, CalendarClock, CircleAlert, ReceiptText } from "lucide-react";
import { bookingService } from "../services/api";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
        setError("");
      } catch (fetchError) {
        console.error("Failed to load booking:", fetchError);
        setError("Could not load booking details. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="mx-auto mt-10 w-full max-w-4xl px-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl px-4 pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Booking Details</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review your booking summary before continuing to payment.
          </p>
        </div>
        <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          ID #{bookingId}
        </span>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {booking && (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Trip Snapshot</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Trip ID</p>
                <p className="mt-1 font-medium text-slate-800">{booking.tripId}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Booking Status</p>
                <p className="mt-1 font-medium text-slate-800">{booking.status || "PENDING"}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Payment Status</p>
                <p className="mt-1 font-medium text-slate-800">{booking.paymentStatus || "UNPAID"}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Amount</p>
                <p className="mt-1 font-medium text-slate-900">
                  {typeof booking.amount === "number" ? `Rs. ${booking.amount}` : "Not available"}
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Next Step</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-indigo-600" />
                Confirm booking details
              </li>
              <li className="flex items-center gap-2">
                <BadgeIndianRupee className="h-4 w-4 text-indigo-600" />
                Complete payment securely
              </li>
              <li className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-indigo-600" />
                Track updates in My Bookings
              </li>
            </ul>

            <button
              onClick={() => navigate(`/payment/${bookingId}`)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Proceed to Payment
              <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
