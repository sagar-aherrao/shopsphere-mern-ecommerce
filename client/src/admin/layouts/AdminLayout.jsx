import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 bg-white shadow-md md:block">
          <div className="border-b px-6 py-5">
            <h1 className="text-xl font-bold text-blue-600">
              Ecommerce CMS
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

          <nav className="space-y-2 p-4">

            <NavLink
              to="/admin"
              end
              className={linkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={linkClass}
            >
              Categories
            </NavLink>

            <NavLink
              to="/admin/products"
              className={linkClass}
            >
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>

          </nav>

          <div className="absolute bottom-0 w-64 border-t p-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">

          {/* Header */}
          <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Admin Panel
              </h2>
            </div>

            <div className="text-sm text-gray-600">
              Admin
            </div>
          </header>

          {/* Page */}
          <div className="p-6">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminLayout;