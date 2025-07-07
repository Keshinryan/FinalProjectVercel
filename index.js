import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });

// Wrap the Gradio client initialization in an async function
async function initializeClient() {
    try {
        const client = await Client.connect("Keshinryan/CloudFinalProject2");
        return client;
    } catch (error) {
        console.error("Error initializing Gradio client:", error);
        throw error;
    }
}
// Initialize the client
const client = await initializeClient();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API TaxoClassify with Vercel js and Gradio is running' });
});

app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const inputImage = new Blob([req.file.buffer]);
    const result = await client.predict("/predict", [inputImage]);

    // If output is a string like: "Class: Orang Utan, Confidence: 0.97"
    const [_, classText, confText] = result.data[0].match(/Class: (.*), Confidence: ([\d.]+)/) || [];

    res.json({
      class: classText,
      confidence: parseFloat(confText)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Prediction error");
  }
});
// Serve the app
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
