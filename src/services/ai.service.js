import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY
});

export const generateTripPlan = async ({
  destination,
  days,
  budgetType,
  interests
}) => {

const prompt = `
You are a professional travel planner.

Generate a travel plan for:

Destination: ${destination}
Days: ${days}
Budget: ${budgetType}
Interests: ${interests?.join(", ")}

Return ONLY JSON in this exact structure:

{
  "itinerary":[
    {
      "day":1,
      "activities":[
        {
          "title":"Activity name",
          "time":"Morning/Afternoon/Evening"
        }
      ]
    }
  ],
  "budgetEstimate":{
    "flights": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "total": number
  },
  "hotels":[
    {
      "name":"Hotel name",
      "type":"Budget/Mid-range/Luxury",
      "rating": number
    }
  ]
}
`;

const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7
});

const content = response.choices[0].message.content;

const jsonMatch = content.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("Invalid AI response format");
}

return JSON.parse(jsonMatch[0]);

};