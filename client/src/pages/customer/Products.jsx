import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../../services/productService";
import ProductCard from "../../components/customer/ProductCard";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || ""
  );

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      const searchValue = searchParams.get("search");
      const sortValue = searchParams.get("sort");

      if (searchValue) {
        params.search = searchValue;
      }

      if (sortValue) {
        params.sort = sortValue;
      }

      const response = await getProducts(params);

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(
          response.message || "Failed to load products"
        );
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (sort) {
      params.sort = sort;
    }

    setSearchParams(params);
  };

  const handleSort = (event) => {
    const value = event.target.value;

    setSort(value);

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (value) {
      params.sort = value;
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          All Products
        </h1>

        <p className="mt-2 text-gray-600">
          Browse our collection of products.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-xl bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 md:flex-row"
        >
          {/* Search */}
          <div className="flex flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="w-full rounded-l-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="rounded-r-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={handleSort}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Sort Products</option>
            <option value="price_asc">
              Price: Low to High
            </option>
            <option value="price_desc">
              Price: High to Low
            </option>
            <option value="name_asc">
              Name: A-Z
            </option>
            <option value="name_desc">
              Name: Z-A
            </option>
          </select>

          {/* Clear */}
          {(search || sort) && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <p>{error}</p>

          <button
            onClick={fetchProducts}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
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
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="rounded-xl bg-gray-50 p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

      {/* Products */}
      {!loading &&
        !error &&
        products.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {products.length}
                </span>{" "}
                products
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
    </div>
  );
};

export default Products;