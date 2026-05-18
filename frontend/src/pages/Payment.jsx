import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, BadgeIndianRupee, CircleAlert, CreditCard, ShieldCheck } from "lucide-react";
import { bookingService, getStoredUser, paymentService } from "../services/api";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isDemoMode = (import.meta.env.VITE_PAYMENT_DEMO_MODE ?? "false") === "true";

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
        setError("");
      } catch (loadError) {
        console.error("Failed to load booking:", loadError);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleLivePayment = async () => {
    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      setError("Razorpay SDK failed to load.");
      return;
    }

    const user = getStoredUser();
    const order = await paymentService.createOrder(Number(bookingId));

    const options = {
      key: order.key,
      amount: order.amount,
      currency: "INR",
      name: "SafarDrop",
      description: "Trip Booking Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifiedBooking = await paymentService.verifyPayment({
            bookingId: Number(bookingId),
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          alert("Payment successful. Booking confirmed.");
          navigate(`/pickup-map/${bookingId}`, { state: { booking: verifiedBooking } });
        } catch (verificationError) {
          setError(verificationError.message || "Payment verification failed.");
        }
      },
      prefill: {
        name: user?.userName || "SafarDrop User",
        email: user?.email || "test@gmail.com"
      },
      theme: {
        color: "#4f46e5"
      },
      modal: {
        ondismiss: () => setIsProcessing(false)
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    setError("");
    setIsProcessing(true);

    try {
      if (!booking?.amount) {
        setError("Booking amount is missing. Create a booking with a valid fare first.");
        return;
      }

      if (isDemoMode) {
        const paidBooking = await paymentService.completeDemoPayment(Number(bookingId));
        alert(
          booking?.paymentStatus === "PAID"
            ? "Traveller notification synced successfully."
            : "Demo payment successful. Traveller notification has been sent."
        );
        navigate(`/pickup-map/${bookingId}`, { state: { booking: paidBooking } });
        return;
      }

      await handleLivePayment();
    } catch (paymentError) {
      console.error("Payment Error:", paymentError);
      setError(paymentError.message || "Payment could not be started.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isPaid = booking?.paymentStatus === "PAID";
  const isActionDisabled = !booking || isProcessing || (isPaid && !isDemoMode);

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-4 pb-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Complete Payment</h1>
          <p className="mt-1 text-sm text-slate-600">
            Confirm this booking by completing payment securely.
          </p>
        </div>
        <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          Booking #{bookingId}
        </span>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          {isDemoMode
            ? "Demo mode: payment button will mark booking as paid and send traveller notification."
            : "Live mode: Razorpay checkout will open for secure payment."}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          Payment status: <span className="font-semibold text-slate-900">{booking?.paymentStatus || "UNPAID"}</span>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Order Summary</h2>

          {loading ? (
            <p className="mt-5 text-sm text-slate-600">Loading payment details...</p>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-4">
                <span className="text-sm text-slate-600">Booking ID</span>
                <span className="text-sm font-medium text-slate-900">{bookingId}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-4">
                <span className="text-sm text-slate-600">Trip ID</span>
                <span className="text-sm font-medium text-slate-900">{booking?.tripId || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-4">
                <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <BadgeIndianRupee className="h-4 w-4" />
                  Amount to pay
                </span>
                <span className="text-lg font-semibold text-slate-900">
                  {typeof booking?.amount === "number" ? `Rs. ${booking.amount}` : "N/A"}
                </span>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Secure Checkout</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Multiple payment options
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Encrypted transaction flow
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-indigo-600" />
              Instant booking confirmation
            </li>
          </ul>

          {isPaid && (
            <p className="mt-5 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              This booking is already paid and confirmed.
            </p>
          )}

          <button
            onClick={handlePayment}
            disabled={isActionDisabled}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isProcessing
              ? "Processing..."
              : isPaid && isDemoMode
                ? "Sync Traveller Notification"
                : isDemoMode
                  ? "Pay Now (Demo)"
                  : "Pay Now"}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Payment;
