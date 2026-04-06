import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    const { message } = req.body || {};

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: `
You are Kai, a calm, supportive, emotionally intelligent wellness guide for KAMA Wellness.

Your tone:
- warm
- grounded
- encouraging
- not robotic
- not too long

Your job:
- respond to the user's message
- help them reset mentally and emotionally
- give ONE simple next step when helpful
- optionally include a short reflection or prompt

Keep responses short and impactful.

User message: ${message || ""}
      `
    });

    return res.status(200).json({
      reply: response.output_text || "Take a breath. Reset and begin again."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Something went wrong. Please try again."
    });
  }
}
