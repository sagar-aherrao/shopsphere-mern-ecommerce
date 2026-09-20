import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createCategory,
  getCategory,
  updateCategory,
} from "../../services/categoryService";

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  // Load category for edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const loadCategory = async () => {
      try {
        const response = await getCategory(id);

        const category = response.data;

        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description:
            category.description || "",
          isActive: category.isActive,
        });

        setExistingImage(category.image || "");
      } catch (error) {
        console.error(
          "Load Category Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load category"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, isEditMode]);

  // Handle text inputs
  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // Auto-generate slug from name
  const handleNameChange = (event) => {
    const name = event.target.value;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((previousData) => ({
      ...previousData,
      name,
      slug,
    }));
  };

  // Image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append(
        "description",
        formData.description
      );
      data.append(
        "isActive",
        formData.isActive
      );

      if (image) {
        data.append("image", image);
      }

      if (isEditMode) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }

      navigate("/admin/categories");
    } catch (error) {
      console.error(
        "Category Submit Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">
          Loading category...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode
            ? "Edit Category"
            : "Add Category"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update category information."
            : "Create a new product category."}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              placeholder="Example: Electronics"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="electronics"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter category description"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Image
            </label>

            {existingImage && !image && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-gray-500">
                  Current Image
                </p>

                <img
                  src={getImageUrl(existingImage)}
                  alt="Current category"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </div>
            )}

            {image && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-gray-500">
                  New Image Preview
                </p>

                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600"
            />

            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG or WEBP. Maximum 5MB.
            </p>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active Category
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 border-t pt-6">

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Category"
                : "Create Category"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/categories")
              }
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

          </div>

        </div>
      </form>
    </div>
  );
};

export default CategoryForm;