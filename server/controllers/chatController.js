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

    const prompt = `
You are CoolBot, an e-commerce shopping assistant.

VERY IMPORTANT:
- Maximum 3 lines.
- Maximum 40 words.
- No introductions.
- No explanations.
- No markdown.
- No paragraphs.
- Give direct recommendations only.

Example:

User: best jeans under 300

Bot:
Slim Fit Jeans - ₹299
Regular Fit Jeans - ₹279
Stretch Denim - ₹249

User Question:
${message}
`;

const result = await model.generateContent(prompt);

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