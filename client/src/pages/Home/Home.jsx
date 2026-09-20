import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../services/api";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [categoriesError, setCategoriesError] = useState("");
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const response = await getCategories();

      if (response.success) {
        setCategories(response.data || []);
      } else {
        setCategoriesError(
          response.message || "Failed to load categories"
        );
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      setCategoriesError(
        error.response?.data?.message ||
          "Unable to load categories"
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await getProducts({
        limit: 8,
        featured: true,
      });

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setProductsError(
          response.message || "Failed to load products"
        );
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setProductsError(
        error.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">

      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-16 text-center text-white shadow-lg">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Welcome to ShopSphere
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
          Discover amazing products across multiple categories.
        </p>

        <Link
          to="/products"
          className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          Shop Now
        </Link>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Shop by Categories
            </h2>

            <p className="mt-1 text-gray-600">
              Explore our product categories
            </p>
          </div>
        </div>

        {categoriesLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl bg-white p-4 shadow"
              >
                <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-gray-200" />

                <div className="mx-auto h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {!categoriesLoading && categoriesError && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
            {categoriesError}
          </div>
        )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
              No categories available.
            </div>
          )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="group rounded-xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {category.image ? (
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {category.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
      </section>

      {/* Featured Products */}
      <section className="pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Products
            </h2>

            <p className="mt-1 text-gray-600">
              Check out our popular products
            </p>
          </div>

          <Link
            to="/products"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>

        {productsLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl bg-white shadow"
              >
                <div className="h-56 bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!productsLoading && productsError && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
            {productsError}
          </div>
        )}

        {!productsLoading &&
          !productsError &&
          products.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
              No featured products available.
            </div>
          )}

        {!productsLoading &&
          !productsError &&
          products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div className="h-56 overflow-hidden bg-gray-100">
                    {product.images?.length > 0 ? (
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-[3rem] font-semibold text-gray-800 group-hover:text-blue-600">
                      {product.name}
                    </h3>

                    {product.category?.name && (
                      <p className="mt-1 text-sm text-gray-500">
                        {product.category.name}
                      </p>
                    )}

                    <div className="mt-3">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>
    </div>
  );
};

export default Home;