import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCategories } from "../../services/categoryService";
import { getImageUrl } from "../../services/api";

const FrontCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError(response.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Shop by Categories
        </h1>

        <p className="mt-2 text-gray-600">
          Explore our wide range of product categories.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gray-200" />

              <div className="mx-auto h-5 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <p>{error}</p>

          <button
            onClick={fetchCategories}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && categories.length === 0 && (
        <div className="rounded-xl bg-gray-50 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Categories Found
          </h2>

          <p className="mt-2 text-gray-500">
            There are currently no categories available.
          </p>
        </div>
      )}

      {/* Categories */}
      {!loading && !error && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category._id}`}
              className="group rounded-xl bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                {category.image ? (
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">
                    {category.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-gray-800 transition group-hover:text-blue-600">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrontCategories;