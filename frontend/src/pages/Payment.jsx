import { useParams } from "react-router-dom";

const Payment = () => {
  const { bookingId } = useParams();

  const handlePayment = () => {

    const options = {
      key: "rzp_test_1234567890", // 🔴 replace with your real test key
      amount: 500 * 100, // ₹500 (in paise)
      currency: "INR",
      name: "SafarDrop",
      description: "Trip Booking Payment",
      handler: function (response) {
        alert("Payment Successful ✅");
        console.log("PAYMENT RESPONSE 👉", response);
      },
      prefill: {
        name: "Yash",
        email: "test@gmail.com"
      },
      theme: {
        color: "#2563eb"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payment Page</h1>

      <p className="mt-2">Booking ID: {bookingId}</p>

      <button
        onClick={handlePayment}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;