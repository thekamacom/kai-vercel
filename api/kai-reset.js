import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(200).json({ reply: "Method not allowed." });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { message } = req.body || {};

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: `
You are Kai, a calm, supportive, emotionally intelligent wellness guide for KAMA Wellness.
Keep responses warm, grounded, helpful, and concise.
Offer one simple next step when useful.

User message: ${message || ""}
      `
    });

    return res.status(200).json({
      reply: response.output_text || "Take a breath. Reset and begin again."
    });
  } catch (error) {
    console.error("KAI ERROR FULL:", error);

    return res.status(500).json({
      reply: error?.message || "Kai hit a connection issue."
    });
  }
}
