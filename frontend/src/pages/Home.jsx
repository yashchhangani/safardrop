import { useState, useEffect } from "react";
import { tripService } from "../services/api";
import TripCard from "../components/TripCard";

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    const data = await tripService.getAllTrips();
    setTrips(data);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      alert("Please enter both cities");
      return;
    }

    const data = await tripService.searchTrips(origin, destination);
    setTrips(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* 🔥 SEARCH BAR */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="From (e.g Pune)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="text"
          placeholder="To (e.g Mumbai)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Search
        </button>

        <button
          onClick={fetchAllTrips}
          className="bg-gray-200 px-6 py-3 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* 🔥 TRIPS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trips.length === 0 ? (
          <p className="text-center col-span-2">No trips found</p>
        ) : (
          trips.map((trip) => (
            <TripCard key={trip.tripId} trip={trip} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;