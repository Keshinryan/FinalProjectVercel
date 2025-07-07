import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";
import { Blob } from "buffer";

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Declare a promise for client init
let clientPromise = Client.connect("Keshinryan/CloudFinalProject2");

app.get("/", (req, res) => {
  res.status(200).json({ message: "API TaxoClassify with Vercel JS and Gradio is running" });
});

app.post("/predict", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const client = await clientPromise; // ensure initialized!
    const imageBlob = new Blob([req.file.buffer]);

    // Call Gradio predict
    const result = await client.predict("/predict", [imageBlob]);

    res.status(200).json(result.data[0]);
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed", detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
