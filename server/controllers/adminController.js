import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Admin Dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Category statistics
    const totalCategories = await Category.countDocuments();

    const activeCategories = await Category.countDocuments({
      isActive: true,
    });

    const inactiveCategories = await Category.countDocuments({
      isActive: false,
    });

    // Product statistics
    const totalProducts = await Product.countDocuments();

    const activeProducts = await Product.countDocuments({
      isActive: true,
    });

    const inactiveProducts = await Product.countDocuments({
      isActive: false,
    });

    const featuredProducts = await Product.countDocuments({
      isFeatured: true,
    });

    const outOfStockProducts = await Product.countDocuments({
      stock: 0,
    });

    // Low stock = 1 to 5 items
    const lowStockProducts = await Product.countDocuments({
      stock: {
        $gt: 0,
        $lte: 5,
      },
    });

    const recentProducts = await Product.find()
  .populate("category", "name slug")
  .sort({ createdAt: -1 })
  .limit(5)
  .select(
    "name slug price discountPrice stock images category createdAt"
  );

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: inactiveCategories,
        },

        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
          featured: featuredProducts,
          outOfStock: outOfStockProducts,
          lowStock: lowStockProducts,
        },
        recentProducts,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};