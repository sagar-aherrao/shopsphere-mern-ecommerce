import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCategory } from "../../services/categoryService";
import { getProducts } from "../../services/productService";
import ProductCard from "../../pages/customer/ProductCard";

const CategoryProducts = () => {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategoryProducts();
  }, [id]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError("");

      // Get category information
      const categoryResponse = await getCategory(id);

      if (!categoryResponse.success) {
        setError(
          categoryResponse.message ||
            "Failed to load category"
        );

        return;
      }

      setCategory(categoryResponse.data);

      // Get products
      const productsResponse = await getProducts({
        category: id,
      });

      if (!productsResponse.success) {
        setError(
          productsResponse.message ||
            "Failed to load products"
        );

        return;
      }

      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch category products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load category products"
      );
    } finally {
      setLoading(false);
    }
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

        <Link
          to="/categories"
          className="hover:text-blue-600"
        >
          Categories
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          {category?.name || "Category"}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div>
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-96 rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="h-56 bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-6 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            Something went wrong
          </h2>

          <p className="mt-2 text-red-600">
            {error}
          </p>

          <button
            onClick={fetchCategoryProducts}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Category Content */}
      {!loading && !error && category && (
        <>
          {/* Category Header */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold md:text-4xl">
              {category.name}
            </h1>

            {category.description && (
              <p className="mt-3 max-w-2xl text-blue-100">
                {category.description}
              </p>
            )}

            <p className="mt-4 text-sm text-blue-100">
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </p>
          </div>

          {/* Empty */}
          {products.length === 0 && (
            <div className="rounded-xl bg-gray-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                No Products Found
              </h2>

              <p className="mt-2 text-gray-500">
                There are currently no products in this
                category.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Browse All Products
              </Link>
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryProducts;