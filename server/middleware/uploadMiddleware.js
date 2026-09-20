import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directories if they don't exist
const categoryUploadPath = "uploads/categories";
const productUploadPath = "uploads/products";

if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
}

if (!fs.existsSync(productUploadPath)) {
  fs.mkdirSync(productUploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.baseUrl.includes("categories")) {
      cb(null, categoryUploadPath);
    } else {
      cb(null, productUploadPath);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeType = allowedTypes.test(file.mimetype);

  const validExtension = allowedTypes.test(extension);

  if (mimeType && validExtension) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});