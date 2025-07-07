import express from "express";
import multer from "multer";
import { Client, handleFile } from "@gradio/client";
import { Blob } from "buffer"; // Needed to define Blob in Node.js

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gradio client
let client;

(async () => {
  try {
    client = await Client.connect("Keshinryan/CloudFinalProject2");
    console.log("✅ Connected to Gradio Space");
  } catch (error) {
    console.error("❌ Failed to connect to Gradio Space:", error);
  }
})();

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "API TaxoClassify with Vercel JS and Gradio is running" });
});

// Prediction endpoint
app.post("/predict", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to a format Gradio can handle
    const handledFile = await handleFile(req.file.buffer, req.file.originalname);

    // Use correct endpoint name if you use api_name="/predict" in Gradio
    const result = await client.predict("/predict", {
      image_array: handledFile
    });

    res.status(200).json({
      predictions: result,
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
