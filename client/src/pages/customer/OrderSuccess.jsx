import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

import { getOrderById } from "../../services/orderService";

const OrderSuccess = () => {
  const { id } = useParams();

  const location = useLocation();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  const [loading, setLoading] = useState(
    !location.state?.order
  );

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getOrderById(id);

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to fetch order"
          );
        }

        setOrder(response.data);
      } catch (error) {
        console.error(
          "Fetch order error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!order) {
      fetchOrder();
    }
  }, [id, order]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">
          Loading your order...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Order
          </h1>

          <p className="mt-3 text-gray-600">
            {error ||
              "Order details could not be found."}
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Success Header */}

      <div className="rounded-2xl bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">
          ✓
        </div>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. We have
          received your order successfully.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Order ID
        </p>

        <p className="mt-1 break-all font-mono font-semibold text-gray-900">
          {order._id}
        </p>
      </div>

      {/* Main Content */}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Items */}

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                Order Items
              </h2>

              <p className="text-sm text-gray-500">
                Ordered on{" "}
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="mt-6 divide-y">
              {order.orderItems?.map(
                (item) => (
                  <div
                    key={
                      item.product?._id ||
                      item.product ||
                      item.name
                    }
                    className="flex gap-4 py-5"
                  >
                    {/* Product Image */}

                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith(
                            "http"
                          )
                            ? item.image
                            : `${import.meta.env.VITE_API_URL?.replace(
                                "/api",
                                ""
                              )}${item.image}`
                        }
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Product Details */}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
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

                    <p className="font-bold text-gray-900">
                      ₹
                      {formatPrice(
                        item.price *
                          item.quantity
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Shipping Address */}

          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Shipping Address
            </h2>

            <div className="mt-4 text-gray-600">
              <p className="font-semibold text-gray-900">
                {
                  order.shippingAddress
                    ?.fullName
                }
              </p>

              <p className="mt-1">
                {
                  order.shippingAddress
                    ?.addressLine1
                }
              </p>

              {order.shippingAddress
                ?.addressLine2 && (
                <p>
                  {
                    order.shippingAddress
                      .addressLine2
                  }
                </p>
              )}

              <p>
                {
                  order.shippingAddress
                    ?.city
                }
                ,{" "}
                {
                  order.shippingAddress
                    ?.state
                }{" "}
                {
                  order.shippingAddress
                    ?.postalCode
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    ?.country
                }
              </p>

              <p className="mt-3">
                Phone:{" "}
                {
                  order.shippingAddress
                    ?.phone
                }
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}

        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Payment Method
                </span>

                <span className="font-medium text-gray-900">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Payment Status
                </span>

                <span className="font-medium text-orange-600">
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Order Status
                </span>

                <span className="font-medium text-blue-600">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t pt-6">
              <div className="flex justify-between text-gray-600">
                <span>
                  Items Total
                </span>

                <span>
                  ₹
                  {formatPrice(
                    order.itemsPrice
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Delivery
                </span>

                <span>
                  {order.shippingPrice === 0
                    ? "FREE"
                    : `₹${formatPrice(
                        order.shippingPrice
                      )}`}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="text-lg font-bold">
                  Total Paid
                </span>

                <span className="text-2xl font-bold">
                  ₹
                  {formatPrice(
                    order.totalPrice
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}

            <div className="mt-8 space-y-3">
              <Link
                to="/products"
                className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Continue Shopping
              </Link>

              <Link
                to="/my-orders"
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;