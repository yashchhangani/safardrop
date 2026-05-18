import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import heroImage from "../assets/hero.png";
import { getStoredUser, userService } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const role = user?.role || "USER";
  const canCreateTrips = role === "TRAVELLER" || role === "ADMIN";
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [toast, setToast] = useState(null);

  const featureCards = useMemo(
    () => [
      {
        key: "send-parcel",
        title: "Send a Parcel",
        description: "Ship your items safely using verified travellers.",
        to: "/send-parcel"
      },
      {
        key: "earn-travelling",
        title: "Earn by Travelling",
        description: "List your journey and earn by carrying parcels.",
        helperText: canCreateTrips ? "" : "Switch to traveller to post route.",
        to: "/create-trip"
      }
    ],
    [canCreateTrips]
  );

  const handleEarnByTravellingClick = async (event) => {
    event.preventDefault();

    if (canCreateTrips) {
      navigate("/create-trip");
      return;
    }

    if (!user?.userId) {
      navigate("/login");
      return;
    }

    setShowSwitchModal(true);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleConfirmRoleSwitch = async () => {
    if (!user?.userId || isSwitchingRole) {
      return;
    }

    try {
      setIsSwitchingRole(true);
      await userService.switchOwnRole(user.userId, "TRAVELLER");
      setShowSwitchModal(false);
      showToast("Switched to traveller. You can now post a route.");
      navigate("/create-trip");
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Failed to switch role.", "error");
    } finally {
      setIsSwitchingRole(false);
    }
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 space-y-8">
        <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-7 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Welcome</p>
              <h2 className="mt-1 text-3xl font-black text-slate-900">
                {user?.userName || "User"}
              </h2>
            </div>
            <Link
              to={canCreateTrips ? "/notifications" : "/home"}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Bell size={20} />
              {canCreateTrips && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </Link>
          </div>
          <h3 className="mt-6 text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            How can we help you today?
          </h3>
        </section>

        <section className="space-y-4">
          {featureCards.map((card) => (
            <Link
              key={card.key}
              to={card.to}
              onClick={card.key === "earn-travelling" ? handleEarnByTravellingClick : undefined}
              className="grid grid-cols-1 md:grid-cols-[240px_1fr] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-52 md:h-full">
                <img
                  src={heroImage}
                  alt={card.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-3xl font-black text-slate-900">{card.title}</h4>
                  <p className="mt-2 text-xl text-slate-600 max-w-xl">{card.description}</p>
                  {card.helperText && (
                    <p className="mt-2 text-sm font-semibold text-amber-700">{card.helperText}</p>
                  )}
                </div>
                <div className="mt-6 flex justify-end text-blue-600">
                  <ArrowRight size={34} />
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <img
              src={heroImage}
              alt="Safe delivery"
              className="mx-auto h-36 w-36 rounded-xl object-cover"
            />
            <p className="mt-5 text-2xl text-slate-700 leading-relaxed">
              We ensure the safest delivery of your packages, providing hand-to-hand service for complete peace of mind.
            </p>
          </div>
        </section>
      </div>

      {showSwitchModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h4 className="text-xl font-black text-slate-900">Switch to Traveller?</h4>
            <p className="mt-2 text-slate-600">
              Post Route is available for traveller accounts. Do you want to switch your role now?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowSwitchModal(false)}
                disabled={isSwitchingRole}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleSwitch}
                disabled={isSwitchingRole}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSwitchingRole ? "Switching..." : "Switch Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[70]">
          <div
            className={`rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.type === "error" ? "bg-red-600 text-white" : "bg-slate-900 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
