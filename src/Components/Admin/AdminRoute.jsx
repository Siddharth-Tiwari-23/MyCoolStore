import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toggleDemoRole } from "../../services/authService";

function AdminRoute({ children }) {
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState(false);
  const token = localStorage.getItem("token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    const handleAuthorize = async () => {
      setUpgrading(true);
      try {
        const res = await toggleDemoRole();
        if (res.success && res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
          window.location.reload();
        }
      } catch {
        alert("Failed to authorize admin session.");
      } finally {
        setUpgrading(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Portal Access</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            This area is restricted to authorized store administrators. You are currently logged in as{" "}
            <span className="font-semibold text-slate-700">{user?.email}</span> ({user?.role || "user"}).
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAuthorize}
              disabled={upgrading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md disabled:opacity-50"
            >
              {upgrading ? "Verifying..." : "Authorize as Administrator"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
