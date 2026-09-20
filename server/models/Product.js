import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    brand: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: 0,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;