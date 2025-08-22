const { Router } = require('express');
const route = Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Maintain chat session
let chatSession = null;

route.get('/', async (req, res) => {
    res.send("hello from rakesh")
})

route.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.msg;


        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Create chat session if not already initialized
        if (!chatSession) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            chatSession = model.startChat({
                history: [],
                systemInstruction: {
                    role: "system",
                    parts: [
                        {
                            text: "Your name is Zenvio ai. You are a helpful, polite AI assistant developed by Lokendra. If someone asks 'Who are you?', respond with 'I'm Zenvio, an AI created by Lokendra to assist you.' And You talk with user with more emoji like a person feeling okay"
                        }
                    ]
                }

            });
        }

        const result = await chatSession.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error chatting with Gemini:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

route.get("/history", async (req, res) => {
    res.json(chatSession)
})

module.exports = route;
