import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, validateConfig } from "../config.js";

function extractBudgetAndKeywords(userQuery) {
  const lower = String(userQuery || "").toLowerCase();
  const budgetRegex = /(under|below|less than|<=|<|budget)\s*([0-9]{2,7})/;
  let budget = null;
  const match = lower.match(budgetRegex);
  if (match) {
    budget = parseInt(match[2], 10);
  } else {
    const anyNumber = lower.match(/([0-9]{2,7})/);
    if (anyNumber) {
      budget = parseInt(anyNumber[1], 10);
    }
  }

  const stopwords = new Set([
    "i","need","a","an","the","for","me","to","my","on","in","of","and","or","with","show","find","buy","get","under","below","less","than","budget","random","something"
  ]);
  const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const keywords = words.filter(w => !stopwords.has(w));
  return { budget, keywords };
}

const CATEGORY_SYNONYMS = {
  cup: ["kitchen", "coffee", "mug"],
  mugs: ["kitchen", "coffee", "mug"],
  mug: ["kitchen", "coffee", "mug"],
  speaker: ["entertainment", "audio"],
  headphones: ["entertainment", "audio"],
  headphone: ["entertainment", "audio"],
  vacuum: ["home improvement"],
  lock: ["security", "security & surveillance"],
  camera: ["security", "security & surveillance"],
  coffee: ["kitchen appliances"],
};

function scoreProduct(product, budget, keywords) {
  let score = 0;
  const name = String(product.product_name || "").toLowerCase();
  const desc = String(product.description || "").toLowerCase();
  const cat = String(product.category || "").toLowerCase();

  for (const kw of keywords) {
    if (!kw) continue;
    if (name.includes(kw)) score += 3;
    if (desc.includes(kw)) score += 2;
    if (cat.includes(kw)) score += 2;
    const syns = CATEGORY_SYNONYMS[kw];
    if (syns) {
      for (const s of syns) {
        if (cat.includes(s)) score += 2;
        if (name.includes(s)) score += 1;
      }
    }
  }

  if (budget && Number.isFinite(product.price)) {
    if (product.price <= budget) {
      score += 5;
      const closeness = 1 - Math.max(0, (budget - product.price)) / Math.max(1, budget);
      score += closeness * 2;
    } else {
      const over = (product.price - budget) / Math.max(1, budget);
      if (over < 0.25) score += 1;
    }
  }
  return score;
}

function buildReason(product, budget, keywords) {
  const parts = [];
  if (budget) {
    if (product.price <= budget) {
      parts.push(`within your budget of ${budget}`);
    } else {
      parts.push(`slightly above your budget of ${budget}`);
    }
  }
  const name = String(product.product_name || "").toLowerCase();
  const desc = String(product.description || "").toLowerCase();
  const cat = String(product.category || "").toLowerCase();
  for (const kw of keywords) {
    if (!kw) continue;
    if (name.includes(kw) || desc.includes(kw) || cat.includes(kw)) {
      parts.push(`matches your keyword "${kw}"`);
    } else if (CATEGORY_SYNONYMS[kw]) {
      const related = CATEGORY_SYNONYMS[kw].find(s => cat.includes(s));
      if (related) parts.push(`related to "${kw}" via ${related}`);
    }
  }
  if (parts.length === 0) parts.push("great value pick based on your query");
  return parts.join(", ");
}

function localFallbackRecommendations(userQuery, productCatalog, limit = 5) {
  const { budget, keywords } = extractBudgetAndKeywords(userQuery);
  
  // If no meaningful keywords found, return helpful guidance
  if (keywords.length === 0) {
    return [{
      brand: "N/A",
      product_name: "No matching products found",
      price: 0,
      category: "Information",
      description: "We don't currently have products matching your query, but we do offer healthtech, entertainment, travel accessories, and smart devices.",
      reason: "Your query doesn't match our available product categories. Try searching for healthtech, entertainment, travel, or smart home products."
    }];
  }
  
  const scored = productCatalog
    .map(p => ({ p, s: scoreProduct(p, budget, keywords) }))
    .sort((a, b) => b.s - a.s);

  let top = scored.slice(0, limit).map(({ p }) => ({
    brand: p.brand || "Unknown",
    product_name: p.product_name || "Unnamed Product",
    price: Number(p.price) || 0,
    category: p.category || "General",
    description: p.description || "",
    reason: buildReason(p, budget, keywords),
  }));

  if (budget) {
    const under = top.filter(t => t.price <= budget);
    if (under.length === 0) {
      const cheapest = [...productCatalog]
        .sort((a, b) => (a.price || 0) - (b.price || 0))
        .slice(0, Math.min(3, productCatalog.length))
        .map(p => ({
          brand: p.brand || "Unknown",
          product_name: p.product_name || "Unnamed Product",
          price: Number(p.price) || 0,
          category: p.category || "General",
          description: p.description || "",
          reason: `closest budget-friendly alternative (no items under ${budget})`,
        }));
      top = [...cheapest, ...top].slice(0, limit);
    }
  }
  return top.length > 0 ? top : [{
    brand: "N/A",
    product_name: "No matching products found",
    price: 0,
    category: "Information",
    description: "We don't currently have products matching your query, but we do offer healthtech, entertainment, travel accessories, and smart devices.",
    reason: "Your query doesn't match our available product categories. Try searching for healthtech, entertainment, travel, or smart home products."
  }];
}

export async function getAIRecommendations(userQuery, productCatalog) {
  try {
    // Validate configuration first
    if (!validateConfig()) {
      throw new Error("Invalid configuration - check your environment variables");
    }

    // Validate inputs
    if (!userQuery || !productCatalog) {
      throw new Error("User query and product catalog are required");
    }

    // console.log("Starting AI recommendation process...");
    // console.log("User query:", userQuery);
    // console.log("Product catalog size:", productCatalog.length);

    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: config.gemini.model });

    const { budget, keywords } = extractBudgetAndKeywords(userQuery);
    const prompt = `You are an AI Product Advisor.
From the provided product catalog JSON, recommend the best matching items for the user's request.

Rules:
- Parse budget if the user mentions constraints like "under 100". Treat numbers as currency units.
- Prefer items within budget; if none fit, recommend the closest affordable alternatives and mention they are slightly above budget.
- If the query is vague or random, infer likely interests and return value-for-money, broadly appealing picks.

- If the user's query is random, nonsensical, or contains no meaningful keywords, return ONLY a single JSON object inside the array exactly as shown below. Do not add any other products in this case:
  {
    "brand": "N/A",
    "product_name": "No valid match found",
    "price": 0,
    "category": "General",
    "description": "Unable to understand your request.",
    "reason": "Your query doesn't seem to relate to any products. Please try rephrasing."
  }
  In this case, IGNORE the rule about "Always return 3–5 items" and return ONLY this one object. Do not add filler or fallback products alongside it.
- Always return 3–5 items when possible.
- Keep prices numeric. Do not include currency symbols.

User Query: "${userQuery}"
Detected Budget: ${budget ?? "none"}
Detected Keywords: ${JSON.stringify(keywords)}

Product Catalog:
${JSON.stringify(productCatalog, null, 2)}

Respond ONLY in valid JSON using this exact format:
[
  {
    "brand": "Brand",
    "product_name": "Product Name",
    "price": 2098,
    "category": "Category",
    "description": "Short description",
    "reason": "Why it's recommended (mention budget/keyword match where relevant)"
  }
]
Important: Return ONLY the JSON array, with 3–5 items.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: config.generationConfig,
      safetySettings: config.safetySettings,
    });
    const message = result.response.text().trim();
    
    // console.log("Raw Gemini response:", message);

    let parsed;
    try {
      parsed = JSON.parse(message);
      // console.log("Successfully parsed JSON response");
    } catch (parseError) {
      // console.log("Failed to parse as JSON, trying to extract JSON from response...");
      // Try to extract JSON array from the response
      const jsonMatch = message.match(/\[.*\]/s);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
          // console.log("Successfully extracted and parsed JSON from response");
        } catch (extractError) {
          // console.error("Failed to parse extracted JSON:", extractError);
          throw new Error("Invalid JSON response from Gemini");
        }
      } else {
        // console.error("No JSON array found in response");
        throw new Error("No valid JSON response from Gemini");
      }
    }

    // Validate the parsed response
    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }

    if (parsed.length === 0) {
      return localFallbackRecommendations(userQuery, productCatalog);
    }

    // Validate each recommendation has required fields
    const validRecommendations = parsed.filter(rec => 
      rec && rec.brand && rec.product_name && (rec.price !== undefined && rec.price !== null) && rec.category && rec.description
    ).map(rec => ({
      brand: rec.brand,
      product_name: rec.product_name,
      price: Number(rec.price) || 0,
      category: rec.category,
      description: rec.description,
      reason: rec.reason || buildReason(rec, budget, keywords),
    }));

    if (validRecommendations.length === 0) {
      return localFallbackRecommendations(userQuery, productCatalog);
    }

    // Check if this is a "no match" response from AI (either old or new format)
    const isNoMatchResponse = validRecommendations.length === 1 && 
      (validRecommendations[0].product_name === "No valid match found" ||
       validRecommendations[0].product_name === "No matching products found") &&
      validRecommendations[0].brand === "N/A";
    
    if (isNoMatchResponse) {
      // Always return our helpful local fallback instead of AI's generic response
      return localFallbackRecommendations(userQuery, productCatalog);
    }

    // Ensure at least 3 items when possible (only for valid product recommendations)
    if (validRecommendations.length < 3) {
      const fallback = localFallbackRecommendations(userQuery, productCatalog, 5);
      const merged = [...validRecommendations];
      for (const fb of fallback) {
        if (!merged.find(m => m.product_name === fb.product_name && m.brand === fb.brand)) {
          merged.push(fb);
        }
        if (merged.length >= 3) break;
      }
      return merged;
    }
    return validRecommendations;

  } catch (error) {
    return localFallbackRecommendations(userQuery, productCatalog);
  }
}