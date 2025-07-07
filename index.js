import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";
import { Blob } from "buffer"; // <- penting untuk Node.js

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

let client;

(async () => {
  try {
    client = await Client.connect("Keshinryan/CloudFinalProject2");
    console.log("✅ Connected to Gradio Space");
  } catch (err) {
    console.error("❌ Failed to connect to Gradio:", err);
  }
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "API TaxoClassify with Vercel JS and Gradio is running" });
});

app.post("/predict", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Convert buffer to Blob
    const imageBlob = new Blob([req.file.buffer]);

    // Use Gradio client directly
    const result = await client.predict("/predict", [imageBlob]);

    res.status(200).json({ predictions: result });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed", detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
