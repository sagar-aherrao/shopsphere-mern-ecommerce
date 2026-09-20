import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "shopsphere_cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      if (!storedCart) {
        return [];
      }

      const parsedCart = JSON.parse(storedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  /*
   * Save cart to localStorage
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );

      console.log(
        "Cart saved:",
        cartItems
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems]);

  /*
   * Add product to cart
   */
 const addToCart = (
  product,
  quantity = 1
) => {
  if (!product?._id) {
    console.error(
      "Invalid product:",
      product
    );

    return;
  }

  const requestedQuantity =
    Number(quantity);

  if (
    Number.isNaN(requestedQuantity) ||
    requestedQuantity < 1
  ) {
    return;
  }

  if (
    product.stock !== undefined &&
    product.stock <= 0
  ) {
    console.warn(
      "Product is out of stock:",
      product.name
    );

    return;
  }

  setCartItems((currentItems) => {
    const existingItem =
      currentItems.find(
        (item) =>
          item.productId === product._id
      );

    if (existingItem) {
      const requestedTotal =
        existingItem.quantity +
        requestedQuantity;

      const finalQuantity =
        product.stock !== undefined
          ? Math.min(
              requestedTotal,
              product.stock
            )
          : requestedTotal;

      return currentItems.map((item) =>
        item.productId === product._id
          ? {
              ...item,
              quantity: finalQuantity,
              stock: product.stock,
            }
          : item
      );
    }

    const finalQuantity =
      product.stock !== undefined
        ? Math.min(
            requestedQuantity,
            product.stock
          )
        : requestedQuantity;

    return [
      ...currentItems,
      {
        productId: product._id,
        name: product.name,
        price: Number(product.price || 0),
        image:
          product.images?.[0] || null,
        quantity: finalQuantity,
        stock: product.stock,
      },
    ];
  });
};

  /*
   * Remove product
   */
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  /*
   * Update quantity
   */
 const updateQuantity = (
  productId,
  quantity
) => {
  setCartItems((currentItems) =>
    currentItems.map((item) => {
      if (item.productId !== productId) {
        return item;
      }

      const requestedQuantity =
        Number(quantity);

      if (
        Number.isNaN(requestedQuantity) ||
        requestedQuantity < 1
      ) {
        return item;
      }

      const maxQuantity =
        item.stock !== undefined
          ? item.stock
          : requestedQuantity;

      return {
        ...item,
        quantity: Math.min(
          requestedQuantity,
          maxQuantity
        ),
      };
    })
  );
};

  const validateCart = () => {
  const errors = [];

  cartItems.forEach((item) => {
    if (!item.productId) {
      errors.push(
        `${item.name || "Product"} has an invalid product ID.`
      );
    }

    if (item.quantity <= 0) {
      errors.push(
        `${item.name || "Product"} has an invalid quantity.`
      );
    }

    if (
      item.stock !== undefined &&
      item.quantity > item.stock
    ) {
      errors.push(
        `${item.name} has only ${item.stock} item(s) available.`
      );
    }

    if (
      item.price === undefined ||
      Number(item.price) < 0
    ) {
      errors.push(
        `${item.name || "Product"} has an invalid price.`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

  /*
   * Clear cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /*
   * Total number of items
   */
  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  /*
   * Cart total
   */
  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    validateCart,
    clearCart,
    totalItems,
    cartTotal,
  };

  console.log("CartProvider cartItems:", cartItems);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};