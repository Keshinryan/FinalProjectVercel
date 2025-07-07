import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gradio client once
let client;
(async () => {
  try {
    client = await Client.connect("Keshinryan/CloudFinalProject2");
    console.log("✅ Connected to Gradio space");
  } catch (err) {
    console.error("❌ Failed to connect to Gradio:", err);
  }
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "API TaxoClassify with Vercel JS and Gradio is running" });
});

app.post("/predict", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const imageBlob = new Blob([req.file.buffer]);

    // Call Gradio API (your function takes 1 input: image)
    const result = await client.predict("/predict", [imageBlob]);

    // Return full prediction JSON from Gradio (your model returns a dict of {kelas, ordo, ..., spesies})
    res.status(200).json({
      predictions: result.data, // This is a JS object containing all taxonomy levels
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).send("Prediction error", err);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
