import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { LogIn, Lock, Mail, ShieldCheck, UserCog } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "USER" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await authService.login(formData);

      if (!res.userId) {
        throw new Error("userId not found in response");
      }

      alert(res.message || "Login successful");
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "The email, password, or role you entered is incorrect."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Login as user, traveller, or admin</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <ShieldCheck size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400">ROLE</label>
            <div className="relative">
              <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl"
              >
                <option value="USER">User</option>
                <option value="TRAVELLER">Traveller</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            New user?{" "}
            <Link to="/signup" className="text-blue-600 font-bold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
