import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error("Load Categories Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      // Remove deleted category from UI
      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) => category._id !== id
        )
      );
    } catch (error) {
      console.error("Delete Category Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">
          Loading categories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories.
          </p>
        </div>

        <Link
          to="/admin/categories/add"
          className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Category
        </Link>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Image
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Name
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Slug
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      {category.image ? (
                        <img
                          src={`http://localhost:5000${category.image}`}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {category.name}
                      </p>

                      {category.description && (
                        <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                          {category.description}
                        </p>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.slug}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/categories/edit/${category._id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(category._id)
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
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;