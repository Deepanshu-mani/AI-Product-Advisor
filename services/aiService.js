import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, validateConfig } from "../config.js";

export async function getAIRecommendations(userQuery, productCatalog) {
  try {
    if (!validateConfig()) {
      throw new Error("Invalid configuration - check your environment variables");
    }

    if (!userQuery || !productCatalog) {
      throw new Error("User query and product catalog are required");
    }

    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: config.gemini.model });
    
    const prompt = `You are an AI Product Advisor. From the provided product catalog JSON, recommend the best matching items for the user's request.

Rules:
- If the user's query is random, nonsensical, or contains no meaningful keywords, return ONLY a single JSON object:
  {
    "brand": "N/A",
    "product_name": "No valid match found",
    "price": 0,
    "category": "General", 
    "description": "Unable to understand your request. Please try describing what you're looking for in clear terms.",
    "reason": "Your query doesn't seem to relate to any products. Please try rephrasing with specific product needs."
  }
- For legitimate queries, return 3-5 product recommendations
- Keep prices numeric (no currency symbols)

User Query: "${userQuery}"

Product Catalog:
${JSON.stringify(productCatalog, null, 2)}

IMPORTANT: Respond with ONLY a valid JSON array. Do not include any other text, explanations, or formatting. Start your response with [ and end with ].`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: config.generationConfig,
      safetySettings: config.safetySettings,
    });

    const message = result.response.text().trim();
    console.log("Gemini response:", message);
    
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw message:", message);
      
      // Try to extract JSON from the response if it's embedded in text
      const jsonMatch = message.match(/\[.*\]/s);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted JSON from response");
        } catch (extractError) {
          console.error("Failed to parse extracted JSON:", extractError);
          throw new Error("Invalid JSON response from Gemini");
        }
      } else {
        throw new Error("No valid JSON found in Gemini response");
      }
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }

    // Validate and clean the response
    return parsed.filter(rec => 
      rec && rec.brand && rec.product_name && rec.price !== undefined && rec.category && rec.description
    ).map(rec => ({
      brand: rec.brand,
      product_name: rec.product_name,
      price: Number(rec.price) || 0,
      category: rec.category,
      description: rec.description,
      reason: rec.reason || "Recommended based on your query"
    }));

  } catch (error) {
    console.error("AI Service Error:", error);
    // Simple fallback for errors
    return [{
      brand: "N/A",
      product_name: "Error occurred",
      price: 0,
      category: "Error",
      description: "Unable to process your request. Please try again.",
      reason: `Error: ${error.message}`
    }];
  }
}