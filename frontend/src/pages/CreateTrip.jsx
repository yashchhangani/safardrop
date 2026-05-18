import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getStoredUser, tripService } from "../services/api";

const CreateTrip = () => {
  const [data, setData] = useState({
    pickupLocation: "",
    pickupArea: "",
    dropLocation: "",
    dropArea: "",
    travelDate: "",
    capacity: "",
    fare: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser();
  const canCreateTrip = user?.role === "TRAVELLER" || user?.role === "ADMIN";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!canCreateTrip) {
      alert("Only traveller or admin accounts can post trips.");
      setLoading(false);
      return;
    }

    if (
      !data.pickupLocation ||
      !data.pickupArea ||
      !data.dropLocation ||
      !data.dropArea ||
      !data.travelDate ||
      !data.capacity ||
      !data.fare
    ) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    if (Number(data.fare) <= 0) {
      alert("Fare must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      if (!user?.userId) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      const tripData = {
        userId: Number(user.userId),
        origin: data.pickupLocation.trim(),
        pickupArea: data.pickupArea.trim(),
        destination: data.dropLocation.trim(),
        dropArea: data.dropArea.trim(),
        travelDate: data.travelDate,
        capacity: Number(data.capacity),
        fare: Number(data.fare),
        tripStatus: "PENDING"
      };

      await tripService.createTrip(tripData);

      alert("Success! Your route has been posted.");
      navigate("/my-trips");
    } catch (err) {
      alert(err.message || "Failed to post route");
    } finally {
      setLoading(false);
    }
  };

  if (!canCreateTrip) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-4">
        <p className="text-center text-slate-600">
          Only traveller or admin accounts can post routes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-3xl font-black tracking-tight">Post a Delivery Route</h2>
          <p className="text-slate-400 mt-2">Help the community by carrying a parcel on your next journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Origin City"
              value={data.pickupLocation}
              onChange={(e) => setData({ ...data, pickupLocation: e.target.value })}
              className="p-4 border rounded-xl"
            />

            <input
              placeholder="Pickup Area (e.g. Baner)"
              value={data.pickupArea}
              onChange={(e) => setData({ ...data, pickupArea: e.target.value })}
              className="p-4 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Destination City"
              value={data.dropLocation}
              onChange={(e) => setData({ ...data, dropLocation: e.target.value })}
              className="p-4 border rounded-xl"
            />

            <input
              placeholder="Drop Area (e.g. Andheri West)"
              value={data.dropArea}
              onChange={(e) => setData({ ...data, dropArea: e.target.value })}
              className="p-4 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="date"
              value={data.travelDate}
              onChange={(e) => setData({ ...data, travelDate: e.target.value })}
              className="p-4 border rounded-xl"
            />

            <input
              type="number"
              placeholder="Capacity"
              value={data.capacity}
              onChange={(e) => setData({ ...data, capacity: e.target.value })}
              className="p-4 border rounded-xl"
            />
          </div>

          <input
            type="number"
            min="1"
            step="1"
            placeholder="Fare in INR"
            value={data.fare}
            onChange={(e) => setData({ ...data, fare: e.target.value })}
            className="w-full p-4 border rounded-xl"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl"
          >
            {loading ? "Posting..." : "Post Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
