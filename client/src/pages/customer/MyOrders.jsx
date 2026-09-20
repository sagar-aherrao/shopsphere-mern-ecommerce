import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        if (!response.success) {
          throw new Error(
            response.message || "Failed to fetch orders"
          );
        }

        setOrders(response.data || []);
      } catch (error) {
        console.error("Get orders error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";

    return `${apiUrl.replace("/api", "")}${image}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Cancelled":
      case "Failed":
        return "bg-red-100 text-red-700";

      case "Processing":
      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Orders
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">
            📦
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            No Orders Yet
          </h1>

          <p className="mt-3 text-gray-500">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}

      <div className="mb-6 text-sm text-gray-500">
        <Link
          to="/"
          className="hover:text-blue-600"
        >
          Home
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          My Orders
        </span>
      </div>

      {/* Page Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Orders
        </h1>

        <p className="mt-2 text-gray-500">
          View and track all your orders.
        </p>
      </div>

      {/* Orders */}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="overflow-hidden rounded-xl bg-white shadow-sm"
          >
            {/* Order Header */}

            <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-gray-500">
                    Order ID
                  </p>

                  <p className="mt-1 font-mono text-xs font-semibold text-gray-900">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Order Date
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Total Amount
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    ₹{formatPrice(order.totalPrice)}
                  </p>
                </div>
              </div>

              <Link
                to={`/order-success/${order._id}`}
                className="rounded-lg border border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                View Order
              </Link>
            </div>

            {/* Order Items */}

            <div className="divide-y">
              {order.orderItems?.map((item, index) => (
                <div
                  key={
                    item.product?._id ||
                    item.product ||
                    `${order._id}-${index}`
                  }
                  className="flex items-center gap-4 p-5"
                >
                  {/* Image */}

                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Product Details */}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹{formatPrice(item.price)} each
                    </p>
                  </div>

                  {/* Item Total */}

                  <p className="whitespace-nowrap font-bold text-gray-900">
                    ₹
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Footer */}

            <div className="flex flex-col gap-4 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  Order: {order.orderStatus}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    order.paymentStatus
                  )}`}
                >
                  Payment: {order.paymentStatus}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {order.paymentMethod}
                </span>
              </div>

              <Link
                to={`/order-success/${order._id}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;