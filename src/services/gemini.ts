import { GoogleGenAI, Type } from "@google/genai";
import { Product, SaleRecord, Forecast } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getForecastForProduct(product: Product, salesHistory: SaleRecord[]): Promise<Forecast> {
  const recentSales = salesHistory
    .filter(s => s.productId === product.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30);

  const salesContext = recentSales.map(s => ({
    date: s.timestamp.split('T')[0],
    qty: s.quantity
  }));

  const prompt = `
    Analyze the following sales history for "${product.name}" (${product.sku}) and predict the demand for the next 7 days.
    
    Current Inventory: ${product.currentStock} ${product.unit}
    Min Threshold: ${product.minStockThreshold} ${product.unit}
    Max Capacity: ${product.maxStockCapacity} ${product.unit}
    
    Recent Sales Data (Last 30 entries):
    ${JSON.stringify(salesContext)}
    
    Based on this data, provide a demand forecast. 
    Calculate the predicted demand for the next 7 days and suggest a restocking quantity.
    Ensure the restocking quantity doesn't exceed the Max Capacity when added to Current Inventory.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedDemand: { type: Type.NUMBER, description: "Total predicted units needed for next 7 days" },
            confidenceScore: { type: Type.NUMBER, description: "Confidence level 0-1" },
            reasoning: { type: Type.STRING, description: "Short explanation of the trend" },
            suggestedRestock: { type: Type.NUMBER, description: "Quantity recommended to order today" }
          },
          required: ["predictedDemand", "confidenceScore", "reasoning", "suggestedRestock"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    return {
      productId: product.id,
      storeId: product.storeId,
      predictedDemand: result.predictedDemand,
      confidenceScore: result.confidenceScore,
      reasoning: result.reasoning,
      suggestedRestock: result.suggestedRestock,
      forecastDate: new Date().toISOString()
    };
  } catch (error) {
    console.error("Forecasting Error:", error);
    // Return fallback forecast
    return {
      productId: product.id,
      storeId: product.storeId,
      predictedDemand: 0,
      confidenceScore: 0,
      reasoning: "AI analysis failed. Please check connection.",
      suggestedRestock: product.currentStock < product.minStockThreshold ? product.maxStockCapacity - product.currentStock : 0,
      forecastDate: new Date().toISOString()
    };
  }
}

export async function generateSupplierEmail(supplierName: string, itemsNeeded: string): Promise<string> {
  const prompt = `
    Write a professional urgent procurement email to the supplier "${supplierName}".
    We urgently need the following restock:
    ${itemsNeeded}
    
    The tone should be professional, assertive but collaborative. Mention that we are using Predictive AI for stock management and these items are critical for our upcoming demand.
    Sign as: Global Procurement Team, RetailAI Network.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Email Generation Error:", error);
    return "Failed to generate email. Please check your AI configuration.";
  }
}

export async function chatInventoryAnalyst(userMessage: string, context: string): Promise<string> {
  const prompt = `
    You are an AI Inventory Analyst for "RetailAI Network".
    
    SYSTEM CONTEXT:
    ${context}
    
    USER QUESTION:
    ${userMessage}
    
    Provide a professional, data-driven response. Be concise and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble analyzing the data right now. Please try again in a moment.";
  }
}
