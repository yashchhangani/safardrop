// src/pages/CreateTrip.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';
import { MapPin, Calendar, Weight, Send, ArrowLeft } from 'lucide-react';

const CreateTrip = () => {
  const [data, setData] = useState({
    pickupLocation: '',
    dropLocation: '',
    travelDate: '',
    capacity: '',
    userId: 1
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields before sending
    if (!data.pickupLocation || !data.dropLocation || !data.travelDate || !data.capacity) {
      alert("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting payload:", data); // Debug
      await tripService.createTrip(data);
      alert("Success! Your route has been posted.");
      navigate('/my-trips');
    } catch (err) {
      console.error("Create trip error:", err);
      alert(`Failed to post route: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" /> Origin City
              </label>
              <input
                placeholder="e.g. Nagpur"
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.pickupLocation}
                onChange={e => setData({...data, pickupLocation: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin size={14} className="text-red-500" /> Destination City
              </label>
              <input
                placeholder="e.g. Shegaon"
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.dropLocation}
                onChange={e => setData({...data, dropLocation: e.target.value})}
              />
            </div>
          </div>

          {/* Travel Date & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Calendar size={14} className="text-blue-500" /> Travel Date
              </label>
              <input
                type="date"
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.travelDate}
                onChange={e => setData({...data, travelDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Weight size={14} className="text-blue-500" /> Available Capacity (kg)
              </label>
              <input
                type="number"
                placeholder="e.g. 6"
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.capacity}
                onChange={e => setData({...data, capacity: parseInt(e.target.value)})}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? "Publishing Route..." : "Post Route"}
              {!loading && <Send size={20} />}
            </button>
            <p className="text-center text-slate-400 text-xs mt-4">
              By posting, you agree to SafarDrop's community safety guidelines.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;