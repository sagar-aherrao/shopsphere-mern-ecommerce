import { Link } from "react-router-dom";

import { getImageUrl } from "../../services/api";

const frontProductCard = ({ product }) => {
  const image =
    product.images?.length > 0
      ? product.images[0]
      : null;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Stock Badge */}
        {product.stock !== undefined && (
          <span
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
              product.stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[3rem] font-semibold text-gray-800 group-hover:text-blue-600">
          {product.name}
        </h3>

        {product.category?.name && (
          <p className="mt-1 text-sm text-gray-500">
            {product.category.name}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </span>

          {product.stock > 0 && (
            <span className="text-sm font-medium text-blue-600">
              View
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default frontProductCard;