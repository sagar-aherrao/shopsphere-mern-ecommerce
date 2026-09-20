import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${isActive
      ? "text-blue-600"
      : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          ShopSphere
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/categories"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Categories
          </Link>

          <Link
            to="/products"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Cart
          </Link>

          {/* Logged-in User */}
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/profile"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Profile
              </Link>

              <Link
                to="/my-orders"
                className="text-gray-700 transition hover:text-blue-600"
              >
                My Orders
              </Link>

              <Link
                to="/addresses"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Addresses
              </Link>
            </>
          )}

          {/* Admin */}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className="font-medium text-gray-700 transition hover:text-blue-600"
            >
              Admin CMS
            </Link>
          )}

          {/* Guest */}
          {/* {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Register
              </Link>
            </>
          )} */}

          {/* Logged-in */}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="text-gray-700 transition hover:text-red-600"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="font-medium text-gray-700 hover:text-blue-600"
              >
                {user?.name}
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;