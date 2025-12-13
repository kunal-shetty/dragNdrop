import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const ai = new GoogleGenAI({ apiKey })

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function generateChatResponse(
  userPrompt: string,
  contextMessages: ChatMessage[] = [],
) {
  try {
    if (!apiKey) {
      return {
        success: false,
        content: "",
        error: "API Key missing. Please set NEXT_PUBLIC_GEMINI_API_KEY.",
      }
    }

    // Build context
    let historyContext = ""
    if (contextMessages.length > 0) {
      historyContext =
        "Previous conversation:\n" +
        contextMessages
          .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n") +
        "\n\n"
    }

    const systemInstruction = `You are a helpful AI assistant for a Figma-style website builder application.

**Your role:**
- Explain how to use the drag-and-drop editor features
- Guide users through creating, editing, and styling components
- Answer questions about components, layers, transforms, and exporting
- Provide tips for keyboard shortcuts and advanced features
- Help troubleshoot common issues

**Available Features:**
- 14+ component types: text, heading, paragraph, button, image, video, card, container, navbar, hero section, testimonials, stats, footer, and more
- Drag & drop from sidebar to canvas
- Free-form positioning and resizing with 8 resize handles
- Inspector panel for editing colors, fonts, spacing, borders, shadows, and transforms
- Layer panel for z-index management and grouping
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+D (duplicate), Delete (remove), Arrow keys (move), Shift+Arrow (move 10px)
- Transform controls: rotate, scale, skew, flip
- Component locking (position, size, editing)
- Custom component library
- Export to HTML/CSS

**Keep responses:**
- Concise (under 200 words)
- Friendly and encouraging
- Action-oriented with bullet points
- Focused on practical guidance

Always respond in 3–6 short bullet points. 
Never exceed 80 words. Be concise and direct.

IMPORTANT: Do not use asterisks (*) for bold or emphasis. 
Do not output Markdown formatting. 
Write entirely in plain text.
`

    const prompt = `${systemInstruction}

Please respond concisely, avoid long explanations, and focus only on what the user needs.

${historyContext}
User: ${userPrompt}

Respond naturally and helpfully`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // required for response.text support
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    })

    return {
      success: true,
      content: response.text || "I'm having trouble generating a response. Please try again.",
    }

  } catch (error) {
    console.error("Chat error:", error)
    return {
      success: false,
      content: "",
      error: "Failed to generate response. Please try again.",
    }
  }
}
