// Load  variable from .env file
require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();
// Get Groq API key from env variable
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// POST chat to send message to Groq LLM
router.post("/chat", async (req, res) => {

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message required" });
    }
    //check if API exists
    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: "Missing GROQ_API_KEY" });
    }

    // Call Groq API
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "You are NurseFlow AI. Answer handover/task questions concisely. End with a brief safety disclaimer."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(500).json({ error: "No response from AI" });
        }
        //return AI repsonse to font-end
        res.json({ reply });

    } catch (error) {
        console.error("Groq Error:", error.response?.data || error.message);

        res.status(500).json({
            error: "Service unavailable",
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;