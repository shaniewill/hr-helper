import { GoogleGenAI, Type } from "@google/genai";
import { Group } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTeamNames = async (groups: Group[]): Promise<Record<string, string>> => {
  const client = getClient();
  if (!client) {
    throw new Error("Gemini API Key is missing. Please check your configuration.");
  }

  // Prepare prompt context
  const groupData = groups.map(g => ({
    id: g.id,
    members: g.members.map(m => m.name)
  }));

  const prompt = `
    I have a list of teams and their members. 
    Please generate a creative, fun, and professional team name for each group.
    The names should be suitable for a corporate HR teambuilding event.
    
    Here are the groups:
    ${JSON.stringify(groupData, null, 2)}
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            teamNames: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  groupId: { type: Type.STRING },
                  name: { type: Type.STRING }
                },
                required: ['groupId', 'name']
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return {};

    const parsed = JSON.parse(resultText);
    const mapping: Record<string, string> = {};
    
    if (parsed.teamNames && Array.isArray(parsed.teamNames)) {
      parsed.teamNames.forEach((item: { groupId: string; name: string }) => {
        mapping[item.groupId] = item.name;
      });
    }

    return mapping;

  } catch (error) {
    console.error("Error generating team names:", error);
    throw error;
  }
};