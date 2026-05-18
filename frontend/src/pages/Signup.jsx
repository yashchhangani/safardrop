import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { ShieldCheck, UserPlus } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return setError("Phone number must be exactly 10 digits");
    }

    setIsSubmitting(true);

    try {
      await authService.signup({
        user_name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_no: formData.phone
      });

      alert("Account created. Please login to continue.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-lg border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Join SafarDrop
          </h2>
          <p className="text-slate-500 mt-2">
            Create your account to start booking trips
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <ShieldCheck size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">Phone Number</label>
            <input
              type="tel"
              placeholder="9876543210"
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
