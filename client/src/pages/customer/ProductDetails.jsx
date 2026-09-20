import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProduct } from "../../services/productService";
import { getImageUrl } from "../../services/api";

import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProduct(id);

      if (!response.success) {
        setError(
          response.message ||
          "Failed to load product"
        );

        return;
      }

      const productData = response.data;

      setProduct(productData);

      if (productData.images?.length > 0) {
        setSelectedImage(productData.images[0]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (
      product?.stock !== undefined &&
      quantity >= product.stock
    ) {
      return;
    }

    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const handleAddToCart = () => {
    console.log(
      "Product being added:",
      product
    );

    console.log(
      "Selected quantity:",
      quantity
    );

    if (!product) {
      console.error(
        "Product is not available"
      );

      return;
    }

    addToCart(product, quantity);

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  };

  /* Loading */
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid animate-pulse grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="h-[500px] rounded-xl bg-gray-200" />

            <div className="mt-4 flex gap-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-20 w-20 rounded-lg bg-gray-200"
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/4 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-12 w-48 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-xl bg-red-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-700">
            Product Not Found
          </h1>

          <p className="mt-2 text-red-600">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images || [];

  const isInStock =
    product.stock === undefined ||
    product.stock > 0;

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

        <Link
          to="/products"
          className="hover:text-blue-600"
        >
          Products
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          {product.name}
        </span>
      </div>

      {/* Product */}
      <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="flex h-[400px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 md:h-[500px]">
            {selectedImage ? (
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-gray-400">
                No Image Available
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === image
                      ? "border-blue-600"
                      : "border-gray-200"
                    }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          {/* Category */}
          {product.category?.name && (
            <Link
              to={`/categories/${product.category._id}`}
              className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-5">
            <span className="text-3xl font-bold text-gray-900">
              ₹
              {Number(
                product.price || 0
              ).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Stock */}
          <div className="mt-4">
            {isInStock ? (
              <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                In Stock
                {product.stock !== undefined &&
                  ` (${product.stock} available)`}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                Description
              </h2>

              <p className="whitespace-pre-line leading-7 text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity */}
          {isInStock && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Quantity
              </label>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="h-11 w-11 rounded-l-lg border border-gray-300 text-xl hover:bg-gray-100"
                >
                  −
                </button>

                <span className="flex h-11 w-14 items-center justify-center border-y border-gray-300 font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="h-11 w-11 rounded-r-lg border border-gray-300 text-xl hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8">
            <button
              type="button"
              disabled={!isInStock}
              onClick={handleAddToCart}
              className={`w-full rounded-lg px-6 py-4 text-lg font-semibold text-white ${isInStock
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-400"
                }`}
            >
              {isInStock
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
        </div>
      </div>
    </div>
    </div >
  );
};

export default ProductDetails;