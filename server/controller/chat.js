const User = require('../models/user_model');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const nanoId = require('nanoid')


// Maintain chat session
let chatSession = null;


const handleSendMessage = async (req, res) => {
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
        res.status(500).json({ error: "Something went wrong! try again later." });
    }
}

const handleGetHistory = async (req, res) => {
    try {
        const { _id } = req.user;
        const { history } = await User.findById(_id);
        res.status(200).json(history);
    } catch (err) {
        return res.status(500).json({ msg: err.message });

    }
}


const handleAddHistory = async (req, res) => {
    const { chatId, messages } = req.body; // full array old+new
    const user = await User.findById(req.user._id);



    // Find existing chat by chatId
    const chatIndex = user.history.findIndex(c => c.chatId === chatId);

    if (chatIndex !== -1) {
        console.log(messages)
        // Replace the messages array with new full array
        user.history[chatIndex].chats = messages.map(m => ({
            sender: m.sender,
            msg: m.msg,
        }));
    } else {
        // If chat not exist, create a new one
        user.history.push({
            chatId: nanoId.nanoid(),
            chats: messages.map(m => ({
                sender: m.sender,
                msg: m.msg,

            }))
        });
    }

    await user.save();
    res.status(200).json({ success: true, history: user.history });
}

module.exports = { handleSendMessage, handleGetHistory, handleAddHistory }