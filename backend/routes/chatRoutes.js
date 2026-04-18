const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/v1/chat
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.json({ 
        response: "Oops! System me Google Gemini AI key set nahi hai. Admin se kaho ki backend/.env me GEMINI_API_KEY dalein." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are a helpful, friendly Career Counselor and Placement Portal Chatbot. 
    You strictly answer in Hinglish (a mix of Hindi and English written in the Latin alphabet). 
    Your tone must be very polite, encouraging, and natural, like an older sibling giving advice. 
    Keep your answers concise, max 3-4 sentences. Wait for the user to ask the question.
    User's message: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
