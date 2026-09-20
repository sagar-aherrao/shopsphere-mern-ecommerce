import Product from "../models/Product.js";
import Category from "../models/Category.js";

import fs from "fs";
import path from "path";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      category,
      brand,
      price,
      discountPrice,
      stock,
      specifications,
      isFeatured,
      isActive,
    } = req.body;

    const images = req.files
      ? req.files.map(
        (file) => `/uploads/products/${file.filename}`
      )
      : [];

    // Check category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check duplicate slug or SKU
    const existingProduct = await Product.findOne({
      $or: [{ slug }, { sku }],
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this slug or SKU already exists",
      });
    }

    // Validate discount price
    if (
      discountPrice !== undefined &&
      discountPrice !== null &&
      Number(discountPrice) > Number(price)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount price cannot be greater than product price",
      });
    }

    const product = await Product.create({
      name,
      slug,
      sku,
      description,
      shortDescription,
      category,
      brand,
      price,
      discountPrice,
      stock,
      images,
      specifications,
      isFeatured,
      isActive,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Get All Products
// Get Products - Search, Filter, Sort & Pagination
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      isActive,
      sort = "newest",
    } = req.query;

    // Convert pagination values to numbers
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    const query = {};

    // Search
    if (search && search.trim() !== "") {
      const searchTerm = search.trim();

      query.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Featured filter
    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    // Active filter
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;

      case "price_desc":
        sortOption = { price: -1 };
        break;

      case "name_asc":
        sortOption = { name: 1 };
        break;

      case "name_desc":
        sortOption = { name: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Get total number of matching products
    const totalProducts = await Product.countDocuments(query);

    // Get products
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}
// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      category,
      brand,
      price,
      discountPrice,
      stock,
      specifications,
      isFeatured,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check category if provided
    if (category !== undefined) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Check duplicate slug/SKU
    if (slug !== undefined || sku !== undefined) {
      const duplicateProduct = await Product.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(slug ? [{ slug }] : []),
          ...(sku ? [{ sku }] : []),
        ],
      });

      if (duplicateProduct) {
        return res.status(409).json({
          success: false,
          message: "Another product with this slug or SKU already exists",
        });
      }
    }

    const finalPrice =
      price !== undefined ? Number(price) : Number(product.price);

    const finalDiscountPrice =
      discountPrice !== undefined
        ? discountPrice === null
          ? null
          : Number(discountPrice)
        : product.discountPrice;

    if (
      finalDiscountPrice !== null &&
      finalDiscountPrice !== undefined &&
      finalDiscountPrice > finalPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount price cannot be greater than product price",
      });
    }

    if (name !== undefined) product.name = name;
    if (slug !== undefined) product.slug = slug;
    if (sku !== undefined) product.sku = sku;
    if (description !== undefined) product.description = description;
    if (shortDescription !== undefined)
      product.shortDescription = shortDescription;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined)
      product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (images !== undefined) product.images = images;
    if (specifications !== undefined)
      product.specifications = specifications;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;

    // IMPORTANT:
    // Add newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(
          (file) => `/uploads/products/${file.filename}`
        );

        product.images = [
          ...(product.images || []),
          ...newImages,
        ];
      }
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image path is required.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const imageIndex = product.images.indexOf(image);

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Image not found in product.",
      });
    }

    // Remove image from MongoDB array
    product.images.splice(imageIndex, 1);

    await product.save();

    // Delete physical file
    const imagePath = image.startsWith("/")
      ? image.substring(1)
      : image;

    const fullPath = path.join(
      process.cwd(),
      imagePath
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully.",
      data: product,
    });
  } catch (error) {
    console.error(
      "Delete Product Image Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete product image.",
    });
  }
};