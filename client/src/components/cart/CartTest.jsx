import { useCart } from "../../context/CartContext";

const CartTest = () => {
  const {
    cartItems,
    totalItems,
    cartTotal,
    clearCart,
  } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        Cart Test
      </h1>

      <p className="mt-4">
        Total Items: {totalItems}
      </p>

      <p>
        Cart Total: ₹
        {cartTotal.toLocaleString("en-IN")}
      </p>

      <pre className="mt-5 overflow-auto rounded-lg bg-gray-100 p-4">
        {JSON.stringify(
          cartItems,
          null,
          2
        )}
      </pre>

      <button
        onClick={clearCart}
        className="mt-5 rounded-lg bg-red-600 px-5 py-2 text-white"
      >
        Clear Cart
      </button>
    </div>
  );
};

export default CartTest;