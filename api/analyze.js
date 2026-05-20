// api/analyze.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { images } = req.body; // odottaa array base64-kuvia

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
Analysoi golf swing seuraavien kuvien perusteella ja vertaa Tommy Fleetwoodin tekniikkaan:
${images.join("\n")}
Kirjoita analyysi vaihe vaiheelta.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ analysis: completion.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analyysi epäonnistui" });
  }
}
