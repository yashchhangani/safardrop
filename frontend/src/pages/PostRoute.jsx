// src/pages/PostRoute.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';

const PostRoute = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    origin: '',
    destination: '',
    travelDate: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tripService.createTrip(trip);
      setLoading(false);
      alert("Trip posted successfully!");
      navigate('/'); // redirect to Home or Trips list
    } catch (error) {
      setLoading(false);
      alert("Failed to post trip. Check console for errors.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Post a Delivery Route</h2>
      <p className="text-slate-500 mb-6 text-sm">
        Help the community by carrying a parcel on your next journey.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="origin"
          placeholder="Origin City e.g. Mumbai"
          value={trip.origin}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination City e.g. Pune"
          value={trip.destination}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />
        <input
          type="date"
          name="travelDate"
          value={trip.travelDate}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Available Capacity (kg)"
          value={trip.capacity}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Route"}
        </button>
      </form>
      <p className="text-xs text-slate-400 mt-4">
        By posting, you agree to SafarDrop's community safety guidelines.
      </p>
    </div>
  );
};

export default PostRoute;