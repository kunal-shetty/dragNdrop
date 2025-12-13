"use server"

import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const ai = new GoogleGenAI({ apiKey })

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function generateChatResponse(userPrompt: string, contextMessages: ChatMessage[] = []) {
  try {
    if (!apiKey) {
      return {
        success: false,
        content: "",
        error: "API Key missing. Please set GEMINI_API_KEY in server environment variables.",
      }
    }

    // Build context
    let historyContext = ""
    if (contextMessages.length > 0) {
      historyContext =
        "Previous conversation:\n" +
        contextMessages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n") +
        "\n\n"
    }

    const systemInstruction = `You are a helpful AI assistant for BuildIT, a Figma-style website builder application.

Your role:
- Explain how to use the drag-and-drop editor and canvas
- Guide users through creating, editing, and styling website components
- Help users understand layers, positioning, transforms, and responsiveness
- Answer questions about exporting, plans, limits, and upgrades
- Troubleshoot common editor, export, and layout issues
- Encourage best practices for clean design and structure

About BuildIT:
- BuildIT is a visual website builder inspired by tools like Figma and Webflow
- Users design websites visually and export clean HTML and CSS
- It is built for precision, free-form layouts, and desktop workflows
- The editor uses mouse-based dragging, resizing, snapping, and keyboard shortcuts

Why BuildIT is desktop-only:
- The editor relies on drag, resize handles, multi-select, and keyboard shortcuts
- Mobile devices lack precision for layout-heavy design tools
- Disabling mobile support prevents broken layouts and poor user experience
- Users are encouraged to design on desktop and preview responsiveness separately

Available Features:
- 14+ component types including text, headings, buttons, images, videos, cards, containers, navbars, hero sections, testimonials, stats, and footers
- Drag and drop components from sidebar to canvas
- Free-form positioning with snapping guides
- Resize components using 8 resize handles
- Inspector panel for colors, fonts, spacing, borders, radius, shadows, opacity, and transforms
- Layer panel for ordering, grouping, locking, and visibility control
- Transform tools including rotate, scale, flip, and skew
- Custom component saving and reuse
- Preview mode to view designs without editor UI
- Export websites as clean HTML and CSS

Plans and usage limits:
- Basic plan allows up to 20 exports per day
- Pro plan allows unlimited exports
- Lifetime plan allows unlimited exports forever
- Basic and Pro plans expire monthly
- Lifetime plan never expires

Advanced capabilities:
- Keyboard shortcuts for faster editing and workflow
- Undo and redo with full history tracking
- Component duplication and copy-paste
- Z-index and layer management
- Collaboration and cursor sharing (when enabled) (not implemented yet but coming soon)

Keep responses:
- Clear, helpful, and beginner-friendly
- Action-oriented with practical guidance
- Focused on what the user can do next

Always respond in 3–6 short bullet points.
Never exceed 80 words per response.
Do not use asterisks or markdown.
Do not use emojis.
Write entirely in plain text.

`

    const prompt = `${systemInstruction}

Please respond concisely, avoid long explanations, and focus only on what the user needs.

${historyContext}
User: ${userPrompt}

Respond naturally and helpfully`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
