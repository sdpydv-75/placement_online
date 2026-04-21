const express = require('express');
const router = express.Router();

// POST /api/v1/chat
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY; 
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.log("Chat API Key is missing or default");
      return res.json({ 
        response: "Oops! System me AI key set nahi hai. Admin se kaho ki backend/.env me OPENROUTER_API_KEY dalein." 
      });
    }

    console.log(`Using API Key: ${apiKey.substring(0, 7)}...`);
    
    const systemPrompt = `You are a helpful, friendly Career Counselor and Placement Portal Chatbot. 
    You strictly answer in Hinglish (a mix of Hindi and English written in the Latin alphabet). 
    Your tone must be very polite, encouraging, and natural, like an older sibling giving advice. 
    Keep your answers concise, max 3-4 sentences. Wait for the user to ask the question.`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000", // Optional, for OpenRouter analytics
          "X-Title": "Online Placement Portal"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-lite-001",
          "messages": [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": message }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
          console.error("OpenRouter API Error Details:", JSON.stringify(data, null, 2));
          // If 2.0 Flash fails, we could fallback, but for now we'll report the error clearly.
          return res.status(response.status).json({ 
            error: data.error?.message || "AI Provider Error. Please check your OpenRouter credits or try again."
          });
      }

      const responseText = data.choices[0].message.content;
      res.json({ response: responseText });

    } catch (fetchError) {
      console.error("Fetch/Network Error:", fetchError);
      res.status(500).json({ error: "Network error while calling AI API" });
    }
  } catch (err) {
    console.error('General Server Error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
