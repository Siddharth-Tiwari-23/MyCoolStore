import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithBot = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const { message } = req.body;

    const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

    const result = await model.generateContent(message);

    const reply = result.response.text();

    res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};