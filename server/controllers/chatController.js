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

Rules:
- Maximum 3 lines.
- Maximum 40 words.
- Be concise.
- Reply according to the user's intent.

If user says:
- hi, hello, hey → greet back briefly.
- asks for products → recommend products.
- asks for deals → suggest deals.
- asks for categories → suggest categories.
- asks unrelated questions → say you only help with shopping.

Examples:

User: hi
Bot: Hi! How can I help you shop today?

User: best jeans under 300
Bot:
Slim Fit Jeans - ₹299
Regular Fit Jeans - ₹279
Stretch Denim - ₹249

User Message:
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