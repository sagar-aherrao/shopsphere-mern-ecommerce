import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProductImage,
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    category: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    specifications: "",
    isFeatured: false,
    isActive: true,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const loadProduct = async () => {
      try {
        const response = await getProduct(id);

        const product = response.data;

        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          sku: product.sku || "",
          description: product.description || "",
          shortDescription:
            product.shortDescription || "",
          category: product.category?._id || product.category || "",
          brand: product.brand || "",
          price: product.price || "",
          discountPrice:
            product.discountPrice || "",
          stock: product.stock ?? "",
          specifications: product.specifications
            ? JSON.stringify(
              product.specifications,
              null,
              2
            )
            : "",
          isFeatured:
            product.isFeatured || false,
          isActive:
            product.isActive ?? true,
        });

        setExistingImages(product.images || []);
      } catch (error) {
        console.error("Load Product Error:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditMode]);

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

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files
    );

    const totalImages =
      existingImages.length + selectedFiles.length;

    if (totalImages > 5) {
      alert(
        `Maximum 5 images allowed. You currently have ${existingImages.length} existing image(s).`
      );

      event.target.value = "";
      return;
    }

    setImages(selectedFiles);
  };

  const handleDeleteExistingImage = async (
    image
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProductImage(id, image);

      setExistingImages((previousImages) =>
        previousImages.filter(
          (existingImage) =>
            existingImage !== image
        )
      );
    } catch (error) {
      console.error(
        "Delete Product Image Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete image."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      let specifications = {};

      if (formData.specifications.trim()) {
        try {
          specifications = JSON.parse(
            formData.specifications
          );
        } catch {
          setError(
            "Specifications must be valid JSON."
          );
          setSubmitting(false);
          return;
        }
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("sku", formData.sku);
      data.append(
        "description",
        formData.description
      );
      data.append(
        "shortDescription",
        formData.shortDescription
      );
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append(
        "discountPrice",
        formData.discountPrice
      );
      data.append("stock", formData.stock);

      data.append(
        "specifications",
        JSON.stringify(specifications)
      );

      data.append(
        "isFeatured",
        formData.isFeatured
      );

      data.append(
        "isActive",
        formData.isActive
      );

      images.forEach((image) => {
        data.append("images", image);
      });

      if (isEditMode) {
        /*
          Current backend update API may still expect
          JSON for updates.

          For full image update support, we will update
          this backend route after the basic product
          form is working.
        */

        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Product Submit Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to save product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode
            ? "Edit Product"
            : "Add Product"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update product information."
            : "Create a new product."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">

          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              SKU
            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Discount Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Discount Price
            </label>

            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

        </div>

        {/* Short Description */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Short Description
          </label>

          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        {/* Specifications */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Specifications (JSON)
          </label>

          <textarea
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            rows="5"
            placeholder={'{"ram":"8GB","storage":"128GB"}'}
            className="w-full rounded-lg border px-4 py-3 font-mono text-sm"
          />

          <p className="mt-2 text-xs text-gray-500">
            Example: {"{"}"ram":"8GB","storage":"128GB"{"}"}
          </p>
        </div>

        {/* Existing Images */}
        {isEditMode && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Existing Images
                </h2>

                <p className="text-sm text-gray-500">
                  Manage images already uploaded for this
                  product.
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {existingImages.length}/5
              </span>
            </div>

            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {existingImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="group relative overflow-hidden rounded-xl border bg-gray-50"
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Product ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />

                    {/* Primary badge */}
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                        Primary
                      </span>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteExistingImage(image)
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white opacity-90 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="text-sm text-gray-500">
                  No images uploaded yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Images */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Product Images
          </label>

          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-400">
            <input
              id="product-images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImagesChange}
              className="hidden"
            />

            <label
              htmlFor="product-images"
              className="cursor-pointer"
            >
              <div className="text-3xl">
                📷
              </div>

              <p className="mt-2 text-sm font-medium text-gray-700">
                Click to upload product images
              </p>

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or WEBP — maximum 5 images
              </p>
            </label>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Select up to 5 JPG, PNG or WEBP images.
          </p>

          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {images.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      New Images
                    </p>

                    <span className="text-xs text-gray-500">
                      {images.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="overflow-hidden rounded-xl border bg-gray-50"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />

                        <div className="p-2">
                          <p className="truncate text-xs text-gray-600">
                            {image.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Status */}
        <div className="mt-6 flex flex-wrap gap-6">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />

            <span className="text-sm font-medium">
              Featured Product
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />

            <span className="text-sm font-medium">
              Active Product
            </span>
          </label>

        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4 border-t pt-6">

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>

                Saving...
              </span>
            ) : isEditMode ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

        </div>
      </form>
    </div>
  );
};

export default ProductForm;