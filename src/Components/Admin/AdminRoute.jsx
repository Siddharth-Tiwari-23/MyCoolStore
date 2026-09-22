import { Navigate, useNavigate } from "react-router-dom";

function AdminRoute({ children }) {
  const navigate = useNavigate();
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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            🚫
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Access Denied (403)</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            The administrator dashboard is strictly restricted to designated store administrators. You are currently authenticated as{" "}
            <span className="font-semibold text-slate-700">{user?.email || "anonymous"}</span> (role: {user?.role || "user"}).
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm shadow-md"
          >
            ← Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
