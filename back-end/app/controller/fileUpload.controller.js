let multer = require("multer");
const path = require("path");
const fs = require("fs");
const { validateImage } = require("../services/imageValidation.service");

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "file") {
            cb(null, path.join(__dirname, "../../public"));
        }
    },
    filename: (req, file, cb) => {
        let fileName = file.originalname.split(".");
        cb(null, Date.now() + "." + fileName[fileName.length - 1]);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "file") {
        cb(null, true);
    } else {
        cb(new Error("Invalid field"));
    }
};

// Multer Instance
let upload = multer({ storage, fileFilter });

// Multer Middleware
let uploadMiddleware = upload.fields([{ name: "file", maxCount: 10 }]);

async function uploadHandler(req, res) {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({
                isSuccess: false,
                message: "No file uploaded",
            });
        }

        const uploadedFiles = req.files.file;
        let validFiles = [];
        let invalidFiles = [];

        for (let file of uploadedFiles) {
            const filePath = path.join(
                __dirname,
                "../../public",
                file.filename
            );

            const validationResult = await validateImage(filePath);

            if (validationResult.isValid) {
                validFiles.push(file.filename);
            } else {
                // Delete invalid file
                fs.unlinkSync(filePath);
                invalidFiles.push({
                    file: file.originalname,
                    reason: validationResult.reason,
                });
            }
        }

        return res.status(200).json({
            isSuccess: true,
            message: "Upload successful",
            data: {
                fileUrl: validFiles,
                rejected: invalidFiles,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            isSuccess: false,
            message: err.message || "Upload failed",
        });
    }
}


module.exports = { uploadMiddleware, uploadHandler };
