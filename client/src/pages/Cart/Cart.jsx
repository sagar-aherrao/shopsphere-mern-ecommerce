import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../services/api";

const Cart = () => {
  const {
    cartItems,
    totalItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    validateCart,
  } = useCart();

  const cartValidation = validateCart();
  /*
   * Empty cart
   */
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-5 text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Looks like you haven't added anything to
            your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Format currency
   */
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  /*
   * Handle quantity increase
   */
  const increaseQuantity = (item) => {
    if (
      item.stock !== undefined &&
      item.quantity >= item.stock
    ) {
      return;
    }

    updateQuantity(
      item.productId,
      item.quantity + 1
    );
  };

  /*
   * Handle quantity decrease
   */
  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      return;
    }

    updateQuantity(
      item.productId,
      item.quantity - 1
    );
  };

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

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          Cart
        </span>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        <p className="mt-2 text-gray-500">
          {totalItems}{" "}
          {totalItems === 1
            ? "item"
            : "items"}{" "}
          in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {!cartValidation.isValid && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h2 className="font-semibold text-red-800">
              Please review your cart
            </h2>

            <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
              {cartValidation.errors.map(
                (error, index) => (
                  <li key={index}>{error}</li>
                )
              )}
            </ul>
          </div>
        )}
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => {
            const subtotal =
              item.price * item.quantity;

            return (
              <div
                key={item.productId}
                className="rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.productId}`}
                    className="flex h-32 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-32"
                  >
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        No Image
                      </span>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <Link
                          to={`/products/${item.productId}`}
                          className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{formatPrice(item.price)}{" "}
                          per item
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.productId
                          )
                        }
                        className="self-start text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                      {/* Quantity */}
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-600">
                          Quantity
                        </p>

                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item
                              )
                            }
                            disabled={
                              item.quantity <= 1
                            }
                            className="h-10 w-10 rounded-l-lg border border-gray-300 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            −
                          </button>

                          <span className="flex h-10 w-14 items-center justify-center border-y border-gray-300 font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item
                              )
                            }
                            disabled={
                              item.stock !==
                              undefined &&
                              item.quantity >=
                              item.stock
                            }
                            className="h-10 w-10 rounded-r-lg border border-gray-300 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        {item.stock !==
                          undefined && (
                            <p className="mt-1 text-xs text-gray-500">
                              {item.stock} available
                            </p>
                          )}
                      </div>

                      {/* Subtotal */}
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500">
                          Subtotal
                        </p>

                        <p className="text-xl font-bold text-gray-900">
                          ₹{formatPrice(subtotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue Shopping */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Cart Summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>
                  Items
                </span>

                <span>
                  {totalItems}
                </span>
              </div>

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
            </div>

            <div className="mt-6 flex justify-between">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ₹{formatPrice(cartTotal)}
              </span>
            </div>

            {/* Checkout */}
            <Link
              to={
                cartValidation.isValid
                  ? "/checkout"
                  : "#"
              }
              onClick={(event) => {
                if (!cartValidation.isValid) {
                  event.preventDefault();
                }
              }}
              className={`mt-6 block w-full rounded-lg px-6 py-4 text-center font-semibold text-white transition ${cartValidation.isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-400"
                }`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;