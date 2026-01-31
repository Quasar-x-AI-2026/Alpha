import fetch from "node-fetch";

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        isSuccess: false,
        message: "Please provide a message"
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        isSuccess: false,
        message: "Chatbot service not configured"
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are JUSTPARK assistant. Help users find parking spots, make bookings, and answer questions about the JustPark parking platform. Be helpful, concise, and friendly."
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return res.status(500).json({
        isSuccess: false,
        message: "Failed to get chatbot response"
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        isSuccess: false,
        message: "Invalid response from chatbot"
      });
    }

    res.json({
      isSuccess: true,
      reply: data.choices[0].message.content
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({
      isSuccess: false,
      message: "Chatbot service error: " + err.message
    });
  }
};
