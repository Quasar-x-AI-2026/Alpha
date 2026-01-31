const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function validateImage(filePath) {
    try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));

        const response = await axios.post(
            "http://localhost:8000/validate-image",
            formData,
            { headers: formData.getHeaders() }
        );

        return response.data;
    } catch (err) {
        console.error("ML validation error:", err.message);
        return { isValid: false, reason: "ML service error" };
    }
}

module.exports = { validateImage };
