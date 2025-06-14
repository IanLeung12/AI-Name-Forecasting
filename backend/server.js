econst express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require('dotenv').config(); // Add this line

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use environment variable instead
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Add this route at the top of your routes
app.get("/", (req, res) => {
  res.send("Name Predictor API is running. Use POST /analyze-name to analyze names.");
});

// Rest of your code remains the same
app.post("/analyze-name", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Briefly explain the significance behind this name or nickname, and focus its potential impact on a person's life and future: "${name}". Do not analyze surnames if only one name is provided, else, analyze both. Provide a concise but scientific analysis within 100 words`,
        },
      ],
      max_tokens: 200,
    });

    res.json({ message: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err.response ?? err);
    res.status(500).json({ error: "Failed to fetch AI response." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
