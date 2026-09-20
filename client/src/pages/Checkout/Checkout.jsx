import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../features/auth/AuthContext";
import { createOrder } from "../../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    cartTotal,
    clearCart,
    validateCart,
  } = useCart();

  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Handle input changes
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Create order
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    /*
    |--------------------------------------------------------------------------
    | Check authentication
    |--------------------------------------------------------------------------
    */

    if (!user) {
      navigate("/login");

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Check cart
    |--------------------------------------------------------------------------
    */

    if (!cartItems.length) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate cart
    |--------------------------------------------------------------------------
    */

    const validation =
      validateCart();

    if (!validation.isValid) {
      setError(
        validation.errors.join(" ")
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare order data
    |--------------------------------------------------------------------------
    */

    const orderData = {
      items: cartItems.map(
        (item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })
      ),

      shippingAddress: formData,

      paymentMethod,
    };

    try {
      setLoading(true);

      const response =
        await createOrder(orderData);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to create order"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Clear cart after successful order
      |--------------------------------------------------------------------------
      */

      clearCart();

      /*
      |--------------------------------------------------------------------------
      | Navigate to order confirmation
      |--------------------------------------------------------------------------
      */

      navigate(
        `/order-success/${response.data._id}`,
        {
          state: {
            order: response.data,
          },
        }
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Empty cart
  |--------------------------------------------------------------------------
  */

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">
            🛒
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add products to your cart before
            proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not logged in
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-3 text-gray-500">
            Please login to continue with
            checkout.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}

      <div className="mb-6 text-sm text-gray-500">
        <Link
          to="/"
          className="hover:text-blue-600"
        >
          Home
        </Link>

        <span className="mx-2">
          /
        </span>

        <Link
          to="/cart"
          className="hover:text-blue-600"
        >
          Cart
        </Link>

        <span className="mx-2">
          /
        </span>

        <span className="text-gray-800">
          Checkout
        </span>
      </div>

      {/* Title */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <p className="mt-2 text-gray-500">
          Complete your shipping details and
          place your order.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        {/* Left Side */}

        <div className="space-y-8 lg:col-span-2">
          {/* Shipping Address */}

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Shipping Address
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Full Name */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Country */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Address Line 1 */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <input
                  type="text"
                  name="addressLine1"
                  value={
                    formData.addressLine1
                  }
                  onChange={handleChange}
                  required
                  placeholder="House number, street, area"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Address Line 2 */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Apartment / Landmark
                  <span className="ml-1 text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  name="addressLine2"
                  value={
                    formData.addressLine2
                  }
                  onChange={handleChange}
                  placeholder="Apartment, landmark, etc."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* City */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* State */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Postal Code */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={handleChange}
                  required
                  placeholder="Enter postal code"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Payment Method
            </h2>

            <div className="mt-6 space-y-4">
              {/* COD */}

              <label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition hover:border-blue-400">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={
                    paymentMethod === "COD"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>
                  <p className="font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your order is
                    delivered.
                  </p>
                </div>
              </label>

              {/* Razorpay */}

              <label className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition hover:border-blue-400">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={
                    paymentMethod ===
                    "RAZORPAY"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>
                  <p className="font-semibold text-gray-900">
                    Razorpay
                  </p>

                  <p className="text-sm text-gray-500">
                    Online payment integration
                    will be completed in the next
                    phase.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}

        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </p>

            {/* Products */}

            <div className="mt-6 max-h-80 space-y-4 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹
                      {formatPrice(
                        item.price
                      )}{" "}
                      × {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-semibold text-gray-900">
                    ₹
                    {formatPrice(
                      item.price *
                        item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Summary */}

            <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal
                </span>

                <span>
                  ₹{formatPrice(cartTotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Delivery
                </span>

                <span className="font-medium text-green-600">
                  FREE
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  ₹{formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Place Order */}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Placing Order..."
                : paymentMethod === "COD"
                  ? "Place Order"
                  : "Proceed to Payment"}
            </button>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;