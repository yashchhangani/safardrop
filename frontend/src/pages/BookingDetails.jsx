import { useParams, useNavigate } from "react-router-dom";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>

      <p>Booking ID: {bookingId}</p>

      <button
        onClick={() => navigate(`/payment/${bookingId}`)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default BookingDetails;