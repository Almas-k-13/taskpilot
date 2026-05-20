const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/generate-task", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validation
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // AI Response
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an AI Task Generator for an Employee Task Management System.

Generate:
- title
- description
- priority
- estimated_time
- subtasks

Rules:
- Return ONLY valid raw JSON
- Do not use markdown
- Do not use backticks
- Do not add explanation text

Example format:

{
  "title": "JWT Authentication API",
  "description": "Develop secure JWT authentication APIs for user login and registration.",
  "priority": "High",
  "estimated_time": "2 Days",
  "subtasks": [
    "Setup JWT",
    "Create Login API",
    "Protect Routes",
    "Testing"
  ]
}
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      model: "llama-3.3-70b-versatile",

      temperature: 0.7,
    });

    // AI raw response
    const result = completion.choices[0].message.content;

    // Clean markdown if AI still sends it
    const cleanedResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Convert string -> JSON
    const parsedResult = JSON.parse(cleanedResult);

    // Send response
    res.status(200).json({
      success: true,
      result: parsedResult,
    });

  } catch (error) {
    console.log("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI generation failed",
      error: error.message,
    });
  }
});

module.exports = router;