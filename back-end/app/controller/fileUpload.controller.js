import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "file") {
      cb(null, path.join(__dirname, "../../public"));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "file") {
    cb(null, true);
  } else {
    cb(new Error("Only 'file' field is allowed"), false);
  }
};

// Multer Instance
const upload = multer({ storage, fileFilter });

// Multer Middleware
export const uploadMiddleware = upload.fields([
  { name: "file", maxCount: 10 },
]);

// Upload Handler
export const uploadHandler = async (req, res) => {
  const fileNames = req.files?.file?.map((file) => file.filename) || [];

  res.status(200).json({
    isSuccess: true,
    message: "File uploaded successfully",
    data: {
      fileUrl: fileNames,
    },
  });
};
