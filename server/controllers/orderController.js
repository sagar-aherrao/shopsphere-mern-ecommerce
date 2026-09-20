import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
| POST /api/orders
| Protected
*/

export const createOrder = async (
  req,
  res
) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate cart
    |--------------------------------------------------------------------------
    */

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cart items are required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate shipping address
    |--------------------------------------------------------------------------
    */

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete shipping address is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate payment method
    |--------------------------------------------------------------------------
    */

    if (
      !paymentMethod ||
      !["COD", "RAZORPAY"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate products and calculate price
    |--------------------------------------------------------------------------
    */

    const orderItems = [];

    let itemsPrice = 0;

    for (const item of items) {
      if (
        !item.productId ||
        !item.quantity
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid cart item",
        });
      }

      const quantity =
        Number(item.quantity);

      if (
        Number.isNaN(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product quantity",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Get actual product from MongoDB
      |--------------------------------------------------------------------------
      */

      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validate stock
      |--------------------------------------------------------------------------
      */

      if (
        product.stock < quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) available`,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Calculate using database price
      |--------------------------------------------------------------------------
      */

      const price =
        Number(product.price);

      itemsPrice +=
        price * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity,
        image:
          product.images?.[0] || "",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    */

    const shippingPrice = 0;

    /*
    |--------------------------------------------------------------------------
    | Final total
    |--------------------------------------------------------------------------
    */

    const totalPrice =
      itemsPrice + shippingPrice;

    /*
    |--------------------------------------------------------------------------
    | Create Order
    |--------------------------------------------------------------------------
    */

    const order =
      await Order.create({
        user: req.user._id,

        orderItems,

        shippingAddress,

        paymentMethod,

        paymentStatus:
          paymentMethod === "COD"
            ? "Pending"
            : "Pending",

        orderStatus: "Pending",

        itemsPrice,

        shippingPrice,

        totalPrice,
      });

    /*
    |--------------------------------------------------------------------------
    | Reduce stock
    |--------------------------------------------------------------------------
    */

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock:
              -item.quantity,
          },
        }
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create order",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get My Orders
|--------------------------------------------------------------------------
| GET /api/orders/my-orders
| Protected
*/

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "orderItems.product",
          "name images"
        );

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Order
|--------------------------------------------------------------------------
| GET /api/orders/:id
| Protected
*/

export const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      ).populate(
        "orderItems.product",
        "name images"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | User can only access own order
    |--------------------------------------------------------------------------
    */

    if (
      order.user.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to access this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      paymentMethod = "",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    // Status filter
    if (status) {
      filter.orderStatus = status;
    }

    // Payment method filter
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Search
    if (search) {
      const searchRegex = new RegExp(search, "i");

      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((user) => user._id);

      const searchConditions = [
        {
          _id: search.match(/^[0-9a-fA-F]{24}$/)
            ? search
            : undefined,
        },
        {
          user: {
            $in: userIds,
          },
        },
      ];

      filter.$or = searchConditions.filter(
        (condition) => {
          if (condition._id !== undefined) {
            return true;
          }

          return condition.user?.$in?.length > 0;
        }
      );
    }

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export  const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const confirmedOrders = await Order.countDocuments({
      orderStatus: "Confirmed",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: error.message,
    });
  }
};