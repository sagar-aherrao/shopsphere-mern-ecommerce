import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts, deleteProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");
  const [sort, setSort] = useState("newest");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalProducts: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error("Load Categories Error:", error);
    }
  };

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: pagination.limit,
        sort,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      if (status !== "") {
        params.isActive = status;
      }

      if (featured !== "") {
        params.featured = featured;
      }

      const response = await getProducts(params);

      setProducts(response.data || []);

      setPagination(response.pagination);
    } catch (error) {
      console.error("Load Products Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [category, status, featured, sort]);

  const handleSearch = (event) => {
    event.preventDefault();

    loadProducts(1);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      loadProducts(pagination.page);
    } catch (error) {
      console.error("Delete Product Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    loadProducts(page);
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your ecommerce products.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>

            {categories.map((categoryItem) => (
              <option
                key={categoryItem._id}
                value={categoryItem._id}
              >
                {categoryItem.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Featured */}
          <select
            value={featured}
            onChange={(event) =>
              setFeatured(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Products</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
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

          <button
            type="submit"
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 lg:col-span-1"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Image
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      {/* Image */}
                      <td className="px-5 py-4">
                        {product.images?.length > 0 ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          SKU: {product.sku}
                        </p>

                        {product.isFeatured && (
                          <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                            Featured
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.category?.name ||
                          "No Category"}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        {product.discountPrice && (
                          <p className="mt-1 text-xs text-green-600">
                            Offer: ₹
                            {Number(
                              product.discountPrice
                            ).toLocaleString("en-IN")}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : `${product.stock} in stock`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(product._id)
                            }
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t px-5 py-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing page {pagination.page} of{" "}
              {pagination.totalPages} (
              {pagination.totalProducts} products)
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handlePageChange(
                    pagination.page - 1
                  )
                }
                disabled={
                  !pagination.hasPreviousPage
                }
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  handlePageChange(
                    pagination.page + 1
                  )
                }
                disabled={!pagination.hasNextPage}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;