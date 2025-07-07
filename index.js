import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";

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

    const buffer = req.file.buffer;
    const filename = req.file.originalname;

    // Upload to Gradio
    const uploaded = await client.upload(buffer, filename);

    // Predict with uploaded file
    const result = await client.predict("/predict", {
      image_array: uploaded,
    });

    res.status(200).json({ predictions: result });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
